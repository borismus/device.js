(function(exports) {

  var VERSION_KEY = 'device';
  var FORCE_KEY = 'force';
  var MQ_TOUCH = /\(\s*?touch-enabled\s*:\s*(.*?)\s*\)/;


 /**
  * Class responsible for deciding which version of the application to
  * load.
  */
  function VersionManager() {
    // Get a list of all versions.
    this.versions = this.getVersions();
  }

  /**
   * Parse all of the <link> elements in the <head>.
   */
  VersionManager.prototype.getVersions = function() {
    var versions = [];
    // Get all of the link rel alternate elements from the head.
    var links = document.querySelectorAll('head link[rel="alternate"]');
    // For each link element, get href, media and id.
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      var media = links[i].getAttribute('media');
      var id = links[i].getAttribute('id');
      versions.push(new Version(href, media, id));
    }
    // Return an array of Version objects.
    return versions;
  };

  /**
   * Device which version to load.
   */
  VersionManager.prototype.redirectIfNeeded = function() {
    // Check if we should do redirection at all.
    var force = this.getGETParam(FORCE_KEY);
    if (force) {
      return;
    }
    // Check if a version override has been specified.
    var override = this.getGETParam(VERSION_KEY);
    if (override) {
      version = this.findVersion(function() {
        return this.matchesOverride.call(this, override);
      });
      // If overriding, specify a force flag when we redirect.
      version.redirect({force: true});
    } else {
      version = this.findVersion(Version.prototype.matches);
      // Get the current version based on currently loaded URL.
      if (!version) {
        console.error('No matched device version.');
        return;
      }
      // Redirect if necessary.
      var loaded = this.findVersion(Version.prototype.matchesUrl);
      if (loaded != version) {
        version.redirect();
      }
    }
  };

  VersionManager.prototype.findVersion = function(criteria) {
    // Go through configured versions.
    for (var i = 0; i < this.versions.length; i++) {
      var v = this.versions[i];
      // Check if this version matches based on criteria.
      if (criteria.call(v)) {
        return v;
      }
    }
    return null;
  };

  /**
   * Gets the value of the GET parameter with specified key. Returns null if no
   * such parameter.
   */
  VersionManager.prototype.getGETParam = function(name) {
    // Mostly from http://goo.gl/r0CH5:
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results) {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    return null;
  };


  function Version(href, mediaQuery, id) {
    this.mediaQuery = mediaQuery;
    this.url = href;
    this.id = id;
  }

  /**
   * Check if this version matches the current one.
   */
  Version.prototype.matches = function() {
    // Apply a polyfill for the touch-enabled media query (not currently
    // standardized, only implemented in Firefox: http://goo.gl/LrmIa)
    var mqParser = new MQParser(this.mediaQuery);
    return mqParser.evaluate();
  };

  /**
   * Check if this version matches the specified URL
   */
  Version.prototype.matchesUrl = function() {
    var currUrl = window.location.href;
    var ABSOLUTE = /^https?:\/\/.*/;
    if (this.url.match(ABSOLUTE)) {
      // If absolute URL, do startswith match.
      return currUrl.indexOf(this.url) === 0;
    } else {
      // If relative URL, do endswith match.
      var diff = currUrl.length - this.url.length;
      return currUrl.indexOf(this.url, diff) !== -1;
    }
  };

  Version.prototype.matchesOverride = function(override) {
    return this.id == override;
  };

  /**
   * Redirect to the current version.
   */
  Version.prototype.redirect = function(options) {
    var url = this.url;
    
    if(window.location.hash != '') {
      url += window.location.hash;
    }

    if (options && options.force) {
      var delim = (url.indexOf('?') != -1 ? '&' : '?');
      var param = FORCE_KEY + '=1';
      url += delim + param;
    }
    window.location.href = url;
  };


  function MQParser(mq) {
    this.mq = mq;
    this.segments = [];
    this.standardSegments = [];
    this.specialSegments = [];

    this.parse();
  }

  MQParser.prototype.parse = function() {
    // Split the Media Query into segments separated by 'and'.
    this.segments = this.mq.split(/\s*and\s*/);
    // Look for segments that contain touch checks.
    for (var i = 0; i < this.segments.length; i++) {
      var seg = this.segments[i];
      // TODO: replace this check with something that checks generally for
      // unknown MQ properties.
      var match = seg.match(MQ_TOUCH);
      if (match) {
        this.specialSegments.push(seg);
      } else {
        // If there's no touch MQ, we're dealing with something standard.
        this.standardSegments.push(seg);
      }
    }
  };

  /**
   * Check if touch support matches the media query.
   */
  MQParser.prototype.evaluateTouch = function() {
    var out = true;
    for (var i = 0; i < this.specialSegments.length; i++) {
      var match = this.specialSegments[i].match(MQ_TOUCH);
      var touchValue = match[1];
      if (touchValue !== "0" && touchValue !== "1") {
        console.error('Invalid value for "touch-enabled" media query.');
      }
      var touchExpected = parseInt(touchValue, 10) === 1 ? true : false;
      out = out && (touchExpected == Modernizr.touch);
    }
    return out;
  };

  /**
   * Returns the valid media query (without touch stuff).
   */
  MQParser.prototype.getMediaQuery = function() {
    return this.standardSegments.join(' and ');
  };

  /**
   * Evaluates the media query with matchMedia.
   */
  MQParser.prototype.evaluate = function() {
    return Modernizr.mq(this.getMediaQuery()) &&
        this.evaluateTouch();

  };

  var vermgr = new VersionManager();
  vermgr.redirectIfNeeded();

})(window);
