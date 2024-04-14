const areSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));
const randColor = () => {
  return (Math.random() * 0xFFFFFF << 0);
  // let s = '0x' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
  // return Number.parseInt(s);
};
const out = (val) => {
  console.log(val);
}

export {areSetsEqual, randColor, out};