(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Client = (function () {
  function Client() {
    _classCallCheck(this, Client);
  }

  _createClass(Client, [{
    key: 'bootstrap',
    value: function bootstrap() {
      var stage = new Stage();
      var socket = io('http://localhost:8080');

      socket.on('state', function (gameState) {
        new Painting(stage, gameState).perform();
      });
    }
  }], [{
    key: 'bootstrap',
    value: function bootstrap() {
      var client = new Client();
      client.bootstrap();
    }
  }]);

  return Client;
})();

var Painting = (function () {
  function Painting(stage, gameState) {
    _classCallCheck(this, Painting);

    this.stage = stage;
    this.context = stage.context;
    this.gameState = gameState;
  }

  _createClass(Painting, [{
    key: 'perform',
    value: function perform() {
      this.erase();
      this.drawBackground();
      this.drawShip();
    }
  }, {
    key: 'erase',
    value: function erase() {
      this.draw(function (context, stage) {
        context.clearRect(0, 0, stage.width(), stage.height());
      });
    }
  }, {
    key: 'drawShip',
    value: function drawShip() {
      var ship = this.gameState.ship;

      this.draw(function (context) {
        context.fillStyle = 'rgb(227, 61, 39)';
        this.drawTriangle(ship.x, ship.y, 30);
        context.fill();
      });
    }
  }, {
    key: 'drawBackground',
    value: function drawBackground() {
      this.draw(function (context, stage) {
        context.fillStyle = 'rgb(227, 227, 227)';
        context.fillRect(0, 0, stage.width(), stage.height());
      });
    }
  }, {
    key: 'drawTriangle',
    value: function drawTriangle(x, y, size) {
      this.draw(function (context) {
        context.beginPath();
        context.moveTo(x, y - size / 2);
        context.lineTo(x + size / 2, y + size / 2);
        context.lineTo(x - size / 2, y + size / 2);
      });
    }
  }, {
    key: 'draw',
    value: function draw(callback) {
      this.context.save();
      callback.call(this, this.context, this.stage);
      this.context.restore();
    }
  }]);

  return Painting;
})();

var Stage = (function () {
  function Stage() {
    _classCallCheck(this, Stage);

    this.materialize();
    this.bindToEvents();
  }

  _createClass(Stage, [{
    key: 'materialize',
    value: function materialize() {
      this.parent = document.body;
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');

      this.parent.appendChild(this.canvas);
      this.resize();
    }
  }, {
    key: 'bindToEvents',
    value: function bindToEvents() {
      window.addEventListener('resize', this.resize.bind(this));
    }
  }, {
    key: 'width',
    value: function width() {
      return this.canvas.width;
    }
  }, {
    key: 'height',
    value: function height() {
      return this.canvas.height;
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.canvas.width = this.parent.offsetWidth;
      this.canvas.height = this.parent.offsetHeight;
    }
  }]);

  return Stage;
})();

Client.bootstrap();

},{}]},{},[1]);
