/**
 * @Author: sunweibin
 * @Date: 2017-11-17 15:38:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-29 17:06:44
 * @description 列表组件中需要使用到的公共工具方法
 */

const tool = {
  /**
   * 根据总数生成每页条数
   * @param {number} totalCount 总数
   */
  constructPageSizeOptions(totalCount) {
    const pageSizeOption = [];
    const maxPage = Math.ceil(totalCount / 10);
    for (let i = 1; i <= maxPage; i++) {
      pageSizeOption.push((10 * i).toString());
    }
    return pageSizeOption;
  },

  /**
   * 显示总数
   */
  showTotal(total) {
    return `共${total}个`;
  },
};

export default tool;
