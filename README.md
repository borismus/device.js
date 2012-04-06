# Best practices for Device detection with Media Queries

CSS media queries are an amazing tool for customizing a layout to look
differently depending on the device you serve it to. For some
inspiration about this, have a look at [mediaqueri.es][mq].

In many cases, the ability to customize the CSS depending on screen size
is not sufficient. Often, you want a completely different DOM structure,
and a separate set of JavaScript depending on the device.

In many cases, you also want to distinguish between these different
versions by providing separate URLs (eg. `tablet.foo.com`, `m.foo.com` and
`foo.com`).

Two approaches for this:

1. Server-side detection based on user agent string
2. Client-side detection.

# Device.js

Device.js is a starting point for doing semantic, media query-based
device detection without needing special server-side configuration,
saving the time and effort required to do user agent string parsing.

Two parts to the solution:

1. Write `<link rel="alternate" media="mediaQuery" href="url" id="id">`
   tags for all of the versions you will provide, and add them to your
   `<head>` section.
2. Include `device.js` in every version of your webapp.

Device.js will read all of the version links in your markup, and
redirect you to the appropriate URL that serves the correct version of
your webapp.

Having the `<link>` tags in your head section also tells search engines
of all of the versions of your site.

## Version override

You can manually override the detector and load a particular version of
the site by passing in the `linkId` GET parameter. This will look up the
`link` tag based on the specified ID and load that version.
