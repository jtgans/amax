function File(pathname) {
  this.pathname = pathname;
  this.pos = 0;
}

File.prototype.read = function(maxlen) {
  throw new MethodNotImplementedError();
}

File.prototype.write = function(data) {
  throw new MethodNotImplementedError();
}

File.registerProtocolHandler = function(protocol, class_) {
  this._registeredProtocols[protocol] = class_;
}
