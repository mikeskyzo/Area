package com.example.client_mobile

import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.client_mobile.Home.Companion.server_location
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.activity_details_area.*
import kotlinx.android.synthetic.main.activity_details_area.imageButtonBack
import kotlinx.android.synthetic.main.activity_details_area.loadingPanel
import kotlinx.android.synthetic.main.activity_select_parameter.*
import okhttp3.*
import java.io.IOException

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
        buttonDeleteArea.setOnClickListener {
            deleteArea(token, area_id)
        }
        recyclerView_params_action.layoutManager = LinearLayoutManager(this)
        recyclerView_params_reaction.layoutManager = LinearLayoutManager(this)
        getArea()
    }

    fun deleteArea(token: String?, areaId: String?) {
        Toast.makeText(this, "Deleting area", Toast.LENGTH_SHORT).show()
    }

    fun getArea() {
        println("AREA ID:")
        println(area_id)
        val client = OkHttpClient()
        val request: Request = Request.Builder()
            .url(server_location.plus("/GetArea/").plus(area_id))
            .header("Authorization", "token ".plus(token.toString()))
            .build()
        loadingPanel.visibility = View.VISIBLE
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
                    }
                    val detailedArea = GsonBuilder().create().fromJson(body, DetailedArea::class.java)
                    setDetails(detailedArea)
                }
            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
            }
        })
    }
    fun setDetails(detailedArea: DetailedArea) {
        val paramsActionAsString: String = Gson().toJson(detailedArea.action.params)
        val paramsReactionAsString: String = Gson().toJson(detailedArea.reaction.params)

        val listParamsAction = Gson().fromJson(paramsActionAsString, Array<Param>::class.java)
        val listParamsReaction = Gson().fromJson(paramsReactionAsString, Array<Param>::class.java)
        textView_area_name.setText(detailedArea.area_name)
        textView_service_action.setText(detailedArea.action.service)
        textView_action_name.setText(detailedArea.action.title)
        runOnUiThread{
            recyclerView_params_action.adapter = DetailsActionAdapter(listParamsAction)
        }
        textView_service_reaction.setText(detailedArea.reaction.service)
        textView_reaction_name.setText(detailedArea.reaction.title)
        runOnUiThread{
            recyclerView_params_reaction.adapter = DetailsActionAdapter(listParamsReaction)
        }

        if (detailedArea.color == "orange") {
            textView_area_name.setTextColor(Color.parseColor("#ff9800"))
        }
        if (detailedArea.color == "red") {
            textView_area_name.setTextColor(Color.parseColor("#e31c0e"))
        }
        if (detailedArea.color == "blue") {
            textView_area_name.setTextColor(Color.parseColor("#0e75e3"))
        }
        if (detailedArea.color == "green") {
            textView_area_name.setTextColor(Color.parseColor("#0ee320"))
        }
        if (detailedArea.color == "yellow") {
            textView_area_name.setTextColor(Color.parseColor("#e3dc0e"))
        }
        if (detailedArea.color == "pink") {
            textView_area_name.setTextColor(Color.parseColor("#f76dec"))
        }
    }

    fun getContext(): Context? {
        return this
    }
}

class DetailedArea(val area_id: String, val area_name: String, val color: String, val action: Action, val reaction: Reaction)