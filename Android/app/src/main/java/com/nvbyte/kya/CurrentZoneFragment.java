package com.nvbyte.kya;

import android.app.Fragment;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.SensorEvent;
import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.android.volley.Response;
import com.android.volley.VolleyError;

import java.util.concurrent.ExecutionException;


/**
 * Fragment that contains information about the current zone level.
 */
public class CurrentZoneFragment extends android.support.v4.app.Fragment {

    private ProgressBar mLoading;
    private View mBackgroundView;
    private View loading;
    private View content;
    private TextView mAreaRatingTextView;
    private Handler handler = new Handler(Looper.getMainLooper());
    private static final String TAG = "CurrentZoneFragment";
    private BroadcastReceiver messageReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mBackgroundView.setBackgroundColor(getResources().getColor(R.color.level2));
                    loading.setVisibility(View.GONE);
                    content.setVisibility(View.VISIBLE);
                }
            });
        }
    };


    @Override
    public void onPause() {
        super.onPause();
        getActivity().unregisterReceiver(messageReceiver);
    }

    @Override
    public void onResume() {
        super.onResume();
        IntentFilter filters = new IntentFilter();
        filters.addAction("com.nvbyte.kya.CURRENT_ZONE");
        getActivity().registerReceiver(messageReceiver,filters);
        mBackgroundView.setBackgroundColor(getResources().getColor(R.color.white));
        content.setVisibility(View.GONE);
        loading.setVisibility(View.VISIBLE);
        HandlerThread handler2 = new HandlerThread("SensorHandlerThread");
        handler2.start();
        handler = new Handler(handler2.getLooper());
        handler.post(new Runnable() {
            @Override
            public void run() {
                PhoneInterface myInterface = PhoneInterface.getInstance(getActivity());
                Location location = LocationProvider.getInstance(getActivity()).getLocation(300);
                KYA.GeoPoint point = KYA.GeoPoint.newBuilder().setLatitude(location.getLatitude()).setLongitude(location.getLongitude()).setUserID(Utils.getUserId(getActivity())).build();
                myInterface.sendMessageGetZone(point.toByteArray());
            }
        });
    }

    @Nullable
    @Override
    /**
     * Creates the view for the  zone fragment. Launches a query to the server to fetch current
     * location data using HTTP request.
     */
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_current_zone, container, false);
        mAreaRatingTextView = (TextView) rootView.findViewById(R.id.zone);
        mBackgroundView = rootView.findViewById(R.id.background);
        loading = rootView.findViewById(R.id.loading);
        content = rootView.findViewById(R.id.zone_info);
        return rootView;
    }
}
