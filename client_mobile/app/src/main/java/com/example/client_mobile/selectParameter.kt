package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_select_action.imageButtonBack
import kotlinx.android.synthetic.main.activity_select_parameter.*
import kotlinx.android.synthetic.main.parameter_row.view.*
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.ResponseBody.Companion.create
import java.io.IOException


class selectParameter : AppCompatActivity() {

    companion object {
        var token: String? = ""
        lateinit var action: Action
        lateinit var reaction: Reaction
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_parameter)

        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")

        imageButtonBack.setOnClickListener {
            val intent = Intent(this, selectAction::class.java)
            startActivity(intent)
        }

        recyclerView_param.layoutManager = LinearLayoutManager(this)
        if (intent.getSerializableExtra("action") != null)
            action = intent.getSerializableExtra("action") as Action
        if (intent.getSerializableExtra("reaction") != null)
            reaction = intent.getSerializableExtra("reaction") as Reaction

        if (intent.getStringExtra("params") != null) {
            val paramsAsString = intent.getStringExtra("params")
            val listParam = Gson().fromJson(paramsAsString, Array<Param>::class.java)
            if (intent.getSerializableExtra("action") != null) {
                action = intent.getSerializableExtra("action") as Action
                recyclerView_param.adapter = ParameterAdapter(listParam, action.name)
            }
            if (intent.getSerializableExtra("reaction") != null) {
                buttonCreateReaction.text = "Create area"
                reaction = intent.getSerializableExtra("reaction") as Reaction
                recyclerView_param.adapter = ParameterAdapter(listParam, reaction.name)
            }
        }

        buttonCreateReaction.setOnClickListener {
            val list = ArrayList<String>()
            //gets all editText
            for (i in 0 until (recyclerView_param.adapter as ParameterAdapter).itemCount) {
                val holder: CustomViewHolderParam = recyclerView_param.findViewHolderForAdapterPosition(i) as CustomViewHolderParam
                list.add(holder.view.editTextParameter.text.toString())
            }
            if (intent.getSerializableExtra("action") != null) {
                for (i in 0 until list.size) {
                    action.params[i].value = list[i]
                }
                intent.putExtra("action", action)
            }
            if (intent.getSerializableExtra("reaction") != null) {
                Toast.makeText(getContext(), "send request", Toast.LENGTH_SHORT).show()
                for (i in 0 until list.size) {
                    reaction.params[i].value = list[i]
                }
                intent.putExtra("reaction", reaction)
                createArea()
                println(action.name)
                println(reaction.name)
            }
/*            val intent = Intent(this, selectReaction::class.java)
            intent.putExtra("token", token)
            startActivity(intent)*/
        }
    }

    fun formatRequest(): String {
        val actionAsString: String = Gson().toJson(action)
        val reactionAsString: String = Gson().toJson(reaction)
        val jsonBody = "{\"action\":".plus(actionAsString).plus(",\"reaction\":").plus(reactionAsString).plus("}")
        return jsonBody
    }

    fun createArea() {
        val myBody = formatRequest().trimIndent()
        val client = OkHttpClient()

        val sex = myBody.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val geh = "{\"action\" : { \"name\" : \"github_issue_event\"},\"reaction\" : { \"name\" : \"slack_send_message\"}}".toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())



/*        val formBody: RequestBody = FormBody.Builder()
            .add("action", Gson().toJson(action))
            .add("reaction", Gson().toJson(reaction))
            .build()*/

        val request: Request = Request.Builder()
            .url(Home.server_location.plus("/CreateArea"))
            .header("Authorization", "token ".plus(token.toString()))
            .header("Content-Type", "application/json")
            .post(geh)
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                println("RESP:")
                println(body)
                println(sex)
                println("END")
                if (body == "404") {
//                    loadingPanel.visibility = View.GONE
                    runOnUiThread {
                        Toast.makeText(getContext(), "Error 404: server not found", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    runOnUiThread {
                        val code = response.code
//                        loadingPanel.visibility = View.GONE
                        if (code >= 400) {
                            Toast.makeText(getContext(), response.message, Toast.LENGTH_SHORT).show()
                        } else {
/*                            val intent = Intent(getContext(), Home::class.java)
                            startActivity(intent)*/
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

    fun getContext(): Context? {
        return this
    }
}