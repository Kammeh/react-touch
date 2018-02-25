'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEFAULT_SWIPE_DISTANCE = 100;
var DEFAULT_UPDATE_EVERY = 0;
var eventsTriggered = 0;
var previous = { x: 0, y: 0 };
var direction = { curr: false, prev: false };
var curr = false;
var init = false;
var reached = false;

var defineSwipe = function defineSwipe() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // TODO: add swipe velocity back in
  var swipeDistance = config.swipeDistance || DEFAULT_SWIPE_DISTANCE;
  var updateEvery = config.updateEvery || DEFAULT_UPDATE_EVERY;

  var funcs = {
    onSwipeLeft: function onSwipeLeft(current, initial, callback) {
      if (updateEvery > 0) {
        if (-(curr.x - init.x) / updateEvery > eventsTriggered) {
          eventsTriggered++;
          callback();
        }
      } else if (-(curr.x - init.x) >= swipeDistance) {
        reached = true;
        callback();
      }
    },
    onSwipeRight: function onSwipeRight(current, initial, callback) {
      if (updateEvery > 0) {
        if ((curr.x - init.x) / updateEvery > eventsTriggered) {
          eventsTriggered++;
          callback();
        }
      } else if (curr.x - init.x >= swipeDistance) {
        reached = true;
        callback();
      }
    },
    onSwipeUp: function onSwipeUp(current, initial, callback) {
      console.log(3);
      console.log(updateEvery);
      console.log(swipeDistance);
      console.log(curr);
      console.log(init);
      if (updateEvery > 0) {
        if (-(curr.y - init.y) / updateEvery > eventsTriggered) {
          eventsTriggered++;
          callback();
        }
      } else if (-(curr.y - init.y) >= swipeDistance) {
        console.log(4);
        reached = true;
        callback();
      }
    },
    onSwipeDown: function onSwipeDown(current, initial, callback) {
      console.log(reached);
      if (updateEvery > 0) {
        if ((curr.y - init.y) / updateEvery > eventsTriggered) {
          eventsTriggered++;
          callback();
        }
      } else if (curr.y - init.y >= swipeDistance) {
        reached = true;
        callback();
      }
    }
  };

  var updatePrevious = function updatePrevious(axis) {
    if (Math.abs(curr[axis] - previous[axis]) > 10) {
      previous = curr;
    }
    if (updateEvery > 0) {
      if (direction.curr != direction.prev) {
        direction.prev = direction.curr;
        init = curr;
        eventsTriggered = 0;
      }
    }
  };

  return {
    determineSwipe: function determineSwipe(current, initial, props, callback) {
      if (!reached) {
        curr = current;
        if (!init) {
          init = initial;
        }
        if (current.x < previous.x) {
          direction.curr = 'left';
          updatePrevious('x');
          funcs.onSwipeLeft(current, initial, props.onSwipeLeft);
        } else if (current.x > previous.x) {
          direction.curr = 'right';
          updatePrevious('x');
          funcs.onSwipeRight(current, initial, props.onSwipeRight);
        } else if (current.y > previous.y) {
          direction.curr = 'down';
          updatePrevious('y');
          funcs.onSwipeDown(current, initial, props.onSwipeDown);
        } else if (current.y < previous.y) {
          direction.curr = 'up';
          updatePrevious('y');
          funcs.onSwipeUp(current, initial, props.onSwipeUp);
        }
      }
    },
    reset: function reset() {
      eventsTriggered = 0;
      init = false;
      curr = false;
      previous = { x: 0, y: 0 };
      reached = false;
    },
    updateEvery: updateEvery
  };
};

exports.default = defineSwipe;