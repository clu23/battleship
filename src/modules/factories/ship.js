class Ship {
  constructor(size, name) {
    this.size = size;
    this.name = name;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits += 1;
    if (this.hits === this.size) {
      this.sunk = true;
    }
  }

  isSunk() {
    return this.sunk;
  }

  getName() {
    return this.name;
  }

  getSize() {
    return this.size;
  }
}

export default Ship;
