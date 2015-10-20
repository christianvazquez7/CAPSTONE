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
    private static final long HEART_BEAT_TIMEOUT = 5000;
    private static final long COLLECT_PERIOD = 1000 * 60 * 1; // 1 minutes.
    private static final long SAMPLE_PERIOD = 1000 * 10; // 10 seconds.
    private long mTimeStartedCollecting = 0;
    private static final String THRESHOLD_PREFERENCE = "THRESHOLD";
    private static final String CURRENT_ZONE_PREFERENCE = "CURRENT_ZONE";
    private final static String SELECTED_EXTRA = "SELECTED_ID";
    private static final long LOCATION_TIMEOUT = 1000;
    private static final long RETRY_CHECKIN_PERIOD_SECONDS = 5; /// 5 seconds
    private static final long RESPONSE_TIMEOUT = 5; /// 5 seconds
    private Timer mMovementTimer;
    private String mCurrentNotificationId = "";


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
                    Location l = LocationProvider.getInstance(KYANotificationService.this).getLocation(LOCATION_TIMEOUT);
                    String userId  = Settings.Secure.getString(getContentResolver(),Settings.Secure.ANDROID_ID);
                    PhoneInterface.getInstance(KYANotificationService.this).sendMessageMovement(new byte[1]);
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
                Log.d(TAG,"Got survey response.");
                sendSurveyResult(intent);
            } else if (action.equals("com.nvbyte.kya.SEND_AFTER_BEAT")) {
                sendHeartbeat(intent);
            } else if (action.equals("com.nvbyte.kya.CHECK_IN")) {
                Log.d(TAG,"Triggered by alarm!!!");
                checkIn();
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

    /**
     * Listens for accelerometer data (velocity and acceleration).
     */
    private KYAListener<SensorEvent> mAccelerometerSensorCallback = new KYAListener<SensorEvent>() {
        @Override
        public synchronized void callback(SensorEvent value) {

        }
    };

    private void onSurveyCanceled(final Intent intent) {
        HandlerThread handlerThread = new HandlerThread("surveyCanceledHandler");
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
                KYANotificationService.this.notify(id, rating, rate, date);
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
        filter.addAction("com.nvbyte.kya.CHECK_IN");
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
                PhoneInterface.getInstance(KYANotificationService.this).sendMessageSurvey(new byte[1]);
                KYANotificationService.this.notify(id, rating, rate, date);
            }
        });
    }


    private void sendHeartbeat(Intent intent) {
        HandlerThread handlerThread = new HandlerThread("hbHandler");
        handlerThread.start();
        Handler heartBeatHandler = new Handler(handlerThread.getLooper());
        heartBeatHandler.post(new Runnable() {
            @Override
            public void run() {
                Future<SensorEvent> futureHeartBeat = SensorDataProvider.getInstance(KYANotificationService.this).getHeartbeat(HEART_BEAT_TIMEOUT);
                try {
                    SensorEvent heartbeat = futureHeartBeat.get();
                    PhoneInterface.getInstance(KYANotificationService.this).sendMessageHeartBeat(new byte[1]);
                } catch (ExecutionException | InterruptedException e) {
                    Log.d(TAG,"Error fetching heartbeat: " + e.getMessage());
                }
            }
        });
    }

    private void checkIn(){
        Log.d(TAG,"Performing check in");
        HandlerThread handlerThread = new HandlerThread("checkIn");
        handlerThread.start();
        Handler handler = new Handler(handlerThread.getLooper());
        handler.post(new Runnable() {
            @Override
            public void run() {
                Location l = LocationProvider.getInstance(KYANotificationService.this).getLocation(LOCATION_TIMEOUT);
                double speed = l.getSpeed();
                double longitude = l.getLongitude();
                double latitude = l.getLatitude();
                PhoneInterface.getInstance(KYANotificationService.this).sendMessageCheckIn(new byte[1], new Runnable() {
                    @Override
                    public void run() {
                        scheduleCheckIn(RETRY_CHECKIN_PERIOD_SECONDS);
                    }
                });
            }
        });
    }

    private void onCheckInResponse(byte[] proto) {
        Log.d(TAG,"Handling response");
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        long nextCheckInSeconds = 60; //TODO: Fetch param from proto.
        int currentZone = 10; // TODO: Fetch param from proto.
        String currentZoneDate = "19/10/15"; //TODO: Fetch param from proto.
        boolean doSurvey = true; //TODO: Fetch param from proto.
        double crimeRate = 45.4; //TODO: Fetch param from proto.
        int prevZone = 1;
        int threshold = preferences.getInt(THRESHOLD_PREFERENCE,1);
        preferences.edit().putInt(CURRENT_ZONE_PREFERENCE,currentZone).commit();
        mAlarmManager = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        scheduleCheckIn(nextCheckInSeconds);
        if (currentZone > prevZone && currentZone > threshold) {
            Log.d(TAG,"Notification Needed!");
            String userId  = Settings.Secure.getString(this.getContentResolver(),Settings.Secure.ANDROID_ID);
            mCurrentNotificationId = userId + System.currentTimeMillis();
            if(doSurvey) {
                startSurvey(mCurrentNotificationId,currentZone,crimeRate,currentZoneDate);
            } else {
                notify(mCurrentNotificationId,currentZone,crimeRate,currentZoneDate);
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
        scheduleCheckIn(1);
        return START_STICKY;
    }

    /**
     * Schedules the next notification based on the amount of time sent back in response.
     * @param timeInSeconds Time delta in seconds for next check in.
     */
    private void scheduleCheckIn(long timeInSeconds) {
        Log.d(TAG,"Scheduling check in!");
        Intent intentAlarm = new Intent();
        intentAlarm.setAction("com.nvbyte.kya.CHECK_IN");
        mAlarmManager.setExact(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + 1000*timeInSeconds, PendingIntent.getBroadcast(this, 0, intentAlarm, PendingIntent.FLAG_UPDATE_CURRENT));
    }

    /**
     * Launch a notification activity with a specific classification.
     * @param notificationId Id of notification session (timestamp + phoneId).
     * @param classification Classification level for notification.
     */
    private void notify(final String notificationId, final int classification, final double crimeRate, final String date) {
        HandlerThread handlerThread = new HandlerThread("handleBeat");
        handlerThread.start();
        Handler beatHandler = new Handler(handlerThread.getLooper());
        beatHandler.post(new Runnable() {
            @Override
            public void run() {
                Future<SensorEvent> futureHeartBeat = SensorDataProvider.getInstance(KYANotificationService.this).getHeartbeat(HEART_BEAT_TIMEOUT);
                try {
                    SensorEvent heartbeat = futureHeartBeat.get();
                    PhoneInterface.getInstance(KYANotificationService.this).sendMessageHeartBeat(new byte[1]);
                } catch (ExecutionException | InterruptedException e) {
                    Log.d(TAG,"Error fetching heartbeat: " + e.getMessage());
                }
                mMovementTimer = new Timer();
                mTimeStartedCollecting = System.currentTimeMillis();
                synchronized (KYANotificationService.this) {
                    if (mMovementTimer != null) {
                        mMovementTimer.cancel();
                        mMovementTimer = new Timer();
                    }
                }
                mMovementTimer.schedule(buildMoveTask(), 0, SAMPLE_PERIOD);
                Intent notificationActivity = new Intent(KYANotificationService.this,NotificationActivity.class);
                notificationActivity.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                notificationActivity.putExtra(RATING,classification);
                notificationActivity.putExtra(CRIME_RATE,crimeRate);
                notificationActivity.putExtra(LAST_UPDATED,date);
                notificationActivity.putExtra(EXTRA_ID,notificationId);
                startActivity(notificationActivity);
            }
        });
    }

    private void startSurvey(String notificationId, int currentZone,double crimeRate,String currentZoneDate){
        Intent surveyActivity = new Intent(this,SurveyActivity.class);
        surveyActivity.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
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
