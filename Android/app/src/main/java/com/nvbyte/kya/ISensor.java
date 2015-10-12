package com.nvbyte.kya;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * Sensor interface for a particular sensor type.
 */
public class ISensor implements SensorEventListener {
    private AtomicInteger mAccuracy = new AtomicInteger(0);
    private Sensor mSensor;
    private KYAListener<SensorEvent> mCallback;
    private boolean isStarted = false;

    /**
     * Creates a sensor object for a particular sensor type, and a listener for its manager.
     * @param sensor Sensor that is being interfaced.
     * @param listener Manager's listener.
     */
    public ISensor(Sensor sensor, KYAListener<SensorEvent> listener) {
        mSensor = sensor;
        mCallback = listener;
    }

    @Override
    /**
     * Called when new sensor data is captured by the sensor.
     */
    public void onSensorChanged(SensorEvent event) {
        mCallback.callback(event);
    }

    @Override
    /**
     * Called when the accuracy of a sensor changes.
     */
    public void onAccuracyChanged(Sensor sensor, int newAccuracy) {
        mAccuracy.set(newAccuracy);
    }

    /**
     * Get the current sensor accuracy.
     * @return Sensor accuracy.
     */
    public int getAccuracy() {
        return mAccuracy.get();
    }

    /**
     * Checks if the sensor is sending data to a registered listener.
     * @return True if sensor is collecting data. False otherwise.
     */
    public boolean isStarted(){
        return isStarted;
    }

    /**
     * Start listening for sensor changes.
     */
    public void start(){

    }

    /**
     * Stop listening for sensor changes.
     */
    public void stop(){

    }
}
