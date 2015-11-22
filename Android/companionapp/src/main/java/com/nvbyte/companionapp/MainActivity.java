package com.nvbyte.companionapp;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;


public class MainActivity extends Activity {

    private TextView mMessage;

    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            final String m = intent.getExtras().getString("message");
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mMessage.setText(m);
                }
            });
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button b = (Button) findViewById(R.id.http);
        b.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                EditText latt = (EditText) findViewById(R.id.latitude);
                EditText lont = (EditText) findViewById(R.id.longitude);
                WearInterface.getInstance(MainActivity.this).sendMock(latt.getText().toString(),lont.getText().toString());

            }
        });

        findViewById(R.id.zone1).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String lat = "" + 18.213719;
                String lon = "" + -67.157224;
                WearInterface.getInstance(MainActivity.this).sendMock(lat,lon);
            }
        });

        findViewById(R.id.zone2).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String lat = "" + 18.214147;
                String lon = "" + -67.149607;
                WearInterface.getInstance(MainActivity.this).sendMock(lat,lon);
            }
        });

        findViewById(R.id.zone3).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String lat = "" + 18.205892;
                String lon = "" + -67.141989;
                WearInterface.getInstance(MainActivity.this).sendMock(lat,lon);
            }
        });

        findViewById(R.id.zone4).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String lat = "" + 18.206034;
                String lon = "" + -67.139972;
                WearInterface.getInstance(MainActivity.this).sendMock(lat,lon);
            }
        });

        findViewById(R.id.zone5).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String lat = "" + 18.211028;
                String lon = "" + -67.140144;
                WearInterface.getInstance(MainActivity.this).sendMock(lat,lon);
            }
        });

        findViewById(R.id.zone6).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String lat = "" + 18.213209;
                String lon = "" + -67.142504;
                WearInterface.getInstance(MainActivity.this).sendMock(lat,lon);
            }
        });

    }

    @Override
    protected void onResume() {
        super.onResume();
        IntentFilter filter = new IntentFilter();
        filter.addAction("com.nvbyte.kya.message");
        registerReceiver(receiver,filter);
    }

    @Override
    protected void onPause() {
        super.onPause();
        unregisterReceiver(receiver);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
