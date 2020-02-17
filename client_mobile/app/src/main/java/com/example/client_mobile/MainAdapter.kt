package com.example.epicture

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.client_mobile.Action
import com.example.client_mobile.ActionReaction
import com.example.client_mobile.R
import kotlinx.android.synthetic.main.action_row.view.*

class MainAdapter(val actionReaction: ActionReaction): RecyclerView.Adapter<CustomViewHolder>() {

    override fun getItemCount(): Int {
        var nb = 0
        for (service in actionReaction.services) {
            if (!service.actions.isNullOrEmpty())
                nb += service.actions.count()
            println(nb)
        }
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolder {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.action_row, parent, false)
        return CustomViewHolder(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolder, position: Int) {

        var actions = mutableListOf<Action>()

        for (service in actionReaction.services) {
            if (!service.actions.isNullOrEmpty()) {
                actions.addAll(service.actions)
            }
        }

        val action = actions.get(position)

        holder.view.button.text = action.title
    }

}

class CustomViewHolder(val view: View): RecyclerView.ViewHolder(view) {

}