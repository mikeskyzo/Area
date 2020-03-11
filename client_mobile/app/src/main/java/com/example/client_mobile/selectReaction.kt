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

/**
 * Class used to select a reaction from the available ones
 */
class selectReaction: AppCompatActivity() {

    companion object {
        var token: String? = ""
        lateinit var action: Action
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_action)
        imageButtonBack.setOnClickListener {
            this.onBackPressed()
        }
        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")
        if (intent.getSerializableExtra("action") != null)
            action = intent.getSerializableExtra("action") as Action
        recyclerView_action.layoutManager = LinearLayoutManager(this)
        getReactions()
    }

    fun getContext(): Context? {
        return this
    }

    /**
     * Sends a GET request on /getReactions to get all the available reactions
     */
    fun getReactions() {
        val client = OkHttpClient()
        val request: Request = Request.Builder()
            .url(Home.server_location.plus("/getReactions"))
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
                            val allReactions = GsonBuilder().create().fromJson(body, Array<Reaction>::class.java)
                            loadingPanel.visibility = View.GONE
                            recyclerView_action.adapter = ReactionAdapter(allReactions, getContext(), token, resources)
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