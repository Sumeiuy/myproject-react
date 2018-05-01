function getDom(tagName, name, value) {
  const selectDom = [];
  const dom = document.getElementsByTagName(tagName);
  for (let i = 0; i < dom.length; i++) {
    if (value === dom[i].getAttribute(name)) {
      selectDom.push(dom[i]);
    }
  }
  return selectDom;
}

export default getDom;
