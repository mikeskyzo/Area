package com.example.epicture

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.client_mobile.R

class MainAdapter: RecyclerView.Adapter<CustomViewHolder>() {

    override fun getItemCount(): Int {
        return 3
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolder {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.action_row, parent, false)
        return CustomViewHolder(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolder, position: Int) {

    }

}

class CustomViewHolder(val view: View): RecyclerView.ViewHolder(view) {

}