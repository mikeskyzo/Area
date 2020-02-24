package com.example.epicture

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.client_mobile.Actions
import com.example.client_mobile.R
import com.example.client_mobile.selectParameter
import com.google.gson.Gson
import kotlinx.android.synthetic.main.action_row.view.*

class MainAdapter(val allActions: Actions, val context: Context?, val token: String?): RecyclerView.Adapter<CustomViewHolderMain>() {

    override fun getItemCount(): Int {
        val nb = allActions.actions.count()
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderMain {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.action_row, parent, false)
        return CustomViewHolderMain(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderMain, position: Int) {

        val action = allActions.actions.get(position)

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
/*            for (element in action.params) {
                println(element.name)
            }*/
            val intent = Intent(context, selectParameter::class.java)
            val arrayAsString: String = Gson().toJson(action.params)
            intent.putExtra("params", arrayAsString)
            intent.putExtra("action", action)
            intent.putExtra("token", token)
            context?.startActivity(intent)
        }
    }

}

class CustomViewHolderMain(val view: View): RecyclerView.ViewHolder(view) {
}