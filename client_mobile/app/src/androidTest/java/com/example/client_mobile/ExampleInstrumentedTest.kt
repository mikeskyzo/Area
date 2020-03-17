package com.example.client_mobile

import androidx.test.InstrumentationRegistry
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.*
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.intent.rule.IntentsTestRule
import androidx.test.espresso.matcher.ViewMatchers.withId
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.runner.AndroidJUnit4
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
    var activityRule: IntentsTestRule<Start>
            = IntentsTestRule(Start::class.java)

    @Test
    fun useAppContext() {
        val appContext = InstrumentationRegistry.getTargetContext()
        assertEquals("com.example.client_mobile", appContext.packageName)
    }

    @Test
    fun testSetUsername() {
        onView(withId(R.id.editTextUsername)).perform(typeText("Username"), closeSoftKeyboard())
        onView(withId(R.id.editTextUsername)).check(matches(withText("Username")))
    }

    @Test
    fun testSetPassword() {
        onView(withId(R.id.editTextPassword)).perform(typeText("Password"), closeSoftKeyboard())
        onView(withId(R.id.editTextPassword)).check(matches(withText("Password")))
    }

    @Test
    fun testDefaultServerLocation() {
        onView(withId(R.id.editTextServerLocation)).check(matches(withText("https://areacoon-api.eu.ngrok.io")))

    }

    @Test
    fun test() {
        assertEquals(2 + 2, 4)
    }
}

