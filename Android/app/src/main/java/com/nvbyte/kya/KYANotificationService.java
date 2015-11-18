package com.nvbyte.kya;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.hardware.SensorEvent;
import android.location.Location;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.SystemClock;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.util.Log;

import com.google.protobuf.InvalidProtocolBufferException;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;


/**
 * Service that runs in the background, and handles wear check in and notification to the wear user.
 * The service works by scheduling check-ins. When a check-in occurs, the application waits for
 * a server response. The server response contains all the parameters necessary for the app to
 * decide if it will notify the user. If the user is notified, the server may or may not request
 * a survey which should happen before notifications. The following lifecycle is observed:
 *
 * (1) Check-In scheduled.
 * (2) Check-In response.
 * (3) Schedule next check-in.
 * (4) Survey (If notification and requested).
 * (5) Send Heartbeat before notification.
 * (6) Send Notification.
 * (7) Send Heartbeat after notification.
 * (8) Send Movement data (For a period of time).
 *
 * A check-in may occur out of this cycle if the user (i) opens the app or (ii) increases its
 * velocity after a previous checkIn response. A new check-in cancels any scheduled check-ins.
 */
public class KYANotificationService extends Service {

    private AlarmManager mAlarmManager;
    private static final String RATING = "RATING";
    private static final String CRIME_RATE = "CRIME_RATE";
    private static final String LAST_UPDATED = "LAST_UPDATED";
    private static final String EXTRA_ID = "NOTIFICATION_ID";
    private static final String TAG = "KYANotificationService";
    private static final long HEART_BEAT_TIMEOUT = 10000;
    private static final long COLLECT_PERIOD = 1000 * 60 * 1; // 1 minutes.
    private static final long SAMPLE_PERIOD = 1000 * 10; // 10 seconds.
    private long mTimeStartedCollecting = 0;
    private static final String THRESHOLD_PREFERENCE = "THRESHOLD";
    private static final String MUTE_PREFERENCE = "mute_preference";
    private static final String CURRENT_ZONE_PREFERENCE = "CURRENT_ZONE";
    private final static String SELECTED_EXTRA = "SELECTED_ID";
    private final static String ZONE_ID_EXTRA = "ZONE_ID";
    private final static String CURRENT_GEOZONE_EXTRA = "CURRENT_GEOZONE";

    private static final long LOCATION_TIMEOUT = 2000;
    private static final long RETRY_CHECKIN_PERIOD_SECONDS = 10; /// 10 seconds
    private static final long RESPONSE_TIMEOUT = 15000; /// 10 seconds
    private Timer mMovementTimer;
    private PendingIntent mNextCheckIn;
    private Timer timeoutTimer;
    private double mLastSpeed = 10001;
    private Location currentLocation;
    private double mLastCheckInSpeed = 10001;
    private long lastLocationTime = System.currentTimeMillis();

    private boolean servingCheckIn;
    private boolean delayedCheckIn;

    private Timer  speedTracker;

    /**
     * Creates a task that periodically checks the user's speed to ensure the scheduled check-in
     * time is still valid. If the speed has increased, the task will either (i) Immediately
     * perform a new check-in or (ii) raise a delay flag to be serviced when the executing check-in
     * is serviced.
     * @return A timer task that updates user speed.
     */
    private TimerTask buildSpeedTask() {
        return new TimerTask(){
            @Override
            public void run() {
                synchronized (KYANotificationService.this) {
                    Location location = LocationProvider.getInstance(KYANotificationService.this).getCurrentLocationForSpeed();
                    double speed = setSpeed(location);
                    mLastSpeed = speed;
                    if (speed > mLastCheckInSpeed) {
                        if(!servingCheckIn) {
                            Utils.appendLog("Checkin again for higher speed: " + mLastCheckInSpeed + " new speed:" + mLastSpeed);
                            delayedCheckIn = false;
                            checkIn();
                        } else {
                            delayedCheckIn = true;
                            Utils.appendLog("Setting delayed checkIN Flag");
                        }
                    }
                }
            }
        };
    }

