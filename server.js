var express = require("express");
var consolidate = require("consolidate")
var application = express();
var server = require("http").Server(application);
var io = require("socket.io")(server);

application.use(
  express.static("./public")
);

application.engine("html", consolidate.mustache);

application.set("view engine", "html");
application.set("views", "./views");

application.get("/", function (request, response) {
  response.render("index", {
    "partials" : {
      "styles"  : "partials/styles",
      "header"  : "partials/header",
      "scripts" : "partials/scripts"
    }
  });
});

application.get("/playground/led", function (request, response) {
  response.render("playground/led", {
    "partials" : {
      "styles"       : "../partials/styles",
      "header"       : "../partials/header",
      "scripts"      : "../partials/scripts",
      "hr"           : "../partials/hr",
      "connect"      : "../partials/connect",
      "led_pin_mode" : "../partials/led_pin_mode",
      "led_on_off"   : "../partials/led_on_off"
    }
  });
});

application.get("/playground/photocell", function (request, response) {
  response.render("playground/photocell", {
    "partials" : {
      "styles"           : "../partials/styles",
      "header"           : "../partials/header",
      "scripts"          : "../partials/scripts",
      "hr"               : "../partials/hr",
      "connect"          : "../partials/connect",
      "photocell_listen" : "../partials/photocell_listen"
    }
  });
});

function debug(value) {
  console.log(value);
}

function info(io, socket, key, value) {
  io.emit(key, value);
}

function error(io, socket, key, value) {
  io.emit(key, value);
}

var board;
var led9;
var led10;
var led11;
var photocell;
var five = require("johnny-five");

try {
  io.on("connection", function (socket) {
    debug("user connected");

    socket.on("disconnect", function () {
      debug("user disconnected");
    });

    socket.on("instruction", function (message) {
      debug("instruction: " + message);

      if (message == "connect") {

        if (board) {
          error(io, socket, "message", "Already connected to Arduino");
        } else {
          board = new five.Board();

          board.on("ready", function () {
            info(io, socket, "message", "Connected to Arduino");
          });

          board.on("error", function (e) {
            error(io, socket, "message", e.message);
          });
        }
      }

      if (message == "led-pin-mode") {
        if (board) {
          led9 = new five.Led(9);
          led10 = new five.Led(10);
          led11 = new five.Led(11);

          info(io, socket, "message", "Pin mode set");
        } else {
          error(io, socket, "message", "You must first connect to Arduino");
        }
      }

      if (message == "led-9-on") {
        if (board && led9) {
          led9.on();
        } else {
          error(io, socket, "message", "You must first connect to Arduino and set pin mode");
        }
      }

      if (message == "led-9-off") {
        if (board && led9) {
          led9.off();
        } else {
          error(io, socket, "message", "You must first connect to Arduino and set pin mode");
        }
      }

      if (message == "led-10-on") {
        if (board && led10) {
          led10.on();
        } else {
          error(io, socket, "message", "You must first connect to Arduino and set pin mode");
        }
      }

      if (message == "led-10-off") {
        if (board && led10) {
          led10.off();
        } else {
          error(io, socket, "message", "You must first connect to Arduino and set pin mode");
        }
      }

      if (message == "led-11-on") {
        if (board && led11) {
          led11.on();
        } else {
          error(io, socket, "message", "You must first connect to Arduino and set pin mode");
        }
      }

      if (message == "led-11-off") {
        if (board && led11) {
          led11.off();
        } else {
          error(io, socket, "message", "You must first connect to Arduino and set pin mode");
        }
      }

      if (message == "photocell-listen") {
        if (board) {
          photocell = new five.Sensor({
            "pin"  : "A0",
            "freq" : 250
          });

          photocell.on("data", function () {
            info(io, socket, "photocell-value", this.value);
          });
        } else {
          error(io, socket, "message", "You must first connect to Arduino");
        }
      }
    });
  });

} catch (e) {
  socket.broadcast.emit("message", e);
}

server.listen(3000, function () {
  debug("listening on http://127.0.0.1:3000");
});