package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Base64
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.recyclerview.widget.LinearLayoutManager
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.result.Result
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
    lateinit var menu_services: Menu
    lateinit var menu_account_settings: Menu
    //lateinit var list_services : ArrayList<String>

    companion object {
        var server_location: String? = ""
        var token: String? = ""
        var list_services = ArrayList<String>()
    }

    fun getContext(): Context? {
        return this
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        list_services.clear()
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
        getServices()
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
        } else if (service[0] == "trello") {
            addTokenTrello(uri)
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
        client.newCall(request).enqueue(object : Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                if (body == "404") {
                    runOnUiThread {
                        Toast.makeText(
                            getContext(),
                            "Error 404: server not found",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                } else {
                    val tab = body.toString().split(" ")
                    println(tab[0])
                    if (tab[0] != "Tunnel") {
                        val allAreas = GsonBuilder().create().fromJson(body, Areas::class.java)
                        runOnUiThread {
                            loadingPanel.visibility = View.GONE
                            recyclerView_areas.adapter = AreaAdapter(allAreas, getContext(), token)
                        }
                    } else {
                        runOnUiThread {
                            Toast.makeText(getContext(), body, Toast.LENGTH_SHORT).show()
                        }
                        val intent = Intent(getContext(), Start::class.java)
                        startActivity(intent)
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
        val url =
            "https://github.com/login/oauth/access_token?client_id=b3925ca43ee751191104&client_secret=1d1d691af539a19b5dac1270273fa433f3b8ac04&code=".plus(
                code
            )

        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .build()

        val request: Request = Request.Builder()
            .url(url)
            .post(formBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
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
        val encodedAuthString: String =
            Base64.encodeToString(authString.toByteArray(), Base64.NO_WRAP)

        val url =
            "https://www.reddit.com/api/v1/access_token?grant_type=authorization_code&code=".plus(
                code
            ).plus("&redirect_uri=").plus("reddit://truc.truc")

        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .build()

        val request: Request = Request.Builder()
            .url(url)
            .header("User-Agent", "Sample App")
            .header("Authorization", "Basic ".plus(encodedAuthString))
            .post(formBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                val access_token =
                    GsonBuilder().create().fromJson(body, AccessToken::class.java).access_token
                addToken("Reddit", access_token)
            }

            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
            }
        })
    }

    fun addTokenTrello(uri: Uri?) {
        println(uri)
    }

    fun addTokenSlack(uri: Uri?) {
        val tab = uri.toString().split("code=", "&state=")
        val code = tab[1]
        val url =
            "https://slack.com/api/oauth.v2.access?client_id=933637704274.945976210260&client_secret=1d1d691af539a19b5dac1270273fa433f3b8ac04&redirect_uri=slack://truc.truc&client_secret=248197e37352e5aa521b969a3cbb8a91&code=".plus(
                code
            )
        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .build()

        val request: Request = Request.Builder()
            .url(url)
            .post(formBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
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
        //getservices()
        list_services.add("Github")
        list_services.add("Discord")
        list_services.add("Twitch")
        list_services.add("Reddit")
        list_services.add("Slack")
        list_services.add("Trello")

        menu_services = navView.menu.addSubMenu("Services")
        for (i in 0 until list_services.size) {
            val service_name =
                resources.getIdentifier(list_services[i], "string", getContext()?.packageName)
            val service_icon = resources.getIdentifier(
                list_services[i].decapitalize(),
                "drawable",
                getContext()?.packageName
            )
            menu_services.add(0, service_name, Menu.NONE, list_services[i]).setIcon(service_icon)
        }
        navView.invalidate()

        /*
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
                        val services = GsonBuilder().create().fromJson(body, Array<Service>::class.java)
                        createItemsServices(services)
                        Toast.makeText(getContext(), body, Toast.LENGTH_SHORT).show()
                    }
                }
            }
            override fun onFailure(call: Call, e: IOException) {
                println("Failed to execute request")
                println(e)
            }
        })*/
    }

    fun createItemsServices(services: Array<Service>) {
        for (i in 0 until services.size) {
        }
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

        client.newCall(request).enqueue(object : Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                if (body == "404") {
                    runOnUiThread {
                        Toast.makeText(
                            getContext(),
                            "Error 404: server not found",
                            Toast.LENGTH_SHORT
                        ).show()
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

    fun connectToService(service: String) {
        val client = OkHttpClient()

        val formBody: RequestBody = FormBody.Builder()
            .add("service", service)
            .build()

        val request: Request = Request.Builder()
            .url(server_location.plus("/auth/addToken"))
            .post(formBody)
            .header("Authorization", "token ".plus(token.toString()))
            .build()

        client.newCall(request).enqueue(object : Callback {
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

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        for (i in 0 until list_services.size) {
            if (item.itemId == resources.getIdentifier(list_services[i], "string", getContext()?.packageName)) {
                println(list_services[i])
                //Request AddToken/{list_services[i]}
                //connectToService(list_services[i])
                Toast.makeText(getContext(), list_services[i], Toast.LENGTH_SHORT).show()
                break
            }
        }
        when (item.itemId) {
            R.id.nav_profile -> {
                val intent = Intent(this, Settings::class.java)
                intent.putExtra("token", token)
                intent.putExtra("server_location", server_location)
                startActivity(intent)
            }
            R.id.nav_create_area -> {
                val intent = Intent(this, selectAction::class.java)
                intent.putExtra("token", token)
                startActivity(intent)
            }
            R.id.nav_help -> {
                val intent = Intent(this, Help::class.java)
                startActivity(intent)
            }
            R.id.nav_logout -> {
                val intent = Intent(this, Start::class.java)
                intent.putExtra("server_location", server_location)
                startActivity(intent)
                Toast.makeText(this, "Logging out", Toast.LENGTH_SHORT).show()
            }
        }
        drawerLayout.closeDrawer(GravityCompat.START)
        return true
    }

    fun redirectHome(message: String) {
        runOnUiThread {
            Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show()
        }
        val intent = Intent(getContext(), Start::class.java)
        startActivity(intent)
    }
}

class Area(
    val area_id: String,
    val action: String,
    val reaction: String,
    val area_name: String,
    val color: String
) : Serializable

class Areas(val areas: List<Area>) : Serializable

class AccessToken(val access_token: String)

class Service(val name: String, val active: Boolean)