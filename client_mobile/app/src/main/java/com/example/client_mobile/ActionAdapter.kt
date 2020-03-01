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
 * Handles the list of actions
 * @param allActions: holds a array of actions
 * @param context: current context
 * @param token: user token
 */

class ActionAdapter(val allActions: Actions, val context: Context?, val token: String?, val resources: Resources): RecyclerView.Adapter<CustomViewHolderAction>() {

    /**
     * Gets the number of actions
     */
    override fun getItemCount(): Int {
        val nb = allActions.actions.count()
        return nb
    }

    /**
     * Create action view holder
     */
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderAction {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.action_row, parent, false)
        return CustomViewHolderAction(cellForRow)
    }

    /**
     * Called for each action
     */
    override fun onBindViewHolder(holder: CustomViewHolderAction, position: Int) {

        val action = allActions.actions.get(position)

        val service_icon = resources.getIdentifier(
            action.service.decapitalize(),
            "drawable",
            context!!.packageName
        )
        holder.view.imageViewIcon.setImageResource(service_icon)

        holder.view.buttonAction.text = action.title
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

/**
 * Holds Action view
 * @param view: view
 */
class CustomViewHolderAction(val view: View): RecyclerView.ViewHolder(view) {
}