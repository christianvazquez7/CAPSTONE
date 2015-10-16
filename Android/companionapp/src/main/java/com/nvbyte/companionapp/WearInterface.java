package com.nvbyte.companionapp;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.wearable.MessageApi;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.NodeApi;
import com.google.android.gms.wearable.Wearable;

public class WearInterface implements MessageApi.MessageListener, GoogleApiClient.ConnectionCallbacks {
    private GoogleApiClient mApiClient;
    private static WearInterface singleton;
    private Context mContext;
    private boolean isConnected = false;
    private static final String RESPONSE_CHECK_IN = "/RESPONSE_CHECK_IN";
    private static final String RESPONSE_GET_ZONE = "/RESPONSE_GET_ZONE";


    public static WearInterface getInstance(Context c) {
        if(singleton == null) {
            singleton = new WearInterface(c);
        }
        return singleton;
    }

    public void sendResponseCheckIn(byte[] message){
        sendMessage(RESPONSE_CHECK_IN,message);
    }

    public void sendResponseGetZone(byte[] message){
        sendMessage(RESPONSE_GET_ZONE,message);
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

    private WearInterface(Context c) {
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
