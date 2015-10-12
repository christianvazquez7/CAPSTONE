package com.nvbyte.kya;

import android.app.AlarmManager;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.os.IBinder;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * Service that runs in the background, and handles wear check in and notification to the wear user.
 */
public class KYANotificationService extends Service {

    private AlarmManager mAlarmManager;
    private boolean mWaitingForVelocity;
    private BroadcastReceiver mAlarmReceiver;
    private int mCurrentNotificationId = -1;

    /**
     * Listens for heartbeat data.
     */
    private KYAListener<SensorEvent> mHeartBeatSensorCallback = new KYAListener<SensorEvent>() {
        @Override
        public void callback(SensorEvent value) {

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

    /**
     * Performs a scheduled check in to the remote service.
     * @param context Application's context.
     */
    public static void checkIn(Context context) {

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
    public int onStartCommand(Intent intent, int flags, int startId) {
        return super.onStartCommand(intent, flags, startId);
    }

    /**
     * Schedules the next notification based on the amount of time sent back in response.
     * @param timeInSeconds Time delta in seconds for next check in.
     */
    private void scheduleCheckIn(long timeInSeconds) {

    }

    /**
     * Launch a notification activity with a specific classification.
     * @param notificationId Id of notification session (timestamp + phoneId).
     * @param classification Classification level for notification.
     */
    private void notify(long notificationId, int classification) {

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
