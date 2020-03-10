package com.example.client_mobile

import android.content.Intent
import android.content.Context
import android.content.res.Resources
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.area_row.view.*

/**
 * Handles the list of areas
 * @param allAreas: Holds an array of areas
 * @param context: current context
 * @param token: user token
 * @param resources: drawables resources (used to get icons)
 */
class AreaAdapter(val allAreas: Array<Area>, val context: Context?, val token: String?, val resources: Resources): RecyclerView.Adapter<CustomViewHolderArea>() {
    /**
     * Gets number of area
     */
    override fun getItemCount(): Int {
        val nb = allAreas.count()
        return nb
    }

    /**
     * Create action view holder
     */
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomViewHolderArea {
        val layoutInflater = LayoutInflater.from(parent.context)
        val cellForRow = layoutInflater.inflate(R.layout.area_row, parent, false)
        return CustomViewHolderArea(cellForRow)
    }

    /**
     * Called for each item area
     */
    override fun onBindViewHolder(holder: CustomViewHolderArea, position: Int) {

        val area = allAreas.get(position)

        holder.view.textView_name.setText(area.area_name)
        if (area.color == "orange") {
            holder.view.textView_name.setBackgroundColor(Color.parseColor("#ff9800"))
            holder.view.imageViewIconAction.setColorFilter(Color.parseColor("#ff9800"))
            holder.view.imageViewIconReaction.setColorFilter(Color.parseColor("#ff9800"))
        }
        if (area.color == "red") {
            holder.view.textView_name.setBackgroundColor(Color.parseColor("#e31c0e"))
            holder.view.imageViewIconAction.setColorFilter(Color.parseColor("#e31c0e"))
            holder.view.imageViewIconReaction.setColorFilter(Color.parseColor("#e31c0e"))
        }
        if (area.color == "blue") {
            holder.view.textView_name.setBackgroundColor(Color.parseColor("#0e75e3"))
            holder.view.imageViewIconAction.setColorFilter(Color.parseColor("#0e75e3"))
            holder.view.imageViewIconReaction.setColorFilter(Color.parseColor("#0e75e3"))
        }
        if (area.color == "green") {
            holder.view.textView_name.setBackgroundColor(Color.parseColor("#0ee320"))
            holder.view.imageViewIconAction.setColorFilter(Color.parseColor("#0ee320"))
            holder.view.imageViewIconReaction.setColorFilter(Color.parseColor("#0ee320"))
        }
        if (area.color == "yellow") {
            holder.view.textView_name.setBackgroundColor(Color.parseColor("#e3dc0e"))
            holder.view.imageViewIconAction.setColorFilter(Color.parseColor("#e3dc0e"))
            holder.view.imageViewIconReaction.setColorFilter(Color.parseColor("#e3dc0e"))
        }
        if (area.color == "pink") {
            holder.view.textView_name.setBackgroundColor(Color.parseColor("#f76dec"))
            holder.view.imageViewIconAction.setColorFilter(Color.parseColor("#f76dec"))
            holder.view.imageViewIconReaction.setColorFilter(Color.parseColor("#f76dec"))
        }

        holder.view.buttonDetails.setOnClickListener {
            val intent = Intent(context, DetailsArea::class.java)
            intent.putExtra("token", token)
            intent.putExtra("area_id", area.area_id)
            context?.startActivity(intent)
            Toast.makeText(holder.view.context, area.area_id, Toast.LENGTH_SHORT).show()
        }
        holder.view.imageViewIconAction.setImageResource(resources.getIdentifier(
            area.action.decapitalize(),
            "drawable",
            context!!.packageName))
        holder.view.imageViewIconReaction.setImageResource(resources.getIdentifier(
            area.reaction.decapitalize(),
            "drawable",
            context!!.packageName))
    }
}

/**
 * Holds Area view
 * @param view: view
 */
class CustomViewHolderArea(val view: View): RecyclerView.ViewHolder(view) {
}