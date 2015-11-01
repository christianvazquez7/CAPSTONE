package com.nvbyte.kya;

import android.hardware.SensorEvent;

/**
 * Callback implementation to return data in an asynchronous manner.
 * @param <T> Type of result returned on callback.
 */
public abstract class KYAListener<T> {
    public abstract void callback(T value);
}
