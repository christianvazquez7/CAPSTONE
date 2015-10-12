package com.nvbyte.kya;


import com.android.volley.RequestQueue;
import com.android.volley.Response;

/**
 * Singleton that manages all HTTP requests to remote service using Volley API.
 */
public class RequestManager {
    private RequestQueue mRequestQueue;
    private static RequestManager mRequestManager;
    private static final String SURVEY_ROUTE = "";
    private static final String HEART_BEAT_ROUTE = "";
    private static final String CHECK_IN_ROUTE = "";
    private static final String CURRENT_ZONE_ROUTE = "";

    /**
     * Private constructor invoked by static factory to avoid multiple instantiations.
     */
    private RequestManager() {

    }

    /**
     * Method to access singleton. Performs lazy initialization of RequestManager and returns an
     * unique instance.
     *
     * @return Request Manager singleton, that manages all HTTP requests.
     */
    public static RequestManager getInstance() {
        return null;
    }

    /**
     * Sends a survey response rating to the remote service.
     *
     * @param rating   Rating selected by the user in response to a survey.
     * @param deviceId Unique identifier for wearer device.
     */
    public void sendSurveyResponse(long deviceId, int rating) {

    }

    /**
     * Sends heart beat readings from sensor to remote service for telemetry.
     *
     * @param bmp      Heart beat readings in beats per minute.
     * @param deviceId Unique identifier for wearer device.
     */
    public void sendHeartBeatReading(long deviceId, int bmp) {

    }

    /**
     * Sends a checkin from the wearer to the remote service.
     *
     * @param deviceId  Unique identifier for wearer device.
     * @param velocity  Velocity of the user obtained from the accelerometer.
     * @param lat       Current latitude of the wear device.
     * @param lon       Current longitude of the wear device.
     * @param onSuccess Success callback, called when request is serviced.
     * @param onFailure Error callback, called when a request does not fall through.
     */
    public void checkIn(long deviceId, int velocity, double lat, double lon, Response.Listener<Byte[]> onSuccess, Response.ErrorListener onFailure) {

    }

    /**
     * GET the current geozone in which the wear device is.
     *
     * @param lat       Current latitude of the wear device.
     * @param lon       Current longitude of the wear device.
     * @param onSuccess Success callback, called when request is serviced.
     * @param onFailure Error callback, called when a request does not fall through.
     */
    public void getCurrentZone(double lat, double lon, Response.Listener<Byte[]> onSuccess, Response.ErrorListener onFailure) {

    }

    /**
     * Cancel all pending HTTP requests.
     */
    public void cancelPendingRequests() {

    }


}