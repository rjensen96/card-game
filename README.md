# card-game

Join a room with your friends and play a card game together!

This app is an implementation of the card game [Phase 10](https://www.unorules.com/phase-10-rules/). This is an education-related project that I did on my 2021 winter break. Please don't sue me if you're with Mattel :)

Try it out here, hosted on AWS Lightsail: http://52.41.20.112/

## Stack

This project has a Vue frontend and an Express/Node.js backend with Mongo db. All communication between clients and server uses the socket.io framework. No REST api this time.

## Future ideas & contributing

A couple features I'd like to add:

- A form when a player creates a room which allows them to customize the number of phases and the phases themselves. The game can be long to play, so it would be fun to allow custom configurations.
- In-game chat between participants in a room. This was partially implemented in the server side but I spent my time elsewhere.

If you want to contribute, clone the project and submit a pull request.
