/* Bootstrap the editor by loading in the core modules */
var __bootstraps = [
  "extend.js",
  "exception.js",
  "cursor.js",
  "output-buffer.js"

  // "url.js",
  // "file.js",
  // "buffer.js",
  // "message.js",
  // "keymap.js",
  // "window.js",
  // "docstring.js"
];

var __conn = null;
var __bootstrap_code = [];
var __bootstrapped = true;

try {
  __conn = new XMLHttpRequest();
} catch (exc) {
  __conn = new ActiveXObject("Microsoft.XMLHTTP");
}

for (var key in __bootstraps) {
  var file = __bootstraps[key];

  __conn.open("GET", "scripts/" + file, false);
  __conn.send(null);

  if (__conn.status != 200) {
    __bootstrapped = false;

    alert("Unable to bootstrap Amax. " +
          file + " failed to load: " +
          __conn.status);
  } else {
    try {
      __bootstrap_code.push(__conn.responseText);
    } catch (exc) {
      __bootstrapped = false;
      alert("Unable to bootstrap Amax. " +
            file + " failed to eval: " +
            exc);
    }
  }
}

eval(__bootstrap_code.join(' '));

/**
 * Class that represents the Amax editor.
 *
 * This class provides the core methods for controlling the editor, as well as
 * providing most of the core infrastructure methods. The Amax global variable
 * is always available at any time.
 */
function AmaxEditor() {
  this.editorDiv = null;
  this.bodyElement = null;
  this.sourceURL = null;

  this._hooks = {};
  this._loadedFeatures = [];

  this.initialize();
}

/**
 * Load a module from the server.
 *
 * Loads in and evaluates the specified file from the 'net. Uses the underlying
 * File architecture to find and load the path given.
 *
 * @var path URL a string URL to the module to be loaded.
 * @returns True on success, or false on error.
 */
AmaxEditor.prototype.loadModule = function(path) {
  var file = File(path);
  var code = file.readAll();

  eval(code);
};

/**
 * Tell the rest of the Amax system that we have a feature loaded.
 */
AmaxEditor.prototype.provideFeature = function(feature) {
  this._features.append(feature);
};

/**
 * Check to see if a feature was loaded.
 */
AmaxEditor.prototype.hasFeature = function(feature) {
  return (feature in this._features);
};

AmaxEditor.prototype.addHook = function(hookname, func) {
  if (this._hooks[hookname]) {
    this._hooks[hookname].append(func);
  } else {
    this._hooks[hookname] = [func];
  }
};

AmaxEditor.prototype.removeHook = function(hookname, func) {
  if (this._hooks[hookname]) {
    this._hooks[hookname].remove(func);
  }
};

AmaxEditor.prototype.runHooks = function() {
  var hookname = arguments[0];
  var args;

  if (arguments.length) {
    args = [];
    for (var i in arguments) {
      args.append(arguments[i]);
    }
  } else {
    args = null;
  }

  if (this._hooks[hookname]) {
    for (var key in this._hooks) {
      var hook = this._hooks[key];
      hook.call(args);
    }
  }
};

/**
 * Initialize Amax for the first time.
 *
 * Finds the core bits of the base HTML layout, and additionally bootstraps the
 * editor by loading in additional core scripts.
 */
AmaxEditor.prototype.initialize = function() {
  this.editorDiv = document.getElementById("amax");
  this.bodyElement = document.getElementsByTagName("body");
  this.sourceURL = location.href;
  this.sourceURL.replace(/\/.*$/, "");

  if (!this.editorDiv) {
    alert("Unable to locate Amax div. Aborting load.");
    return;
  }

  if (!this.bodyElement) {
    slert("Unable to locate body element. Aborting load.");
    return;
  } else {
    this.bodyElement = this.bodyElement[0];
  }

  /* Setup our initial style for the amacs div */
  this.editorDiv.style.fontFamily = "monospace";
  this.editorDiv.style.whiteSpace = "pre";

  /* Initialize our screen */
  this.screen = new OutputBuffer(this.editorDiv);

  // this.addHook("window_size_changed", function() { this.updateWindowSize(); });
  // window.addEventListener("resize",
  //                         function(event) {
  //                           this.runHooks("window_size_changed");
  //                         },
  //                         false);
};

var Amax = null;

if (__bootstrapped) {
  /* Setup our globals */
  Amax = new AmaxEditor();
  Amax.screen.update();

  window.addEventListener("keydown", function(evt) {
                            var lowers = "abcdefghijklmnopqrstuvwxyz";
                            var uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                            var nums   = "0123456789";
                            var symbs  = ")!@#$%^&*(";

                            if ((evt.keyCode >= 65) && (evt.keyCode <= 90)) {
                              if (evt.shiftKey) {
                                Amax.screen.write(uppers[evt.keyCode - 65]);
                              } else {
                                Amax.screen.write(lowers[evt.keyCode - 65]);
                              }

                              Amax.screen.update();
                              return;
                            }

                            if ((evt.keyCode >= 48) && (evt.keyCode <= 57)) {
                              if (evt.shiftKey) {
                                Amax.screen.write(symbs[evt.keyCode - 48]);
                              } else {
                                Amax.screen.write(nums[evt.keyCode - 48]);
                              }
                              Amax.screen.update();
                              return;
                            }

                            switch (evt.keyCode) {
                            case 32: /* space */
                              Amax.screen.write(" ");
                              break;
                            case 13: /* return */
                              Amax.screen.writeLine("");
                              break;
                            case 8: /* backspace */
                              Amax.screen.moveCursor("left");
                              Amax.screen.write(" ");
                              Amax.screen.moveCursor("left");
                              break;
                            default:
                            //alert(evt.keyCode);
                            }

                            Amax.screen.update();
                            Amax.screen.cursor.updateCursor();
                          }, false);
}
