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

/**
 * Class used to select a name and a color of the area and create it
 */
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
        loadingPanel.visibility = View.GONE

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
            }

            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
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

    /**
     * Builds the json request to create an area
     */
    fun formatRequest(): String {
        val actionAsString: String = Gson().toJson(action)
        val reactionAsString: String = Gson().toJson(reaction)
        val nameAndColor = ",\"area_name\":\"".plus(name).plus("\",\"color\":\"").plus(color).plus("\"")
        val jsonBody = "{\"action\":".plus(actionAsString).plus(",\"reaction\":").plus(reactionAsString).plus(nameAndColor).plus("}")
        return jsonBody
    }

    /**
     * Send a POST request to /CreateArea to create an area
     */
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

        loadingPanel.visibility = View.VISIBLE
        Toast.makeText(getContext(), "Creating area...", Toast.LENGTH_SHORT).show()
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
                        code >= 400 -> {
                            Toast.makeText(getContext(), "Failed to created area : " + response.message, Toast.LENGTH_SHORT).show()
                            val intent = Intent(getContext(), selectAction::class.java)
                            intent.putExtra("token", token)
                            startActivity(intent)
                        }
                        code >= 200 -> {
                            Toast.makeText(getContext(), "Area successfully created", Toast.LENGTH_SHORT).show()
                            val intent = Intent(getContext(), Home::class.java)
                            intent.putExtra("token", token)
                            startActivity(intent)
                        }
                    }
                }


                /*if (body == "404") {
                    loadingPanel.visibility = View.GONE
                    runOnUiThread {
                        Toast.makeText(getContext(), "Error 404: server not found", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    runOnUiThread {
                        val code = response.code
                        loadingPanel.visibility = View.GONE
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
                }*/
            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
            }
        })
    }

    /**
     * Gets the current context
     */
    fun getContext(): Context? {
        return this
    }
}

