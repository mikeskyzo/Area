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
            .url("http://10.29.125.210:8080/createUser")
            .post(formBody)
            .build()

        //val call: Call = client.newCall(request)

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
