/**
 * usprivacy-string.js
 * 
 * Implements class UsprivacyString
 * 
 * The class contains the methods to get/set the usprivacy string 
 * and a method to get the current version.
 * 
 * The usprivacy string as the format: ”vnol” where 
 *  v = version
 *  n = Notice Given
 *  o = OptedOut
 *  l = lspact (Limited Service Provider Agreement Covered Transaction)
 * Example: “1YY1” Version 1, Notice given, Opted out, LSAPCT in place.
 * Default is null.
 * 
 **/
const validStringRegExp = /^[1][nNyY-][nNyY-][nNyY-]$/;

class UsprivacyString {
  constructor() {
    this.version = 1;
    this.noticegiven = '-';
    this.optedout = '-';
    this.lspact = '-';      // Limited Service Provider Agreement Covered Transaction (LSPACT)
    this.baseString = null; // default is null
  }
  
  // getUsprivacyString()
  // return the usprivacy string or null if an error occurs
  getUsprivacyString() {
    return this.baseString;
  }
  
  // setUsprivacyString(newstr)
  // checks for validity of the string before setting internals
  // returns true if success otherwise false
  setUsprivacyString(newstr) {
    let didSet = false;
    if(validStringRegExp.test(newstr)) {
      this.version = parseInt(newstr[0], 10);
      this.noticegiven = newstr[1];
      this.optedout = newstr[2];
      this.lspact = newstr[3];
      this.baseString = newstr;
      didSet = true;
    }
    return didSet;
  }

  // getVerion()
  // returns the version number
  getVersion () { 
      return this.version;
  }
}

export default UsprivacyString;