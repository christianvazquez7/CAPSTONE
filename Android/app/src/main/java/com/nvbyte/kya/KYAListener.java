package com.nvbyte.kya;

import android.hardware.SensorEvent;

public abstract class KYAListener<T> {
    public abstract void callback(T value);
}
