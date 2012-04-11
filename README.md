# Best practices for Device detection with Media Queries

CSS media queries are an amazing tool for customizing a layout to look
differently depending on the device you serve it to. For some
inspiration, have a look at [mediaqueri.es][mq].

In many cases, however, the ability to customize the CSS depending on
screen size is not sufficient. You might want a completely different
DOM structure, and a separate set of JavaScript depending on the device.

You may also want to distinguish between these different versions by
providing separate URLs (eg. `tablet.foo.com`, `m.foo.com` and
`foo.com`) for clarity and perhaps for SEO reasons.

Broadly speaking there are two approaches for doing this:

1. Server-side detection based on user agent string
2. Client-side detection based on features.

This project is about making the latter as easy as possible.

[mq]: http://mediaqueri.es

# Device.js

Device.js is a starting point for doing semantic, media query-based
device detection without needing special server-side configuration,
saving the time and effort required to do user agent string parsing.

Two parts to the solution:

1. Write `<link rel="alternate" media="mediaQuery" href="url" id="id">`
   tags for all of the versions you will provide, and add them to your
   `<head>` section.
2. Include `device.js` in every version of your webapp.

For example, if your app is here is how your HTML will look like:

    <!doctype html>
    <html>
      <head>
        <!-- Every version of your webapp should include a list of all
             versions. -->
        <link rel="alternate" href="http://foo.com" id="desktop"
            media="only screen and (touch-enabled: 0)">
        <link rel="alternate" href="http://m.foo.com" id="phone"
            media="only screen and (max-device-width: 640px)">
        <link rel="alternate" href="http://tablet.foo.com" id="tablet"
            media="only screen and (min-device-width: 641px)">

        <!-- Viewport is very important, since it affects results of media
             query matching. -->
        <meta name="viewport" content="width=device-width">
      </head>
      <body>
        <script src="device.js"></script>
      </body>
    </html>

Device.js will read all of the version links in your markup, and
redirect you to the appropriate URL that serves the correct version of
your webapp.

Having the `<link>` tags in your head section also tells search engines
of all of the versions of your site.

## Version override

You can manually override the detector and load a particular version of
the site by passing in the `device` GET parameter with the ID of the
version you'd like to load. This will look up the `link` tag based on
the specified ID and load that version. For example, if you are on
desktop but want the tablet version, visiting
`http://foo.com/?version=tablet` will redirect to the tablet version at
`http://tablet.foo.com`.

Relatedly, you can prevent redirection completely, by specifying the
`force=1` GET parameter. For example, if you are on desktop and know the
URL of the tablet site, you can load `http://tablet.foo.com/?force=1`.

## For example

Here is an example of device.js in action. It's a fake TODO list (no
functionality, just device detection and switching):
<http://borismus.github.com/device.js/sample>

## Contributing

The goal of device.js is to provide a SEO-compatible best practice and
starting point for reliable cross-device, cross-browser redirection.

Given how many browsers and devices we have these days, there are bound
to be bugs. If you find them, please report them and (ideally) fix them
in a pull request.
