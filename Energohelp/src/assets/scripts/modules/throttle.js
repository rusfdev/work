export default function(func, interval, context) {
  let isCooldown = false;

  return function() {
    if (isCooldown) return;
    func.apply(context || this, arguments);
    isCooldown = true;
    setTimeout(() => isCooldown = false, interval);
  };
}