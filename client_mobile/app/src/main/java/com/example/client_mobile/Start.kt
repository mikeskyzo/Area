package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.activity_start.*
import okhttp3.*
import java.io.IOException


class Start : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_start)
        buttonLogin.setOnClickListener {
            if (editTextUsername.length() == 0) {
                Toast.makeText(this, "Please enter a username", Toast.LENGTH_SHORT).show()
            } else if (editTextPassword.length() == 0) {
                Toast.makeText(this, "Please enter a password", Toast.LENGTH_SHORT).show()
            } else {
                askForLogin(editTextUsername.getText().toString(), editTextPassword.getText().toString())
            }
        }

        buttonCreateAccount.setOnClickListener {
            val intent = Intent(this, createAccount::class.java)
            intent.putExtra("server_location", editTextServerLocation.getText().toString())
            startActivity(intent)
        }
    }

    fun getContext(): Context? {
        return this as Context
    }

    fun askForLogin(username: String, password: String) {
        val serverLocation = editTextServerLocation.getText().toString()
        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .add("username", username)
            .add("password", password)
            .build()

        val request: Request = Request.Builder()
            .url(serverLocation.plus("/connectUser"))
            .post(formBody)
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                if (body == "404") {
                    runOnUiThread {
                        Toast.makeText(getContext(), "Error 404: server not found", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    runOnUiThread {
                        val code = response.code
                        val account = GsonBuilder().create().fromJson(body, Account::class.java)
                        if (code >= 400) {
                            Toast.makeText(getContext(), account.message, Toast.LENGTH_SHORT).show()
                        } else {
                            val intent = Intent(getContext(), Home::class.java)
                            intent.putExtra("username", username)
                            intent.putExtra("token", account.token)
                            intent.putExtra("server_location", serverLocation)
                            println("start")
                            println(account.token)
                            startActivity(intent)
                        }
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
