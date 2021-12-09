const { Server } = require("socket.io");
const db = require("../database");
let io_;

/**
 *
 * @param {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io
 */
function initializeIO(io) {
  io_ = io;
  io.on("connection", (socket) => {
    console.log("client connected");
    // todo: since below works, refactor this way more to make a separate file for initializing the socket and assigining handlers.
    // then, here, just call initializeSocket(socket);
    // ALSO TODO: make factories for room, user... functions for dealCards, makeDeck, etc.
    setSocketJoinHandler(socket);
    setSocketChatHandler(socket);
  });
}

function setSocketJoinHandler(socket) {
  // CONNECTING TO ROOMS:
  // https://stackoverflow.com/questions/19150220/creating-rooms-in-socket-io
  socket.on("joinRoom", (data) => {
    console.log("joining:", data.room);

    // join the room
    socket.join(data.room);

    // tell the socket that it joined successfully
    io_.to(socket.id).emit("joinConfirmation", data);

    // add user to the room (will also create room if doesn't exist.)
    db.getProperty(`rooms.${data.room}.users`).then((usersInRoom) => {
      const arrUsers = usersInRoom ? [...usersInRoom, data.user] : [data.user];
      // console.log("users in room:", arrUsers);
      db.setProperty(`rooms.${data.room}.users`, arrUsers);
    });

    // tell the room who joined
    io_
      .to(data.room)
      .emit("roomNotification", `${data.user} has joined ${data.room}`);
  });
}

function setSocketChatHandler(socket) {
  socket.on("chatMessage", (data) => {
    // console.log("chat:", data);
    io_.to(data.room).emit("chatMessage", data);
  });
}

module.exports = initializeIO;
