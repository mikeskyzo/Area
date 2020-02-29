package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import kotlinx.android.synthetic.main.action_row.view.*

class ActionAdapter(val allActions: Actions, val context: Context?, val token: String?): RecyclerView.Adapter<CustomViewHolderAction>() {

    override fun getItemCount(): Int {
        val nb = allActions.actions.count()
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderAction {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.action_row, parent, false)
        return CustomViewHolderAction(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderAction, position: Int) {

        val action = allActions.actions.get(position)

        holder.view.buttonAction.text = action.title
        if (action.service == "Github")
            holder.view.imageViewIcon.setImageResource(R.drawable.github)
        if (action.service == "Slack")
            holder.view.imageViewIcon.setImageResource(R.drawable.slack)
        if (action.service == "Twitch")
            holder.view.imageViewIcon.setImageResource(R.drawable.twitch)
        if (action.service == "Reddit")
            holder.view.imageViewIcon.setImageResource(R.drawable.reddit)
        if (action.service == "Discord")
            holder.view.imageViewIcon.setImageResource(R.drawable.discord)
        if (action.service == "Trello")
            holder.view.imageViewIcon.setImageResource(R.drawable.trello)
        holder.view.buttonAction.setOnClickListener {
            val intent = Intent(context, selectParameter::class.java)
            val arrayAsString: String = Gson().toJson(action.params)
            intent.putExtra("params", arrayAsString)
            intent.putExtra("action", action)
            intent.putExtra("token", token)
            context?.startActivity(intent)
        }
    }
}

class CustomViewHolderAction(val view: View): RecyclerView.ViewHolder(view) {
}