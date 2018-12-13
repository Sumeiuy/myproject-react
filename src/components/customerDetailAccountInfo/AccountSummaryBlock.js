/*
 * @Author: sunweibin
 * @Date: 2018-12-06 13:20:58
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-06 15:03:02
 * @description 账户概览信息块
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { data } from '../../helper';
import IFWrap from '../common/biz/IfWrap';
import AccountSummaryCell from './IndicatorCell';

import styles from './accountSummaryBlock.less';

function AccountSummaryBlock(props) {
  const {
    title,
    summaryData,
    showDesc,
    noBorder,
  } = props;
  const summaryBlockCls = classnames({
    [styles.summaryBlock]: true,
    [styles.noBorder]: noBorder,
  });
  return (
    <IFWrap isRender={!_.isEmpty(summaryData)}>
      <div className={summaryBlockCls}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.body}>
          {
            _.map(
              summaryData,
              indicator => (
                <AccountSummaryCell
                  showDesc={showDesc}
                  key={data.uuid()}
                  indicator={indicator}
                />)
            )
          }
        </div>
      </div>
    </IFWrap>
  );
}

AccountSummaryBlock.propTypes = {
  // 概览数据块的标题
  title: PropTypes.string.isRequired,
  // 概览数据标题后的自定义按钮点击事件
  onSettingClick: PropTypes.func,
  // 概览数据每一部分的数据
  summaryData: PropTypes.array,
  // 展示指标描述不
  showDesc: PropTypes.bool,
  noBorder: PropTypes.bool,
};

AccountSummaryBlock.defaultProps = {
  onSettingClick: _.noop,
  summaryData: [],
  showDesc: true,
  noBorder: false,
};

export default AccountSummaryBlock;
