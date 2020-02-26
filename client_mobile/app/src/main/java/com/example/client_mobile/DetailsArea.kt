package com.example.client_mobile

import android.content.Context
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class DetailsArea : AppCompatActivity() {
    lateinit var option : Spinner
    lateinit var result : TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_name)

        option = findViewById(R.id.spinner)

        val colors = arrayOf("red", "blue", "green", "yellow", "pink")

        option.adapter = ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, colors)

        option.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {
                Toast.makeText(getContext(), "nothing selected", Toast.LENGTH_SHORT).show()
                TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
            }

            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                Toast.makeText(getContext(), colors.get(position), Toast.LENGTH_SHORT).show()
                TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
            }

        }
    }

    fun getContext(): Context? {
        return this
    }
}