package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.client_mobile.Home.Companion.server_location
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.activity_details_area.*
import okhttp3.*
import java.io.IOException
import java.io.Serializable

class DetailsArea : AppCompatActivity() {
    lateinit var option : Spinner

    companion object {
        var token: String? = ""
        var area_id: String? = ""
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_details_area)

        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")
        if (intent.getStringExtra("area_id") != null)
            area_id = intent.getStringExtra("area_id")
        imageButtonBack.setOnClickListener {
            this.onBackPressed()
        }
        getArea()
    }

    fun getArea() {
        println("AREA ID:")
        println(area_id)
        val client = OkHttpClient()
        val request: Request = Request.Builder()
            .url(server_location.plus("/GetArea/").plus(area_id))
            .header("Authorization", "token ".plus(token.toString()))
            .build()
        //loadingPanel.visibility = View.VISIBLE
        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                if (body == "404") {
                    runOnUiThread {
                        Toast.makeText(getContext(), "Error 404: server not found", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    println("BODYYY:")
                    println(body)
//                    val action = GsonBuilder().create().fromJson(body, Action::class.java)
//                    val actionAsString: String = Gson().toJson(action)
                    //println(actionAsString)
                    runOnUiThread {
                        //loadingPanel.visibility = View.GONE
                        //recyclerView_areas.adapter = AreaAdapter(allAreas, getContext(), token)
                    }
                }
            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
            }
        })
    }

    fun getContext(): Context? {
        return this
    }
}

class DetailedArea(val area_id: String, val area_name: String, val color: String)