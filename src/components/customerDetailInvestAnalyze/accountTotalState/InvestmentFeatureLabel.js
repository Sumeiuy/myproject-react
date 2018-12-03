/*
 * @Author: zhangjun
 * @Date: 2018-11-21 10:23:24
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-21 13:25:19
 * @description 盈利能力等级
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover, Tag } from 'antd';

import styles from './investmentFeatureLabel.less';

export default function InvestmentFeatureLabel(props) {
  const { labelData } = props;
  if (_.isEmpty(labelData)) {
    return null;
  }
  const { name, desc } = labelData;
  return (
    <div className={styles.labelItem}>
      <Popover overlayClassName={styles.labelPopover} title={desc}>
        <Tag className={styles.tag}>{name}</Tag>
      </Popover>
    </div>
  );
}

InvestmentFeatureLabel.propTypes = {
  // 标签信息数据
  labelData: PropTypes.object.isRequired,
};
