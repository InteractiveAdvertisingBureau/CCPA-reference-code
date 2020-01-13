/**
 * IAB's Reference UspAPI reference implementation
 **/

// import the UsprivacyString class
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

// function to dynamically add the "__uspapiLocator" frame to the window
let addFrame = function() {
  // if the frame does not already exist
  if (!window.frames['__uspapiLocator']) {
    // in case this is running in the <head>, make sure <body> exists
    // (can't/shouldn't add a frame to the <head>
    if (document.body) {
      // create iframe and append it to <body>
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'display:none';
      iframe.name = '__uspapiLocator';
      document.body.appendChild(iframe);
    } else {
      /**
       * Wait for the body tag to exist.
       *
       * Since this API "stub" is located in the <head>,
       * setTimeout allows us to inject the iframe more
       * quickly than relying on DOMContentLoaded or
       * other events.
       */
      setTimeout(addFrame, 5);
    }
  }
}

// add the "__uspapiLocator" frame to the window
addFrame();

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
    if ((str1 = getCookie("usprivacy"))) {
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
      console.error("__uspapi: Invalid command: ", cmd)
    }
  };

  return api;
} (window);

// register postMessage handler
function __handleUspapiMessage (event) {
  const data = event && event.data && event.data.__uspapiCall;
  if (data) {
    window.__uspapi(data.command, data.version, (returnValue, success) => {
      event.source.postMessage({
        __uspapiReturn: {
          returnValue,
          success,
          callId: data.callId
        }
      }, '*');
    });
  }
}

window.addEventListener('message', __handleUspapiMessage, false);
