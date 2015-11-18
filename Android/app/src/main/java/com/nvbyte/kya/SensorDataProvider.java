package com.nvbyte.kya;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.Log;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * Provides sensor data to application. It internally keeps track on who is listening and also
 * marshall sensor events to only provide meaningful results to subscribers. When no one is
 * listening it makes sure no other sensors are on.
 */
public class SensorDataProvider {
    private SensorManager mSensorManager;
    private Context mContext;
    private static SensorDataProvider mProvider;
    private HashMap<Integer,ISensor> mSensorIByType;
    private final ExecutorService pool;
    private static final String TAG = "SensorDataProvider";

    /**
     * Get singleton provider. Makes use of lazy initialization to avoid multiple instantiations.
     * @return A singleton instance of the Sensor data provider for universal use.
     */
    public static SensorDataProvider getInstance(Context c) {
        if(mProvider == null) {
            mProvider = new SensorDataProvider(c);
        }
        return mProvider;
    }

    /**
     * Private constructor to avoid instantiation of class leading to multiple instances.
     * @param context Application's context.
     */
    private SensorDataProvider(Context context) {
        mContext = context;
        mSensorManager = (SensorManager) mContext.getSystemService(Context.SENSOR_SERVICE);
        pool = Executors.newFixedThreadPool(3);
        mSensorIByType = new LinkedHashMap<>();
        ISensor heartBeatSensor = new ISensor(mSensorManager,mSensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE));
        ISensor accelerometer = new ISensor(mSensorManager,mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER));
        mSensorIByType.put(Sensor.TYPE_HEART_RATE,heartBeatSensor);
        mSensorIByType.put(Sensor.TYPE_ACCELEROMETER,accelerometer);
        //mSensorManager.registerListener(accelerationChangeListener,mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),1000000);
    }

    /**
     * Get the heart beat of the user using sensor type HEART_RATE.
     * @param timeout The time to wait for a sensor result.
     * @return A future heart beat, which can be fetched synchronously later on.
     */
    public Future<SensorEvent> getHeartbeat(long timeout) {
        Log.d(TAG,"Fetching heart beat");
        ISensor accelerometer = mSensorIByType.get(Sensor.TYPE_HEART_RATE);
        Future<SensorEvent> future = pool.submit(new SensorEventFuture(mContext,accelerometer,timeout));
        return future;
    }
}
