package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.activity_create_account.*
import kotlinx.android.synthetic.main.activity_create_account.buttonCreateAccount
import kotlinx.android.synthetic.main.activity_create_account.editTextPassword
import kotlinx.android.synthetic.main.activity_create_account.editTextUsername
import kotlinx.android.synthetic.main.activity_create_account.loadingPanel
import okhttp3.*
import java.io.IOException


class CreateAccount : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_account)
        loadingPanel.visibility = View.GONE

        val server_location = intent.getStringExtra("server_location")

        imageButtonBack.setOnClickListener {
            val intent = Intent(this, Start::class.java)
            startActivity(intent)
        }

        buttonCreateAccount.setOnClickListener {
            when {
                editTextUsername.length() == 0 -> {
                    Toast.makeText(this, "Please enter a username", Toast.LENGTH_SHORT).show()
                }
                editTextPassword.length() == 0 -> {
                    Toast.makeText(this, "Please enter a password", Toast.LENGTH_SHORT).show()
                }
                editTextPassword.getText().toString() != editTextConfirmPassword.getText().toString() -> {
                    Toast.makeText(this, "The password and the password confirmation must be the same", Toast.LENGTH_SHORT).show()
                }
                else -> {
                    askForAccountCreation(editTextUsername.getText().toString(), editTextPassword.getText().toString(), server_location)
                }
            }
        }
    }

    /**
     * Returns the current context
     */
    fun getContext(): Context? {
        return this as Context
    }

    /**
     * Request the server to create a new user with a POST on /createUser
     * @param username: username of the user
     * @param password: password of the user
     * @param server_location: server address
     */
    fun askForAccountCreation(username: String, password: String, server_location: String?) {
        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .add("username", username)
            .add("password", password)
            .build()

        val request: Request = Request.Builder()
            .url(server_location.plus("/createUser"))
            .post(formBody)
            .build()

        loadingPanel.visibility = View.VISIBLE
        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                val code = response.code
                runOnUiThread {
                    loadingPanel.visibility = View.GONE
                    when {
                        code == 404 -> {
                            Toast.makeText(getContext(), body, Toast.LENGTH_SHORT).show()
                        }
                        code >= 400 -> {
                            val resp = GsonBuilder().create().fromJson(body, BodyResp::class.java)
                            Toast.makeText(getContext(), resp.message, Toast.LENGTH_SHORT).show()
                        }
                        code >= 200 -> {
                            val account = GsonBuilder().create().fromJson(body, Account::class.java)
                            val intent = Intent(getContext(), Home::class.java)
                            intent.putExtra("username", username)
                            intent.putExtra("token", account.token)
                            intent.putExtra("server_location", server_location)
                            startActivity(intent)
                            Toast.makeText(getContext(), "Account successfully created", Toast.LENGTH_SHORT).show()
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

    /**
     * Used to create an obj of the response from POST /createUser
     */
    class Account(val success: Boolean, val message: String, val token: String)
}
