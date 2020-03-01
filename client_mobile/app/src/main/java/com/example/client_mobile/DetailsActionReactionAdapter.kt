package com.example.client_mobile

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.parameter_row.view.*

/**
 * Handles the parameters of an area created
 * @param params: an array of parameters
 */
class DetailsActionReactionAdapter(val params: Array<Param>): RecyclerView.Adapter<CustomViewHolderDetailsActionReaction>() {

    /**
     * Gets number of actions or reactions
     */
    override fun getItemCount(): Int {
        val nb = params.count()
        return nb
    }

    /**
     * Creates a view holder for actions or reactions
     */
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderDetailsActionReaction{
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.parameter_row, parent, false)
        return CustomViewHolderDetailsActionReaction(cellForRow)
    }

    /**
     * Called for each parameters of actions or reactions
     */
    override fun onBindViewHolder(holder: CustomViewHolderDetailsActionReaction, position: Int) {

        val param = params.get(position)

        holder.view.textViewParameter.setText(param.description)
        holder.view.editTextParameter.setText(param.value)
        holder.view.editTextParameter.isEnabled = false
    }
}

/**
 * Holds a detailed action or reaction
 * @param view: view
 */
class CustomViewHolderDetailsActionReaction(val view: View): RecyclerView.ViewHolder(view) {
}