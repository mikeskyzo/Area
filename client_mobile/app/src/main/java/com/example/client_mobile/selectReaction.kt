package com.example.client_mobile

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.activity_select_action.*

class selectReaction: AppCompatActivity() {

    companion object {
        var token: String? = ""
        lateinit var action: Action
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_action)
        if (intent.getStringExtra("token") != null)
            token = intent.getStringExtra("token")
        if (intent.getSerializableExtra("action") != null)
            action = intent.getSerializableExtra("action") as Action
        println("select reaction")
        println(action.name)
        for (i in action.params.indices) {
            println(action.params[i].name)
            println(action.params[i].value)
        }
        recyclerView_main.layoutManager = LinearLayoutManager(this)
    }
}