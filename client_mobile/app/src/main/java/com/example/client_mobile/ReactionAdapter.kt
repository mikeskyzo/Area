package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.content.res.Resources
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import kotlinx.android.synthetic.main.action_row.view.*

/**
 * Handles the list of reactions
 * @param allReactions: holds an array of reaction
 * @param context: current context
 * @param token: user token
 */
class ReactionAdapter(val allReactions: Array<Reaction>, val context: Context?, val token: String?, val resources: Resources): RecyclerView.Adapter<CustomViewHolderReaction>() {

    override fun getItemCount(): Int {
        val nb = allReactions.count()
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderReaction {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.action_row, parent, false)
        return CustomViewHolderReaction(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderReaction, position: Int) {

        val reaction = allReactions.get(position)

        val service_icon = resources.getIdentifier(
            reaction.service.decapitalize(),
            "drawable",
            context!!.packageName
        )
        holder.view.imageViewIcon.setImageResource(service_icon)
        holder.view.buttonAction.text = reaction.title
        holder.view.buttonAction.setOnClickListener {
            val intent = Intent(context, selectParameter::class.java)
            val arrayAsString: String = Gson().toJson(reaction.params)
            intent.putExtra("params", arrayAsString)
            intent.putExtra("reaction", reaction)
            intent.putExtra("token", token)
            context.startActivity(intent)
        }
    }
}

class CustomViewHolderReaction(val view: View): RecyclerView.ViewHolder(view) {
}