$(function() {
  $.get('/styles/' + id, function(txt) {
    $("#loading").hide();
    $("textarea").val(txt);
    CodeMirror.fromTextArea($("textarea")[0], {
      lineNumbers: true,
      mode: 'text/css',
      readOnly: true
    });
  });
});
