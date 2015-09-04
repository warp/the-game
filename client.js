(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var dogeImage = new Image();
dogeImage.src = 'doge.png';

window.Client = (function () {
  function Client(name) {
    _classCallCheck(this, Client);

    this.name = name;
  }

  _createClass(Client, [{
    key: 'start',
    value: function start() {
      var stage = new Stage(1000, 600);
      var input = new InputListener();
      var client = new WebSocket(document.location.protocol.replace('http', 'ws') + '//' + document.location.host);
      var thrusties = [];

      window.addEventListener('beforeunload', function () {
        client.close();
      });

      client.onopen = (function () {
        client.send(JSON.stringify({ join: { name: this.name } }));

        input.events.on('stateChange', function (state) {
          client.send(JSON.stringify({ inputState: state }));
        });
      }).bind(this);

      client.onmessage = function (message) {
        var gameState = JSON.parse(message.data).state;
        new Rendering(stage, gameState, thrusties).perform();
      };
    }
  }], [{
    key: 'start',
    value: function start() {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      var client = new (_bind.apply(Client, [null].concat(params)))();
      client.start();
    }
  }]);

  return Client;
})();

var EventStream = (function () {
  function EventStream() {
    _classCallCheck(this, EventStream);

    this.listeners = {};
  }

  _createClass(EventStream, [{
    key: 'on',
    value: function on(eventName, callback) {
      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(callback);
    }
  }, {
    key: 'broadcast',
    value: function broadcast(eventName) {
      for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        data[_key2 - 1] = arguments[_key2];
      }

      (this.listeners[eventName] || []).forEach(function (callback) {
        callback.call.apply(callback, [null].concat(data));
      });
    }
  }]);

  return EventStream;
})();

var InputListener = (function () {
  function InputListener() {
    _classCallCheck(this, InputListener);

    this.events = new EventStream();
    this.state = {};
    this.bindToEvents();
  }

  _createClass(InputListener, [{
    key: 'keyCodeAction',
    value: function keyCodeAction(keyCode) {
      var keyCodeToActionMappings = {
        38: 'thrust',
        37: 'left',
        39: 'right'
      };

      return keyCodeToActionMappings[keyCode];
    }
  }, {
    key: 'bindToEvents',
    value: function bindToEvents() {
      window.addEventListener('keydown', this.setState(true));
      window.addEventListener('keyup', this.setState(false));
    }
  }, {
    key: 'setState',
    value: function setState(value) {
      return (function (event) {
        var action = this.keyCodeAction(event.keyCode);

        if (action) {
          this.state[action] = value;
        }

        this.events.broadcast('stateChange', this.state);
      }).bind(this);
    }
  }]);

  return InputListener;
})();

var Rendering = (function () {
  function Rendering(stage, gameState, thrusties) {
    _classCallCheck(this, Rendering);

    this.stage = stage;
    this.context = stage.context;
    this.gameState = gameState;
    this.thrusties = thrusties;
  }

  _createClass(Rendering, [{
    key: 'perform',
    value: function perform() {
      this.erase();
      this.drawBackground();
      this.drawThrusties();
      this.drawShips();
    }
  }, {
    key: 'erase',
    value: function erase() {
      this.draw(function (context, stage) {
        context.clearRect(0, 0, stage.width, stage.height);
      });
    }
  }, {
    key: 'drawThrusties',
    value: function drawThrusties() {
      var _this = this;

      this.draw(function (context) {
        _this.thrusties.forEach(function (_ref, index) {
          var angle = _ref.angle;
          var x = _ref.x;
          var y = _ref.y;
          var mx = _ref.mx;
          var my = _ref.my;
          var ttl = _ref.ttl;

          _this.thrusties[index].ttl -= 0.3;
          _this.thrusties[index].x += mx;
          _this.thrusties[index].y += my;
          if (ttl > 0) {
            context.fillStyle = 'rgba(225, 0, 0, ' + ttl + ')';
            _this.drawTriangle(x, y, 10 * ttl, angle);
            context.fill();
          } else {
            _this.thrusties.splice(index, 1);
          }
        });
      });
    }
  }, {
    key: 'drawShips',
    value: function drawShips() {
      var _this2 = this;

      this.gameState.ships.forEach(function (ship) {
        _this2.draw(function (context) {
          context.fillStyle = ship.colour;
          this.drawTriangle(ship.x, ship.y, 30, ship.rotation);
          context.fill();
          this.drawText(ship.name, ship.x, Math.max(ship.y - 25, 10), ship.colour);
          if (ship.doge) {
            this.drawDoge(ship);
          }
          if (ship.thrusting) {
            var _rotatePoint = this.rotatePoint(-ship.rotation, 0, 0)([0, 10]);

            var _rotatePoint2 = _slicedToArray(_rotatePoint, 2);

            var mx = _rotatePoint2[0];
            var my = _rotatePoint2[1];

            this.thrusties.push({
              angle: ship.rotation,
              x: ship.x + mx,
              y: ship.y + my,
              mx: mx,
              my: my,
              ttl: 1
            });
          }
        });
      });
    }
  }, {
    key: 'drawDoge',
    value: function drawDoge(ship) {
      this.draw(function (context) {
        context.drawImage(dogeImage, ship.x, ship.y - 10, 64, 34);
      });
    }

    // Draw text whose center is at x
  }, {
    key: 'drawText',
    value: function drawText(text, x, y, colour) {
      this.draw(function (context) {
        var measurement = context.measureText(text);
        context.fillStyle = colour;
        context.font = "bold 10pt Helvetica Neue";
        context.fillText(text, x - measurement.width / 2, y);
      });
    }
  }, {
    key: 'drawBackground',
    value: function drawBackground() {
      this.draw(function (context, stage) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, stage.width, stage.height);
      });
    }
  }, {
    key: 'rotatePoint',
    value: function rotatePoint(angle, x, y) {
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      return function (_ref2) {
        var _ref22 = _slicedToArray(_ref2, 2);

        var px = _ref22[0];
        var py = _ref22[1];
        return [px * cos - py * sin + x, px * sin + py * cos + y];
      };
    }
  }, {
    key: 'drawTriangle',
    value: function drawTriangle(x, y, size, rotation) {
      var path = [[0, -size / 2], [size / 2, size / 2], [-size / 2, size / 2]].map(this.rotatePoint(-rotation, x, y));

      this.drawPath(path);
    }
  }, {
    key: 'drawPath',
    value: function drawPath(points) {
      this.draw(function (context) {
        context.beginPath();
        context.moveTo.apply(context, points.shift());
        points.forEach(function (point) {
          return context.lineTo.apply(context, point);
        });
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

  return Rendering;
})();

var Stage = (function () {
  function Stage(width, height) {
    _classCallCheck(this, Stage);

    this.materialize();
    this.width = width;
    this.height = height;
  }

  _createClass(Stage, [{
    key: 'materialize',
    value: function materialize() {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      document.body.appendChild(this.canvas);
    }
  }, {
    key: 'width',
    set: function set(value) {
      this.canvas.width = value;
    },
    get: function get() {
      return this.canvas.width;
    }
  }, {
    key: 'height',
    set: function set(value) {
      this.canvas.height = value;
    },
    get: function get() {
      return this.canvas.height;
    }
  }]);

  return Stage;
})();

},{}]},{},[1]);
