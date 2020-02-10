package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.activity_create_account.*
import okhttp3.*
import java.io.IOException


class createAccount : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_account)

        val server_location = intent.getStringExtra("server_location")

        imageButtonBack.setOnClickListener {
            val intent = Intent(this, Start::class.java)
            startActivity(intent)
        }

        buttonCreateAccount.setOnClickListener {
            if (editTextUsername.length() == 0) {
                Toast.makeText(this, "Please enter a username", Toast.LENGTH_SHORT).show()
            } else if (editTextPassword.length() == 0) {
                Toast.makeText(this, "Please enter a password", Toast.LENGTH_SHORT).show()
            } else if (editTextPassword.getText().toString() != editTextConfirmPassword.getText().toString()) {
                Toast.makeText(this, "The password and the password confirmation must be the same", Toast.LENGTH_SHORT).show()
            } else {
                askForAccountCreation(editTextUsername.getText().toString(), editTextPassword.getText().toString(), server_location)
            }
        }
    }

    fun getContext(): Context? {
        return this as Context
    }

    fun askForAccountCreation(username: String, password: String, server_location: String) {
        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .add("username", username)
            .add("password", password)
            .build()

        val request: Request = Request.Builder()
            .url(server_location.plus("/createUser"))
            .post(formBody)
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                val code = response.code
                val account = GsonBuilder().create().fromJson(body, Account::class.java)

                runOnUiThread {
                    if (code >= 400) {
                        Toast.makeText(getContext(), account.message, Toast.LENGTH_SHORT).show()
                    } else {
                        val intent = Intent(getContext(), Home::class.java)
                        intent.putExtra("server_location", server_location)
                        intent.putExtra("username", username)
                        intent.putExtra("token", account.token)
                        startActivity(intent)
                    }
                }
            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
            }
        })
    }

    class Account(val success: Boolean, val message: String, val token: String)
}
