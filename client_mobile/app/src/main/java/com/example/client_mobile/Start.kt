package com.example.client_mobile

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_start.*
import okhttp3.*
import okhttp3.FormBody
import java.io.IOException


class Start : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_start)

        buttonLogin.setOnClickListener {
            val intent = Intent(this, Home::class.java)
            startActivity(intent)
        }

        buttonCreateAccount.setOnClickListener {
            val intent = Intent(this, createAccount::class.java)
            startActivity(intent)
        }
    }

    class Account(val username: String, val password: String)
}
