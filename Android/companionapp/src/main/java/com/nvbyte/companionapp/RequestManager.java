package com.nvbyte.companionapp;


import android.content.Context;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.Volley;

/**
 * Singleton that manages all HTTP requests to remote service using Volley API.
 */
public class RequestManager {
    private RequestQueue mRequestQueue;
    private static RequestManager mRequestManager;
    private static final String IP = "192.168.1.100";
    private static final String SURVEY_ROUTE = "http://"+IP+":3000/telemetry/survey";
    private static final String HEART_BEAT_ROUTE = "http://"+IP+":3000/telemetry/heartbeat";
    private static final String CHECK_IN_ROUTE = "http://"+IP+":3000/location/checkin";
    private static final String CURRENT_ZONE_ROUTE = "http://"+IP+":3000/zones/current/";
    private static final String MOVEMENT_ROUTE = "http://"+IP+":3000/telemetry/movement";
    private static final String RETRY_ROUTE = "http://"+IP+":3000/location/checkin";


    private Context mContext;
    private static final String TAG = "RequestManager";

    /**
     * Private constructor invoked by static factory to avoid multiple instantiations.
     */
    private RequestManager(Context context) {
        mContext = context;
        mRequestQueue = Volley.newRequestQueue(mContext);
    }

    /**
     * Method to access singleton. Performs lazy initialization of RequestManager and returns an
     * unique instance.
     *
     * @return Request Manager singleton, that manages all HTTP requests.
     */
    public static RequestManager getInstance(Context context) {
        if(mRequestManager == null) {
            mRequestManager = new RequestManager(context);
        }
        return mRequestManager;
    }

    public void sendMovement(byte[] message) {
        byte[] body = message;
        ByteArrayRequest request = new ByteArrayRequest(Request.Method.POST, MOVEMENT_ROUTE, body, new Response.Listener<byte[]>() {
            @Override
            public void onResponse(byte[] response) {
                Log.d(TAG, "Got response for movement");
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "Error submitting movement to server.");
            }

            ;
        });
        mRequestQueue.add(request);
    }

    /**
     * Sends a survey response rating to the remote service.
     *
     */
    public void sendSurveyResponse(byte[] message) {
        byte[] body = message;
        ByteArrayRequest request = new ByteArrayRequest(Request.Method.POST,SURVEY_ROUTE,body,new Response.Listener<byte[]>() {
            @Override
            public void onResponse(byte[] response) {
                Log.d(TAG,"Got response for survey");
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG,"Error submitting survey to server.");
            };
        });
        mRequestQueue.add(request);
    }

    /**
     * Sends heart beat readings from sensor to remote service for telemetry.
     *
     */
    public void sendHeartBeatReading(byte[] message) {
        byte[] body = message;
        ByteArrayRequest request = new ByteArrayRequest(Request.Method.POST,HEART_BEAT_ROUTE,body,new Response.Listener<byte[]>() {
            @Override
            public void onResponse(byte[] response) {
                Log.d(TAG,"Got response for heartbeat");
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG,"Error submitting heartbeat to server.");
            };
        });
        mRequestQueue.add(request);
    }

    /**
     * Sends a checkin from the wearer to the remote service.
     *
     * @param onSuccess Success callback, called when request is serviced.
     * @param onFailure Error callback, called when a request does not fall through.
     */
    public void checkIn(byte[] message, Response.Listener<byte[]> onSuccess, Response.ErrorListener onFailure) {
        byte[] body = message;
        ByteArrayRequest request = new ByteArrayRequest(Request.Method.POST,CHECK_IN_ROUTE,body,onSuccess, onFailure);
        mRequestQueue.add(request);
    }

    /**
     * Sends a checkin from the wearer to the remote service.
     *
     * @param onSuccess Success callback, called when request is serviced.
     * @param onFailure Error callback, called when a request does not fall through.
     */
    public void retry(byte[] message, Response.Listener<byte[]> onSuccess, Response.ErrorListener onFailure) {
        byte[] body = message;
        ByteArrayRequest request = new ByteArrayRequest(Request.Method.POST,RETRY_ROUTE,body,onSuccess, onFailure);
        mRequestQueue.add(request);
    }

    /**
     * GET the current geozone in which the wear device is.
     * @param onSuccess Success callback, called when request is serviced.
     * @param onFailure Error callback, called when a request does not fall through.
     */
    public void getCurrentZone(byte[] message, Response.Listener<byte[]> onSuccess, Response.ErrorListener onFailure) {
        byte[] body = message;
        ByteArrayRequest request = new ByteArrayRequest(Request.Method.POST,CURRENT_ZONE_ROUTE,body,onSuccess, onFailure);
        mRequestQueue.add(request);
    }

    /**
     * Cancel all pending HTTP requests.
     */
    public void cancelPendingRequests(Object tag) {
        mRequestQueue.cancelAll(tag);
    }


}