package com.example.client_mobile

import android.content.Context
import android.content.Intent
import com.google.gson.GsonBuilder
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.activity_select_action.*
import okhttp3.*
import java.io.IOException
import java.io.Serializable

/**
 * Class that is used to displays the available actions and select one
 */
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

        recyclerView_action.layoutManager = LinearLayoutManager(this)
        getActions()
    }

    fun getContext(): Context? {
        return this
    }

    /**
     * Sends a GET request on /getActions to get all the availables actions
     */
    fun getActions() {
        val client = OkHttpClient()
        val request: Request = Request.Builder()
            .url(Home.server_location.plus("/getActions"))
            .header("Authorization", "token ".plus(token.toString()))
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                val code = response.code
                runOnUiThread {
                    loadingPanel.visibility = View.GONE
                    when {
                        code == 404 -> {
                            Toast.makeText(getContext(), body, Toast.LENGTH_SHORT).show()
                            val intent = Intent(getContext(), Start::class.java)
                            intent.putExtra("server_location", Home.server_location)
                            startActivity(intent)
                        }
                        code >= 200 -> {
                            val allActions = GsonBuilder().create().fromJson(body, Array<Action>::class.java)
                            recyclerView_action.adapter = ActionAdapter(allActions, getContext(), token, resources)

                        }
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

/**
 * Used to create a json object of a parameter
 */
class Param(val name: String, val description: String, var value: String) : Serializable

/**
 * Used to create a json object of a Action
 */
class Action(val name: String, val service: String, val title: String, val description: String, val params: List<Param>) : Serializable

/**
 * Used to create a json object of a Reaction
 */
class Reaction(val name: String, val service: String, val title: String, val description: String, val params: List<Param> ) : Serializable
