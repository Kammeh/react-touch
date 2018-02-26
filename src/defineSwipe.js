const DEFAULT_SWIPE_DISTANCE = 100;
const DEFAULT_UPDATE_EVERY = 0;
let eventsTriggered = 0;
let previous = {x: 0, y: 0};
let direction = {curr: false, prev: false};
let curr = false;
let init = false;
let reached = false;

const defineSwipe = (config={}) => {
  // TODO: add swipe velocity back in
  const swipeDistance = config.swipeDistance || DEFAULT_SWIPE_DISTANCE;
  const updateEvery = config.updateEvery || DEFAULT_UPDATE_EVERY;

  const funcs = {
    onSwipeLeft: (current, initial, callback) => {
      if(updateEvery > 0) {
        if (-(curr.x - init.x) / updateEvery > eventsTriggered) {
          eventsTriggered++;
          callback();
        }
      } else if (-(curr.x - init.x) >= swipeDistance) {
        reached = true;
        callback();
      }
    },
    onSwipeRight: (current, initial, callback) => {
      if(updateEvery > 0) {
        if ((curr.x - init.x) / updateEvery > eventsTriggered) {
          eventsTriggered++;
          callback();
        }
      } else if ((curr.x - init.x) >= swipeDistance) {
        reached = true;
        callback();
      }
    },
    onSwipeUp: (current, initial, callback) => {
      if(updateEvery > 0) {
        if (-(curr.y - init.y) / updateEvery > eventsTriggered) {
          eventsTriggered++;
          callback();
        }
      } else if (-(curr.y - init.y) >= swipeDistance) {
        reached = true;
        callback();
      }
    },
    onSwipeDown: (current, initial, callback) => {
      if(updateEvery > 0) {
        if ((curr.y - init.y) / updateEvery > eventsTriggered) {
          eventsTriggered++;
          callback();
        }
      } else if ((curr.y - init.y) >= swipeDistance) {
        reached = true;
        callback();
      }
    }
  }

  const updatePrevious = (axis) => {
    if(Math.abs(curr[axis] - previous[axis]) > 10) {
      previous = curr
    }
    if(updateEvery > 0) {
      if(direction.curr != direction.prev) {
        direction.prev = direction.curr;
        init = curr;
        eventsTriggered = 0;
      }
    }
  }

  return {
    determineSwipe: (current, initial, props, callback) => {
      if(!reached) {
        curr = current;
        if(!init) {
          init = initial;
        }
        if(current.x < previous.x) {
          direction.curr = 'left';
          updatePrevious('x');
          funcs.onSwipeLeft(current, initial, props.onSwipeLeft);
        } else if(current.x > previous.x) {
          direction.curr = 'right';
          updatePrevious('x');
          funcs.onSwipeRight(current, initial, props.onSwipeRight);
        } else if(current.y > previous.y) {
          direction.curr = 'down';
          updatePrevious('y');
          funcs.onSwipeDown(current, initial, props.onSwipeDown);
        } else if(current.y < previous.y) {
          direction.curr = 'up';
          updatePrevious('y');
          funcs.onSwipeUp(current, initial, props.onSwipeUp);
        }
      }
    },
    reset: () => {
      eventsTriggered = 0;
      init = false;
      curr = false;
      previous = {x: 0, y: 0};
      reached = false;
    },
    updateEvery: updateEvery
  };
};

export default defineSwipe;
