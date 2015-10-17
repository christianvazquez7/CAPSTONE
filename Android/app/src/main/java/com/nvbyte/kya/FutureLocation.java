package com.nvbyte.kya;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Looper;
import android.util.Log;

import java.util.concurrent.Callable;

/**
 * Created by christianvazquez on 10/17/15.
 */
public class FutureLocation implements Callable<Location>, LocationListener {

    private final Context mContext;
    private final LocationManager mManager;
    private Location locationResult;
    private static final long admittedTimeDelta = 30000;
    private static final long significantTime = 60000;
    private long mTimeout;

    public FutureLocation(Context context, LocationManager manager, Looper looper, long timeOut) {
        mContext = context;
        mManager = manager;
        mTimeout = timeOut;
        mManager.requestLocationUpdates(LocationManager.PASSIVE_PROVIDER,0,0,this,looper);
        mManager.requestLocationUpdates(LocationManager.GPS_PROVIDER,0,0,this,looper);
        Location lastPassiveLocation = mManager.getLastKnownLocation(LocationManager.PASSIVE_PROVIDER);
        Location lastGpsLocation = mManager.getLastKnownLocation(LocationManager.PASSIVE_PROVIDER);
        locationResult = bestLocation(lastGpsLocation,lastPassiveLocation);
    }

    private Location bestLocation(Location l1,Location l2) {
        if (l1 == null && l2 == null) {
            return null;
        } else if (l1 == null || l2 == null) {
            if (l1 == null) {
                return l2;
            } else {
                return l1;
            }
        }
        if (l1.getTime() - l2.getTime() > significantTime) {
            return l1;
        } else if (l2.getTime() - l1.getTime() > significantTime) {
            return l2;
        } else {
                if(l1.getAccuracy() >= l2.getAccuracy()) {
                    return l1;
                } else {
                    return l2;
                }
            }
        }

    @Override
    public Location call() throws Exception {
        if(System.currentTimeMillis() - locationResult.getTime() <= admittedTimeDelta) {
            return locationResult;
        } else {
            Thread.sleep(mTimeout);
            return locationResult;
        }
    }

    @Override
    public void onLocationChanged(Location location) {
        if (locationResult == null) {
            locationResult = location;
        } else {
            locationResult = bestLocation(location,locationResult);
        }
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public void onProviderEnabled(String provider) {

    }

    @Override
    public void onProviderDisabled(String provider) {

    }
}
