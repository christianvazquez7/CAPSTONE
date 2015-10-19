package com.nvbyte.kya;

import android.content.Context;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.os.SystemClock;
import android.util.Log;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

import java.util.concurrent.Callable;

/**
 * Created by christianvazquez on 10/17/15.
 */
public class FutureLocation implements Callable<Location> {

    private final Context mContext;
    private final GoogleApiClient mManager;
    private Location locationResult;
    private static final long admittedTimeDelta = 30000;
    private static final long significantTime = 60000;
    private long mTimeout;
    private Looper mLooper;
    private LocationListener mLocationListener;

    public FutureLocation(Context context, GoogleApiClient client, long timeOut) {
        mContext = context;
        mManager = client;
        mTimeout = timeOut;
        HandlerThread handlerThread = new HandlerThread("Thread");
        handlerThread.start();
        mLooper = handlerThread.getLooper();
        Log.d("TAG","Subscribing to locaiton requests");
    }

    private Location bestLocation(Location l1,Location l2) {
        Log.d("HERE","FETCHING BEST LOCATION");
        if (l1 == null && l2 == null) {
            Log.d("HERE","both are null");
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
        locationResult = LocationServices.FusedLocationApi.getLastLocation(mManager);
        if(locationResult != null && System.currentTimeMillis() - locationResult.getTime() < admittedTimeDelta) {
            return locationResult;
        }
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                Log.d("TAG","Starting location reads");
                LocationRequest locationRequest = LocationRequest.create()
                        .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                        .setInterval(0);
                mLocationListener = new LocationListener() {
                    @Override
                    public void onLocationChanged(Location location) {
                        Log.d("TAG", "Location changed");
                        locationResult = bestLocation(location,locationResult);
                    }
                };
                LocationServices.FusedLocationApi.requestLocationUpdates(mManager, locationRequest,mLocationListener,mLooper);
                Log.d("TAG", "Locations requested");
            }
        });
        thread.start();
        Thread.sleep(mTimeout);
        LocationServices.FusedLocationApi.removeLocationUpdates(mManager,mLocationListener);
        return locationResult;
    }
}
