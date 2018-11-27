/*
 * @Author: sunweibin
 * @Date: 2018-11-26 16:44:23
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 09:09:23
 * @description 联系方式使用的Table
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'antd';
import _ from 'lodash';

import { isFromNoSupportUpdateSource } from './utils';

import { styles } from './infoTable.less';

function InfoTable(props) {
  // 给表格添加操作列内容
  const { dataSource, columns, isMainEmp } = props;
  const newColumns = _.map(columns, (column) => {
    const { dataIndex } = column;
    if (dataIndex === 'operate') {

      return {
        ...column,
        render: (text, record) => {
          const { mainFlag } = record;
          // 主服务经理可以查看和编辑客户的电话信息、地址信息和其他信息
          if (mainFlag === 'N' && isMainEmp && !isFromNoSupportUpdateSource()) {
            // 只有主服务经理能够修改非主要的并且来自可以修改的来源的存在操作列
            return (
              <span>
                <span><Icon type="edit" /></span>
                <span><Icon type="edit" /></span>
              </span>
            );
          }
          return null;
        },
      };
    }
    return column;
  });

  return (
    <div className={styles.infoTable}>
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={newColumns}
      />
    </div>
  );
}

InfoTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  // 是否主服务经理
  isMainEmp: PropTypes.bool.isRequired,
};

export default InfoTable;


