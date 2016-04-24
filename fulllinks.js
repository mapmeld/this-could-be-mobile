const cheerio = require('cheerio');
const URL = require('url-parse');

function fulllinks(fullurl, id, body) {
  $ = cheerio.load(body);
  fullurl = new URL(fullurl);

  function hasHTTP(url) {
    if (url.indexOf('http:') === 0 || url.indexOf('https:') === 0) {
      return true;
    }
    return false;
  }

  function relativePath(url) {
    return (url.indexOf('/') !== 0);
  }

  function reformURL(htmlurl) {
    if (hasHTTP(htmlurl)) {
      return htmlurl;
    } else {
      if(relativePath(htmlurl)) {
        var remainingpath = fullurl.pathname.split('/');
        remainingpath.pop();
        return '//' + fullurl.hostname + remainingpath.join('/') + '/' + htmlurl;
      } else {
        return '//' + fullurl.hostname + htmlurl;
      }
    }
  }

  $('script, img').each(function(i, x) {
    var x = $(x);
    var url = x.attr("src");
    if (url) {
      x.attr("src", reformURL(url));
    }
  });
  $('link').each(function(i, x) {
    var x = $(x);
    var url = x.attr("href");
    if (url) {
      x.attr("href", reformURL(url));
    }
  });
  $('a').each(function(i, x) {
    var x = $(x);
    var url = x.attr("href");
    if (url) {
      var reformed = reformURL(url);
      x.attr("href", "/page?id=" + id + "&url=" + reformed);
    }
  });

  // must have <head> tag
  if (!$('head').length) {
    $('html').prepend('<head>');
  }

  // should have meta viewport
  if (!$('head meta[name="viewport"]').length) {
    $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1"/>');
  }

  // should have meta charset
  if (!$('head meta[charset]').length && !$('head meta[name="charset"]').length && !$('head meta[http-equiv="Content-Type"]').length) {
    $('head').prepend('<meta charset="UTF-8"/>');
  }

  // add custom stylesheet at end
  $('head').append('<link rel="stylesheet" type="text/css" href="/styles/' + id + '"/>');

  return $.html();
}

module.exports = fulllinks;
