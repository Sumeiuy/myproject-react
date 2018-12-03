// 过滤图标数据
function filterData(reportData, key) {
  const data = [];
  if (reportData) {
    reportData.forEach((item) => {
      data.push(item[key]);
    });
  }
  return data;
}

export {
  filterData,
};
