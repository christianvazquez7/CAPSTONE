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

/**
 * An interface to communicate from the wearable to the paired phone. This sends messages to the
 * phone which are intercepted by a message service running on the phone.
 */
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
    private static final String SEND_RETRY = "/SEND_RETRY";

    /**
     * Obtain the phone interface instance to send a message to the paired phone.
     * @param c The application context.
     * @return A handle to communicate in an rpc-like manner with the paired phone.
     */
    public static PhoneInterface getInstance(Context c) {
        if(singleton == null) {
            singleton = new PhoneInterface(c);
        }
        return singleton;
    }

    /**
     * Prompt the phone to send an HTTP POST with the device's current location.
     * @param message GeoPoint proto buffer.
     */
    public void sendMessageMovement(byte[] message){
        sendMessage(SEND_MOVEMENT,message,null);
    }

    /**
     * Prompt the phone to send an HTTP POST with the user's heartbeat.
     * @param message Telemetry proto buffer.
     */
    public void sendMessageHeartBeat(byte[] message){
        sendMessage(SEND_HEARTBEAT,message,null);
    }

    /**
     * Prompt the phone to send an HTTP POST with the user's survey response.
     * @param message Telemetry proto buffer.
     */
    public void sendMessageSurvey(byte[] message){
        sendMessage(SEND_SURVEY,message,null);
    }

    /**
     * Prompt the phone to check in with the runtime server.
     * @param message CheckIn proto buffer.
     * @param onError Operation to run if there was an error in the message request.
     */
    public void sendMessageCheckIn(byte[] message, Runnable onError){
        sendMessage(SEND_CHECK_IN,message,onError);
    }

    /**
     * Prompt the phone to check in with the runtime server.
     * @param message CheckIn proto buffer.
     * @param onError Operation to run if there was an error in the message request.
     */
    public void sendMessageRetry(byte[] message, Runnable onError){
        sendMessage(SEND_RETRY,message,onError);
    }

    /**
     * Prompt the phone to get the user's current zone.
     * @param message GeoPoint proto buffer.
     */
    public void sendMessageGetZone(byte[] message){
        Log.d("TAG","Sending message to phone");
        sendMessage(SEND_GET_ZONE,message,null);
    }

    /**
     * Send a message to the paired phone using the NodeApi.
     * @param a The message path to identify the type of message that is being sent.
     * @param b The serialized message contents (proto buffer) to be sent.
     * @param onError Operation to run if there was an error in the message request (Can be null).
     */
    private void sendMessage(final String a,final byte[] b, final Runnable onError){
        new Thread( new Runnable() {
            @Override
            public void run() {
                NodeApi.GetConnectedNodesResult nodes = Wearable.NodeApi.getConnectedNodes( mApiClient ).await();
                if (nodes.getNodes() == null || nodes.getNodes().isEmpty()){
                    if(onError != null)
                        onError.run();
                }
                for(Node node : nodes.getNodes()) {
                    MessageApi.SendMessageResult result = Wearable.MessageApi.sendMessage(
                            mApiClient, node.getId(), a,b).await();
                    if(!result.getStatus().isSuccess()) {
                        if(onError != null)
                            onError.run();
                    }
                }
            }
        }).start();
    }

    /**
     * Private constructor to enforce singleton property.
     * @param c The application's context.
     */
    private PhoneInterface(Context c) {
        mContext = c;
        initGoogleApiClient();
    }

    /**
     * Initialize the Google Api Client. This must be done in a background thread.
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
