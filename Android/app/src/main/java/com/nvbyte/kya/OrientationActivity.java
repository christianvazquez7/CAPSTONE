package com.nvbyte.kya;

import android.app.Activity;
import android.graphics.Color;
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
import com.google.android.gms.maps.model.Polygon;
import com.google.android.gms.maps.model.PolygonOptions;

/**
 * Shows a way for the user to orient themselves in the landscape. Shows a map that displays:
 * (1) The users position on the map.
 * (2) A polygon depicting the newly entered higher risk zone.
 * (3) A polygon depicting the previous lower lever zone.
 */
public class OrientationActivity extends Activity implements OnMapReadyCallback,GoogleMap.OnMapLongClickListener {
    private DismissOverlayView mDismissOverlay;
    private final static String CURRENT_GEOZONE_EXTRA = "CURRENT_GEOZONE";

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
    /**
     * Paints user location, lower level area, and higher level area on the google map fragent.
     */
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
                final Location l = lp.getLocation(5000,true);
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        CameraUpdate center=CameraUpdateFactory.newLatLng(new LatLng(l.getLatitude(), l.getLongitude()));
                        CameraUpdate zoom=CameraUpdateFactory.zoomTo(16);
                        map.moveCamera(center);
                        map.animateCamera(zoom);
                        KYA.GeoZone dangerZone = (KYA.GeoZone) getIntent().getExtras().getSerializable(CURRENT_GEOZONE_EXTRA);
                        Object saferZoneObject = getIntent().getExtras().getSerializable("OLD_GEO");
                        KYA.GeoZone saferZone = null;
                        if (saferZoneObject != null) {
                            saferZone = (KYA.GeoZone) saferZoneObject;
                        }

                        if(dangerZone != null) {
                            LatLng nw = new LatLng(dangerZone.getBoundaries(0).getLatitude(), dangerZone.getBoundaries(0).getLongitude());
                            LatLng ne = new LatLng(dangerZone.getBoundaries(1).getLatitude(), dangerZone.getBoundaries(1).getLongitude());
                            LatLng se = new LatLng(dangerZone.getBoundaries(2).getLatitude(), dangerZone.getBoundaries(2).getLongitude());
                            LatLng sw = new LatLng(dangerZone.getBoundaries(3).getLatitude(), dangerZone.getBoundaries(3).getLongitude());
                            int level = getIntent().getIntExtra("CLASS", 1);
                            Utils.appendLog("Appending danger zone");
                            Log.d("TAG","Appending danger zone.");
                            Polygon polygon = map.addPolygon(new PolygonOptions()

                                    .add(nw, ne, se, sw)
                                    .fillColor(getResources().getColor(Utils.getAlphaColorByLevel(level)))
                                    .strokeWidth(0.7f)
                                    .strokeColor(getResources().getColor(Utils.getColorByLevel(level))));

                        }

                        if(saferZone != null) {
                            Log.d("TAG","Appending safer zone.");
                            Utils.appendLog("Appending safer zone");
                            LatLng nw2 = new LatLng(saferZone.getBoundaries(0).getLatitude(), saferZone.getBoundaries(0).getLongitude());
                            LatLng ne2 = new LatLng(saferZone.getBoundaries(1).getLatitude(), saferZone.getBoundaries(1).getLongitude());
                            LatLng se2 = new LatLng(saferZone.getBoundaries(2).getLatitude(), saferZone.getBoundaries(2).getLongitude());
                            LatLng sw2 = new LatLng(saferZone.getBoundaries(3).getLatitude(), saferZone.getBoundaries(3).getLongitude());

                            Polygon safer = map.addPolygon(new PolygonOptions()
                                    .add(nw2, ne2, se2, sw2)
                                    .fillColor(getResources().getColor(Utils.getAlphaColorByLevel(saferZone.getLevel())))
                                    .strokeWidth(0.7f)
                                    .strokeColor(getResources().getColor(Utils.getColorByLevel(saferZone.getLevel()))));
                        }
                    }
                });


            }
        });
        map.setOnMyLocationChangeListener(new GoogleMap.OnMyLocationChangeListener() {
            @Override
            public void onMyLocationChange(Location location) {

                CameraUpdate center=CameraUpdateFactory.newLatLng(new LatLng(location.getLatitude(), location.getLongitude()));
                CameraUpdate zoom=CameraUpdateFactory.zoomTo(16);
                map.moveCamera(center);
                map.animateCamera(zoom);

            }
        });

    }

    @Override
    /**
     * On long click, show an option to dismiss the map.
     */
    public void onMapLongClick(LatLng point) {
        mDismissOverlay.show();
    }

    private double LatOffset(double lat,double amount){
        //Position, decimal degrees


        //Earth’s radius, sphere
        double R=6378137;

        //offsets in meters
        double dn = amount;

        //Coordinate offsets in radians
        double dLat = dn/R;

        //OffsetPosition, decimal degrees
        return lat + dLat * 180/Math.PI;
    }

    private double LongOffset(double lon,double lat,double amount) {

        double R=6378137;

        //offsets in meters
        double de = amount;

        //Coordinate offsets in radians
        double dLon = de/(R*Math.cos(Math.PI * lat / 180));

        //OffsetPosition, decimal degrees
        return lon + dLon * 180/Math.PI;
    }
}
