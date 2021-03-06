package com.example.client_mobile

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.service_row.view.*
import okhttp3.*
import java.io.IOException

/**
 * Handles the list of services the user subscribed to
 */
class SettingsAdapter(val services: Array<Service?>, val context: Context?, val token: String?): RecyclerView.Adapter<CustomViewHolderSettings>() {
    override fun getItemCount(): Int {
        return services.count()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderSettings{
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.service_row, parent, false)
        return CustomViewHolderSettings(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderSettings, position: Int) {
        val service = services.get(position)
        holder.view.textView_service.setText(service?.service)

        holder.view.imageViewDelete.setOnClickListener {
            deleteService(service!!.service)
        }
    }

    /**
     * Sends a DELETE request on /auth/delete to unsubscribe from a service
     */
    fun deleteService(service: String) {
        val client = OkHttpClient()

        val request: Request = Request.Builder()
            .url(Home.server_location.plus("/auth/delete/").plus(service))
            .header("Authorization", "token ".plus(token.toString()))
            .delete()
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                val code = response.code
                (context as Activity).runOnUiThread {
                    when {
                        code == 404 -> {
                            Toast.makeText(context, body, Toast.LENGTH_SHORT).show()
                            val intent = Intent(context, Start::class.java)
                            intent.putExtra("server_location", Home.server_location)
                            context.startActivity(intent)
                        }
                        code >= 200 -> {
                            Toast.makeText(context, "Unsubscription successful", Toast.LENGTH_SHORT).show()
                            val intent = Intent(context, Settings::class.java)
                            intent.putExtra("token", token)
                            intent.putExtra("server_location", Home.server_location)
                            context.startActivity(intent)
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

/**
 * Holds Settings view
 * @param view: view
 */
class CustomViewHolderSettings(val view: View): RecyclerView.ViewHolder(view) {
}