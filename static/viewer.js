function doCodeMirror(readOnly) {
  CodeMirror.fromTextArea(document.getElementsByTagName("textarea")[0], {
    lineNumbers: true,
    mode: 'text/css',
    readOnly: readOnly
  });
}

if (typeof id !== 'undefined') {
  $(function() {
    $.get('/styles/' + id, function(txt) {
      $("#loading").hide();
      $("textarea").val(txt);
      doCodeMirror(true);
    });
  });
} else {
  doCodeMirror(false);
}
