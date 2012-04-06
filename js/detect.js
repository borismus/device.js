(function(exports) {
  var VERSION_KEY = 'device';

 /**
  * Class responsible for deciding which version of the application to
  * load.
  */
  function VersionManager() {
  }

  /**
   * Parse all of the <link> elements in the <head>.
   */
  VersionManager.prototype.getVersions = function() {
    // Get all of the link rel alternate elements from the head.
    // For each link element, get href, media and id.
    // Return an array of Version objects.
  };

  /**
   * Check if there's a version override specified in the GET params.
   */
  VersionManager.prototype.parseVersionOverride = function() {
    // Parse the GET parameters.
    // If there's one with the right key, get it out.
  };

  /**
   * Redirect to the appropriate version.
   */
  VersionManager.prototype.redirect = function(url) {
  };

  /**
   * Device which version to load.
   */
  VersionManager.prototype.decideVersion = function() {
    // Get a list of all versions.
    // Check if a version override has been specified.
    // If so, look it up.
    // Otherwise, find a version that matches.
    // Redirect if necessary.
  };


  function Version() {
    this.mediaQuery = null;
    this.url = null;
    this.id = null;
  }

  /**
   * Check if this version matches the current one.
   */
  Version.prototype.matchVersion = function() {
    // Apply a polyfill for the touch-enabled media query (not currently
    // standardized, only implemented in Mozilla: http://goo.gl/LrmIa)
  };


})(window);
