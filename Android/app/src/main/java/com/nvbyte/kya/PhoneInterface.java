package com.nvbyte.kya;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.wearable.MessageApi;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.NodeApi;
import com.google.android.gms.wearable.Wearable;

public class PhoneInterface implements MessageApi.MessageListener, GoogleApiClient.ConnectionCallbacks {
    private GoogleApiClient mApiClient;
    private static PhoneInterface singleton;
    private Context mContext;
    private boolean isConnected = false;
    private static final String SEND_HEARTBEAT = "/SEND_HEARTBEAT";
    private static final String SEND_CHECK_IN = "/SEND_CHECK_IN";
    private static final String SEND_SURVEY = "/SEND_SURVEY";
    private static final String SEND_GET_ZONE = "/SEND_GET_ZONE";
    private static final String SEND_MOVEMENT = "/SEND_MOVEMENT";



    public static PhoneInterface getInstance(Context c) {
        if(singleton == null) {
            singleton = new PhoneInterface(c);
        }
        return singleton;
    }

    public void sendMessageMovement(byte[] message){
        sendMessage(SEND_MOVEMENT,message);
    }

    public void sendMessageHeartBeat(byte[] message){
        sendMessage(SEND_HEARTBEAT,message);
    }

    public void sendMessageSurvey(byte[] message){
        sendMessage(SEND_SURVEY,message);
    }

    public void sendMessageCheckIn(byte[] message){
        sendMessage(SEND_CHECK_IN,message);
    }

    public void sendMessageGetZone(byte[] message){
        Log.d("TAG","Sending message to phone");
        sendMessage(SEND_GET_ZONE,message);
    }

    private void sendMessage(final String a,final byte[] b){
        new Thread( new Runnable() {
            @Override
            public void run() {
                NodeApi.GetConnectedNodesResult nodes = Wearable.NodeApi.getConnectedNodes( mApiClient ).await();
                for(Node node : nodes.getNodes()) {
                    MessageApi.SendMessageResult result = Wearable.MessageApi.sendMessage(
                            mApiClient, node.getId(), a,b).await();
                }
            }
        }).start();
    }

    private PhoneInterface(Context c) {
        mContext = c;
        initGoogleApiClient();
    }

    private void initGoogleApiClient() {
        mApiClient = new GoogleApiClient.Builder( mContext )
                .addApi( Wearable.API )
                .addConnectionCallbacks( this )
                .build();

        if( mApiClient != null && !( mApiClient.isConnected() || mApiClient.isConnecting() ) )
            mApiClient.blockingConnect();
    }

    @Override
    public void onConnected(Bundle bundle) {
        Wearable.MessageApi.addListener( mApiClient, this );
        isConnected = true;
        Log.e("TRACK", "CONNECTED");
    }

    @Override
    public void onConnectionSuspended(int i) {
        isConnected = false;
    }

    @Override
    public void onMessageReceived (MessageEvent messageEvent) {
        final MessageEvent e = messageEvent;

    }

}
