package com.example.client_mobile

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.service_row.view.*


class SettingsAdapter(val services: Array<Service>): RecyclerView.Adapter<CustomViewHolderSettings>() {
    override fun getItemCount(): Int {
        var nb = 0
        for (i in services.indices) {
            println(services[i].active)
            if (services[i].active) {
                println(services[i].service)
                nb++
            }
        }
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderSettings{
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.service_row, parent, false)
        return CustomViewHolderSettings(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderSettings, position: Int) {
        val service = services.get(position)
        if (service.active)
            holder.view.textView_service.setText(service.service)
    }
}

class CustomViewHolderSettings(val view: View): RecyclerView.ViewHolder(view) {
}