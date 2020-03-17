package com.example.client_mobile

import android.content.Context
import androidx.test.InstrumentationRegistry
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.closeSoftKeyboard
import androidx.test.espresso.action.ViewActions.typeText
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.withId
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.runner.AndroidJUnit4
import androidx.test.rule.*
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith


/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@Suppress("DEPRECATION")
@RunWith(AndroidJUnit4::class)
class ExampleInstrumentedTest {

    @get:Rule
    var activityRule: ActivityTestRule<Start>
            = ActivityTestRule(Start::class.java)

    @Test
    fun useAppContext() {
        // Context of the app under test.
        val appContext = InstrumentationRegistry.getTargetContext()
        assertEquals("com.example.client_mobile", appContext.packageName)
    }

    @Test
    fun testStart() {
        // Type text and then press the button.
        onView(withId(R.id.editTextUsername)).perform(typeText("Caca"), closeSoftKeyboard())
        onView(withId(R.id.editTextUsername)).check(matches(withText("Caca")))
    }

    @Test
    fun addition_isCorrect() {
        assertEquals(4, 2 + 2)
    }
}

