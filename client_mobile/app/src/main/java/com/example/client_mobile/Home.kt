package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
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


/**
 * Class that will displays the currents areas, allow the user to subscribe to a service and create an area
 */
class Home : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    /**
     * Toolbar at the top of the screen
     */
    lateinit var toolbar: Toolbar
    /**
     * Drawer layout
     */
    lateinit var drawerLayout: DrawerLayout
    /**
     * Navigation view on the left
     */
    lateinit var navView: NavigationView
    /**
     * Menu containing a list of services that'll be created dynamically
     */
    lateinit var menu_services: Menu

    companion object {
        /**
         * Server address
         */
        var server_location: String? = ""
        /**
         * User token
         */
        var token: String? = ""
        /**
         * List of services
         */
        var list_services = ArrayList<String>()
    }

    /**
     * Returns the current context
     */
    fun getContext(): Context? {
        return this
    }

    /**
     * Creates Home activity
     */
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

    /**
     * Called when the server redirects the client to the application
     */
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

    /**
     * Send a request GET /getAreas/name to get all the areas of the current user
     */
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
                            recyclerView_areas.adapter = AreaAdapter(allAreas, getContext(), token, resources)
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

    /**
     * Send a request GET /getServices to retrieves all the services availables on the server
     */
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

    /**
     * Creates new items on the navigation bar according to the services retrieved from getServices()
     */
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

    /**
     * Called when the user click on an item from a menu of the navigation bar
     */
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
}

/**
 * User to create a JSON object of an area retrieved from a request
 * @param area_id: area id
 * @param action: action
 * @param reaction: reaction
 * @param area_name: area name
 * @param color: color
 */
class Area(
    val area_id: String,
    val action: String,
    val reaction: String,
    val area_name: String,
    val color: String
) : Serializable

/**
 * User to create a JSON object of a list of areas retrieved from a request
 */
class Areas(val areas: List<Area>) : Serializable

/**
 * User to create a JSON object of a service retrieved from a request
 */
class Service(val service: String, val active: Boolean)