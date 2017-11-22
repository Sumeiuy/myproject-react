/**
 * @file Columns.js
 *  tasklist 构造表格的列数据
 * @author wangjunjun
 */
import _ from 'lodash';
import React from 'react';
import classnames from 'classnames';
import Tag from '../../common/tag';
import styles from './columns.less';

export default function Columns(props) {
  const { pageData } = props;

  // const operateType = _.filter(operationList, v => v.label !== '全部');

  // 后台返回的类型字段转化为对应的中文显示
  const changeTypeDisplay = (st, options) => {
    if (st && !_.isEmpty(st) && options instanceof Array) {
      const obj = _.find(options, o => o.value === st) || {};
      return obj.label || '无';
    }
    return '无';
  };

  // 后台返回的子类型字段、状态字段转化为对应的中文显示
  const changeDisplay = (st, options) => {
    if (st && !_.isEmpty(st)) {
      const nowStatus = _.find(options, o => o.value === st) || {};
      return nowStatus.label || '无';
    }
    return '无';
  };

  const tagClsConfig = {
    '01': '#60bbea',
    '02': '#ff784e',
    '03': '#7d9be0',
    '04': '#756fb8',
  };

  const chooseCls = record => classnames(styles.todo, {
    [styles.chooseTodo]: record.business2 === 'Chance',
    [styles.haveTodo]: record.business2 === 'Mission',
  });

  const getChooseText = (redord) => {
    let chooseText = '';
    if (redord.business2 === 'Chance') {
      chooseText = '选';
    } else if (redord.business2 === 'Mission') {
      chooseText = '必';
    }
    return chooseText;
  };

  const columns = [{
    width: '60%',
    render: (text, record) => (
      <div className="leftSection">
        <div className="id">
          <span className={chooseCls(record)}>{getChooseText(record)}</span>
          <span className={styles.serialNumber}>编号{record.id || '暂无'}</span>
          <span className={styles.type}>{changeTypeDisplay(record.subType, pageData.type)}</span>
        </div>
        <div className="subType">{record.title || '无'}</div>
        <div className={styles.drafter}>
          创建者：
          <span className="drafterName">
            {record.empName}&nbsp;{record.orgName ? '-' : ''}&nbsp;{record.orgName}
          </span>
        </div>
      </div>
    ),
  }, {
    width: '40%',
    render: (text, record) => (
      <div className="rightSection">
        <Tag
          color={record.status ? tagClsConfig[record.status] : ''}
          text={changeDisplay(record.status, pageData.status)}
        />
        <div className="date">{(record.createTime && record.createTime.slice(0, 10)) || '无'}</div>
      </div>
    ),
  }];

  return columns;
}
