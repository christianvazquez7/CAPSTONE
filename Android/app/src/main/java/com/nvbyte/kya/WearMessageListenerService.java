package com.nvbyte.kya;

import android.content.Intent;
import android.util.Log;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;


public class WearMessageListenerService extends WearableListenerService {
    private static final String RESPONSE_CHECK_IN = "/RESPONSE_CHECK_IN";
    private static final String RESPONSE_GET_ZONE = "/RESPONSE_GET_ZONE";
    private static final String RESPONSE_ERROR = "/RESPONSE_ERROR";


    @Override
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
        }
    }
}