    /**
     * Creates a task that periodically sends the user's location to the remote service for telemetry.
     * @return A timer task that runs for the time specified by COLLECT_PERIOD.
     */
    private TimerTask buildMoveTask() {
        return new TimerTask(){
            @Override
            public void run() {
                if(System.currentTimeMillis() - mTimeStartedCollecting >= COLLECT_PERIOD) {
                    synchronized (KYANotificationService.this) {
                        if(mMovementTimer != null)
                            mMovementTimer.cancel();
                        mMovementTimer = null;
                    }
                } else {
                    Location location = LocationProvider.getInstance(KYANotificationService.this).getLocation(LOCATION_TIMEOUT,true);
                    if(location != null) {
                        KYA.GeoPoint point = KYA.GeoPoint.newBuilder().setLatitude(location.getLatitude()).setLongitude(location.getLongitude()).setUserID(Utils.getUserId(KYANotificationService.this)).build();
                        PhoneInterface.getInstance(KYANotificationService.this).sendMessageMovement(point.toByteArray());
                    }
                }
            }
        };
    }

    /**
     * Creates a timeout timer class that schedules a new check-in or services a delayed check-in
     * if the given time for check-in response is not met.
     * @return A timer task that ensures check-n cycle continuity.
     */
    private TimerTask buildTimeoutTask() {
        return new TimerTask(){
            @Override
            public void run() {
                    synchronized (KYANotificationService.this) {
                        Utils.appendLog("Retry for timeout in buildTimeoutTask()!");
                        servingCheckIn = false;
                        if(timeoutTimer != null)
                            timeoutTimer.cancel();
                        timeoutTimer = null;
                        if(delayedCheckIn) {
                            Utils.appendLog("Next check in is delayed!!!! in timeout...");
                            delayedCheckIn = false;
                            checkIn();
                        } else {
                            scheduleCheckIn(RETRY_CHECKIN_PERIOD_SECONDS);
                        }
                    }
                }
        };
    }

