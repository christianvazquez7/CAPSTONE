package com.nvbyte.companionapp;

import android.content.Intent;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;

import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;


public class MessageService extends WearableListenerService {

    private static final String SEND_HEARTBEAT = "/SEND_HEARTBEAT";
    private static final String SEND_CHECK_IN = "/SEND_CHECK_IN";
    private static final String SEND_SURVEY = "/SEND_SURVEY";
    private static final String SEND_GET_ZONE = "/SEND_GET_ZONE";
    private static final String SEND_MOVEMENT = "/SEND_MOVEMENT";
    private static final String TAG = "MessageService";

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
            super.onMessageReceived( messageEvent );
            RequestManager manager = RequestManager.getInstance(this);
            byte[] content = messageEvent.getData();
            if(messageEvent.getPath().equals(SEND_GET_ZONE)) {
               fetchZone(manager,content);
            } else if(messageEvent.getPath().equals(SEND_HEARTBEAT)) {
                sendHeartbeat(manager,content);
            } else if(messageEvent.getPath().equals(SEND_CHECK_IN)) {
                handleCheckIn(manager,content);
            } else if(messageEvent.getPath().equals(SEND_SURVEY)) {
                sendSurvey(manager,content);
            } else if(messageEvent.getPath().equals(SEND_MOVEMENT)) {
                sendMovement(manager,content);
            }
    }

    private void handleCheckIn(RequestManager manager,byte[] body) {
        manager.checkIn(body, new Response.Listener<byte[]>() {
            @Override
            public void onResponse(final byte[] response) {
                Log.d(TAG,"Got server response for check-in...");
                HandlerThread handlerThread = new HandlerThread("SensorHandlerThread");
                handlerThread.start();
                Handler handler = new Handler(handlerThread.getLooper());
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        Log.d(TAG,"Sending check-in response to wear...");
                        WearInterface wInterface = WearInterface.getInstance(MessageService.this);
                        wInterface.sendResponseCheckIn(response);
                        Log.d(TAG,"Sent check-in response to wear.");
                    }
                });
            }
        },new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG,"Error sending check-in request!");
            }
        });
    }

    private void sendMovement(RequestManager manager,byte[] body) {
        manager.sendMovement(body);
    }

    private void sendHeartbeat(RequestManager manager,byte[] body) {
        manager.sendHeartBeatReading(body);
    }

    private void sendSurvey(RequestManager manager, byte[] body) {
        manager.sendSurveyResponse(body);
    }

    private void fetchZone(RequestManager manager, byte[] body) {
        manager.getCurrentZone(body, new Response.Listener<byte[]>() {
            @Override
            public void onResponse(byte[] response) {
                Log.d(TAG,"Got server response for current-zone...");
                HandlerThread handlerThread = new HandlerThread("SensorHandlerThread");
                handlerThread.start();
                Handler handler = new Handler(handlerThread.getLooper());
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        Log.d("TAG","Sending current zone to wear");
                        WearInterface wInterface = WearInterface.getInstance(MessageService.this);
                        wInterface.sendResponseGetZone(new byte[1]);
                        Log.d("TAG","Sent current zone to wear");
                    }
                });
            }
        },new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG,"Error sending current zone request!");
            }
        });
    }

}