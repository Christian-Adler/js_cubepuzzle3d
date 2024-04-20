function pad(numberString, size) {
  let padded = numberString;
  while (padded.length < size) {
    padded = `0${padded}`;
  }
  return padded;
}

function msToHMS(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor((ms / 1000 / 3600) % 24);

  const humanized = [
    pad(hours.toString(), 2),
    pad(minutes.toString(), 2),
    pad(seconds.toString(), 2),
  ].join(':');

  return humanized;
}

const areSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

const randColor = () => {
  return (Math.random() * 0xFFFFFF << 0);
  // let s = '0x' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
  // return Number.parseInt(s);
};

const out = (val) => {
  console.log(val);
};

const txtOutDiv = document.getElementById('txtOut');
const txtOut = (val) => {
  txtOutDiv.innerText = val;
};

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

export { areSetsEqual, randColor, out, txtOut, shuffle, msToHMS };