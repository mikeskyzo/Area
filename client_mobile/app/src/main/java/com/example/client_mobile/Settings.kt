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

class Settings : AppCompatActivity() {

    companion object {
        var token: String? = ""
        var server_location: String? = ""
    }

    /**
     * Gets the current context
     */
    fun getContext(): Context? {
        return this
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        loadingPanel.visibility = View.VISIBLE
        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")
        if (intent.getStringExtra("server_location") != null)
            server_location = intent.getStringExtra("server_location")
        recyclerView_services.layoutManager = LinearLayoutManager(this)

        imageButtonBack.setOnClickListener {
            val intent = Intent(this, Home::class.java)
            startActivity(intent)
        }

        loadingPanel.visibility = View.VISIBLE
        getServices()
    }

    /**
     * Request the server to get the services to which the user subscribed with a GET on /getServices
     */
    fun getServices() {
        val client = OkHttpClient()
        val request: Request = Request.Builder()
            .url(server_location.plus("/getServices"))
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
                    runOnUiThread {
                        loadingPanel.visibility = View.GONE
                        val services = GsonBuilder().create().fromJson(body, Array<Service>::class.java)
                        val listServices = ArrayList<Service>()

                        for (i in 0 until services.size) {
                            if (services[i].active == true) {
                                listServices.add(services[i])
                            }
                        }
                        val arrayServices = arrayOfNulls<Service>(listServices.size)
                        listServices.toArray(arrayServices)
                        recyclerView_services.adapter = SettingsAdapter(arrayServices, getContext(), token)
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