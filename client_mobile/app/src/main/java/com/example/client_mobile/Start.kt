package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.media.MediaPlayer
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.activity_start.*
import kotlinx.android.synthetic.main.activity_start.loadingPanel
import okhttp3.*
import java.io.IOException


/**
 * Start class it's cool
 */
class Start : AppCompatActivity() {
    companion object {
        var server_location: String? = ""
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_start)
        loadingPanel.visibility = View.GONE
        if (intent.getStringExtra("server_location") != null) {
            server_location = intent.getStringExtra("server_location")
            editTextServerLocation.setText(server_location)
        }
        buttonLogin.setOnClickListener {
            MediaPlayer.create(this, R.raw.gnome).start()

            if (editTextUsername.length() == 0) {
                Toast.makeText(this, "Please enter a username", Toast.LENGTH_SHORT).show()
            } else if (editTextPassword.length() == 0) {
                Toast.makeText(this, "Please enter a password", Toast.LENGTH_SHORT).show()
            } else if (editTextServerLocation.length() == 0) {
                Toast.makeText(this, "Please enter a server location", Toast.LENGTH_SHORT).show()
            } else if (editTextServerLocation.getText().toString().take(8) != "https://") {
                Toast.makeText(this, "Invalid server location url", Toast.LENGTH_SHORT).show()
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
        return this
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

        loadingPanel.visibility = View.VISIBLE
        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                if (body == "404") {
                    loadingPanel.visibility = View.GONE
                    runOnUiThread {
                        Toast.makeText(getContext(), "Error 404: server not found", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    runOnUiThread {
                        val code = response.code
                        loadingPanel.visibility = View.GONE
                        if (code >= 400 ) {
                            val tab = body.toString().split(" ")
                            println(tab[0])
                            if (tab[0] != "Tunnel") {
                                val resp = GsonBuilder().create().fromJson(body, BodyResp::class.java)
                                Toast.makeText(getContext(), resp.message, Toast.LENGTH_SHORT).show()
                            } else
                                Toast.makeText(getContext(), body, Toast.LENGTH_SHORT).show()
                        } else {
                            val account = GsonBuilder().create().fromJson(body, Account::class.java)
                            val intent = Intent(getContext(), Home::class.java)
                            intent.putExtra("username", username)
                            intent.putExtra("token", account.token)
                            intent.putExtra("server_location", serverLocation)
                            startActivity(intent)
                        }
                    }
                }
            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
                if (e.toString() == "java.net.SocketTimeoutException: timeout" || e.toString() == "java.net.SocketTimeoutException: SSL handshake timed out") {
                    runOnUiThread {
                        loadingPanel.visibility = View.GONE
                        Toast.makeText(getContext(), "Timeout, server didn't respond", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

}

class BodyResp(val success: Boolean, val message: String)
class Account(val success: Boolean, val message: String, val token: String)
