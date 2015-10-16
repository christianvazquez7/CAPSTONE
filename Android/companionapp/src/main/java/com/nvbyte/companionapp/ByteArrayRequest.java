package com.nvbyte.companionapp;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.Response;

import org.apache.http.HttpStatus;

public class ByteArrayRequest extends Request<byte[]> {
    private final Response.Listener<byte[]> mListener;
    private final byte[] mBody;
    public ByteArrayRequest(int method, String url, byte[] body, Response.Listener<byte[]> listener, Response.ErrorListener errorListener) {
        super(method, url, errorListener);
        mBody = body;
        mListener = listener;
    }
    @Override
    protected Response<byte[]> parseNetworkResponse(NetworkResponse response) {
        if(response == null){
            return null;
        }
        if(response.statusCode != HttpStatus.SC_OK){
            return null;
        }
        byte[] bytes = response.data;
        return Response.success(bytes, null);
    }
    @Override
    protected void deliverResponse(byte[] response) {
        if(mListener != null){
            mListener.onResponse(response);
        }
    }

    @Override
    public byte[] getBody() throws AuthFailureError {
        return mBody;
    }
}