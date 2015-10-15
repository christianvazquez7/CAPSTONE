package com.nvbyte.kya;

import android.app.Fragment;
import android.hardware.SensorEvent;
import android.location.Location;
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



    @Override
    public void onResume() {
        super.onResume();
        mBackgroundView.setBackgroundColor(getResources().getColor(R.color.white));
        content.setVisibility(View.GONE);
        loading.setVisibility(View.VISIBLE);
        RequestManager requestManager = RequestManager.getInstance(getActivity());
        requestManager.getCurrentZone(10,10,new Response.Listener<byte[]>() {
            @Override
            public void onResponse(byte[] response) {
                mBackgroundView.setBackgroundColor(getResources().getColor(R.color.level2));
                loading.setVisibility(View.GONE);
                content.setVisibility(View.VISIBLE);
            }
        },new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG,"Error fetching request:"+ error.getMessage());
            }
        });
//        final SensorDataProvider provider = SensorDataProvider.getInstance(getActivity());
//        HandlerThread handler2 = new HandlerThread("SensorHandlerThread");
//        handler2.start();
//        handler = new Handler(handler2.getLooper());
//        handler.post(new Runnable() {
//            @Override
//            public void run() {
//                try {
//                    final SensorEvent event = provider.getHeartbeat(10000).get();
//                    getActivity().runOnUiThread(new Runnable() {
//                        @Override
//                        public void run() {
//                            mAreaRatingTextView.setText(event.values[0] + " bpm");
//                        }
//                    });
//                } catch (Exception e) {
//
//                }
//            }
//        });
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
