package com.example.epicture

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.client_mobile.Action
import com.example.client_mobile.ActionReaction
import com.example.client_mobile.Param
import com.example.client_mobile.R
import kotlinx.android.synthetic.main.action_row.view.*
import kotlinx.android.synthetic.main.parameter_row.view.*

class ParameterAdapter(val params: Array<Param>, val actionName: String): RecyclerView.Adapter<CustomViewHolderParam>() {

    override fun getItemCount(): Int {
        val nb = params.count()
        return nb
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderParam {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.parameter_row, parent, false)
        //println(actionName)
        return CustomViewHolderParam(cellForRow)
    }

    override fun onBindViewHolder(holder: CustomViewHolderParam, position: Int) {

        val param = params.get(position)

        holder.view.textViewParameter.setText(param.description)
    }
}

class CustomViewHolderParam(val view: View): RecyclerView.ViewHolder(view) {
}