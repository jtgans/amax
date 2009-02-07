function Cursor(div, width, height) {
  this.editorDiv = div;

  this.cursorDiv = document.createElement('div');

  this.width = width;
  this.height = height;
  this.row = 0;
  this.col = 0;
  this.color = "#ffff00";
  this.opacity = 0.5;
  this.blinkRate = 500;

  this.initialize();
}

Cursor.prototype.blinkCursor = function() {
  if (this.cursorDiv.style.display != "none") {
    this.cursorDiv.style.display = "none";
  } else {
    this.cursorDiv.style.display = "block";
  }
};

Cursor.prototype.initialize = function() {
  var this_ = this;
  var timeoutFunc = function() {
    this_.blinkCursor();
  };

  setInterval(timeoutFunc, this.blinkRate);
};

Cursor.prototype.updateCursor = function() {
  this.cursorDiv.style.position = "absolute";
  this.cursorDiv.style.opacity = this.opacity;
  this.cursorDiv.style.backgroundColor = this.color;
  this.cursorDiv.style.padding = "0px";
  this.cursorDiv.style.margin = "0px";
  this.cursorDiv.style.width = this.width.toString() + "px";
  this.cursorDiv.style.height = this.height.toString() + "px";
  this.cursorDiv.style.display = "block";

  var parentleft = 0;
  var parenttop  = 0;
  var curelement = this.editorDiv;

  do {
    parentleft += curelement.offsetLeft;
    parenttop  += curelement.offsetTop;
    curelement = curelement.offsetParent;
  } while (curelement);

  var cursorleft = (this.col * this.width) + parentleft;
  var cursortop  = (this.row * this.height) + parenttop;

  this.cursorDiv.style.top = cursortop;
  this.cursorDiv.style.left = cursorleft;

  this.editorDiv.appendChild(this.cursorDiv);
};
