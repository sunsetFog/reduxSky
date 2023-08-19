export const Events = (() => {
  const list = {};

  const listens = (key, fn) => {
    list[key] = list[key] || [];
    list[key].push(fn);
  };
  const triggers = function (...agrs) {
    let key = Array.prototype.shift.call(agrs),
      fns = list[key];
    if (!fns || fns.length === 0) {
      return false;
    }
    for (let i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, agrs);
    }
  };
  const removes = function (key, fn) {
    let fns = list[key];
    if (!fns) {
      return false;
    }
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (let i = fns.length - 1; i >= 0; i--) {
        let _fn = fns[i];
        if (_fn === fn) {
          fns.splice(i, 1);
        }
      }
    }
  };
  return {
    listen: listens,
    trigger: triggers,
    remove: removes,
  };
})();
