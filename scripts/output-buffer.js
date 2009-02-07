function OutputBuffer(div) {
  this.div = div;

  this.cellWidth = 0;
  this.cellHeight = 0;
  this.numCols = 0;
  this.numRows = 0;

  this.output = [];
  this.emptyLine = "";

  this.getCellSize();
  this.cursor = new Cursor(this.div, this.cellWidth, this.cellHeight);
  this.updateSize();
}

OutputBuffer.prototype.removeAllNodes = function() {
  while (this.div.hasChildNodes()) {
    this.div.removeChild(this.div.firstChild);
  }
};

OutputBuffer.prototype.getCellSize = function() {
  this.removeAllNodes();
  this.div.style.padding = "0px";
  this.div.style.margin = "0px";
  this.div.style.width = "auto";
  this.div.style.height = "auto";
  this.div.style.display = "inline";
  this.div.style.border = "none";

  var text = document.createTextNode("w");
  this.div.appendChild(text);
  this.cellWidth = this.div.offsetWidth;
  this.cellHeight = this.div.offsetHeight;

  this.div.style.width = "100%";
  this.div.style.height = "100%";
  this.div.style.display = "block";
  this.removeAllNodes();
};

OutputBuffer.prototype.clearOutput = function() {
  this.output = Array(this.numRows);
  this.emptyLine = new String();

  for (var col = 0; col < this.numCols; col++) {
    this.emptyLine += " ";
  }

  for (var row = 0; row < this.numRows; row++) {
    this.output[row] = this.emptyLine;
  }

  this.cursor.row = 0;
  this.cursor.col = 0;
};

OutputBuffer.prototype.updateSize = function() {
  this.numRows = Math.floor(this.div.offsetHeight / this.cellHeight);
  this.numCols = Math.floor(this.div.offsetWidth / this.cellWidth);

  this.div.style.height = (this.cellHeight * this.numRows).toString();
  this.div.style.width = (this.cellWidth * this.numCols).toString();

  this.clearOutput();
};

OutputBuffer.prototype.update = function() {
  this.removeAllNodes();

  for (var i in this.output) {
    var line = this.output[i];

    this.div.appendChild(document.createTextNode(line));
    this.div.appendChild(document.createElement('br'));
  }

  this.cursor.updateCursor();
};

OutputBuffer.prototype.scrollUp = function() {
  this.output = this.output.slice(1);
  this.output.push(this.emptyLine);
};

OutputBuffer.prototype.moveCursor = function(dir, count) {
  if (!count) count = 1;

  switch (dir) {
  case "up":
    this.cursor.row -= count;
    break;

  case "down":
    this.cursor.row += count;
    break;

  case "left":
    this.cursor.col -= count;
    break;

  case "right":
    this.cursor.col += count;
    break;
  }

  if (this.cursor.col > this.numCols) {
    while (this.cursor.col > this.numCols) {
      this.cursor.col = this.cursor.col - this.numCols;
      this.cursor.row++;
    }
  } else if (this.cursor.col < 0) {
    while (this.cursor.col < 0) {
      this.cursor.col = this.numCols + this.cursor.col;
      this.cursor.row--;
    }
  }

  if (this.cursor.row > this.numRows) {
    this.scrollUp(this.cursor.row - this.numRows);
    this.cursor.row = this.numRows;
  } else if (this.cursor.row < 0) {
    this.cursor.row = 0;
  }
};

OutputBuffer.prototype.putStringAt = function(row, col, str) {
  var oldstr = this.output[row];
  var newstr = "";

  newstr  = oldstr.substr(0, col);
  newstr += str;
  newstr += oldstr.substr(col + str.length);

  if (newstr.length > this.numCols) {
    newstr = newstr.substr(0, this.numCols);
  }

  this.output[row] = newstr;
};

OutputBuffer.prototype.write = function(str) {
  this.putStringAt(this.cursor.row, this.cursor.col, str);
  this.moveCursor("right", str.length);
}

OutputBuffer.prototype.writeLine = function(str) {
  this.write(str);
  this.moveCursor("down");
  this.cursor.col = 0;
};
