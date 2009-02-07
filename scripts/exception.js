/**
 * Class that represents an exception.
 *
 * This is the base Exception class.
 */
function Exception(str) {
  this.str = str;
}

Exception.prototype.toString = function() {
  return this.str;
};
