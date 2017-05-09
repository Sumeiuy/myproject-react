var browser_version = navigator.userAgent;
var crmWindowWidth = $('body').width();
var crmWindowHeight = $('body').height() + 90;
// 判断浏览器版本
// 弹出Dialog
// width: 1000,
// height: 510,
$('body').EBWindow({
  id: 'CRMCheckbrowser',
  show_cover: true,
  scrollY: false,
  scrollX: false,
  closable: false,
  width: crmWindowWidth,
  height: crmWindowHeight,
  content_mode: 'iframe',
  sourceURL: 'http://160.6.73.108:9081/static/checkBrowser/UpdateBrowser.html',
});
// 调整高度
$('#CRMCheckbrowser .window-title').hide(0);
// $('#CRMCheckbrowser .window-content').height('510px');
// $('#CRMCheckbrowser-iframe').height('510px');
