/**
 * IAB's Reference UspAPI reference implementation
 **/

// impart the UsprivacyString class
import UsprivacyString from './usprivacy-string';

// global vars
const API_VERSION = 1;
var pendingCalls = [];
var uspString = new UsprivacyString();

// helper functions
function getCookie(cookiename) {
  var name = cookiename + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookiearray = decodedCookie.split(';');
  for(var i = 0; i < cookiearray.length; i++) {
    var cookie = cookiearray[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
};

const executePendingCalls = function(pendingCallbacks) {
  // run any pending calls
  while (pendingCallbacks.length > 0) {
    try {
      var cmd = pendingCallbacks.shift();
      if (!cmd) {
        continue;
      }
      window.__uspapi.apply(null, cmd);
    } catch (nfe) {
      logError('Error running pending call', nfe);
    }
  }
};

var getuspdata = function(apiver, callback) {
  if (
    apiver !== null &&
    apiver !== undefined &&
    apiver != API_VERSION
  ) {
    if (typeof callback === 'function') callback(null, false);
    return;
  }

  // Get the data from the storage
  var str1 = null;
  if (str1 = getCookie("us_privacy")) {
      if (!uspString.setUsprivacyString(str1)) {
        console.log("Warning: uspString not set.");
      }
  } 

  // get the uspstring and stuff it into the uspdata object
  var str = null;
  if (str = uspString.getUsprivacyString()) {
    if (typeof callback === 'function') {
          callback(
            {
              version: uspString.getVersion(),
              uspString: str
            },
            true
          );
        }
  } else {
      if (typeof callback === 'function') {
        callback(
          {
            version: null,
            uspString: null
          },
          false
        );
      }
  }
};

/**
 * U.S. Privacy API implementation
 */
var pendingCalls = [];

window.__uspapi = new function (win) {
  if (win.__uspapi) {
    try {
      // if the api was already loaded, then use it
      if (win.__uspapi('__uspapi')) {
        return win.__uspapi;
      } else {
        // Making a call to __uspapi with no arguments will return the pending calls;
        pendingCalls = __uspapi() || [];
      }
    } catch (nfe) {
      return win.__uspapi;
    }
  }

  var api = function (cmd) {
    return {
      getuspdata: getuspdata,
      __uspapi: function () {
        return true;
      }
    }[cmd].apply(null, [].slice.call(arguments, 1));
  };

  return api;
}(window);

executePendingCalls(pendingCalls);