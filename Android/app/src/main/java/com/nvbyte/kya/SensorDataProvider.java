package com.nvbyte.kya;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorManager;

import java.util.HashMap;
import java.util.List;

/**
 * Provides sensor data to application. It internally keeps track on who is listening and also
 * marshall sensor events to only provide meaningful results to subscribers. When no one is
 * listening it makes sure no other sensors are on.
 */
public class SensorDataProvider {
    private SensorManager mSensorManager;
    private List<Sensor> mDeviceSensors;
    private Context mContext;
    private HashMap<Integer,List<KYAListener<SensorEvent>>> mListenersPerSensorType;
    private static SensorDataProvider mProvider;
    private HashMap<Integer,ISensor> mSensorIByType;

    /**
     * Get singleton provider. Makes use of lazy initialization to avoid multiple instantiations.
     * @return A singleton instance of the Sensor data provider for universal use.
     */
    public static SensorDataProvider getInstance() {
        return null;
    }

    /**
     * Private constructor to avoid instantiation of class leading to multiple instances.
     * @param context Application's context.
     */
    private SensorDataProvider(Context context) {

    }

    /**
     * Data provider's internal listener for heartbeat sensor events.
     */
    private KYAListener<SensorEvent> mManagerHeartBeatCallback = new KYAListener<SensorEvent>() {
        @Override
        public synchronized void callback(SensorEvent value) {

        }
    };

    /**
     * Data provider's internal listener for orientation sensor events.
     */
    private KYAListener<SensorEvent> mManagerOrientationCallback = new KYAListener<SensorEvent>() {
        @Override
        public synchronized void callback(SensorEvent value) {

        }
    };

    /**
     * Data provider's internal listener for accelerometer sensor events.
     */
    private KYAListener<SensorEvent> mManagerAccelerometerCallback = new KYAListener<SensorEvent>() {
        @Override
        public synchronized void callback(SensorEvent value) {

        }
    };

    /**
     * Unregister an external listener for a specific sensor type. Stops sensor if it has no other
     * registered listeners.
     * @param sensorType Sensor type to detach listener from.
     * @param listener Listener you intend to unregister.
     */
    public void unregisterListener(int sensorType, KYAListener<SensorEvent> listener) {

    }

    /**
     * Register an external listener for a specific sensor type. Starts sensor if it has not been
     * started already by a previous call.
     * @param sensorType Sensor type to attach listener from.
     * @param listener Listener you intend to register.
     */
    public void registerListener(int sensorType,KYAListener<SensorEvent> listener) {

    }

    /**
     * Start listening internally to a sensor.
     * @param sensorType Type of sensor you wish to start internally listening on.
     */
    private void startListening(int sensorType) {

    }

    /**
     * Stop listening internally to a sensor.
     * @param sensorType Type of sensor you wish to stop internally listening on.
     */
    private void stopListening(int sensorType) {

    }
}
