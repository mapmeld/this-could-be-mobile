$(function() {
  function doCodeMirror() {
    CodeMirror.fromTextArea(document.getElementsByTagName("textarea")[0], {
      lineNumbers: true,
      mode: 'text/css',
      readOnly: true
    });
  }

  if (typeof id !== 'undefined') {
    $.get('/styles/' + id, function(txt) {
      $("#loading").hide();
      $("textarea").val(txt);
      doCodeMirror();
    });
  } else {
    doCodeMirror();
  }
});