    private BroadcastReceiver mKYABroadcastReciever = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            Log.d(TAG,"GOT ACTION:"+intent.getAction());
            if(action.equals("com.nvbyte.kya.SEND_SURVEY")) {
                Log.d(TAG, "Got survey response.");
                sendSurveyResult(intent);
            } else if (action.equals("com.nvbyte.kya.SEND_AFTER_BEAT")) {
                sendHeartbeat(intent);
            } else if (action.equals("com.nvbyte.kya.CHECK_IN_RESPONSE")) {
                byte[] response = intent.getExtras().getByteArray("PROTO");
                Log.d(TAG,"Got check in response");
                onCheckInResponse(response);
            } else if (action.equals("com.nvbyte.kya.ACCELERATION_EVENT")) {

            } else if (action.equals("com.nvbyte.kya.SURVEY_CANCELED")) {
                Log.d(TAG,"SURVEY WAS CANCELED");
                onSurveyCanceled(intent);
            } else if (action.equals("com.nvbyte.kya.ERROR")) {
                synchronized (KYANotificationService.this) {
                    servingCheckIn = false;
                    if (timeoutTimer != null)
                        timeoutTimer.cancel();
                    timeoutTimer = null;
                    Utils.appendLog("Scheduling check in on ERROR");
                    scheduleCheckIn(RETRY_CHECKIN_PERIOD_SECONDS);
                }
            }
        }
    };

    /**
     * Called when the survey is exited manually or by timeout. Launches the notification associated
     * with the survey.
     * @param intent An intent that contains all parameters for notification.
     */
    private void onSurveyCanceled(final Intent intent) {
        HandlerThread handlerThread = new HandlerThread("surveyCanceledHandler");
        handlerThread.start();
        Handler surveyHandler = new Handler(handlerThread.getLooper());
        surveyHandler.post(new Runnable() {
            @Override
            public void run() {
                int rating  = intent.getExtras().getInt(RATING);
                String id = intent.getExtras().getString(EXTRA_ID);
                String date = intent.getExtras().getString(LAST_UPDATED);
                double rate = intent.getExtras().getDouble(CRIME_RATE);
                int currentZoneId = intent.getExtras().getInt(ZONE_ID_EXTRA);
                KYA.GeoZone zone = (KYA.GeoZone) intent.getExtras().getSerializable(CURRENT_GEOZONE_EXTRA);
                KYA.GeoZone prevGeo = (KYA.GeoZone) intent.getExtras().getSerializable("OLD_GEO");
                KYANotificationService.this.notify(id, rating, rate, date,true,currentZoneId,zone,prevGeo);
            }
        });
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG,"Creating service - initializing filters");
        IntentFilter filter = new IntentFilter();
        filter.addAction("com.nvbyte.kya.SEND_SURVEY");
        filter.addAction("com.nvbyte.kya.SEND_AFTER_BEAT");
        filter.addAction("com.nvbyte.kya.CHECK_IN_RESPONSE");
        filter.addAction("com.nvbyte.kya.ACCELERATION_EVENT");
        filter.addAction("com.nvbyte.kya.SURVEY_CANCELED");
        filter.addAction("com.nvbyte.kya.ERROR");
        registerReceiver(mKYABroadcastReciever,filter);
        mAlarmManager = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
    }


    /**
     * Called when the survey response is acquired. Sends the survey response to the remote service
     * for telemetry and launches the notification.
     * @param intent An intent that contains all parameters for notification and selected survey
     *               response.
     */
    private void sendSurveyResult(final Intent intent) {
        HandlerThread handlerThread = new HandlerThread("surveyHandler");
        handlerThread.start();
        Handler surveyHandler = new Handler(handlerThread.getLooper());
        surveyHandler.post(new Runnable() {
            @Override
            public void run() {
                int selected = intent.getExtras().getInt(SELECTED_EXTRA);
                int rating  = intent.getExtras().getInt(RATING);
                String id = intent.getExtras().getString(EXTRA_ID);
                String date = intent.getExtras().getString(LAST_UPDATED);
                double rate = intent.getExtras().getDouble(CRIME_RATE);
                int currentZoneId = intent.getExtras().getInt(ZONE_ID_EXTRA);

                KYA.Telemetry.Survey survey = KYA.Telemetry.Survey.newBuilder().setPerceivedRisk(selected).setActualRisk(rating).build();
                KYA.Telemetry.Builder builder = KYA.Telemetry.newBuilder().setUserID(Utils.getUserId(KYANotificationService.this));
                builder.setSurvey(survey);
                builder.setNotificationID(id);
                builder.setZoneID(currentZoneId);
                PhoneInterface.getInstance(KYANotificationService.this).sendMessageSurvey(builder.build().toByteArray());
                KYA.GeoZone zone = (KYA.GeoZone) intent.getExtras().getSerializable(CURRENT_GEOZONE_EXTRA);
                KYA.GeoZone prevGeo = (KYA.GeoZone) intent.getExtras().getSerializable("OLD_GEO");
                KYANotificationService.this.notify(id, rating, rate, date,true,currentZoneId,zone,prevGeo);
            }
        });
    }

    /**
     * Sends the heart rate to the survey for telemetry.
     * @param intent An intent containing zone id for telemetry collection.
     */
    private void sendHeartbeat(final Intent intent) {
        final int currentZoneId = intent.getExtras().getInt(ZONE_ID_EXTRA);
        HandlerThread handlerThread = new HandlerThread("hbHandler");
        handlerThread.start();
        Handler heartBeatHandler = new Handler(handlerThread.getLooper());
        heartBeatHandler.post(new Runnable() {
            @Override
            public void run() {
                Future<SensorEvent> futureHeartBeat = SensorDataProvider.getInstance(KYANotificationService.this).getHeartbeat(HEART_BEAT_TIMEOUT);
                try {
                    SensorEvent heartbeat = futureHeartBeat.get();
                    KYA.Telemetry.HeartRate hr = KYA.Telemetry.HeartRate.newBuilder().setAfter((int) heartbeat.values[0]).build();
                    KYA.Telemetry.Builder builder = KYA.Telemetry.newBuilder().setUserID(Utils.getUserId(KYANotificationService.this));
                    builder.setHeartRate(hr);
                    builder.setNotificationID(intent.getExtras().getString(EXTRA_ID));
                    builder.setZoneID(currentZoneId);
                    PhoneInterface.getInstance(KYANotificationService.this).sendMessageHeartBeat(builder.build().toByteArray());
                } catch (ExecutionException | InterruptedException e) {
                    Log.d(TAG,"Error fetching heartbeat: " + e.getMessage());
                }
            }
        });
    }

    /**
     * Checks in with the remote service. If a check-in is being serviced when this method is called
     * the check-in will be ignored. This method will cancel any pending check-in that has been
     * previously scheduled. If the check-in fails, another check-in will be scheduled in a time
     * specified by the retry period.
     */
    private synchronized void checkIn(){
        if(servingCheckIn) {
            return;
        }
        servingCheckIn = true;
        Log.d(TAG,"Performing check in");
        if(mNextCheckIn != null) {
            mAlarmManager.cancel(mNextCheckIn);
            mNextCheckIn = null;
        }
        HandlerThread handlerThread = new HandlerThread("checkIn");
        handlerThread.start();
        Handler handler = new Handler(handlerThread.getLooper());
        handler.post(new Runnable() {
            @Override
            public void run() {
                synchronized (KYANotificationService.this) {
                    Location location = LocationProvider.getInstance(KYANotificationService.this).getLocation(LOCATION_TIMEOUT, true);
                    if (location != null) {
                        mLastCheckInSpeed = mLastSpeed;
                        KYA.GeoPoint point = KYA.GeoPoint.newBuilder().setLatitude(location.getLatitude()).setLongitude(location.getLongitude()).setUserID(Utils.getUserId(KYANotificationService.this)).build();
                        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(KYANotificationService.this);
                        boolean negativeDelta = preferences.getBoolean("lower_preference", true);
                        int previousId = preferences.getInt("PREV_ID", -1);
                        KYA.CheckIn.Builder builder = KYA.CheckIn.newBuilder().setNegDelta(negativeDelta).setUserId(Utils.getUserId(KYANotificationService.this));
                        builder.setLocation(point);
                        builder.setPrevZoneId(previousId);
                        builder.setSpeed(mLastCheckInSpeed);

                        if (timeoutTimer != null) {
                            timeoutTimer.cancel();
                        }
                        timeoutTimer = new Timer();

                        timeoutTimer.schedule(buildTimeoutTask(), RESPONSE_TIMEOUT);
                        SimpleDateFormat sdf = new SimpleDateFormat("MMM dd,yyyy HH:mm:ss");
                        Date resultdate = new Date(System.currentTimeMillis());
                        Utils.appendLog("SENT CHECK IN at : " + sdf.format(resultdate));
                        PhoneInterface.getInstance(KYANotificationService.this).sendMessageCheckIn(builder.build().toByteArray(), new Runnable() {
                            @Override
                            public void run() {
                                synchronized (KYANotificationService.this) {
                                    servingCheckIn = false;
                                    if (timeoutTimer != null)
                                        timeoutTimer.cancel();
                                    timeoutTimer = null;
                                    Utils.appendLog("Had to retry check in!");
                                    if (delayedCheckIn) {
                                        Utils.appendLog("Next Check IN is delayed after retry!!!");
                                        delayedCheckIn = false;
                                        checkIn();
                                    } else {
                                        Utils.appendLog("Retry Check-In.");
                                        scheduleCheckIn(RETRY_CHECKIN_PERIOD_SECONDS);
                                    }
                                }
                            }
                        });
                    } else {
                        if(timeoutTimer != null)
                            timeoutTimer.cancel();
                        timeoutTimer = null;
                        servingCheckIn = false;
                        Utils.appendLog("Had to retry check in 2!");
                        if(delayedCheckIn) {
                            delayedCheckIn = false;
                            Utils.appendLog("Next Check IN is delayed after retry 2!!!");
                            checkIn();
                        } else {
                            scheduleCheckIn(RETRY_CHECKIN_PERIOD_SECONDS);
                        }
                    }
                }
            }
        });
    }

    /**
     * Called when the check in is serviced and the response is received from the remote service.
     * A new check-in will be scheduled according to the time determined by the service. The user
     * will be notified if an increase in risk is met and if a decrease in risk is met and negative
     * delta is enabled, as long as the application is not muted and the threshold condition is met.
     * If the response includes a survey flag, a survey will be launched before the notification
     * occurs. If the delayed flag is enabled, a subsequent check-in will be launched immediately.
     * @param proto A valid CheckInResponse proto buffer.
     */
    private synchronized  void onCheckInResponse(byte[] proto) {
        servingCheckIn = false;
        Log.d(TAG,"Handling response");
        SimpleDateFormat sdf = new SimpleDateFormat("MMM dd,yyyy HH:mm:ss");
        Date resultdate = new Date(System.currentTimeMillis());
        Utils.appendLog("Got response at : " + sdf.format(resultdate));
        if(timeoutTimer != null)
            timeoutTimer.cancel();
        timeoutTimer = null;
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        KYA.CheckInResponse response = null;
        try {
            response = KYA.CheckInResponse.parseFrom(proto);
        } catch (InvalidProtocolBufferException e) {
            Log.e(TAG,e.getMessage());
        }
        double nextCheckInSeconds = response.getNextRequestTimeInSeconds();
        Utils.appendLog("Next check in should be:" + nextCheckInSeconds);
        int currentZone = response.getCurrentZone().getLevel();
        String currentZoneDate = response.getCurrentZone().getUpdated();
        boolean doSurvey = response.getRequestFeedback();
        double crimeRate = response.getCurrentZone().getTotalCrime();
        boolean muted = preferences.getBoolean(MUTE_PREFERENCE,true);
        boolean negativeDelta = preferences.getBoolean("lower_preference",true);
        int prevZone =  preferences.getInt(CURRENT_ZONE_PREFERENCE,1);
        int threshold = preferences.getInt(THRESHOLD_PREFERENCE,1);
        preferences.edit().putInt(CURRENT_ZONE_PREFERENCE, currentZone).commit();
        KYA.GeoZone prev = null;
        if(response.hasPrevZone()) {
            Log.d(TAG,"HAS PREVIOUS ZONE!!");
            Utils.appendLog("Has Previous zone...");
            prev = response.getPrevZone();
        }
        int currentZoneId = response.getCurrentZone().getZoneID();
        preferences.edit().putInt("PREV_ID", currentZoneId).commit();
        mAlarmManager = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        scheduleCheckIn(nextCheckInSeconds);
        if (((currentZone > prevZone && currentZone > threshold) || (currentZone < prevZone && negativeDelta)) && !muted) {
            Log.d(TAG,"Notification Needed!");
            String userId  = Settings.Secure.getString(this.getContentResolver(),Settings.Secure.ANDROID_ID);
            String mCurrentNotificationId = userId + System.currentTimeMillis();
            boolean higher = currentZone > prevZone;
            if(doSurvey && higher) {
                startSurvey(mCurrentNotificationId,currentZone,crimeRate,currentZoneDate,currentZoneId,response.getCurrentZone(),prev);
            } else {
                notify(mCurrentNotificationId, currentZone, crimeRate, currentZoneDate, higher, currentZoneId, response.getCurrentZone(),prev);
            }
        }

        if(delayedCheckIn) {
            delayedCheckIn = false;
            checkIn();
        }
    }

    @Override
    /**
     * Handles main functionality of the notification. This includes the following:
     *      (1) Fetch heart beat.
     *      (2) Send check-in.
     *      (3) Start survey.
     *      (4) Check for notification.
     *      (5) Schedule the next check in.
     *      (6) Send notification.
     */
    public int onStartCommand(Intent intent, int flags, int startId){
        Log.d(TAG, "OnStartCommand");
        checkIn();
        return START_STICKY;
    }

    /**
     * Schedules the next notification based on the amount of time sent back in response.
     * @param timeInSeconds Time delta in seconds for next check in.
     */
    private synchronized void scheduleCheckIn(double timeInSeconds) {
            if(speedTracker == null) {
                speedTracker = new Timer();
                speedTracker.schedule(buildSpeedTask(),5000,5000);
            }
            if(mNextCheckIn == null) {
                Utils.appendLog("Scheduling check-in in: "+ timeInSeconds + " seconds");
                Intent intentAlarm = new Intent();
                intentAlarm.setAction("com.nvbyte.kya.CHECK_IN");
                mNextCheckIn = PendingIntent.getBroadcast(this, 0, intentAlarm, PendingIntent.FLAG_UPDATE_CURRENT);
                mAlarmManager.setExact(AlarmManager.ELAPSED_REALTIME_WAKEUP,(long) (SystemClock.elapsedRealtime() + 1000 * timeInSeconds),mNextCheckIn);
            }
    }

    /**
     * Launch a notification for the user.
     * @param notificationId Id of the notification (device serial appended to timestamp).
     * @param classification Classification of new zone.
     * @param crimeRate Number of crimes in new zone.
     * @param date Update time of the new zone.
     * @param higher True if the risk is increasing. False otherwise.
     * @param currentZoneId Id of the current zone.
     * @param zone Current GeoZone.
     * @param prev Previous GeoZone.
     */
    private void notify(final String notificationId, final int classification, final double crimeRate, final String date, final boolean higher,final int currentZoneId,final KYA.GeoZone zone, final KYA.GeoZone prev) {
        Utils.acquire(this);
        HandlerThread handlerThread = new HandlerThread("handleBeat");
        handlerThread.start();
        Handler beatHandler = new Handler(handlerThread.getLooper());
        beatHandler.post(new Runnable() {
            @Override
            public void run() {

                if(higher) {
                    Future<SensorEvent> futureHeartBeat = SensorDataProvider.getInstance(KYANotificationService.this).getHeartbeat(HEART_BEAT_TIMEOUT);
                    try {
                        SensorEvent heartbeat = futureHeartBeat.get();
                        KYA.Telemetry.HeartRate hr = KYA.Telemetry.HeartRate.newBuilder().setBefore((int) heartbeat.values[0]).build();
                        KYA.Telemetry.Builder builder = KYA.Telemetry.newBuilder().setUserID(Utils.getUserId(KYANotificationService.this));
                        builder.setHeartRate(hr);
                        builder.setNotificationID(notificationId);
                        builder.setZoneID(currentZoneId);
                        PhoneInterface.getInstance(KYANotificationService.this).sendMessageHeartBeat(builder.build().toByteArray());
                    } catch (ExecutionException | InterruptedException e) {
                        Log.d(TAG, "Error fetching heartbeat: " + e.getMessage());
                    }
                    mTimeStartedCollecting = System.currentTimeMillis();
                    synchronized (KYANotificationService.this) {
                        if (mMovementTimer != null) {
                            mMovementTimer.cancel();
                        }
                        mMovementTimer = new Timer();
                    }
                    mMovementTimer.schedule(buildMoveTask(), 0, SAMPLE_PERIOD);
                }

                Intent notificationActivity = new Intent(getApplicationContext(),NotificationActivity.class);
                notificationActivity.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                notificationActivity.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                notificationActivity.putExtra(RATING,classification);
                notificationActivity.putExtra(CRIME_RATE,crimeRate);
                notificationActivity.putExtra(LAST_UPDATED,date);
                notificationActivity.putExtra(EXTRA_ID,notificationId);
                notificationActivity.putExtra("HIGHER",higher);
                notificationActivity.putExtra(ZONE_ID_EXTRA,currentZoneId);
                if(zone != null)
                    notificationActivity.putExtra(CURRENT_GEOZONE_EXTRA,zone);
                notificationActivity.putExtra("OLD_GEO",prev);

                startActivity(notificationActivity);
            }
        });
    }

    /**
     * Launch a survey for the user.
     * @param notificationId Id of the notification (device serial appended to timestamp).
     * @param currentZone Classification of new zone.
     * @param crimeRate Number of crimes in new zone.
     * @param currentZoneDate Update time of the new zone.
     * @param currentZoneId Id of the current zone.
     * @param zone Current GeoZone.
     * @param prev Previous GeoZone.
     */
    private void startSurvey(String notificationId, int currentZone,double crimeRate,String currentZoneDate,int currentZoneId, KYA.GeoZone zone, KYA.GeoZone prev){
        Utils.acquire(this);
        Intent surveyActivity = new Intent(getApplicationContext(),SurveyActivity.class);
        surveyActivity.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        surveyActivity.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
        surveyActivity.putExtra(EXTRA_ID, notificationId);
        surveyActivity.putExtra(RATING,currentZone);
        surveyActivity.putExtra(CRIME_RATE,crimeRate);
        surveyActivity.putExtra(LAST_UPDATED,currentZoneDate);
        surveyActivity.putExtra(ZONE_ID_EXTRA,currentZoneId);
        surveyActivity.putExtra(CURRENT_GEOZONE_EXTRA,zone);
        surveyActivity.putExtra("OLD_GEO",prev);

        startActivity(surveyActivity);
    }

    private synchronized double setSpeed(Location loc) {
        if(loc != null) {
            long currentTime = System.currentTimeMillis();
            double timeDelta = (currentTime - lastLocationTime)/1000;
            if(currentLocation != null) {
                double speed = loc.distanceTo(currentLocation)/timeDelta;
                currentLocation = loc;
                lastLocationTime = currentTime;
                return speed;
            } else {
                currentLocation = loc;
                lastLocationTime = currentTime;
                return 10000;
            }
        } else {
            return 10000;
        }
    }

    @Override
    /**
     * Used to connect service with an activity or other process. Should return null in our
     * application's context.
     */
    public IBinder onBind(Intent intent) {
        return null;
    }


}
