/**
 * @file seibelColumns.js
 *  seibel 构造表格的列数据
 * @author honggaunqging
 */

import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import Icon from '../Icon';
import { permissionOptions } from '../../../config';

const STATUS_MAP = permissionOptions.stateOptions;

export default function seibelColumns(type) {
  const columns = [{
    width: '60%',
    render: (text, record) => (
      <div className="leftSection">
        <div className="id">
          <Icon type={type} />
          <span className="serialNumber">编号{record.serialNumber || '无'}</span>
          <span className="subType">{record.subType || '无'}</span>
        </div>
        <div className="title">{record.title || '无'}</div>
        <div className="address">拟稿人：{record.empName}({record.empId})，{`${record.level2OrgName || ''}${record.level3OrgName || ''}` || '无'}</div>
      </div>
      ),
  }, {
    width: '40%',
    render: (text, record) => {
      // 当前行记录
      let statusClass;
      let statusLabel;
      if (record.status) {
        statusClass = classnames({
          'state-complete': record.status === STATUS_MAP[0].value,
          'state-resolve': record.status === STATUS_MAP[1].value,
          'state-close': record.status === STATUS_MAP[2].value,
        });
        statusLabel = STATUS_MAP.filter(item => item.value === record.status);
      }
      return (
        <div className="rightSection">
          <div className={statusClass}>{(!_.isEmpty(statusLabel) && statusLabel[0].label) || '无'}</div>
          <div className="date">{(record.createTime &&
            record.createTime.slice(0, 10)) || '无'}</div>
          <div className="cust">客户:{record.custName || '无'}({record.custNumber || '无'})</div>
        </div>
      );
    },
  }];

  return columns;
}
