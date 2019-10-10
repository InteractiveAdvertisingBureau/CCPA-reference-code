# CCPA-reference-code
PRIVATE workspace for CCPA publisher code dev

File usprivacy-string.js
    Implements class UsprivacyString

    The class contains the methods to get/set the usprivacy string 
    and a method to get the current version.
    
    The usprivacy string as the format: ”vno” where 
    v = version
    n = Notice Given
    o = OptedOut
    
    Example: “1YY” Version 1, Notice given, Opted out.
    
    Default is "1--".

File uspapi.js 
    Implements the IAB tech lab U.S. Privacy API reference implementation

    __uspapi("getuspdata", version, callback)

    getuspdata will return the uspdata object { version, uspstring }
    version supported (needs to be set to 1 for v1)
    callback function returns uspdata object and success, success is either true of false.

index.html
    Simple reference implementation using U.S. Privacy API

README.md
    This document

Build notes:
To build you need NPM. 
Run npm install to install npm. 

Run npm build:dev to build dev 
Run npm start to build dev and start the web browser, loading the index.html.

Currently only tested within dev and on Chrome.