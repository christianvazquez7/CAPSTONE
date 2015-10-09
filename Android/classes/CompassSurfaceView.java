package com.nvbyte.kya;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.location.Location;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

/**
 * Custom surface view that obtains location data and orientation data
 */
public class CompassSurfaceView extends SurfaceView implements SurfaceHolder.Callback{

    private int mLowerClassification;
    private Paint mCircleColor;
    private Paint mArrowColor;
    private Paint mBackgroundColor;
    private long mTargetLong;
    private long mTargetLat;
    private int mCurrentClassification;

    /**
     * Creates a new custom compass surface view with a specific background color and classification.
     * @param context Application's context.
     * @param backgroundColorResource Color resource id for background of notification.
     * @param classification Classification level for current zone.
     * @param prevClassification Classification level for previous zone.
     * @param lat Target latitude of previous safe zone.
     * @param lon Target longitude of previous safe zone.
     */
    public CompassSurfaceView(Context context, int backgroundColorResource, int classification, int prevClassification,long lat, long lon) {
        super(context);
    }

    /**
     * Calculate angle from current location to desired safe location.
     * @param from Current user's location.
     * @param to Location of previous safe zone.
     * @param orientationX Orientation in x axis of device.
     * @return Angle between 0 and 360.
     */
    private double calculateAngle(Location from, Location to , double orientationX ) {
        return 0;
    }

    /**
     * Draw the compass circle on the surface view.
     * @param canvas Canvas on which to draw the circle.
     */
    private void drawCircle(Canvas canvas){

    }

    /**
     * Draw arrow pointing to previous classification zone.
     * @param classification Classification of previous zone.
     * @param angle Angle at which to draw the arrow.
     */
    private void drawArrow(int classification, double angle) {

    }

    /**
     * Clear the screen.
     * @param canvas Canvas to clear.
     */
    private void clear(Canvas canvas) {

    }

    /**
     * Stop painting data.
     */
    private void pause() {

    }

    /**
     * Start painting data.
     */
    private void play() {

    }

    @Override
    /**
     * Main draw method. Perform all drawing here.
     */
    protected void onDraw(Canvas canvas) {

    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {

    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {

    }
}
