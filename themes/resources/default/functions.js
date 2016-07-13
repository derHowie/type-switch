'use strict';
var functions = function () {};

functions.sound = function (src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  }
  this.stop = function() {
    this.sound.pause();
  }
  this.reset = function() {
    this.sound.currentTime = 0;
  }
}

functions.playSound = function (sound) {
  sound.reset();
  sound.play();
}

functions.divideTime = function (val, el) {
  var min = 0;
  var sec = 0;
  function padZero(num) {
    if (num.toString().length < 2) {
      num = '0' + num.toString();
    }
    return num;
  }
  while (val >= 60) {
    min += 1;
    val -= 60;
  }
  sec = val;
  $(el).text(padZero(min) + ':' + padZero(sec));
}

functions.calcPoints = function (answer, el) {
  var points = (answer === 'correct') ? 250 : -100;
  $(el).text(parseInt($(el).text()) + points);
}

functions.appendGamePrompt = function (newPrompt, el) {
  newPrompt.split('').map(function (letter, i) {
    var letterContainer = document.createElement('p');
    if (letter === ' ') {
      letter = 'W';
      letterContainer.style.opacity = '0';
    }
    letterContainer.setAttribute('class', 'letter');
    var node = document.createTextNode(letter);
    letterContainer.appendChild(node);
    return letterContainer;
  }).forEach(function (node) {
    document.getElementById('prompt').appendChild(node);
  });
}
