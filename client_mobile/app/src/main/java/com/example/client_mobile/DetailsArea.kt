package com.example.client_mobile

import android.content.Context
import android.content.Intent
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
import okhttp3.*
import java.io.IOException

/**
 * Class used to display the details of an area and to delete it
 */
class DetailsArea : AppCompatActivity() {
    companion object {
        /**
         * User token
         */
        var token: String? = ""
        /**
         * Area id
         */
        var area_id: String? = ""
    }

    /**
     * Creates activity DetailsArea
     */
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

    /**
     * Send a request DELETE /DeleteArea to delete an area by its id
     */
    fun deleteArea(token: String?, areaId: String?) {
        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .add("area_id", areaId.toString())
            .build()

        val request: Request = Request.Builder()
            .url(server_location.plus("/DeleteArea"))
            .header("Authorization", "token ".plus(token.toString()))
            .delete(formBody)
            .build()

        loadingPanel.visibility = View.VISIBLE
        Toast.makeText(getContext(), "Deleting area...", Toast.LENGTH_SHORT).show()
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
                        if (code >= 400) {
                            Toast.makeText(getContext(), body, Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(getContext(), "Area deleted", Toast.LENGTH_SHORT).show()
                            val intent = Intent(getContext(), Home::class.java)
                            intent.putExtra("token", token)
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

    /**
     * Send a GET request on /GetArea to retrieve an area by its id
     */
    fun getArea() {
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
                    val tab = body.toString().split(" ")
                    if (tab[0] != "Tunnel") {
                        val detailedArea = GsonBuilder().create().fromJson(body, DetailedArea::class.java)
                        setDetails(detailedArea)
                    } else {
                        runOnUiThread {
                            Toast.makeText(getContext(), body, Toast.LENGTH_SHORT).show()
                        }
                        val intent = Intent(getContext(), Start::class.java)
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

    /**
     * Sets the area information on the layout
     * @param detailedArea: area to be displayed
     */
    fun setDetails(detailedArea: DetailedArea) {
        val paramsActionAsString: String = Gson().toJson(detailedArea.action.params)
        val paramsReactionAsString: String = Gson().toJson(detailedArea.reaction.params)

        val listParamsAction = Gson().fromJson(paramsActionAsString, Array<Param>::class.java)
        val listParamsReaction = Gson().fromJson(paramsReactionAsString, Array<Param>::class.java)
        textView_area_name.setText(detailedArea.area_name)
        textView_service_action.setText("Action : ".plus(detailedArea.action.service))
        textView_action_name.setText(detailedArea.action.title)
        runOnUiThread{
            recyclerView_params_action.adapter = DetailsActionReactionAdapter(listParamsAction)
        }
        textView_service_reaction.setText("Reaction : ".plus(detailedArea.reaction.service))
        textView_reaction_name.setText(detailedArea.reaction.title)
        runOnUiThread{
            recyclerView_params_reaction.adapter = DetailsActionReactionAdapter(listParamsReaction)
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

    /**
     * Gets the current context
     */
    fun getContext(): Context? {
        return this
    }
}

/**
 * Used to create a JSON object when requesting an area by its id
 * @param area_id: area id
 * @param area_name: area name
 * @param color: color
 * @param action: action
 * @param reaction: reaction
 */
class DetailedArea(val area_id: String, val area_name: String, val color: String, val action: Action, val reaction: Reaction)