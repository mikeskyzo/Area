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
        println("ONRESUME")
        val uri = intent.data
        val delimiter = "://"
        val service = uri.toString().split(delimiter)

        println(uri)

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

    fun getServices() {

        val client = OkHttpClient()
        val request: Request = Request.Builder()
            .url(server_location.plus("/getServices"))
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
                    println(body)
                    runOnUiThread {
                        val services = GsonBuilder().create().fromJson(body, Array<Service>::class.java)
/*                        for (i in 0 until services.size) {
                            println(services[0].service)
                        }*/
                        createItemsServices(services)
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

    fun createItemsServices(services: Array<Service>) {
        menu_services = navView.menu.addSubMenu("Services")
        for (i in 0 until services.size) {
            list_services.add(services[i].service)
            val service_name =
                resources.getIdentifier(
                    services[i].service,
                    "string",
                    getContext()?.packageName
                )
            val service_icon = resources.getIdentifier(
                services[i].service.decapitalize(),
                "drawable",
                getContext()?.packageName
            )
            menu_services.add(0, service_name, Menu.NONE, services[i].service)
                .setIcon(service_icon)
        }
        navView.invalidate()
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

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        for (i in 0 until list_services.size) {
            if (item.itemId == resources.getIdentifier(list_services[i], "string", getContext()?.packageName)) {
                println(list_services[i])
                val url = server_location.plus("/auth/connect/").plus(list_services[i]).plus("?token=").plus(token)
                val inte = Intent(Intent.ACTION_VIEW)
                inte.data = Uri.parse(url)
                startActivity(inte)
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

class Service(val service: String, val active: Boolean)