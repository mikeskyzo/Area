package com.example.client_mobile

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class selectReaction: AppCompatActivity() {

    companion object {
        var token: String? = ""
        var actionName : String? = ""
        lateinit var action: Action
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")
        if (intent.getStringExtra("actionName") != null)
            actionName = intent.getStringExtra("actionName")
    }
}