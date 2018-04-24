/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合调仓组件
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-17 16:58:53
 */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import InfoTitle from '../common/InfoTitle';
import Icon from '../common/Icon';
import styles from './combinationAdjustHistory.less';

const titleStyle = {
  fontSize: '16px',
};

export default class CombinationAdjustHistory extends PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className={styles.combinationAdjustHistoryBox}>
        <InfoTitle
          head="组合调仓"
          titleStyle={titleStyle}
        />
        <dl className={styles.adjustIn}>
          <dt>
            <i>买</i>
            <span>最新调入</span>
          </dt>
          <dd>
            <div className={styles.titleBox}>
              <a className={styles.securityName} title={'神马股份'}>神马股份（2322323）</a>
              <span className={styles.combinationName} title={'组合名称组合名称组合名称'}>{'组合名称组合名称组合名称'.slice(0, 10)}</span>
            </div>
            <div className={styles.timeBox}>
              <span>2018/02/12 17:00</span>
              <a><Icon type="kehuzu" /></a>
            </div>
            <p title={'仓理由调仓理由调仓理由调仓理由'}>{'调仓理由调仓理由调仓理由调仓理由调仓理由调'.slice(0, 30)}</p>
          </dd>
          <dd className={styles.more}>
            <span>{'更多 >'}</span>
          </dd>
        </dl>
        <dl>
          <dt>
            <i>卖</i>
            <span>最新调出</span>
          </dt>
          <dd>
            <div className={styles.titleBox}>
              <a className={styles.securityName}>神马股份（2322323）</a>
              <span className={styles.combinationName} title={'组合名称组合名称组合名称'}>{'组合名称组合名称组合名称'.slice(0, 10)}</span>
            </div>
            <div className={styles.timeBox}>
              <span>2018/02/12 17:00</span>
              <a><Icon type="kehuzu" /></a>
            </div>
            <p title={'仓理由调仓理由调仓理由调仓理由'}>{'调仓理由调仓理由调仓理由调仓理由调仓理由调'.slice(0, 30)}</p>
          </dd>
          <dd className={styles.more}>
            <span>{'更多 >'}</span>
          </dd>
        </dl>
      </div>
    );
  }
}
