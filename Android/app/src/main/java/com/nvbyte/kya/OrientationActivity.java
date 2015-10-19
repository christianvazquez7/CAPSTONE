package com.nvbyte.kya;

import android.app.Activity;
import android.location.Location;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.support.v4.app.FragmentActivity;
import android.support.wearable.view.DismissOverlayView;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

/**
 * Contains the compass surface view that draws direction to previous safer zone after a
 * notification occurs.
 */
public class OrientationActivity extends Activity implements OnMapReadyCallback,GoogleMap.OnMapLongClickListener {
    private DismissOverlayView mDismissOverlay;

    @Override
    /**
     * Sets up the views on for the compass and classification of current zone.
     */
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_orientation);
        mDismissOverlay =
                (DismissOverlayView) findViewById(R.id.dismiss_overlay);
        mDismissOverlay.setIntroText("Intro");
        mDismissOverlay.showIntroIfNecessary();

        MapFragment fm = (MapFragment)  getFragmentManager().findFragmentById(R.id.map);
        fm.getMapAsync(this);




    }

    @Override
    public void onMapReady(final GoogleMap map) {
        Log.d("TAG","MAP DISPLAYED");
        map.setMyLocationEnabled(true);
        map.setOnMapLongClickListener(this);


        HandlerThread thread = new HandlerThread("Handler");
        thread.start();
        Handler hand = new Handler(thread.getLooper());
        hand.post(new Runnable() {
            @Override
            public void run() {

                LocationProvider lp =  LocationProvider.getInstance(OrientationActivity.this);
                final Location l = lp.getLocation(5000);
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        CameraUpdate center=CameraUpdateFactory.newLatLng(new LatLng(l.getLatitude(), l.getLongitude()));
                        CameraUpdate zoom=CameraUpdateFactory.zoomTo(11);
                        map.moveCamera(center);
                        map.animateCamera(zoom);
                    }
                });


            }
        });
        map.setOnMyLocationChangeListener(new GoogleMap.OnMyLocationChangeListener() {
            @Override
            public void onMyLocationChange(Location location) {

                CameraUpdate center=CameraUpdateFactory.newLatLng(new LatLng(location.getLatitude(), location.getLongitude()));
                CameraUpdate zoom=CameraUpdateFactory.zoomTo(11);
                map.moveCamera(center);
                map.animateCamera(zoom);

            }
        });

    }

    @Override
    public void onMapLongClick(LatLng point) {
        mDismissOverlay.show();
    }
}
