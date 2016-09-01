function doCodeMirror(readOnly) {
  return CodeMirror.fromTextArea(document.getElementsByTagName("textarea")[0], {
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
      var editingArea = doCodeMirror(false);
      $('#save').click(function() {
        $.post('/styles/' + id + '/edit', {
          _csrf: $('#csrf').val(),
          css: editingArea.getValue()
        }, function() {
          console.log('save complete');
        });
      });
    });
  });
} else {
  doCodeMirror(false);
}
