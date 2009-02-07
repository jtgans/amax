function InvalidURLError(url) {
  this.str = "Invalid URL " + url;
}
extend(Exception, InvalidURLError);

function URL(str) {
  this.protocol = "";
  this.username = "";
  this.password = "";
  this.hostname = "";
  this.pathname = "";
  this.anchor   = "";
  this.args     = {};

  if (str) {
    this.parseString(str);
  }
}

URL.prototype.parseString = function(url) {
  /**
   * <proto>://<user>:<pass>@<hostname>:<port>/<path>/<filename>#<anchor>
   */
  var lastpos = 0;
  var pos = 0;
  var skip = false;

  /* Get the proto first */
  pos = url.indexOf("://");
  if (pos == -1) {
    throw new InvalidURLError(url);
  }
  this.protocol = url.substring(0, pos);

  /* Get the <user>:<pass>@hostname part */
  lastpos = pos + 3;
  pos = url.indexOf("/", lastpos);
  if (pos == -1) {
    this.hostname = url.substring(lastpos);
    skip = true;
  } else {
    this.hostname = url.substring(lastpos, pos);
  }

  /* Grab the pathname part */
  if (!skip) {
    lastpos = pos + 1;
    pos = url.indexOf("#", lastpos);
    if (pos == -1) {
      this.pathname = url.substring(lastpos);
      skip = true;
    } else {
      this.pathname = url.substring(lastpos, pos);
    }
  }

  /* Grab the anchor part */
  if (!skip) {
    lastpos = pos + 1;
    pos = url.indexOf("?", lastpos);
    if (pos == -1) {
      this.anchor = url.substring(lastpos);
      skip = true;
    } else {
      this.anchor = url.substring(lastpos, pos);
    }
  }

  /* Rip out <user>:<pass> from hostname */
  pos = url.indexOf("@", this.hostname);
  if (pos > -1) {
    this.username = this.hostname.substring(0, pos);
    this.hostname = this.hostname.substring(pos + 1);
  }

  /* Rip out <pass> from username */
  pos = url.indexOf(":", this.username);
  if (pos > -1) {
    this.password = this.username.substring(pos + 1);
    this.username = this.username.substring(0, pos);
  }
}

URL.prototype.toString = function() {
  var result = "";
  var query_args = [];

  result = this.protocol;
  result += "://";

  if (this.username.length > 0) {
    result += this.username;

    if (this.password.length > 0) {
      result += ":" + this.password;
    }

    result += "@";
  }

  result += this.hostname;
  result += this.pathname;

  if (this.anchor.length > 0) {
    result += "#" + this.anchor;
  }

  return result;
}

Amax.provideFeature("url");
