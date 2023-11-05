/**
 * My homebrewed 2D Vector class
 * */

  // Determinant of a 3x3 matrix
  const det = (t00, t01, t02, t10, t11, t12, t20, t21, t22) =>
    t00 * (t11 * t22 - t12 * t21) +
    t01 * (t12 * t20 - t10 * t22) +
    t02 * (t10 * t21 - t11 * t20);

export default class Vector {
  constructor(x = 0, y = 0) {
    [this.x, this.y] = [x, y];
  }

  array() {
    return [this.x, this.y];
  }

  clone() {
    // A copy of this vector
    return new Vector(this.x, this.y);
  }

  mag() {
    // Magnitude (length)
    return Math.sqrt(this.dot(this));
  }

  set(other) {
    // Set from another vector
    [this.x, this.y] = [other.x, other.y];
  }

  add(v) {
    // Vector sum
    return new Vector(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    // Vector subtraction
    return new Vector(this.x - v.x, this.y - v.y);
  }

  dist(q) {
    // Distance to point
    return this.sub(q).mag();
  }

  dot(q) {
    // Dot product
    return this.x * q.x + this.y * q.y;
  }

  angle(v) {
    // Returns the angle between this vector and v
    return Math.acos(
      Math.min(Math.max(this.dot(v) / this.mag() / v.mag(), -1), 1)
    );
  }

  signedAngle(v) {
    // Returns the _signed_ angle between this vector and v
    // so that a rotation of this by angle makes it colinear with v
    const a = this.angle(v);
    if (new Vector(0, 0).orient(this, v) > 0) return -a;
    return a;
  }

  scale(alpha) {
    // Multiplication by scalar
    return new Vector(this.x * alpha, this.y * alpha);
  }

  rotate(angle) {
    // Returns this vector rotated by angle radians
    const [c, s] = [Math.cos(angle), Math.sin(angle)];
    return new Vector(c * this.x - s * this.y, s * this.x + c * this.y);
  }

  mix(q, alpha) {
    // this vector * (1-alpha) + q * alpha
    return new Vector(
      this.x * (1 - alpha) + q.x * alpha,
      this.y * (1 - alpha) + q.y * alpha
    );
  }

  normalize() {
    // this vector normalized
    return this.scale(1 / this.mag());
  }

  distSegment(p, q) {
    // Distance to line segment
    const s = p.dist(q);
    if (s < 0.00001) return this.dist(p);
    const v = q.sub(p).scale(1.0 / s);
    const u = this.sub(p);
    const d = u.dot(v);
    if (d < 0) return this.dist(p);
    if (d > s) return this.dist(q);
    return p.mix(q, d / s).dist(this);
  }

  orient(p, q) {
    // Returns the orientation of triangle (this,p,q)
    return Math.sign(det(1, 1, 1, this.x, p.x, q.x, this.y, p.y, q.y));
  }
}
