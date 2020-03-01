package com.example.client_mobile

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.parameter_row.view.*


/**
 * Handles the list of parameter for actions an reactions
 * @param params: an array of parameters
 */
class ParameterAdapter(val params: Array<Param>): RecyclerView.Adapter<CustomViewHolderParam>() {
    override fun getItemCount(): Int {
        val nb = params.count()
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderParam {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.parameter_row, parent, false)
        return CustomViewHolderParam(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderParam, position: Int) {

        val param = params.get(position)

        holder.view.textViewParameter.setText(param.description)
    }
}

class CustomViewHolderParam(val view: View): RecyclerView.ViewHolder(view) {
}