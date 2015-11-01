package com.nvbyte.kya;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Receiver in charge of starting KYA Notification service when device boots.
 */
public class BootLoader extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals("android.intent.action.BOOT_COMPLETED")) {
            Intent startServiceIntent = new Intent(context, KYANotificationService.class);
            context.startService(startServiceIntent);
        } else if (intent.getAction().equals("com.nvbyte.kya.CHECK_IN")) {
            Intent startServiceIntent = new Intent(context, KYANotificationService.class);
            context.startService(startServiceIntent);
        }
    }
}
