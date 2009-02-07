function Buffer() {
  this.size = 0;
  this.point = 0;
  this.mark = 0;
  this.filename = Amax.sourceURL;
  this.contents = "";
}
