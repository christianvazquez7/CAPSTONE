package com.nvbyte.kya;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.wearable.view.DismissOverlayView;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

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
public class OrientationActivity extends FragmentActivity implements OnMapReadyCallback,GoogleMap.OnMapLongClickListener {
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

        SupportMapFragment fm = (SupportMapFragment)  getSupportFragmentManager().findFragmentById(R.id.map);
        fm.getMapAsync(this);


    }

    @Override
    public void onMapReady(GoogleMap map) {
        Log.d("TAG","MAP DISPLAYED");
        map.setOnMapLongClickListener(this);
    }

    @Override
    public void onMapLongClick(LatLng point) {
        mDismissOverlay.show();
    }
}
