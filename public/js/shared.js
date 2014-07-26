var socket = io();

var instructions = [
  "connect",
  "led-pin-mode",
  "led-9-on",
  "led-9-off",
  "led-10-on",
  "led-10-off",
  "led-11-on",
  "led-11-off",
  "photocell-listen"
];

for (var i = 0; i < instructions.length; i++) {
  (function(instruction){
    $(".arduino-" + instruction).click(function() {
      socket.emit("instruction", instruction);
    });
  }(instructions[i]));
}

socket.on("message", function (message) {
  alert(message);
});

var photocell_value = $(".arduino-photocell-value");

socket.on("photocell-value", function (value) {
  photocell_value.val(value);
});