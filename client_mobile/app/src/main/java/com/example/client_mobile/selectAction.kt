package com.example.client_mobile

import android.content.Context
import android.content.Intent
import com.google.gson.GsonBuilder
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.epicture.MainAdapter
import kotlinx.android.synthetic.main.activity_select_action.*
import okhttp3.*
import java.io.IOException

class selectAction : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_action)

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
                        recyclerView_main.adapter = MainAdapter(actionsReactions)
                        println(body)
                        Toast.makeText(getContext(), body, Toast.LENGTH_SHORT).show()
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

class Param(val name: String, val description: String)

class Action(val name: String, val service: String, val title: String, val description: String, val params: List<Param>  )

class Reaction(val name: String, val service: String, val title: String, val description: String, val params: List<Param>  )


class ActionReaction(val actions: List<Action>, val reactions: List<Reaction>)
