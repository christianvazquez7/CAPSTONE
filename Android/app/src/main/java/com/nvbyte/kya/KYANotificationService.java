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

import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;


/**
 * Service that runs in the background, and handles wear check in and notification to the wear user.
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
    private static final long LOCATION_TIMEOUT = 1500;
    private static final long RETRY_CHECKIN_PERIOD_SECONDS = 5; /// 5 seconds
    private static final long RESPONSE_TIMEOUT = 10000; /// 5 seconds
    private Timer mMovementTimer;
    private String mCurrentNotificationId = "";
    private PendingIntent mNextCheckIn;
    private Timer timeoutTimer;
    private double mLastSpeed = 0;

    private Timer  speedTracker;

    private TimerTask buildSpeedTask() {
        return new TimerTask(){
            @Override
            public void run() {
                Location location = LocationProvider.getInstance(KYANotificationService.this).getLocation(LOCATION_TIMEOUT,true);
                if(location != null) {
                    Log.d(TAG,"LOCATION SPEED: "+location.getSpeed());
                    if(location.getSpeed() > mLastSpeed) {
                        mLastSpeed = location.getSpeed();
                        checkIn();
                    }
                }
            }
        };
    }

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

    private TimerTask buildTimeoutTask() {
        return new TimerTask(){
            @Override
            public void run() {
                    synchronized (KYANotificationService.this) {
                        if(timeoutTimer != null)
                            timeoutTimer.cancel();
                        timeoutTimer = null;
                        scheduleCheckIn(RETRY_CHECKIN_PERIOD_SECONDS);
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
                scheduleCheckIn(RETRY_CHECKIN_PERIOD_SECONDS);
            }
        }
    };

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
                KYANotificationService.this.notify(id, rating, rate, date,true);
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

                KYA.Telemetry.Survey survey = KYA.Telemetry.Survey.newBuilder().setPerceivedRisk(selected).setActualRisk(rating).build();
                KYA.Telemetry.Builder builder = KYA.Telemetry.newBuilder().setUserID(Utils.getUserId(KYANotificationService.this));
                builder.setSurvey(survey);
                builder.setNotificationID(id);
                builder.setZoneID(1);
                PhoneInterface.getInstance(KYANotificationService.this).sendMessageSurvey(builder.build().toByteArray());
                KYANotificationService.this.notify(id, rating, rate, date,true);
            }
        });
    }


    private void sendHeartbeat(final Intent intent) {
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
                    builder.setZoneID(1);
                    PhoneInterface.getInstance(KYANotificationService.this).sendMessageHeartBeat(builder.build().toByteArray());
                } catch (ExecutionException | InterruptedException e) {
                    Log.d(TAG,"Error fetching heartbeat: " + e.getMessage());
                }
            }
        });
    }

    private void checkIn(){
        Log.d(TAG,"Performing check in");
        synchronized (this) {
            if(mNextCheckIn != null) {
                mAlarmManager.cancel(mNextCheckIn);
                mNextCheckIn = null;
            }
        }
        HandlerThread handlerThread = new HandlerThread("checkIn");
        handlerThread.start();
        Handler handler = new Handler(handlerThread.getLooper());
        handler.post(new Runnable() {
            @Override
            public void run() {
                Location location = LocationProvider.getInstance(KYANotificationService.this).getLocation(LOCATION_TIMEOUT,true);
                if(location != null) {
                    if(location.hasSpeed()) {
                        mLastSpeed = location.getSpeed();
                    }
                    KYA.GeoPoint point = KYA.GeoPoint.newBuilder().setLatitude(location.getLatitude()).setLongitude(location.getLongitude()).setUserID(Utils.getUserId(KYANotificationService.this)).build();
                    KYA.CheckIn.Builder builder = KYA.CheckIn.newBuilder().setUserId(Utils.getUserId(KYANotificationService.this));
                    builder.setLocation(point);
                    builder.setSpeed(location.getSpeed());

                    synchronized (KYANotificationService.this) {
                        if (timeoutTimer != null) {
                            timeoutTimer.cancel();
                        }
                        timeoutTimer = new Timer();
                    }
                    timeoutTimer.schedule(buildTimeoutTask(), RESPONSE_TIMEOUT);

                    PhoneInterface.getInstance(KYANotificationService.this).sendMessageCheckIn(builder.build().toByteArray(), new Runnable() {
                        @Override
                        public void run() {
                            synchronized (KYANotificationService.this) {
                                if(timeoutTimer != null)
                                    timeoutTimer.cancel();
                                timeoutTimer = null;
                            }
                            scheduleCheckIn(RETRY_CHECKIN_PERIOD_SECONDS);
                        }
                    });
                } else {
                    scheduleCheckIn(RETRY_CHECKIN_PERIOD_SECONDS);
                }
            }
        });
    }

    private void onCheckInResponse(byte[] proto) {
        Log.d(TAG,"Handling response");
        synchronized (KYANotificationService.this) {
            if(timeoutTimer != null)
                timeoutTimer.cancel();
            timeoutTimer = null;
        }
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        KYA.KYAResponse response = null;
        try {
            response = KYA.KYAResponse.parseFrom(proto);
        } catch (InvalidProtocolBufferException e) {
            Log.e(TAG,e.getMessage());
        }
        long nextCheckInSeconds = response.getNextRequestTimeInSeconds();
        int currentZone = response.getNewLevel();
        String currentZoneDate = response.getCurrentZone().getUpdated();
        boolean doSurvey = response.getRequestFeedback();
        double crimeRate = response.getCurrentZone().getNumberOfCrimes();
        boolean muted = preferences.getBoolean(MUTE_PREFERENCE,true);
        boolean negativeDelta = preferences.getBoolean("lower_preference",true);
        int prevZone =  preferences.getInt(CURRENT_ZONE_PREFERENCE,1);
        int threshold = preferences.getInt(THRESHOLD_PREFERENCE,1);
        preferences.edit().putInt(CURRENT_ZONE_PREFERENCE,currentZone).commit();
        mAlarmManager = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        scheduleCheckIn(nextCheckInSeconds);
        if (((currentZone > prevZone && currentZone > threshold) || (currentZone < prevZone && negativeDelta)) && !muted) {
            Log.d(TAG,"Notification Needed!");
            String userId  = Settings.Secure.getString(this.getContentResolver(),Settings.Secure.ANDROID_ID);
            mCurrentNotificationId = userId + System.currentTimeMillis();
            boolean higher = currentZone > prevZone;
            if(doSurvey && higher) {
                startSurvey(mCurrentNotificationId,currentZone,crimeRate,currentZoneDate);
            } else {
                notify(mCurrentNotificationId,currentZone,crimeRate,currentZoneDate,higher);
            }
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
    private void scheduleCheckIn(long timeInSeconds) {
        synchronized (this) {
            if(speedTracker == null) {
                speedTracker = new Timer();
                speedTracker.schedule(buildSpeedTask(),5000,10000);
            }
            if(mNextCheckIn == null) {
                Log.d(TAG, "Scheduling check in!");
                Intent intentAlarm = new Intent();
                intentAlarm.setAction("com.nvbyte.kya.CHECK_IN");
                mNextCheckIn = PendingIntent.getBroadcast(this, 0, intentAlarm, PendingIntent.FLAG_UPDATE_CURRENT);
                mAlarmManager.setExact(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + 1000 * timeInSeconds,mNextCheckIn);
            }
        }
    }

    /**
     * Launch a notification activity with a specific classification.
     * @param notificationId Id of notification session (timestamp + phoneId).
     * @param classification Classification level for notification.
     */
    private void notify(final String notificationId, final int classification, final double crimeRate, final String date, final boolean higher) {
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
                        builder.setZoneID(1);
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
                startActivity(notificationActivity);
            }
        });
    }

    private void startSurvey(String notificationId, int currentZone,double crimeRate,String currentZoneDate){
        Utils.acquire(this);
        Intent surveyActivity = new Intent(getApplicationContext(),SurveyActivity.class);
        surveyActivity.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        surveyActivity.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
        surveyActivity.putExtra(EXTRA_ID,notificationId);
        surveyActivity.putExtra(RATING,currentZone);
        surveyActivity.putExtra(CRIME_RATE,crimeRate);
        surveyActivity.putExtra(LAST_UPDATED,currentZoneDate);
        startActivity(surveyActivity);
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
