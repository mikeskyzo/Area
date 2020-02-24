package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.activity_select_action.*
import okhttp3.*
import java.io.IOException

class selectReaction: AppCompatActivity() {

    companion object {
        var token: String? = ""
        lateinit var action: Action
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
/*        imageButtonBack.setOnClickListener {
            val intent = Intent(this, selectAction::class.java)
            startActivity(intent)
        }*/
        setContentView(R.layout.activity_select_action)
        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")
        if (intent.getSerializableExtra("action") != null)
            action = intent.getSerializableExtra("action") as Action
/*        println("select reaction")
        println(action.name)
        for (i in action.params.indices) {
            println(action.params[i].name)
            println(action.params[i].value)
        }*/
        recyclerView_action.layoutManager = LinearLayoutManager(this)
        getReactions()
    }

    fun getContext(): Context? {
        return this
    }

    fun getReactions() {
        val client = OkHttpClient()
        val request: Request = Request.Builder()
            .url(Home.server_location.plus("/getReactions"))
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
                    val allReactions = GsonBuilder().create().fromJson(body, Reactions::class.java)
                    runOnUiThread {
                        loadingPanel.visibility = View.GONE
                        recyclerView_action.adapter = ReactionAdapter(allReactions, getContext(), token)
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