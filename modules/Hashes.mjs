class Hashes {
  constructor() {
    this.map = new Map();
  }

  add(len, hash) {
    let set = this.map.get(len);
    if (!set) {
      set = new Set();
      this.map.set(len, set);
    }

    if (set.has(hash)) {
      return false;
    }

    set.add(hash);
    return true;
  }

  has(len, hash) {
    let set = this.map.get(len);
    if (!set)
      return false;

    return set.has(hash);
  }

  size() {
    let count = 0;
    for (const set of this.map.values()) {
      count += set.size;
    }
    return count;
  }

  clear() {
    this.map.clear();
  }
}

export {Hashes};