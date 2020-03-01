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


class ServiceAdapter(val allServices: Services, val context: Context?, val token: String?): RecyclerView.Adapter<CustomViewHolderService>() {
    override fun getItemCount(): Int {
        val nb = allServices.services.count()
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderService {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.area_row, parent, false)
        return CustomViewHolderService(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderService, position: Int) {

        val service = allServices.services.get(position)

        holder.view.textView_service.setText(service.service)

    }
}

class CustomViewHolderService(val view: View): RecyclerView.ViewHolder(view) {
}