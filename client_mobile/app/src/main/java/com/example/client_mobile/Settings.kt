package com.example.client_mobile

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.activity_settings.*
import okhttp3.*
import java.io.IOException
import java.io.Serializable

class Settings : AppCompatActivity() {

    companion object {
        var token: String? = ""
        var server_location: String? = ""
    }

    fun getContext(): Context? {
        return this
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")
        if (intent.getStringExtra("server_location") != null)
            server_location = intent.getStringExtra("server_location")
        recyclerView_services.layoutManager = LinearLayoutManager(this)

        imageButtonBack.setOnClickListener {
            val intent = Intent(this, Home::class.java)
            startActivity(intent)
        }

        getServices()
    }

    fun getServices() {
        val client = OkHttpClient()
        val request: Request = Request.Builder()
            .url(server_location.plus("/auth/getServices"))
            .header("Authorization", "token ".plus(token.toString()))
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                if (body == "404") {
                    runOnUiThread {
                        Toast.makeText(getContext(), "Error 404: server not found", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    //val allServices = GsonBuilder().create().fromJson(body, Services::class.java)
                    println("SERVICES")
                    println(body)
                    runOnUiThread {
                        //loadingPanel.visibility = View.GONE
                        //recyclerView_services.adapter = ServiceAdapter(allServices, getContext(), token)
                    }
                }
            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
            }
        })
    }
}


class Services(val services: List<Service>) : Serializable
