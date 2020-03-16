# [B-DEV-510] AREA - Action/REAction

**Epitech project promotion 2022**

----------------------
Project's goal
----------------------

The Dev_area_2019 is a software suite that functions similar to IFTTT and Zapier. The project is split in
__three main parts__ :

* An application server to implement all the features
* A web client to use the application from your browser by querying the application server
* A mobile client to use the application from your phone by querying the application server

----------------------
Project's structure
----------------------
With this project, three solutions are built:
 - The application server
 - The web client
 - The mobile client

----------------------
Installation
----------------------
The project use docker, so, from the root of the project, you can use the following command to build the software :

```bash
docker-compose build
```

>If you're new using Docker, don't forget to install and start the Docker service

----------------------
Usage
----------------------

You can launch the server with this command :

```bash
docker-compose up
```

----------------------
Features
----------------------
* Authentication
    * Built-in Authentication
    * Third party Authentication
* setting services for :
    * Discord
    * Reddit
    * Slack
    * Twitch
    * Gmail
    * Trello
    * GitHub
    
----------------------
Unit tests
----------------------

if you want to try some unit test on the api of the project, you'll need to install Postman first.
Go into the "tests" folder and in "unit tests". you'll find two files. One for the unit test collection and the other for the environment variables.

load those two files into Postman and run the collection. You can choose which test to run. however, be sure to put "create user" or "connect user" (if you already used the create user first) first or the other tests won't work.


don't run "Create user" and "connect user" at the same time or it'll cause problems for the other tests 

----------------------
How to contribute ?
----------------------

You can't contribute unless you're part of the project team.

----------------------
contributors
----------------------

the project has been made by the following team members :

* Benjamin Piniac
* Jean Bourgarel
* Matthieu Desrues
* Mikael Gerard