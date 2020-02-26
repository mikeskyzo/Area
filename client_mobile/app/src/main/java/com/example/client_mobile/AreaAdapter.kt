package com.example.client_mobile

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.area_row.view.*


class AreaAdapter(val allAreas: Areas): RecyclerView.Adapter<CustomViewHolderArea>() {
    override fun getItemCount(): Int {
        val nb = allAreas.areas.count()
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderArea {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.area_row, parent, false)
        return CustomViewHolderArea(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderArea, position: Int) {

        val area = allAreas.areas.get(position)

        //holder.view.cardView.setCardBackgroundColor(Color.parseColor("#EAEDED"))
        holder.view.buttonDetails.setOnClickListener {
            println(area.area_id)
            Toast.makeText(holder.view.context, area.area_id, Toast.LENGTH_SHORT).show()
        }
        if (area.action == "Github")
            holder.view.imageViewIconAction.setImageResource(R.drawable.ic_github)
        if (area.reaction == "Slack")
            holder.view.imageViewIconReaction.setImageResource(R.drawable.ic_slack)
//        holder.view.textViewParameter.setText(param.description)
    }
}

class CustomViewHolderArea(val view: View): RecyclerView.ViewHolder(view) {
}