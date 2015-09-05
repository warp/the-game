(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var dogeImage = new Image();
dogeImage.src = 'doge.png';

exports['default'] = dogeImage;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventStream = (function () {
  function EventStream() {
    _classCallCheck(this, EventStream);

    this.listeners = {};
  }

  _createClass(EventStream, [{
    key: "on",
    value: function on(eventName, callback) {
      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(callback);
    }
  }, {
    key: "broadcast",
    value: function broadcast(eventName) {
      for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }

      (this.listeners[eventName] || []).forEach(function (callback) {
        callback.call.apply(callback, [null].concat(data));
      });
    }
  }]);

  return EventStream;
})();

exports["default"] = EventStream;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var GamepadInput = (function () {
  _createClass(GamepadInput, null, [{
    key: 'MAPPINGS',

    // For PS3 controller
    get: function get() {
      return {
        4: 'thrust', // D-pad up
        14: 'thrust', // X
        7: 'left', // D-pad left
        5: 'right' // D-pad right
      };
    }
  }, {
    key: 'MS_SAMPLE',
    get: function get() {
      return 50;
    }
  }]);

  function GamepadInput(eventStream) {
    _classCallCheck(this, GamepadInput);

    this.events = eventStream;
    this.state = {};
    this.bindToEvents();
  }

  _createClass(GamepadInput, [{
    key: 'getGamepad',
    value: function getGamepad() {
      return navigator.getGamepads().find(function (pad) {
        return pad;
      });
    }
  }, {
    key: 'bindToEvents',
    value: function bindToEvents() {
      var _this = this;

      setInterval(function () {
        var gamepad = _this.getGamepad();

        if (!gamepad) {
          return;
        }

        _this.setStateFromButtons(gamepad.buttons);
      }, GamepadInput.MS_SAMPLE);
    }
  }, {
    key: 'setStateFromButtons',
    value: function setStateFromButtons(buttons) {
      var newState = {};

      buttons.forEach(function (button, buttonIndex) {
        if (button.pressed) {
          var action = GamepadInput.MAPPINGS[buttonIndex];

          if (action) {
            newState[action] = true;
          }
        }
      });

      this.setState(newState);
    }
  }, {
    key: 'isDifferent',
    value: function isDifferent(newState) {
      // Fast comparison
      return JSON.stringify(this.state) !== JSON.stringify(newState);
    }
  }, {
    key: 'setState',
    value: function setState(newState) {
      if (this.isDifferent(newState)) {
        this.state = newState;
        this.events.broadcast('stateChange', this.state);
      }
    }
  }]);

  return GamepadInput;
})();

exports['default'] = GamepadInput;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _playerInput = require('./player-input');

var _playerInput2 = _interopRequireDefault(_playerInput);

var _keyboardInput = require('./keyboard-input');

var _keyboardInput2 = _interopRequireDefault(_keyboardInput);

var _gamepadInput = require('./gamepad-input');

var _gamepadInput2 = _interopRequireDefault(_gamepadInput);

var _rendering = require('./rendering');

var _rendering2 = _interopRequireDefault(_rendering);

var _stage = require('./stage');

var _stage2 = _interopRequireDefault(_stage);

window.Client = (function () {
  function Client(name) {
    _classCallCheck(this, Client);

    this.name = name;
  }

  _createClass(Client, [{
    key: 'start',
    value: function start() {
      var stage = new _stage2['default'](1000, 600);
      var input = new _playerInput2['default'](_keyboardInput2['default'], _gamepadInput2['default']);
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
        new _rendering2['default'](stage, gameState, thrusties).perform();
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

},{"./gamepad-input":3,"./keyboard-input":5,"./player-input":6,"./rendering":7,"./stage":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var KeyboardInput = (function () {
  _createClass(KeyboardInput, null, [{
    key: 'MAPPINGS',
    get: function get() {
      return {
        38: 'thrust',
        37: 'left',
        39: 'right'
      };
    }
  }]);

  function KeyboardInput(eventStream) {
    _classCallCheck(this, KeyboardInput);

    this.events = eventStream;
    this.state = {};
    this.bindToEvents();
  }

  _createClass(KeyboardInput, [{
    key: 'keyCodeAction',
    value: function keyCodeAction(keyCode) {
      return KeyboardInput.MAPPINGS[keyCode];
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

  return KeyboardInput;
})();

exports['default'] = KeyboardInput;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _eventStream = require('./event-stream');

var _eventStream2 = _interopRequireDefault(_eventStream);

var PlayerInput = (function () {
  function PlayerInput() {
    _classCallCheck(this, PlayerInput);

    this.events = new _eventStream2['default']();

    for (var _len = arguments.length, inputSources = Array(_len), _key = 0; _key < _len; _key++) {
      inputSources[_key] = arguments[_key];
    }

    this.inputSources = inputSources;
    this.bindToEvents();
  }

  _createClass(PlayerInput, [{
    key: 'bindToEvents',
    value: function bindToEvents() {
      var _this = this;

      this.inputSources.forEach(function (source) {
        return new source(_this.events);
      });
    }
  }]);

  return PlayerInput;
})();

exports['default'] = PlayerInput;
module.exports = exports['default'];

},{"./event-stream":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _doge = require('./doge');

var _doge2 = _interopRequireDefault(_doge);

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

          if (ship.doge) {
            this.drawDoge(ship);
          } else {
            context.fillStyle = ship.colour;
            this.drawTriangle(ship.x, ship.y, 30, ship.rotation);
            context.fill();
          }

          this.drawText(ship.name, ship.x, Math.max(ship.y - 25, 10), ship.colour);

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
      this.drawImage(_doge2['default'], ship.x, ship.y, 96, 51, ship.rotation);
    }

    // Draw image whose center is x, y
  }, {
    key: 'drawImage',
    value: function drawImage(image, x, y, width, height) {
      var rotation = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

      this.draw(function (context) {
        context.translate(x, y);
        context.rotate(-rotation);
        context.drawImage(image, -width / 2, -height / 2, width, height);
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

exports['default'] = Rendering;
module.exports = exports['default'];

},{"./doge":1}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

exports['default'] = Stage;
module.exports = exports['default'];

},{}]},{},[4]);
