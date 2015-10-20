package com.nvbyte.kya;

import android.location.Location;
import android.provider.Settings;

import java.util.Timer;
import java.util.TimerTask;

public class MovementTask extends TimerTask {

    private long mTimeStarted;
    private long mPeriod;
    private Timer mTimer;

    public MovementTask(long timeStarted,long period, Timer timer) {
        super();
        mTimeStarted = timeStarted;
        mPeriod = period;
        mTimer = timer;
    }
    @Override
    public void run() {

    }
}
