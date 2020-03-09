# How to use Areacoon mobile app

This README is used to understand how you can use the application.

## Server location

The user can type the server location when logging or creating an account.

## User authentification

### Account creation

In order to use the application, the user must firstly register an account. On the start page of the application you must :
1. Click on "Create an account"
2. Select a username, a password and confirm your password
3. Enter a server location. By default, it's "https://areacoon-api.eu.ngrok.io"
4. Click on "Create an account"

You'll get an error message for the following cases :
-The application couldn't connect to the server
-The request timed out
-The username is already taken
-The username, password or confirmation password is missing
-The password and confirmation password doesn't match

If the request is successful, you're going to be redirected to the home page of the application.

### Login

In order to connect with an existing account, the user must enter its username and password. On the start page of the application you must :
1. Enter a username and a password
2. Enter a server location. By default, its "https://areacoon-api.eu.ngrok.io"

You'll get an error message for the following cases :
-The application couldn't connect to the server
-The request timed out
-There is no account for this username
-The username and password doesn't match

If the request is successful, you're going to be redirected to the home page of the application.

## Home features

After logging in or registering, you'll be redirected to the home page of the application. Here is a list of all the things you can do from here.

### Displaying areas

On the home page, there is all of the areas created by the user. It's represented by a card containing :
-The name of the area
-The icon of the service action (left one)
-The icon of the service reaction (right one)
-A button that'll redirect the user to a page containing all the informations about the area selected (name, action and reactions parameters names and values).

The user can delete the area from it's page thanks to the "Delete area" button at the bottom of the page.
If the home page doesn't show any area, it means that the user didn't create any.

### Subscribing to a service

To subscribe to a service, the user must select one of them among the list displayed on the navigation bar.
1. Get to the home page of the application
2. Drag the navigation bar from left to right, or click on the top left button.
3. Scroll down to the service list, and click on one
4. Authorize the service to get some rights on your account

After the fourth step, you'll be registered to the service and redirected to the home page of the application.

### Unsubscribe to a service

To unsubscribe from a service, the user must select the service he wants to unsubscribe to from the "My services" page.
1. Get to the home page of the application
2. Drag the navigation bar from left to right, or click on the top left button.
3. Click on the "My services" button. You'll be redirected to a page displaying all the services you're subscribed to.
4. Click on the red cross next to a service to unsubscribe from it.

After the fourth step, you'll have to subscribe again to the service to use its actions and reactions. If the service doesn't need any authentification, it'll appear on this page by default and you won't be able to remove it.

### Creating an area

To create an area, the user must access at least one action and one reaction by subscribing to services. After being able to use actions and reactions from the services, the user must :
1. Get to the home page of the application
2. Drag the navigation bar from left to right, or click on the top left button
3. Click on the "Create an area" button. You'll be redirected to a page displaying all the actions your services allows you to use
4. Select an action from the ones displayed. An icon on the left of the action name is displayed and used to know which service is associated to the action
5. Enter the parameters you want to set for your action. Those depends on the action you chose. Then, click on the "Create a reaction" button at the bottom of the screen
6. Select a reaction in the same way you did for an action
7. Enter the parameters of the reaction the same way you did for an action
8. Click on the "Next" button
9. Enter a name for your area and choose a color for this one
10. Click on the "Create an area" button.

After creating an area, you'll either be redirected to the home page of the application if the area has been successfully created, or on the select action page if the server failed to create the area.

### Logging out

To log out, the user must click on the "Log out" button on the navigation bar of the home page.
1. Get to the home page of the application
2. Drag the navigation bar from left to right, or click on the top left button
3. Click on the "Log out" button

After logging out, you'll be redirected to the start page of the application.
