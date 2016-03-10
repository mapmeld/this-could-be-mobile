var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
if (width < 780) {
  window.location.href = '/mobile?id=' + id + '&url=' + url;
}
