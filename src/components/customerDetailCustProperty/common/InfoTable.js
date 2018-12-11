/*
 * @Author: sunweibin
 * @Date: 2018-11-26 16:44:23
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-11 11:33:06
 * @description 联系方式使用的Table
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import _ from 'lodash';

import Icon from '../../common/Icon';
import { isFromNoSupportUpdateSource } from './utils';

import styles from './infoTable.less';

function InfoTable(props) {
  // 给表格添加操作列内容
  let { columns } = props;
  const {
    dataSource,
    isMainEmp,
    onEditClick,
    onDelClick,
  } = props;
  // 新增需求，如果是非主服务经理的人，看不到操作一栏
  if (!isMainEmp) {
    columns = _.filter(columns, item => item.dataIndex !== 'operate');
  }
  const newColumns = _.map(columns, (column) => {
    const { dataIndex } = column;
    if (dataIndex === 'operate') {
      return {
        ...column,
        render: (text, record) => {
          const { mainFlag, sourceCode } = record;
          // 主服务经理可以查看和编辑客户的电话信息、地址信息和其他信息
          if (mainFlag === 'N' && isMainEmp && !isFromNoSupportUpdateSource(sourceCode)) {
            // 只有主服务经理能够修改非主要的并且来自可以修改的来源的存在操作列
            return (
              <span>
                <span className={`${styles.operateBtn} ${styles.editBtn}`}>
                  <Icon type="shenqing" onClick={() => onEditClick(record)} />
                </span>
                <span className={styles.operateBtn}>
                  <Icon type="shanchu" onClick={() => onDelClick(record)} />
                </span>
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
  // 点击删除回调
  onDelClick: PropTypes.func.isRequired,
  // 点击编辑图标回调
  onEditClick: PropTypes.func.isRequired,
};

export default InfoTable;
