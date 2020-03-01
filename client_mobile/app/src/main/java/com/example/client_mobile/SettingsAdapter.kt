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


class SettingsAdapter(val services: Array<Service?>, val context: Context?, val token: String?): RecyclerView.Adapter<CustomViewHolderSettings>() {
    override fun getItemCount(): Int {
        var nb = services.count()
        return nb
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

    fun deleteService(service: String) {
        val client = OkHttpClient()


        val formBody: RequestBody = FormBody.Builder()
            .add("service", service)
            .build()

        val request: Request = Request.Builder()
            .url(Home.server_location.plus("/auth/delete/").plus(service))
            .header("Authorization", "token ".plus(token.toString()))
            .delete()
            .build()

        client.newCall(request).enqueue(object: Callback {
            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                println("DELETE")
                println(body)
                println("SEX")
                println(Home.server_location.plus("/auth/delete/").plus(service))
                if (body == "404") {
                    (context as Activity).runOnUiThread {
                        Toast.makeText(context, "Error 404: server not found", Toast.LENGTH_SHORT)
                            .show()
                    }
                } else {
                    (context as Activity).runOnUiThread {
                        val intent = Intent(context, Settings::class.java)
                        intent.putExtra("token", token)
                        intent.putExtra("server_location", Home.server_location)
                        context.startActivity(intent)
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

class CustomViewHolderSettings(val view: View): RecyclerView.ViewHolder(view) {
}