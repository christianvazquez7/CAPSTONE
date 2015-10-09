package com.nvbyte.kya;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;

import java.util.concurrent.Future;

/**
 * Provides location information in latitude and longitude.
 */
public class LocationProvider {
    private LocationManager mLocationManager;
    private LocationListener mLocationListener;
    private Context mContext;
    private static final double ACURRACY_THRESHOLD = 10;

    /**
     * Static factory that lazily instantiates a singleton instance of the LocationProvider.
     * @param context Application's context.
     * @return A singleton instance of the LocationProvider class.
     */
    private LocationProvider getInstance(Context context) {
        return null;
    }

    /**
     * Private constructor for LocationProvider. This should enforce the singleton property of
     * this class.
     * @param context Application's context.
     */
    private LocationProvider(Context context) {

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
    public Future<Location> getLocation() {
        return null;
    }


}
