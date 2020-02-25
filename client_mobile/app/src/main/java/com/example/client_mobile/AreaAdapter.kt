package com.example.client_mobile

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView


class AreaAdapter(val areas: Array<Area>): RecyclerView.Adapter<CustomViewHolderArea>() {
    override fun getItemCount(): Int {
        val nb = areas.count()
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderArea {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.area_row, parent, false)
        return CustomViewHolderArea(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderArea, position: Int) {

        val param = areas.get(position)

//        holder.view.textViewParameter.setText(param.description)
    }
}

class CustomViewHolderArea(val view: View): RecyclerView.ViewHolder(view) {
}