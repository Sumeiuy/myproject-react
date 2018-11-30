/*
 * @Author: sunweibin
 * @Date: 2018-10-16 09:27:48
 * @Last Modified by: liqianwen
 * @Last Modified time: 2018-11-30 10:55:37
 * @description 客户360详情中概要信息显示的15个重点标签
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Tag } from 'antd';
import Tooltip from '../common/Tooltip';

import styles from './custLabel.less';

export default function CustLabel(props) {
  const { labelData } = props;
  if (_.isEmpty(labelData)) {
    return null;
  }

  const { name, desc } = labelData;
  // 标签名称长度超过8个字后，截取7个字，后面使用省略号
  const nameLength = name && name.length;
  let fixedName = name;
  if (nameLength > 8) {
    fixedName = `${name.substr(0,7)}...`;
  }
  const style = {
    minWidth: '220px'
  };
  return (
    <div className={styles.labelItem}>
      <Tooltip content={desc} title={name} overlayStyle={style}>
        <Tag className={styles.tag}>{fixedName}</Tag>
      </Tooltip>
    </div>
  );
}

CustLabel.propTypes = {
  // 标签信息数据
  labelData: PropTypes.object.isRequired,
};

