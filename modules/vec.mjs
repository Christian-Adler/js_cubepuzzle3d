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

  mult(val) {
    this.x *= val;
    this.y *= val;
    this.z *= val;
    return this
  }

  multToNew(val) {
    return this.clone().mult(val);
  }

  containedIn(min, max) {
    return this.x >= min && this.x <= max
        && this.y >= min && this.y <= max
        && this.z >= min && this.z <= max;
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

  compareTo(other) {
    if (this.x !== other.x)
      return this.x - other.x;
    if (this.y !== other.y)
      return this.y - other.y;
    if (this.z !== other.z)
      return this.z - other.z;
    return 0;
  }

  toString() {
    return `[${this.x},${this.y},${this.z}]`;
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

export {Vec};