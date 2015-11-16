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

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
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
    private boolean DEBUG = false;
    private Location currentLocation = null;
    private LocationListener listener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            currentLocation = location;
        }
    };

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

    public void setMockLocation(String lat, String lon) {
        Location mockLocation = new Location("network");
        long currentTime = System.currentTimeMillis();
        long elapsedTimeNanos = SystemClock.elapsedRealtimeNanos();
        mockLocation.setElapsedRealtimeNanos(elapsedTimeNanos);
        mockLocation.setTime(currentTime);
        mockLocation.setLatitude(Double.parseDouble(lat));
        mockLocation.setLongitude(Double.parseDouble(lon));
        mockLocation.setAccuracy(3.0f);
        LocationServices.FusedLocationApi.setMockLocation(mGoogleApiClient,mockLocation);
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
        if(DEBUG) {
            LocationServices.FusedLocationApi.setMockMode(mGoogleApiClient,true);
            Location mockLocation = new Location("network");
            long currentTime = System.currentTimeMillis();
            long elapsedTimeNanos = SystemClock.elapsedRealtimeNanos();
            mockLocation.setElapsedRealtimeNanos(elapsedTimeNanos);
            mockLocation.setTime(currentTime);
            mockLocation.setLatitude(18.200775);
            mockLocation.setLongitude(-67.144758);
            mockLocation.setAccuracy(3.0f);
            LocationServices.FusedLocationApi.setMockLocation(mGoogleApiClient,mockLocation);
        } else {
            LocationServices.FusedLocationApi.setMockMode(mGoogleApiClient,false);
        }
        LocationRequest locationRequest = LocationRequest.create()
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(1000);

        LocationServices.FusedLocationApi.requestLocationUpdates(mGoogleApiClient, locationRequest, listener);

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

    public Location getCurrentLocationForSpeed() {
        return currentLocation;
    }
}
