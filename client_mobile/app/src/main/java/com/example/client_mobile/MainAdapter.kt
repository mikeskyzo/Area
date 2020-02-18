package com.example.epicture

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.client_mobile.ActionReaction
import com.example.client_mobile.R
import kotlinx.android.synthetic.main.action_row.view.*

class MainAdapter(val actionReaction: ActionReaction): RecyclerView.Adapter<CustomViewHolder>() {

    override fun getItemCount(): Int {
        val nb = actionReaction.actions.count()
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolder {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.action_row, parent, false)
        return CustomViewHolder(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolder, position: Int) {

        val action = actionReaction.actions.get(position)

        holder.view.buttonAction.text = action.title
        if (action.service == "Github")
            holder.view.imageViewIcon.setImageResource(R.drawable.ic_github)
        if (action.service == "Slack")
            holder.view.imageViewIcon.setImageResource(R.drawable.ic_slack)
        if (action.service == "Twitch")
            holder.view.imageViewIcon.setImageResource(R.drawable.ic_twitch)
        if (action.service == "Reddit")
            holder.view.imageViewIcon.setImageResource(R.drawable.ic_reddit)
        if (action.service == "Discord")
            holder.view.imageViewIcon.setImageResource(R.drawable.ic_discord)
        if (action.service == "Trello")
            holder.view.imageViewIcon.setImageResource(R.drawable.ic_trello)
        holder.view.buttonAction.setOnClickListener {
            Toast.makeText(holder.view.context, holder.view.buttonAction.text.toString(), Toast.LENGTH_SHORT).show()
            for (element in action.params) {
                println(element.name)
            }
        }
    }

}

class CustomViewHolder(val view: View): RecyclerView.ViewHolder(view) {
}