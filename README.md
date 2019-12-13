# CCPA-reference-code
Public workspace for CCPA publisher code dev

File usprivacy-string.js
    Implements class UsprivacyString

    The class contains the methods to get/set the usprivacy string 
    and a method to get the current version.
    
    The usprivacy string as the format: ”vnol” where
    v = version (int)
    n = Notice Given (char)
    o = OptedOut (char)
    l = Lspact (char)
    
    Example: “1YYY” Version 1, Notice given, Opted out, under Lspact.
    
    Default is null.

File uspapi.js
    Implements the IAB tech lab U.S. Privacy API reference implementation

    __uspapi("getuspdata", version, callback)

    getuspdata will return the uspdata object { version, uspstring }
    version supported (needs to be set to 1 for v1)
    callback function returns uspdata object and success, success is either true of false.

index.html
    Simple reference implementation using U.S. Privacy API
    Set param lspact=0 to set yourself as a none signatory
    Note: this sample sets the cookie as a first party and secure. You will need HTTPS to get this to work. For debugging you can set the URL param debug=1 to make it work on HTTP, like http://localhost.

index.html
    Simple HTML to test all the API return calls

README.md
    This document

Build notes:
To build you need NPM. 
Run npm install to install npm. 

Run npm run build:dev to build dev 
Run npm start to build dev and start the web browser, loading the index.html.

Currently only tested within dev and on Chrome.
