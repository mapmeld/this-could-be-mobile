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

  return $.html().replace('</head>', '<link rel="stylesheet" type="text/css" href="/styles/' + id + '"/></head>')
}

module.exports = fulllinks;
