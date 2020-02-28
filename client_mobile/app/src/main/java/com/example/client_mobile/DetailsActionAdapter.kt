package com.example.client_mobile

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.parameter_row.view.*


class DetailsActionAdapter(val params: Array<Param>): RecyclerView.Adapter<CustomViewHolderDetailsAction>() {
    override fun getItemCount(): Int {
        val nb = params.count()
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderDetailsAction{
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.parameter_row, parent, false)
        return CustomViewHolderDetailsAction(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderDetailsAction, position: Int) {

        val param = params.get(position)

        holder.view.textViewParameter.setText(param.description)
        holder.view.editTextParameter.setText(param.value)
        holder.view.editTextParameter.isEnabled = false
    }
}

class CustomViewHolderDetailsAction(val view: View): RecyclerView.ViewHolder(view) {
}