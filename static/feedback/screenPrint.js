document.addEventListener('DOMContentLoaded',  function () {
  $.feedback({
      ajaxURL: 'http://localhost:8082/mcrm/api/groovy/feedback/saveFeedback',
      html2canvasURL: 'html2canvas.js',
      onClose: function() { window.location.reload(); },
  });
}, false);