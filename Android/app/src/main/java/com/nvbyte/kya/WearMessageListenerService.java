package com.nvbyte.kya;

import android.content.Intent;
import android.location.Location;
import android.util.Log;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

/**
 * Background service that listens for messages coming from the paired phone. This class handles
 * all actions for different message types. The different message types are the following:
 * (i) Check_In: Triggered when the phone has successfully checked in with the remote service.
 * (ii) GET_ZONE: Triggered when the phone has successfully retrieved the current zone from the
 * remote service.
 * (iii) ERROR: Triggered when the phone has encountered an issue during a request with the remote
 * server.
 */
public class WearMessageListenerService extends WearableListenerService {
    private static final String RESPONSE_CHECK_IN = "/RESPONSE_CHECK_IN";
    private static final String RESPONSE_GET_ZONE = "/RESPONSE_GET_ZONE";
    private static final String RESPONSE_ERROR = "/RESPONSE_ERROR";
    private static final String MOCK = "/MOCK";



    @Override
    /**
     * Triggered when a message is received from the paired Android phone. Depending of the message,
     * the service forwards an action intent that should be captured by the KYANotificationService.
     */
    public void onMessageReceived(MessageEvent messageEvent) {
        super.onMessageReceived(messageEvent);
        Log.d("TAG","GOT MESSAGE FROM PHONE");
        if(messageEvent.getPath().equals(RESPONSE_GET_ZONE)) {
            Intent intent = new Intent();
            intent.setAction("com.nvbyte.kya.CURRENT_ZONE");
            intent.putExtra("PROTO", messageEvent.getData());
            sendBroadcast(intent);
        } else if (messageEvent.getPath().equals(RESPONSE_CHECK_IN)) {
            Intent intent = new Intent();
            intent.setAction("com.nvbyte.kya.CHECK_IN_RESPONSE");
            intent.putExtra("PROTO", messageEvent.getData());
            sendBroadcast(intent);
        } else if (messageEvent.getPath().equals(RESPONSE_ERROR)) {
            Intent intent = new Intent();
            intent.setAction("com.nvbyte.kya.ERROR");
            sendBroadcast(intent);
        } else if (messageEvent.getPath().equals(MOCK)) {
            String mix = new String(messageEvent.getData());
            String[] part = mix.trim().split("p");

            LocationProvider.getInstance(this).setMockLocation(part[0],part[1]);
        }
    }
}