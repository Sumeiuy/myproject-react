// 过滤数据
function filterData(data, key) {
  const filterData = [];
  if (data) {
    data.forEach(item => {
      filterData.push(item[key]);
    });
  }
  return filterData;
}
const activityColumnHelper = {
  filterData,
};


export default activityColumnHelper;
export {
  filterData,
};
