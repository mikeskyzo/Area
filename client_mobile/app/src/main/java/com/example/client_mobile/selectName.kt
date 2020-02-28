package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_select_name.*
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.*
import java.io.IOException

class selectName : AppCompatActivity() {

    lateinit var option : Spinner

    companion object {
        var token: String? = ""
        var name: String? = ""
        var color: String? = ""
        lateinit var action: Action
        lateinit var reaction: Reaction
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_name)

        if (intent.getSerializableExtra("action") != null)
            action = intent.getSerializableExtra("action") as Action
        if (intent.getSerializableExtra("reaction") != null)
            reaction = intent.getSerializableExtra("reaction") as Reaction
        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")



        option = findViewById(R.id.spinner)

        val colors = arrayOf("orange", "red", "blue", "green", "yellow", "pink")

        option.adapter = ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, colors)

        option.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {
                Toast.makeText(getContext(), "nothing selected", Toast.LENGTH_SHORT).show()
            }

            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                Toast.makeText(getContext(), colors.get(position), Toast.LENGTH_SHORT).show()
            }

        }

        imageButtonBack.setOnClickListener {
            this.onBackPressed()
        }

        buttonCreateArea.setOnClickListener {
            color = spinner.selectedItem.toString()
            name = editTextName.text.toString()
            createArea()
        }
    }

    fun formatRequest(): String {
        val actionAsString: String = Gson().toJson(action)
        val reactionAsString: String = Gson().toJson(reaction)
        val nameAndColor = ",\"area_name\":\"".plus(name).plus("\",\"color\":\"").plus(color).plus("\"")
        val jsonBody = "{\"action\":".plus(actionAsString).plus(",\"reaction\":").plus(reactionAsString).plus(nameAndColor).plus("}")
        println("TO SEND:")
        println(jsonBody)
        return jsonBody
    }

    fun createArea() {
        val myBody = formatRequest().trimIndent()
        val client = OkHttpClient()

        val formBody = myBody.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val request: Request = Request.Builder()
            .url(Home.server_location.plus("/CreateArea"))
            .header("Authorization", "token ".plus(token.toString()))
            .header("Content-Type", "application/json")
            .post(formBody)
            .build()

        //loadingPanel.visibility = View.VISIBLE
        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                if (body == "404") {
                    //loadingPanel.visibility = View.GONE
                    runOnUiThread {
                        Toast.makeText(getContext(), "Error 404: server not found", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    runOnUiThread {
                        val code = response.code
                        println("code:")
                        println(code)
                        println(body)
                        println(token.toString())
                        //loadingPanel.visibility = View.GONE
                        if (code >= 400) {
                            Toast.makeText(getContext(), "Failed to created area : " + response.message, Toast.LENGTH_SHORT).show()
                            val intent = Intent(getContext(), selectAction::class.java)
                            intent.putExtra("token", token)
                            startActivity(intent)
                        } else {
                            Toast.makeText(getContext(), "Area successfully created", Toast.LENGTH_SHORT).show()
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
            }
        })
    }

    fun getContext(): Context? {
        return this
    }
}