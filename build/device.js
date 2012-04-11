/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */

window.matchMedia = window.matchMedia || (function(doc, undefined){

  var bool,
      docElem  = doc.documentElement,
      refNode  = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement('body'),
      div      = doc.createElement('div');

  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  return function(q){

    div.innerHTML = '&shy;<style media="'+q+'"> #mq-test-1 { width: 42px; }</style>';

    docElem.insertBefore(fakeBody, refNode);
    bool = div.offsetWidth == 42;
    docElem.removeChild(fakeBody);

    return { matches: bool, media: q };
  };

})(document);



/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-touch-teststyles-prefixes
 */
;window.Modernizr=function(a,b,c){function v(a){i.cssText=a}function w(a,b){return v(l.join(a+";")+(b||""))}function x(a,b){return typeof a===b}function y(a,b){return!!~(""+a).indexOf(b)}function z(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:x(f,"function")?f.bind(d||b):f}return!1}var d="2.5.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m={},n={},o={},p=[],q=p.slice,r,s=function(a,c,d,e){var h,i,j,k=b.createElement("div"),l=b.body,m=l?l:b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),k.appendChild(j);return h=["&#173;","<style>",a,"</style>"].join(""),k.id=g,m.innerHTML+=h,m.appendChild(k),l||(m.style.background="",f.appendChild(m)),i=c(k,a),l?k.parentNode.removeChild(k):m.parentNode.removeChild(m),!!i},t={}.hasOwnProperty,u;!x(t,"undefined")&&!x(t.call,"undefined")?u=function(a,b){return t.call(a,b)}:u=function(a,b){return b in a&&x(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e});var A=function(c,d){var f=c.join(""),g=d.length;s(f,function(c,d){var f=b.styleSheets[b.styleSheets.length-1],h=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"",i=c.childNodes,j={};while(g--)j[i[g].id]=i[g];e.touch="ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch||(j.touch&&j.touch.offsetTop)===9},g,d)}([,["@media (",l.join("touch-enabled),("),g,")","{#touch{top:9px;position:absolute}}"].join("")],[,"touch"]);m.touch=function(){return e.touch};for(var B in m)u(m,B)&&(r=B.toLowerCase(),e[r]=m[B](),p.push((e[r]?"":"no-")+r));return v(""),h=j=null,e._version=d,e._prefixes=l,e.testStyles=s,e}(this,this.document);

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
    var thisUrl = window.location.href;
    // Go through configured versions.
    for (var i = 0; i < this.versions.length; i++) {
      var v = this.versions[i];
      // Check if current URL matches one of the existing versions.
      if (v.matchesUrl(thisUrl)) {
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
    return window.matchMedia(mqParser.getMediaQuery()) &&
        mqParser.evaluateTouch();
  };

  /**
   * Check if this version matches the specified URL
   */
  Version.prototype.matchesUrl = function(url) {
    // If absolute URL, do exact match.
    // If relative URL, do endswith match.
    return false;
  };

  /**
   * Redirect to the current version.
   */
  Version.prototype.redirect = function() {
    //window.location.href = this.url;
    //console.log('redirecting to', this.url);
    document.body.innerHTML += 'redirecting to: ' + this.url;
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

  var vermgr = new VersionManager();
  vermgr.redirectIfNeeded();

})(window);
