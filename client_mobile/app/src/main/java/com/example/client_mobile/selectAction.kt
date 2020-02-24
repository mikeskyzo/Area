package com.example.client_mobile

import android.content.Context
import android.content.Intent
import com.google.gson.GsonBuilder
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.epicture.MainAdapter
import kotlinx.android.synthetic.main.action_row.*
import kotlinx.android.synthetic.main.activity_select_action.*
import okhttp3.*
import java.io.IOException
import java.io.Serializable

class selectAction : AppCompatActivity() {

    companion object {
        var token: String? = ""
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_action)

        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")

        imageButtonBack.setOnClickListener {
            val intent = Intent(this, Home::class.java)
            startActivity(intent)
        }

        recyclerView_main.layoutManager = LinearLayoutManager(this)
        getActionsReactions()
    }

    fun getContext(): Context? {
        return this
    }

    fun getActionsReactions() {
        val client = OkHttpClient()
        val request: Request = Request.Builder()
            .url(Home.server_location.plus("/getActionsReactions"))
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
                    val actionsReactions = GsonBuilder().create().fromJson(body, ActionReaction::class.java)
                    runOnUiThread {
                        loadingPanel.visibility = View.GONE
                        recyclerView_main.adapter = MainAdapter(actionsReactions, getContext(), token)
                        println(body)
                        //Toast.makeText(getContext(), body, Toast.LENGTH_SHORT).show()
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

class Param(val name: String, val description: String, var value: String) : Serializable

class Action(val name: String, val service: String, val title: String, val description: String, val params: List<Param>) : Serializable

class Reaction(val name: String, val service: String, val title: String, val description: String, val params: List<Param> ) : Serializable


class ActionReaction(val actions: List<Action>, val reactions: List<Reaction>) : Serializable
