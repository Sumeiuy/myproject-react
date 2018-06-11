/**
 * @Author: sunweibin
 * @Date: 2018-06-11 16:36:40
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-11 17:03:34
 * @description 关联关系展示表格
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

export default function AssociateRelationTable(props) {
  const { data } = props;
  return (
    <Table
      dataSource={data}
      pagination={{
        position: 'bottom',
        pageSize: 5,
      }}
    />
  );
}

AssociateRelationTable.propTypes = {
  data: PropTypes.array.isRequired,
  onDelRelation: PropTypes.func.isRequired,
  onUpdateRelation: PropTypes.func.isRequired,
};
