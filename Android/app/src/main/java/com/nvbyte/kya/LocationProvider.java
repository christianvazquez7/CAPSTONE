package com.nvbyte.kya;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * Provides location information in latitude and longitude.
 */
public class LocationProvider {
    private LocationManager mLocationManager;
    private Context mContext;
    private static LocationProvider singleton;

    /**
     * Static factory that lazily instantiates a singleton instance of the LocationProvider.
     * @param context Application's context.
     * @return A singleton instance of the LocationProvider class.
     */
    public static LocationProvider getInstance(Context context) {
        if(singleton == null) {
            singleton = new LocationProvider(context);
        }
        return singleton;
    }

    /**
     * Private constructor for LocationProvider. This should enforce the singleton property of
     * this class.
     * @param context Application's context.
     */
    private LocationProvider(Context context) {
        mContext = context;
        mLocationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
    }

    /**
     * Fetches location through three different methods. First it tries to fetch cached location
     * (last known location). Then, if a network provider is enabled, fetches location from the
     * network provider. Finally, it uses the GPS of the device to collect location data. If any of
     * these passes the threshold for accuracy determined by ACCURACY_THRESHOLD, it is returned.
     * Otherwise, a new reading is waited for.
     * @return A Future location, which can then be used to wait synchronously in service for
     * a location before fetching a request.
     */
    public Location getLocation(long timeout) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        HandlerThread thread = new HandlerThread("LocationHandler");
        thread.start();
        Future<Location> location = executor.submit(new FutureLocation(mContext,mLocationManager,thread.getLooper(),timeout));
        Location actualLocation = null;
        try {
            actualLocation = location.get();
        } catch (Exception e) {
            Log.d("TAG","ERROR WITH THREAD");
        }
        return actualLocation;
    }
}
