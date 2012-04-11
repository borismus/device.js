(function(exports) {

 /**
  * Class responsible for deciding which version of the application to
  * load.
  */
  function VersionManager() {
    this.VERSION_KEY = 'device';

    // Get a list of all versions.
    this.versions = this.getVersions();
  }

  /**
   * Parse all of the <link> elements in the <head>.
   */
  VersionManager.prototype.getVersions = function() {
    var versions = [];
    // Get all of the link rel alternate elements from the head.
    var links = document.querySelectorAll('head link');
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
   * Check if there's a version override specified in the GET params.
   */
  VersionManager.prototype.parseVersionOverride = function() {
    // Parse the GET parameters.
    // If there's one with the right key, get it out.
  };

  /**
   * Device which version to load.
   */
  VersionManager.prototype.redirectIfNeeded = function() {
    // Check if a version override has been specified.
    var override = this.parseVersionOverride();
    var version = null;
    for (var i = 0; i < this.versions.length; i++) {
      var v = this.versions[i];
      if ((override && v.id == override) || v.matches()) {
        version = v;
        break;
      }
    }
    // Get the current version based on currently loaded URL.
    if (!version) {
      console.error('No matched device version.');
      return;
    }
    // Redirect if necessary.
    var loaded = this.loadedVersion();
    if (loaded != version) {
      version.redirect();
    }
  };

  /**
   * Gets the currently loaded version.
   */
  VersionManager.prototype.loadedVersion = function() {
    // Go through configured versions.
    for (var i = 0; i < this.versions.length; i++) {
      var v = this.versions[i];
      // Check if current URL matches one of the existing versions.
      if (v.matchesUrl()) {
        return v;
      }
    }
    return null;
  };

  /**
   * Gets the value of the GET parameter with specified key. Returns null if no
   * such parameter.
   */
  VersionManager.prototype.getParam = function(key) {
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

  /**
   * Redirect to the current version.
   */
  Version.prototype.redirect = function() {
    window.location.href = this.url;
    //console.log('redirecting to', this.url);
    //document.body.innerHTML += 'redirecting to: ' + this.url;
  };


  function URLParser(url) {
    this.url = url;
  }

  URLParser.isAbsolute = function() {
    return this.url.match(this.ABSOLUTE);
  };

  function MQParser(mq) {
    this.MQ_TOUCH = /\(touch-enabled: (.*?)\)/;

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
      var match = seg.match(this.MQ_TOUCH);
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
      var match = this.specialSegments[i].match(this.MQ_TOUCH);
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
    return window.matchMedia(this.getMediaQuery()).matches &&
        this.evaluateTouch();

  };

  var vermgr = new VersionManager();
  vermgr.redirectIfNeeded();

})(window);
