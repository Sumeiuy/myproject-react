/**
 * @Author: sunweibin
 * @Date: 2018-06-11 16:36:40
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-14 21:19:08
 * @description 关联关系展示表格
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import _ from 'lodash';

import Icon from '../common/Icon';

import { custRelationshipColumns } from './config';

import styles from './associateRelationTable.less';

export default function AssociateRelationTable(props) {
  const { data, onDelRelation, onUpdateRelation } = props;
  // 此处的Table的Columns需要增加操作一列
  const columns = [...custRelationshipColumns, {
    title: '操作',
    key: 'action',
    width: 110,
    render(text, record) {
      const hasEcifId = !_.isEmpty(record.ecifId);
      if (hasEcifId) {
        // 如果有ecifId,表示该关联关系已经落入ecif的表中，此数据不能删除
        return (
          <span>
            <span className={styles.action} onClick={() => onUpdateRelation(record)}>
              <Icon type="bianji" />
            </span>
          </span>
        );
      }
      return (
        <span>
          <span className={styles.action} onClick={() => onUpdateRelation(record)}>
            <Icon type="bianji" />
          </span>
          <span className={styles.action} onClick={() => onDelRelation(record)}>
            <Icon type="shanchu" className={styles.fixDelIcon} />
          </span>
        </span>
      );
    },
  }];
  return (
    <div className={styles.associateRelationTable}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          position: 'bottom',
          pageSize: 5,
        }}
      />
    </div>
  );
}

AssociateRelationTable.propTypes = {
  data: PropTypes.array.isRequired,
  onDelRelation: PropTypes.func.isRequired,
  onUpdateRelation: PropTypes.func.isRequired,
};
