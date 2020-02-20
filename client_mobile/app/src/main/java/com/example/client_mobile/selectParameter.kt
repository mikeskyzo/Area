package com.example.client_mobile

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.epicture.ParameterAdapter
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.reflect.TypeToken
import kotlinx.android.synthetic.main.activity_select_action.imageButtonBack
import kotlinx.android.synthetic.main.activity_select_parameter.*


class selectParameter : AppCompatActivity() {

    companion object {
        var token: String? = ""
        lateinit var action: Action
    }

    inline fun <reified T> genericType() = object: TypeToken<T>() {}.type



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_parameter)

        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")

        if (intent.getSerializableExtra("action") != null)
        println(token)

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
            recyclerView_param.adapter = ParameterAdapter(listParam)
        }
    }

    fun getContext(): Context? {
        return this
    }
}