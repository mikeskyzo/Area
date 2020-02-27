package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Base64
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.navigation.NavigationView
import com.google.gson.GsonBuilder
import kotlinx.android.synthetic.main.content_main.*
import okhttp3.*
import java.io.IOException
import java.io.Serializable


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

        loadingPanel.visibility = View.VISIBLE
        if (intent.getStringExtra("server_location") != null)
            server_location = intent.getStringExtra("server_location")
        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")

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
        recyclerView_areas.layoutManager = LinearLayoutManager(this)
        getAreas()
    }

    override fun onResume() {
        val uri = intent.data
        val delimiter = "://"
        val service = uri.toString().split(delimiter)

        if (service[0] == "github") {
            addTokenGithub(uri)
        } else if (service[0] == "slack") {
            addTokenSlack(uri)
        } else if (service[0] == "reddit") {
            addTokenReddit(uri)
        }

        if (uri !== null) {
            Toast.makeText(this, uri.toString(), Toast.LENGTH_SHORT).show()
        }
        super.onResume()
    }

    fun getAreas() {
        val client = OkHttpClient()
        val request: Request = Request.Builder()
            .url(server_location.plus("/getAreas/name"))
            .header("Authorization", "token ".plus(token.toString()))
            .build()
        loadingPanel.visibility = View.VISIBLE
        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                if (body == "404") {
                    runOnUiThread {
                        Toast.makeText(getContext(), "Error 404: server not found", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    val allAreas = GsonBuilder().create().fromJson(body, Areas::class.java)
                    runOnUiThread {
                        loadingPanel.visibility = View.GONE
                        recyclerView_areas.adapter = AreaAdapter(allAreas, getContext(), token)
                    }
                }
            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
            }
        })
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

    fun addTokenReddit(uri: Uri?) {
        val regex = Regex("(?<=code=).*\$")
        val result: MatchResult? = regex.find(uri.toString())
        val code = result?.value!!


        val authString: String = "YRYKkBFVxzy12Q:"
        val encodedAuthString: String = Base64.encodeToString(authString.toByteArray(), Base64.NO_WRAP)

        val url = "https://www.reddit.com/api/v1/access_token?grant_type=authorization_code&code=".plus(code).plus("&redirect_uri=").plus("reddit://truc.truc")

        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .build()

        val request: Request = Request.Builder()
            .url(url)
            .header("User-Agent", "Sample App")
            .header("Authorization", "Basic ".plus(encodedAuthString))
            .post(formBody)
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                val access_token = GsonBuilder().create().fromJson(body, AccessToken::class.java).access_token
                addToken("Reddit", access_token)
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
                } else if (body == "409") {
                    runOnUiThread {
                        Toast.makeText(getContext(), body, Toast.LENGTH_SHORT).show()
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
                val intent = Intent(this, Settings::class.java)
                intent.putExtra("token", token)
                intent.putExtra("server_location", server_location)
                startActivity(intent)
//                getServices()
//                Toast.makeText(this, "Profile clicked", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_create_area -> {
                val intent = Intent(this, selectAction::class.java)
                intent.putExtra("token", token)
                startActivity(intent)
            }
            R.id.nav_logout -> {
                val intent = Intent(this, Start::class.java)
                intent.putExtra("server_location", server_location)
                startActivity(intent)
                Toast.makeText(this, "Sign out clicked", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_github -> {
                val openURL = Intent(android.content.Intent.ACTION_VIEW)
                openURL.data = Uri.parse("https://github.com/login/oauth/authorize?client_id=b3925ca43ee751191104&scope=admin:repo_hook")
                startActivity(openURL)
            }
            R.id.nav_slack -> {
                val openURL = Intent(android.content.Intent.ACTION_VIEW)
                openURL.data = Uri.parse("https://slack.com/oauth/v2/authorize?client_id=933637704274.945976210260&user_scope=chat:write%20channels:read%20groups:read%20mpim:read%20im:read&redirect_uri=slack://truc.truc")
                startActivity(openURL)
            }
            R.id.nav_reddit -> {
                val openURL = Intent(android.content.Intent.ACTION_VIEW)
                openURL.data = Uri.parse("https://www.reddit.com/api/v1/authorize?client_id=YRYKkBFVxzy12Q&redirect_uri=reddit://truc.truc&scope=edit identity flair history modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread&response_type=code&duration=permanent&state=NONE")
                startActivity(openURL)
            }
        }
        drawerLayout.closeDrawer(GravityCompat.START)
        return true
    }
}

class Area(val area_id: String, val action: String, val reaction: String, val area_name: String, val color: String) : Serializable

class Areas(val areas: List<Area>) : Serializable

class AccessToken(val access_token: String)