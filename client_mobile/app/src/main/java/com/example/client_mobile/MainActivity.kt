package com.example.client_mobile

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.GsonBuilder
import okhttp3.*
import okhttp3.FormBody
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException


class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        //askForConnection()
    }


    fun askForConnection() {


        val client = OkHttpClient()
        val formBody: RequestBody = FormBody.Builder()
            .add("username", "test")
            .add("password", "pwd")
            .build()

        val request: Request = Request.Builder()
            .url("http://10.29.125.210:8080/createUser")
            .post(formBody)
            .build()

        val call: Call = client.newCall(request)

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




/*        val mediaType = "application/json; charset=utf-8".toMediaType()

        val jsonString = GsonBuilder().create().toJson(Account("jeanss", "homo"))
        val requestBody = jsonString.toRequestBody(mediaType)

        println("START")

        val url = "http://localhost:8080/createUser"
        val request = Request.Builder().url(url).post(requestBody).build()
        val client = OkHttpClient()


        println(jsonString)
        println(requestBody)
        println(request)
        println("END")


        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                println("response ouui oui oui")
                println(body)
                val gson = GsonBuilder().create()

                val homeFeed = gson.fromJson(body, Account::class.java)
                println(homeFeed)
            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
            }
        })*/
        println("punch her")
    }

    class Account(val username: String, val password: String)
}
