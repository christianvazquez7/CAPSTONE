package com.nvbyte.companionapp;

import android.content.Intent;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;

import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

/**
 * Message service analogous to the WearMessageServiceListener on the wear application. Listens
 * for messages sent from the watch to the phone. The sent messages type define rpc-like methods to
 * be invoked on the phone (given the lack of wifi on the watch). The following rpc are serviced:
 * (1) SEND_HEARTBEAT: Send heart beat telemetry to the remote service.
 * (2) SEND_CHECK_IN: Send position and velocity of user to remote service in order to determine if
 * notification is needed.
 * (3) SEND_SURVEY: Send survey telemetry to the remote service.
 * (4) SEND_GET_ZONE: Request the current zone from the remote service.
 * (5) SEND_MOVEMENT: Send movement telemetry to the remote service.
 */
public class MessageService extends WearableListenerService {

    private static final String SEND_HEARTBEAT = "/SEND_HEARTBEAT";
    private static final String SEND_CHECK_IN = "/SEND_CHECK_IN";
    private static final String SEND_SURVEY = "/SEND_SURVEY";
    private static final String SEND_GET_ZONE = "/SEND_GET_ZONE";
    private static final String SEND_MOVEMENT = "/SEND_MOVEMENT";
    private static final String SEND_RETRY = "/SEND_RETRY";
    private static final String TAG = "MessageService";

    @Override
    /**
     * Triggered when a message is received from the Android wear device.
     */
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
            } else if(messageEvent.getPath().equals(SEND_RETRY)) {
                handleRetry(manager,content);
            }
    }

    /**
     * Check-In with the remote service. The servers response is then forwarded to the paired watch.
     * If an error occurs during check-in, notify the watch for it to re-schedule a subsequent
     * check-in.
     * @param manager Manager of HTTP requests.
     * @param body Serialized CheckIn protobuffer.
     */
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
                HandlerThread handlerThread = new HandlerThread("ErrorHandlerThread");
                handlerThread.start();
                Handler handler = new Handler(handlerThread.getLooper());
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        Log.d(TAG,"Sending error response to wear...");
                        WearInterface wInterface = WearInterface.getInstance(MessageService.this);
                        wInterface.sendError();
                    }
                });

            }
        });
    }


    private void handleRetry(RequestManager manager,byte[] body) {
        manager.retry(body, new Response.Listener<byte[]>() {
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
                HandlerThread handlerThread = new HandlerThread("ErrorHandlerThread");
                handlerThread.start();
                Handler handler = new Handler(handlerThread.getLooper());
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        Log.d(TAG,"Sending error response to wear...");
                        WearInterface wInterface = WearInterface.getInstance(MessageService.this);
                        wInterface.sendError();
                    }
                });

            }
        });
    }

    /**
     * Send movement telemetry data. This is fire and forget. If the data is lost, no retry will
     * happen. The success or failure of the operation is obscure to the Android wear device.
     * @param manager Manager of HTTP requests.
     * @param body Serialized Geopoint protobuffer.
     */
    private void sendMovement(RequestManager manager,byte[] body) {
        manager.sendMovement(body);
    }

    /**
     * Send heartbeat telemetry data. This is fire and forget. If the data is lost, no retry will
     * happen. The success or failure of the operation is obscure to the Android wear device.
     * @param manager Manager of HTTP requests.
     * @param body Serialized Telemetry protobuffer.
     */
    private void sendHeartbeat(RequestManager manager,byte[] body) {
        manager.sendHeartBeatReading(body);
    }

    /**
     * Send survey telemetry data. This is fire and forget. If the data is lost, no retry will
     * happen. The success or failure of the operation is obscure to the Android wear device.
     * @param manager Manager of HTTP requests.
     * @param body Serialized Telemetry protobuffer.
     */
    private void sendSurvey(RequestManager manager, byte[] body) {
        manager.sendSurveyResponse(body);
    }

    /**
     * Fetch the user's current zone from the remote service.
     * @param manager Manager of HTTP requests.
     * @param body Serialized Geopoint protobuffer.
     */
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