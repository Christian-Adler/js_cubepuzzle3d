class Vec {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new Vec(this.x, this.y, this.z);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  addToNew(other) {
    return this.clone().add(other);
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  subToNew(other) {
    return this.clone().sub(other);
  }

  mult(val) {
    this.x *= val;
    this.y *= val;
    this.z *= val;
    return this;
  }

  multToNew(val) {
    return this.clone().mult(val);
  }

  containedIn(min, max) {
    return this.x >= min && this.x <= max
      && this.y >= min && this.y <= max
      && this.z >= min && this.z <= max;
  }

  isCorner(min, max) {
    return (this.x === min || this.x === max)
      && (this.y === min || this.y === max)
      && (this.z === min || this.z === max);
  }

  isOnEdge(min, max) {
    return ((this.x === min || this.x === max) && (this.y === min || this.y === max)) ||
      ((this.x === min || this.x === max) && (this.z === min || this.z === max)) ||
      ((this.z === min || this.z === max) && (this.y === min || this.y === max));
  }

  invert() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  }

  envelope() {
    const env = [];
    env.push(this.addToNew(Vec.normX()));
    env.push(this.addToNew(Vec.normX().invert()));
    env.push(this.addToNew(Vec.normY()));
    env.push(this.addToNew(Vec.normY().invert()));
    env.push(this.addToNew(Vec.normZ()));
    env.push(this.addToNew(Vec.normZ().invert()));
    return env;
  }

  length() {
    return this.x + this.y + this.z;
  }

  compareTo(other) {
    // let compareVal = this.length() - other.length();
    // if (compareVal !== 0)
    //   return compareVal;

    let compareVal = 0;

    if (compareVal === 0)
      compareVal = this.y - other.y;
    if (compareVal === 0)
      compareVal = this.z - other.z;
    if (compareVal === 0)
      compareVal = this.x - other.x;

    return compareVal;
  }

  toString() {
    return `[${this.x},${this.y},${this.z}]`;
  }

  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }

  static fromObject(obj) {
    return Vec.of(obj.x, obj.y, obj.z);
  }

  hash() {
    // possible, because we only have 5 in each dimension
    return `${this.x}${this.y}${this.z}`;
  }

  static of(x, y, z) {
    return new Vec(x, y, z);
  }

  static nullVec() {
    return Vec.of(0, 0, 0);
  }

  static normX() {
    return Vec.of(1, 0, 0);
  }

  static normY() {
    return Vec.of(0, 1, 0);
  }

  static normZ() {
    return Vec.of(0, 0, 1);
  }
}

export { Vec };