// 根据属性值获取dom元素 tagName:标签名,name:属性名,value:匹配的属性值
function getDomByAttribute(tagName, name, value) {
  const selectDom = [];
  const dom = document.getElementsByTagName(tagName);
  for (let i = 0; i < dom.length; i++) {
    if (value === dom[i].getAttribute(name)) {
      selectDom.push(dom[i]);
    }
  }
  return selectDom;
}

// 根据属性值获取标签内容, tagName:标签名,targetName:目标属性名
function getTextByAttribute(tagName, targetName) {
  const selectText = [];
  // 获取form表单中的标签
  const TemplateFormItem = document.querySelector('#templateFormMention');
  const dom = TemplateFormItem.getElementsByTagName(tagName);
  for (let i = 0; i < dom.length; i++) {
    if (dom[i].getAttribute(targetName)) {
      selectText.push(dom[i].innerText);
    }
  }
  return selectText;
}

export {
  getDomByAttribute,
  getTextByAttribute,
};
