package com.example.client_mobile

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.google.gson.GsonBuilder
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        askForConnection()
    }

    fun askForConnection() {

        val mediaType = "application/json; charset=utf-8".toMediaType()

        val magie = GsonBuilder().create()
        val jsonString = magie.toJson(Account("jean", "homo"))

        val myJSONObject = "{username: \"jean\", password: \"homo\"}"
        val requestBody = jsonString.toRequestBody(mediaType)


        val url = "http://server:8080/createUser"
        val request = Request.Builder().url(url).post(requestBody).build()
        val client = OkHttpClient()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                println(body)
                val gson = GsonBuilder().create()

                val homeFeed = gson.fromJson(body, Account::class.java)
                println(homeFeed)
            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
            }
        })
        println("slap her")
    }

    class Account(val username: String, val password: String)
}
