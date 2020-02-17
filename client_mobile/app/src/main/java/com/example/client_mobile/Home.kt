package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MenuItem
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import com.google.gson.GsonBuilder
import okhttp3.*
import java.io.IOException

class Home : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    lateinit var toolbar: Toolbar
    lateinit var drawerLayout: DrawerLayout
    lateinit var navView: NavigationView

    companion object {
        var server_location: String? = ""
        var token: String? = ""
    }

    fun getContext(): Context? {
        return this
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        if (intent.getStringExtra("server_location") != null)
            server_location = intent.getStringExtra("server_location")
        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")
        Toast.makeText(this, server_location, Toast.LENGTH_SHORT).show()

        toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)

        drawerLayout = findViewById(R.id.drawer_layout)
        navView = findViewById(R.id.nav_view)

        val toggle = ActionBarDrawerToggle(
            this, drawerLayout, toolbar, 0, 0
        )
        drawerLayout.addDrawerListener(toggle)
        toggle.syncState()
        navView.setNavigationItemSelectedListener(this)
    }

    override fun onResume() {
        val uri = intent.data
        val delimiter = "://"
        val service = uri.toString().split(delimiter)

        if (service[0] == "github") {
            addTokenGithub(uri)
        } else if (service[0] == "slack") {
            addTokenSlack(uri)
        }

        if (uri !== null) {
            Toast.makeText(this, uri.toString(), Toast.LENGTH_SHORT).show()
        }
        super.onResume()
    }

    fun addTokenGithub(uri: Uri?) {
        val regex = Regex("(?<=code=).*\$")
        val result: MatchResult? = regex.find(uri.toString())
        val code = result?.value!!
        val url = "https://github.com/login/oauth/access_token?client_id=b3925ca43ee751191104&client_secret=1d1d691af539a19b5dac1270273fa433f3b8ac04&code=".plus(code)

        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .build()

        val request: Request = Request.Builder()
            .url(url)
            .post(formBody)
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                val delimiter1 = "access_token="
                val delimiter2 = "&scope"

                val access_token = body.toString().split(delimiter1, delimiter2)[1]
                addToken("Github", access_token)

            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
            }
        })
    }

    fun addTokenSlack(uri : Uri?) {
        val tab = uri.toString().split("code=", "&state=")
        val code = tab[1]
        val url = "https://slack.com/api/oauth.v2.access?client_id=933637704274.945976210260&client_secret=1d1d691af539a19b5dac1270273fa433f3b8ac04&redirect_uri=slack://truc.truc&client_secret=248197e37352e5aa521b969a3cbb8a91&code=".plus(code)
        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .build()

        val request: Request = Request.Builder()
            .url(url)
            .post(formBody)
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                val delimiter1 = "access_token\":\""
                val delimiter2 = "\",\"token_type"

                val access_token = body.toString().split(delimiter1, delimiter2)[1]
                addToken("Slack", access_token)

            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
            }
        })
    }

    fun getServices() {
        val client = OkHttpClient()
        val request: Request = Request.Builder()
            .url(server_location.plus("/auth/getServices"))
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
                    runOnUiThread {
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

    fun addToken(service: String, access_token: String, refresh_token: String = "", expires_in: String = "") {
        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .add("service", service)
            .add("access_token", access_token)
            .add("refresh_token", refresh_token)
            .add("expires_in", expires_in)
            .build()

        val request: Request = Request.Builder()
            .url(server_location.plus("/auth/addToken"))
            .post(formBody)
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
                    runOnUiThread {
                        println("addToken")
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

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.nav_profile -> {
                getServices()
                Toast.makeText(this, "Profile clicked", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_messages -> {
                Toast.makeText(this, "Actions clicked", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_friends -> {
                Toast.makeText(this, "Reactions clicked", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_update -> {
                Toast.makeText(this, "Settings clicked", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_logout -> {
                val intent = Intent(this, Start::class.java)
                startActivity(intent)
                Toast.makeText(this, "Sign out clicked", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_github -> {
                val openURL = Intent(android.content.Intent.ACTION_VIEW)
                openURL.data = Uri.parse("https://github.com/login/oauth/authorize?client_id=b3925ca43ee751191104&scop=admin%20repo_hook")
                startActivity(openURL)
            }
            R.id.nav_slack -> {
                val openURL = Intent(android.content.Intent.ACTION_VIEW)
                openURL.data = Uri.parse("https://slack.com/oauth/v2/authorize?client_id=933637704274.945976210260&user_scope=chat:write%20channels:read%20groups:read%20mpim:read%20im:read&redirect_uri=slack://truc.truc")
                startActivity(openURL)
            }
        }
        drawerLayout.closeDrawer(GravityCompat.START)
        return true
    }
}
