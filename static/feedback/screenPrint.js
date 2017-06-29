document.addEventListener('DOMContentLoaded',  function () {
  $.feedback({
      ajaxURL: '/fspa/mcrm/api/groovynoauth/feedback/saveFeedback',
      html2canvasURL: 'html2canvas.js',
      onClose: function() { window.location.reload(); },
  });
}, false);