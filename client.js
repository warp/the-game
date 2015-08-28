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
      this.stage = new Stage();
      this.painter = new Painter(this.stage);
      this.painter.paint({});
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

var Painter = (function () {
  function Painter(stage) {
    _classCallCheck(this, Painter);

    this.stage = stage;
  }

  _createClass(Painter, [{
    key: 'paint',
    value: function paint() {
      this.erase();
      this.drawBackground();
    }
  }, {
    key: 'erase',
    value: function erase() {
      this.stage.draw(function (stage) {
        this.clearRect(0, 0, stage.width(), stage.height());
      });
    }
  }, {
    key: 'drawBackground',
    value: function drawBackground() {
      this.stage.draw(function (stage) {
        this.fillStyle = 'rgb(227, 227, 227)';
        this.fillRect(0, 0, stage.width(), stage.height());
      });
    }
  }]);

  return Painter;
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
    key: 'draw',
    value: function draw(callback) {
      callback.call(this.context, this);
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

var socket = io('http://localhost:8080');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

},{}]},{},[1]);
