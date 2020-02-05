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
        askForConnection()

        buttonLogin.setOnClickListener {
            val intent = Intent(this, Home::class.java)
            startActivity(intent)
        }

        buttonCreateAccount.setOnClickListener {
            val intent = Intent(this, createAccount::class.java)
            startActivity(intent)
        }
    }

    fun askForConnection() {


        val client = OkHttpClient()
        val formBody: RequestBody = FormBody.Builder()
            .add("username", "test")
            .add("password", "pwd")
            .build()

        val request: Request = Request.Builder()
            .url("http://10.29.124.224:8080/createUser")
            .post(formBody)
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                println("response ouui oui oui")
                println(body)

            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
            }
        })
    }

    class Account(val username: String, val password: String)
}
