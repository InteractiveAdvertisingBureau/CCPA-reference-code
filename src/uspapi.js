/**
 * IAB's Reference UspAPI reference implementation
 **/

// impart the UsprivacyString class
import UsprivacyString from './usprivacy-string';

// global vars
const API_VERSION = 1;
let pendingCalls = [];
let uspString = new UsprivacyString();

// helper functions
let getCookie = function(cookiename) {
  var name = cookiename + "=";
  var cookiearray = document.cookie.split(';');
  for (var i = 0; i < cookiearray.length; i++) {
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
  // run any pending calls if there are any queued pending callbacks
  if (pendingCallbacks.length) {
    pendingCallbacks.forEach(function(cmd) {
      try {
          if (cmd) {
            window.__usapi.apply(null, cmd);
          }
      } catch (nfe) {
          console.error('Error running pending call: ' + nfe);
      }
    });

  // Reset the queue (changing where the variable points to in memory)
    pendingCallbacks = [];
  }
};

let getuspdata = function(apiver, callback) {
  if (typeof callback === 'function') {
    if (
      apiver !== null &&
      apiver !== undefined &&
      apiver != API_VERSION
    ) {
      if (typeof callback === 'function') 
        callback(null, false);
      return;
    }

    // Get the data from the storage
    let str1 = null;
    if ((str1 = getCookie("us_privacy"))) {
        if (!uspString.setUsprivacyString(str1)) {
            console.log("Warning: uspString not set.");
        }
    } 

    // get the uspstring and stuff it into the uspdata object
    let str = uspString.getUsprivacyString();
    if (str) {
      callback(
        {
          version: uspString.getVersion(),
          uspString: str
        },
        true
      );
    } else {
      callback(
        {
          version: null,
          uspString: null
        },
        false
      );
    }
  } else {
    console.error("__uspapi: callback parameter not a function"); 
  }
};

/**
 * U.S. Privacy API implementation
 */
window.__uspapi = new function (win) {
  if (win.__uspapi) {
    try {
      // if the api was already loaded, then use it
      if (win.__uspapi('__uspapi')) {
        return win.__uspapi;
      } else {
        // Making a call to __uspapi with no arguments will return the pending calls;
        pendingCalls = win.__uspapi() || [];
      }
    } catch (nfe) {
      return win.__uspapi;
    }
  }

  let api = function (cmd) {
    try {
        return {
        getUSPData: getuspdata,
        __uspapi: function () {
          return true;
        }
      } [cmd].apply(null, [].slice.call(arguments, 1));
    }
    catch (err) {
      console.error("Invalid command: ", cmd)
    }
  };

  return api;
} (window);

// executePendingCalls(pendingCalls);