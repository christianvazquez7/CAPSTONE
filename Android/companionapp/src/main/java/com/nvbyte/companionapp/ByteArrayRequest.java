package com.nvbyte.companionapp;

import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.Response;

import org.apache.http.HttpStatus;

/**
 * HTTP Request for sending raw byte data in the request body. This class extends the default
 * requests in Volley to use protobuffers instead of json.
 */
public class ByteArrayRequest extends Request<byte[]> {
    private final Response.Listener<byte[]> mListener;
    private final byte[] mBody;
    public ByteArrayRequest(int method, String url, byte[] body, Response.Listener<byte[]> listener, Response.ErrorListener errorListener) {
        super(method, url, errorListener);
        mBody = body;
        mListener = listener;
    }

    @Override
    /**
     * Parses response from server and forwards it to the success listener. In this case
     * the server response is a serialized raw buffer so no parsing should happen. Simply return
     * the response.data.
     */
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
    /**
     * Delivers response to caller.
     */
    protected void deliverResponse(byte[] response) {
        if(mListener != null){
            mListener.onResponse(response);
        }
    }

    @Override
    /**
     * Get the body to send in request (in case of POST). In our case, the body is simply
     * a serialized raw byte buffer.
     */
    public byte[] getBody() throws AuthFailureError {
        return mBody;
    }

    @Override
    /**
     * Determines the body content type. Since our application is sending raw byte data, the correct
     * type is 'octet-stream'.
     */
    public String getBodyContentType() {
        return "application/octet-stream";
    }
}