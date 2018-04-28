/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合调仓组件
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-17 16:58:53
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import Icon from '../common/Icon';
import config from './config';
import styles from './combinationAdjustHistory.less';

const titleStyle = {
  fontSize: '16px',
};

const { directionRange } = config;
const directionArray = _.filter(directionRange, o => o.value);
console.warn('directionArray', directionArray);
export default class CombinationAdjustHistory extends PureComponent {
  static propTypes = {
    showModal: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  // constructor(props) {
  //   super(props);
  // }

  @autobind
  moreHandle(directionCode) {
    const { showModal } = this.props;
    showModal(directionCode);
  }

  render() {
    const { data } = this.props;
    const { list } = data;
    return (
      <div className={styles.combinationAdjustHistoryBox}>
        <InfoTitle
          head="组合调仓"
          titleStyle={titleStyle}
        />
        {
          directionArray.map((item) => {
            const { icon, title, value } = item;
            const showList = _.filter(list, o => o.directionCode === value);
            return (
              <dl className={styles.adjustIn} key={value}>
                <dt>
                  <i>{icon}</i>
                  <span>{title}</span>
                </dt>
                {
                  showList.map((child, index) => {
                    const childKey = `${value}${index}`;
                    const { securityName, securityCode, combinationName, reason } = child;
                    return (
                      <dd key={childKey}>
                        <div className={styles.titleBox}>
                          <a className={styles.securityName} title={securityName}>
                            {securityName} ({securityCode})
                          </a>
                          <a className={styles.combinationName} title={combinationName}>
                            {combinationName}
                          </a>
                        </div>
                        <div className={styles.timeBox}>
                          <span>{child.time}</span>
                          <a><Icon type="kehuzu" /></a>
                        </div>
                        <p title={reason}>{reason}</p>
                      </dd>
                    );
                  })
                }
                <dd className={styles.more}>
                  <a onClick={() => this.moreHandle(value)}>{'更多 >'}</a>
                </dd>
              </dl>
            );
          })
        }
      </div>
    );
  }
}
