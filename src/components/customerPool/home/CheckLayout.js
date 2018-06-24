/**
 * @file components/customerPool/home/CheckLayout.js
 *  文字列表，row如下图：-----, | 代表solid线
 *  50   | 50
 *  xxxx | xxxx
 *  --------------
 *  50   | 50
 *  xxxx | xxxx
 * @author zhangjunli
 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Popover } from 'antd';
import _ from 'lodash';

import antdStyles from '../../../css/antd.less';
import styles from './checkLayout.less';

import {
  linkTo,
} from './homeIndicators_';

const SOURCE = 'assetsTransactions';
const TYPE_LIST = ['purFinAset', 'gjAmt', 'synthesis', 'gjPurRake'];

function renderItem(data = {}, params, itemStyle = null) {
  const param = {
    ...params,
    source: SOURCE,
    type: data.type,
  };

  const linkToList = () => {
    const isLinkTo = data.type !== TYPE_LIST[2];
    if (isLinkTo) {
      linkTo(param);
    }
  };
  return (
    <div className={classnames(styles.check, itemStyle)}>
      <div
        className={styles.count}
        onClick={linkToList}
      >
        <span title={`${data.item || ''}${data.unit || ''}`}>
          {data.item || ''}
          <span>{data.unit || ''}</span>
        </span>
      </div>
      <Popover
        title={data.title || ''}
        content={data.description}
        placement="bottom"
        overlayStyle={{ maxWidth: '320px' }}
        overlayClassName={antdStyles.popoverClass}
      >
        <div className={styles.title}>{data.title || ''}</div>
      </Popover>
    </div>
  );
}

function CheckLayout(props, { push }) {
  const { dataSource } = props;
  const finalDate = _.map(dataSource, (item, index) => ({
    ...item,
    type: TYPE_LIST[index],
  }));
  const params = {
    ...props,
    push,
  };
  return (
    <div className={styles.container}>
      <div className={classnames(styles.content, styles.left)}>
        {renderItem(finalDate[0], params, styles.bottomBorder)}
        {renderItem(finalDate[1], params)}
      </div>
      <div className={classnames(styles.content, styles.right)}>
        {renderItem(finalDate[2], params, styles.bottomBorder)}
        {renderItem(finalDate[3], params)}
      </div>
    </div>
  );
}

CheckLayout.propTypes = {
  dataSource: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  cycle: PropTypes.string.isRequired,
};

CheckLayout.contextTypes = {
  push: PropTypes.func.isRequired,
};


export default CheckLayout;
