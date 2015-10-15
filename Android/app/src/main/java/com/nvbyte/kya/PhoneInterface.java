package com.nvbyte.kya;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.wearable.MessageApi;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Wearable;

public class PhoneInterface implements MessageApi.MessageListener, GoogleApiClient.ConnectionCallbacks {
    private GoogleApiClient mApiClient;
    private static PhoneInterface singleton;
    private Context mContext;
    private boolean isConnected = false;

    public static PhoneInterface getInstance(Context c) {
        if(singleton == null) {
            singleton = new PhoneInterface(c);
        }
        return singleton;
    }

    private PhoneInterface(Context c) {
        mContext = c;
        initGoogleApiClient();
    }

    public void initGoogleApiClient() {
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
