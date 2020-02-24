package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.epicture.CustomViewHolderParam
import com.example.epicture.ParameterAdapter
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_select_action.imageButtonBack
import kotlinx.android.synthetic.main.activity_select_parameter.*
import kotlinx.android.synthetic.main.parameter_row.view.*


class selectParameter : AppCompatActivity() {

    companion object {
        var token: String? = ""
        lateinit var action: Action
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_parameter)

        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")

        imageButtonBack.setOnClickListener {
            val intent = Intent(this, selectAction::class.java)
            startActivity(intent)
        }

        recyclerView_param.layoutManager = LinearLayoutManager(this)
        if (intent.getSerializableExtra("action") != null)
            action = intent.getSerializableExtra("action") as Action

        if (intent.getStringExtra("params") != null) {
            val paramsAsString = intent.getStringExtra("params")
            val listParam = Gson().fromJson(paramsAsString, Array<Param>::class.java)
            recyclerView_param.adapter = ParameterAdapter(listParam, action.name)
        }

        buttonCreateReaction.setOnClickListener {
            val list = ArrayList<String>()
            //gets all editText
            for (i in 0 until (recyclerView_param.adapter as ParameterAdapter).itemCount) {
                val holder: CustomViewHolderParam = recyclerView_param.findViewHolderForAdapterPosition(i) as CustomViewHolderParam
                list.add(holder.view.editTextParameter.text.toString())
            }
            for (i in 0 until list.size) {
                action.params[i].value = list[i]
            }
            val intent = Intent(this, selectReaction::class.java)
            intent.putExtra("token", token)
            intent.putExtra("action", action)
            startActivity(intent)
        }
    }

    fun getContext(): Context? {
        return this
    }
}