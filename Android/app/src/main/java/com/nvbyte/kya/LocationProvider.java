package com.nvbyte.kya;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.wearable.Wearable;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * Provides location services to components in KYA application.
 */
public class LocationProvider implements GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener{
    private LocationManager mLocationManager;
    private Context mContext;
    private static LocationProvider singleton;
    private GoogleApiClient mGoogleApiClient;

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
        mGoogleApiClient = new GoogleApiClient.Builder( mContext )
                .addApi( Wearable.API )
                .addApi(LocationServices.API)
                .addConnectionCallbacks( this )
                .build();

        if( mGoogleApiClient != null && !( mGoogleApiClient.isConnected() || mGoogleApiClient.isConnecting() ) )
            mGoogleApiClient.blockingConnect();
    }

    /**
     * Fetches location through three different methods. First it tries to fetch cached location
     * (last known location). Then, if a network provider is enabled, fetches location from the
     * network provider. Finally, it uses the GPS of the device to collect location data. If any of
     * these passes the threshold for accuracy determined by ACCURACY_THRESHOLD, it is returned.
     * Otherwise, a new reading is waited for.
     * @return Best estimate of user's current location.
     */
    public Location getLocation(long timeout,boolean tryHard) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<Location> location = executor.submit(new FutureLocation(mContext, mGoogleApiClient, timeout,tryHard));
        Location actualLocation = null;
        try {
            actualLocation = location.get();
        } catch (Exception e) {
            Log.d("TAG","ERROR WITH THREAD");
        }
        return actualLocation;
    }

    /**
     * Fetches the user speed using location services from Google and Gps.
     * @param timeout The amount of time to wait for accurate speed estimate.
     * @return The speed at which the device is traveling. Can be null.
     */
    public double getSpeed(long timeout) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<Location> location = executor.submit(new FutureLocation(mContext, mGoogleApiClient, timeout, false));
        Location actualLocation = null;
        try {
            actualLocation = location.get();
        } catch (Exception e) {
            Log.d("TAG","ERROR WITH THREAD");
        }
        return actualLocation.getSpeed();
    }

    @Override
    public void onConnected(Bundle bundle) {
        Log.d("TAG","CONECTED!");
    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

    }
}
