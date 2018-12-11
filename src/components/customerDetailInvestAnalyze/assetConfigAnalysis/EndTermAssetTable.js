/*
 * @Author: zhangjun
 * @Date: 2018-12-04 21:25:54
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-10 16:49:31
 * @description 期末资产配置表格
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from '../../common/table';
import { TABLE_COLUMNS } from './config';
import IfTableWrap from '../../common/IfTableWrap';
import styles from './endTermAssetTable.less';

export default function EndTermAssetTable(props) {
  const { endTermAssetTableData } = props;
  // 后端返回的数据都是number类型，配置权重需要展示成百分数形式
  const dataSource = _.map(endTermAssetTableData, item => (
    {
      ...item,
      configWeight: `${item.configWeight}%`
    }
  ));
  return (
    <div className={styles.endTermAssetTable}>
      <IfTableWrap isRender={!_.isEmpty(endTermAssetTableData)}>
        <Table
          columns={TABLE_COLUMNS}
          dataSource={dataSource}
          pagination={false}
        />
      </IfTableWrap>
    </div>
  );
}

EndTermAssetTable.propTypes = {
  // 表格数据
  endTermAssetTableData: PropTypes.array.isRequired,
};
