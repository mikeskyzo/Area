package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import kotlinx.android.synthetic.main.action_row.view.*

class ReactionAdapter(val allReactions: Reactions, val context: Context?, val token: String?): RecyclerView.Adapter<CustomViewHolderReaction>() {

    override fun getItemCount(): Int {
        val nb = allReactions.reactions.count()
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderReaction {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.action_row, parent, false)
        return CustomViewHolderReaction(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderReaction, position: Int) {

        val reaction = allReactions.reactions.get(position)

        holder.view.buttonAction.text = reaction.title
        if (reaction.service == "Github")
            holder.view.imageViewIcon.setImageResource(R.drawable.github)
        if (reaction.service == "Slack")
            holder.view.imageViewIcon.setImageResource(R.drawable.slack)
        if (reaction.service == "Twitch")
            holder.view.imageViewIcon.setImageResource(R.drawable.twitch)
        if (reaction.service == "Reddit")
            holder.view.imageViewIcon.setImageResource(R.drawable.reddit)
        if (reaction.service == "Discord")
            holder.view.imageViewIcon.setImageResource(R.drawable.discord)
        if (reaction.service == "Trello")
            holder.view.imageViewIcon.setImageResource(R.drawable.trello)
        holder.view.buttonAction.setOnClickListener {
            val intent = Intent(context, selectParameter::class.java)
            val arrayAsString: String = Gson().toJson(reaction.params)
            intent.putExtra("params", arrayAsString)
            intent.putExtra("reaction", reaction)
            intent.putExtra("token", token)
            context?.startActivity(intent)
        }
    }
}

class CustomViewHolderReaction(val view: View): RecyclerView.ViewHolder(view) {
}