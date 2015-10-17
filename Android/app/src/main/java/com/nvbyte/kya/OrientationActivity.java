package com.nvbyte.kya;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

/**
 * Contains the compass surface view that draws direction to previous safer zone after a
 * notification occurs.
 */
public class OrientationActivity extends Activity {
    private TextView mClassificationTextView;

    @Override
    /**
     * Sets up the views on for the compass and classification of current zone.
     */
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_orientation);
    }

    @Override
    /**
     * Stops all compass activity.
     */
    protected void onPause() {
        super.onPause();
    }

    @Override
    /**
     * Starts all compass activity
     */
    protected void onResume() {
        super.onResume();
    }
}
