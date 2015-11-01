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
 * Async task that returns a location future.
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
    private boolean mTryHard = false;

    /**
     * Create a future location task to obtain location data from wearable.
     * @param context The application's context.
     * @param client The Google api client to obtain location services from (must be initialized).
     * @param timeOut The amount of time to wait for a valid response.
     */
    public FutureLocation(Context context, GoogleApiClient client, long timeOut, boolean tryHard) {
        mContext = context;
        mManager = client;
        mTimeout = timeOut;
        HandlerThread handlerThread = new HandlerThread("Thread");
        handlerThread.start();
        mLooper = handlerThread.getLooper();
        Log.d("TAG","Subscribing to locaiton requests");
        mTryHard = tryHard;
    }

    /**
     * Determines the best location based on the following criteria:
     * (1) The amount of time that has passed since the location object was created.
     * (2) The accuracy of the location estimate.
     * If the amount of time of an estimate from the current time is too big then the location with
     * the smallest delta is given priority. Otherwise, the accuracy of each estimate is evaluated
     * and the highest accuracy location is selected.
     * @param l1 Location object to compare.
     * @param l2 Location object to compare.
     * @return A location object which is the best estimate of the user's current location based
     * on accuracy and delta criteria.
     */
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
    /**
     * Starts a thread that subscribes to the location google api service. If the cached location
     * satisfies the delta criteria, then returns immediately. Otherwise, the thread sleeps for
     * the timeout specified and then returns the latest location value after sleep. This value can
     * be null.
     */
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

        if(mTryHard && locationResult == null) {
            do {
                Thread.sleep(mTimeout);
            } while(locationResult == null);
        }
        LocationServices.FusedLocationApi.removeLocationUpdates(mManager,mLocationListener);
        return locationResult;
    }
}
