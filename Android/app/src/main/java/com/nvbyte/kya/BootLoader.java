package com.nvbyte.kya;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootLoader extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals("android.intent.action.BOOT_COMPLETED")) {
            Intent startServiceIntent = new Intent(context, KYANotificationService.class);
            context.startService(startServiceIntent);
        }
    }
}
