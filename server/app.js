const { Server } = require("socket.io");

const debug = require("debug")("app4");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const roomsRouter = require("./routes/rooms");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// proxy cors stuff
// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use("/rooms", roomsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// refactoring to remove the bin/www files: http://expressjs.com/en/guide/migrating-4.html#app-gen
// module.exports = app;

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), function () {
  debug("Express server listening on port " + server.address().port);
});

/**************** SOCKET IO CONFIG *****************/

const io = new Server(server, {
  cors: true,
  origins: ["http://localhost:8080"],
});

// CONNECTING TO ROOMS:
// https://stackoverflow.com/questions/19150220/creating-rooms-in-socket-io

io.on("connection", (socket) => {
  console.log("client connected");
  // socket.on("joinRoom", (data) => socket.emit("usersUpdate", "BOOM SERVER!"));
  socket.on("joinRoom", (data) => {
    console.log("attempting to join ", data.room);
    socket.join(data.room);

    // tell the socket that it joined successfully
    io.to(socket.id).emit("joinConfirmation", data);

    // tell the room who joined
    io.to(data.room).emit(
      "roomNotification",
      `${data.user} has joined ${data.room}`
    );
  });

  socket.on("chatMessage", (data) => {
    console.log("chat:", data);
    io.to(data.room).emit("chatMessage", data);
  });
});

app.set("socketio", io);
