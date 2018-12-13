/*
 * @Author: sunweibin
 * @Date: 2018-12-13 10:53:47
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-13 12:12:01
 * @description 针对表格里面的一些处理的辅助函数
 */
import _ from 'lodash';

const table = {
  /**
   * 按照当前最新的UI规范以及他们的要求添加空白列
   */
  padColumnForUI(columns) {
    const tableFirst20pxEmptyColumn = {
      key: 'tableFirst20pxEmptyColumn',
      dataIndex: 'tableFirst20pxEmptyColumn',
      width: 20,
    };
    const tableEnd20pxEmptyColumn = {
      key: 'tableEnd20pxEmptyColumn',
      dataIndex: 'tableEnd20pxEmptyColumn',
      width: 20,
    };
    const newColumns = [];
    if (!_.isEmpty(columns)) {
      const len = _.size(columns);
      _.forEach(columns, (column, index) => {
        if (index === 0) {
          // 第一个前面需要添加一个宽度为20px的空白列
          newColumns.unshift(tableFirst20pxEmptyColumn);
        }
        newColumns.push(column);
        if (index < len - 1) {
          newColumns.push({
            key: `tableEmptyColumn${index}`,
            dataIndex: `tableEmptyColumn${index}`,
          });
        }
        if (index === len - 1) {
          // 最后一个
          newColumns.push(tableEnd20pxEmptyColumn);
        }
      });
    }
    return newColumns;
  }
};

export default table;
