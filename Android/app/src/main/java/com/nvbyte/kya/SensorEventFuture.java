package com.nvbyte.kya;

import android.content.Context;
import android.hardware.SensorEvent;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;

import java.util.concurrent.Callable;

public class SensorEventFuture implements Callable<SensorEvent> {

    private final Context mContext;
    private final ISensor mSensor;
    private final long mTimeout;
    private HandlerThread handler = new HandlerThread("SensorHandlerThread");
    private SensorEvent mData;
    private int mAccuracy;
    public static final String TAG = "SensorEventFuture";

    public SensorEventFuture(Context context, ISensor iSensor, long timeout) {
        mContext = context;
        mSensor = iSensor;
        mTimeout = timeout;
    }


    @Override
    public SensorEvent call() throws Exception {
        handler.start();
        Log.d(TAG, "Fetching heart beat");

        Thread sensorThread = new Thread() {
            public void run() {
                mSensor.start(new KYAListener<SensorEvent>() {
                    @Override
                    public synchronized void callback(SensorEvent value) {
                        Log.d(TAG, "Got Reading: " + value.values[0]);
                        if(value.accuracy >= mAccuracy) {
                            mData = value;
                            mAccuracy = value.accuracy;
                        }
                    }
                },new Handler(handler.getLooper()));
            };
        };
        sensorThread.start();
        Thread.sleep(mTimeout);
        mSensor.stop();
        return mData;
    }
}
