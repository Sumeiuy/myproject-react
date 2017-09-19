/**
 * @file seibelColumns.js
 *  seibel 构造表格的列数据
 * @author honggaunqging
 */

import React from 'react';
import Icon from '../Icon';
import Tag from '../tag';

export default function seibelColumns(type) {
  const columns = [{
    width: '60%',
    render: (text, record) => (
      <div className="leftSection">
        <div className="id">
          <Icon type={type} />
          <span className="serialNumber">编号{record.serialNumber || '无'}</span>
          <span className="type">{record.type || '无'}</span>
        </div>
        <div className="subType">{record.subType || '无'}</div>
        <div className="drafter">拟稿人：<span className="drafterName">{record.empName}({record.empId})</span>{`${record.level2OrgName || ''}${record.level3OrgName || ''}` || '无'}</div>
      </div>
      ),
  }, {
    width: '40%',
    render: (text, record) => (
      <div className="rightSection">
        <Tag type={record.status} />
        <div className="date">{(record.createTime &&
          record.createTime.slice(0, 10)) || '无'}</div>
        <div className="cust">客户：{record.custName || '无'}({record.custNumber || '无'})</div>
      </div>
    ),
  }];

  return columns;
}
