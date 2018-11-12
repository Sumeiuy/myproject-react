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
import _ from 'lodash';

import Tooltip from '../../common/Tooltip';
import { logCommon } from '../../../decorators/logable';
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
    // 手动上传日志 资产和交易量
    logCommon({
      type: 'DrillDown',
      payload: {
        name: '资产和交易量',
        subtype: data.title,
        value: data.item,
      },
    });
    if (isLinkTo) {
      linkTo(param);
    }
  };
  return (
    <div className={classnames(styles.check, itemStyle)}>
      <div
        className={classnames(styles.count, styles.countGray)}
        onClick={linkToList}
      >
        <span title={`${data.item || ''}${data.unit || ''}`}>
          {data.item || ''}
          <span>{data.unit || ''}</span>
        </span>
      </div>
      <Tooltip
        title={data.title || ''}
        content={data.description}
        placement="bottom"
        overlayStyle={{ maxWidth: '320px' }}
      >
        <div className={styles.title}>{data.title || ''}</div>
      </Tooltip>
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
  cycle: PropTypes.array.isRequired,
};

CheckLayout.contextTypes = {
  push: PropTypes.func.isRequired,
};


export default CheckLayout;
