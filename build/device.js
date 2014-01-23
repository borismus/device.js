/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-touch-mq-teststyles-prefixes
 */
;window.Modernizr=function(a,b,c){function w(a){i.cssText=a}function x(a,b){return w(l.join(a+";")+(b||""))}function y(a,b){return typeof a===b}function z(a,b){return!!~(""+a).indexOf(b)}function A(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:y(f,"function")?f.bind(d||b):f}return!1}var d="2.5.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m={},n={},o={},p=[],q=p.slice,r,s=function(a,c,d,e){var h,i,j,k=b.createElement("div"),l=b.body,m=l?l:b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),k.appendChild(j);return h=["&#173;","<style>",a,"</style>"].join(""),k.id=g,(l?k:m).innerHTML+=h,m.appendChild(k),l||(m.style.background="",f.appendChild(m)),i=c(k,a),l?k.parentNode.removeChild(k):m.parentNode.removeChild(m),!!i},t=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return s("@media "+b+" { #"+g+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},u={}.hasOwnProperty,v;!y(u,"undefined")&&!y(u.call,"undefined")?v=function(a,b){return u.call(a,b)}:v=function(a,b){return b in a&&y(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e});var B=function(c,d){var f=c.join(""),g=d.length;s(f,function(c,d){var f=b.styleSheets[b.styleSheets.length-1],h=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"",i=c.childNodes,j={};while(g--)j[i[g].id]=i[g];e.touch="ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch||(j.touch&&j.touch.offsetTop)===9},g,d)}([,["@media (",l.join("touch-enabled),("),g,")","{#touch{top:9px;position:absolute}}"].join("")],[,"touch"]);m.touch=function(){return e.touch};for(var C in m)v(m,C)&&(r=C.toLowerCase(),e[r]=m[C](),p.push((e[r]?"":"no-")+r));return w(""),h=j=null,e._version=d,e._prefixes=l,e.mq=t,e.testStyles=s,e}(this,this.document);
(function(exports) {

  var VERSION_KEY = 'device';
  var FORCE_KEY = 'force';
  var MQ_TOUCH = /\(touch-enabled: (.*?)\)/;


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
