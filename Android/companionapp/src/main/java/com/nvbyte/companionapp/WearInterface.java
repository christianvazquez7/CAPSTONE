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

/**
 * Interface for the phone to communicate with the paired Android wear device. This allows the
 * paired phone to notify and send HTTP response data back to the wear device. The following
 * messages are sent:
 * (1) Check_In: Sent when the phone has successfully checked in with the remote service.
 * (2) GET_ZONE: Sent when the phone has successfully retrieved the current zone from the
 * remote service.
 * (3) ERROR: Sent when the phone has encountered an issue during a request with the remote
 * server.
 */
public class WearInterface implements MessageApi.MessageListener, GoogleApiClient.ConnectionCallbacks {
    private GoogleApiClient mApiClient;
    private static WearInterface singleton;
    private Context mContext;
    private boolean isConnected = false;
    private static final String RESPONSE_CHECK_IN = "/RESPONSE_CHECK_IN";
    private static final String RESPONSE_GET_ZONE = "/RESPONSE_GET_ZONE";
    private static final String RESPONSE_ERROR = "/RESPONSE_ERROR";
    private static final String MOCK = "/MOCK";


    /**
     * Get the singleton instance of the interface to the wearable device.
     * @param c The application context.
     * @return Singleton instance of the wear interface.
     */
    public static WearInterface getInstance(Context c) {
        if(singleton == null) {
            singleton = new WearInterface(c);
        }
        return singleton;
    }

    public  void sendMock(String lat, String lon) {
        String send = lat + "p"+ lon;
        sendMessage(MOCK,send.getBytes());
    }
    /**
     * Send error message to watch to notify a problem occurred trying to communicate with the
     * remote runtime server.
     */
    public void sendError() {
        sendMessage(RESPONSE_ERROR,new byte[1]);
    }

    /**
     * Send the check-in's HTTP response back to the wear device.
     * @param message Serialized KYAResponse protobuffer.
     */
    public void sendResponseCheckIn(byte[] message){
        sendMessage(RESPONSE_CHECK_IN,message);
    }

    /**
     * Send the current zone of the user obtained from the remote service response.
     * @param message Serialized Geozone protobuffer.
     */
    public void sendResponseGetZone(byte[] message){
        sendMessage(RESPONSE_GET_ZONE,message);
    }

    /**
     * Send a message to the paired watch.
     * @param a Message type.
     * @param b Serialized message content.
     */
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

    /**
     * Private constructor to enforce singleton attribute.
     * @param c The application context.
     */
    private WearInterface(Context c) {
        mContext = c;
        initGoogleApiClient();
    }

    /**
     * Initialize the GoogleApiClient synchronously to connect with the watch using the Node and
     * Wearable API.
     */
    private void initGoogleApiClient() {
        mApiClient = new GoogleApiClient.Builder( mContext )
                .addApi( Wearable.API )
                .addConnectionCallbacks( this )
                .build();

        if( mApiClient != null && !( mApiClient.isConnected() || mApiClient.isConnecting() ) )
            mApiClient.blockingConnect();
    }

    @Override
    /**
     * Triggered when the google api client is connected successfully.
     */
    public void onConnected(Bundle bundle) {
        Wearable.MessageApi.addListener( mApiClient, this );
        isConnected = true;
        Log.e("TRACK", "CONNECTED");
    }

    @Override
    /**
     * Triggered when the connection between devices is lost.
     */
    public void onConnectionSuspended(int i) {
        isConnected = false;
    }

    @Override
    /**
     * Triggered when a message is obtained from the paired device.
     */
    public void onMessageReceived (MessageEvent messageEvent) {
        final MessageEvent e = messageEvent;
    }

}
