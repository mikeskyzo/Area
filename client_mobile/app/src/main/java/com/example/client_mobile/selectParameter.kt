package com.example.client_mobile

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_select_action.imageButtonBack
import kotlinx.android.synthetic.main.activity_select_parameter.*
import kotlinx.android.synthetic.main.parameter_row.view.*

/**
 * Class that displays a list of available parameters for actions or reactions
 */
class selectParameter : AppCompatActivity() {

    companion object {
        var token: String? = ""
        lateinit var action: Action
        lateinit var reaction: Reaction
    }

    @SuppressLint("SetTextI18n")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_parameter)
        loadingPanel.visibility = View.GONE

        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")

        imageButtonBack.setOnClickListener {
            this.onBackPressed()
        }

        recyclerView_param.layoutManager = LinearLayoutManager(this)
        if (intent.getSerializableExtra("action") != null)
            action = intent.getSerializableExtra("action") as Action
        if (intent.getSerializableExtra("reaction") != null)
            reaction = intent.getSerializableExtra("reaction") as Reaction

        if (intent.getStringExtra("params") != null) {
            val paramsAsString = intent.getStringExtra("params")
            val listParam = Gson().fromJson(paramsAsString, Array<Param>::class.java)
            if (intent.getSerializableExtra("action") != null) {
                action = intent.getSerializableExtra("action") as Action
                recyclerView_param.adapter = ParameterAdapter(listParam)
            }
            if (intent.getSerializableExtra("reaction") != null) {
                buttonCreateReaction.text = "Next"
                reaction = intent.getSerializableExtra("reaction") as Reaction
                recyclerView_param.adapter = ParameterAdapter(listParam)
            }
        }

        buttonCreateReaction.setOnClickListener {
            val list = ArrayList<String>()
            for (i in 0 until (recyclerView_param.adapter as ParameterAdapter).itemCount) {
                val holder: CustomViewHolderParam = recyclerView_param.findViewHolderForAdapterPosition(i) as CustomViewHolderParam
                list.add(holder.view.editTextParameter.text.toString())
            }
            if (intent.getSerializableExtra("action") != null) {
                for (i in 0 until list.size) {
                    action.params[i].value = list[i]
                }
                intent.putExtra("action", action)
                val intent = Intent(this, selectReaction::class.java)
                intent.putExtra("token", token)
                startActivity(intent)
            }
            if (intent.getSerializableExtra("reaction") != null) {
                for (i in 0 until list.size) {
                    reaction.params[i].value = list[i]
                }
                val intent = Intent(this, selectName::class.java)
                intent.putExtra("token", token)
                intent.putExtra("action", action)
                intent.putExtra("reaction", reaction)
                startActivity(intent)
            }
        }
    }

    /**
     * Gets the current context
     */
    fun getContext(): Context? {
        return this
    }
}