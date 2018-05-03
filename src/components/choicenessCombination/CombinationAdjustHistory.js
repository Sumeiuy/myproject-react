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
import { time } from '../../helper';
import config from './config';
import styles from './combinationAdjustHistory.less';

const titleStyle = {
  fontSize: '16px',
};

const { directionRange } = config;
const directionArray = _.filter(directionRange, o => o.value);
// securityType 里股票对应的值
const STOCK_CODE = config.securityType[0].value;
// 持仓历史
const HISTORY_TYPE = config.typeList[0];
export default class CombinationAdjustHistory extends PureComponent {
  static propTypes = {
    showModal: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    openCustomerListPage: PropTypes.func.isRequired,
    openStockPage: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  // 证券名称点击事件
  @autobind
  securityHandle(type, code) {
    if (type === STOCK_CODE) {
      const { openStockPage } = this.props;
      const openPayload = {
        code,
      };
      openStockPage(openPayload);
    }
  }

  @autobind
  moreHandle(value) {
    const { showModal } = this.props;
    const payload = {
      code: value,
      type: HISTORY_TYPE,
    };
    showModal(payload);
  }

  render() {
    const { data, openCustomerListPage } = this.props;
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
            const tempList = _.filter(list, o => o.directionCode === Number(value));
            const showList = _.slice(tempList, 0, 2);
            return (
              <dl className={styles.adjustIn} key={value}>
                <dt>
                  <i>{icon}</i>
                  <span>{title}</span>
                </dt>
                {
                  showList.map((child, index) => {
                    const childKey = `${value}${index}`;
                    const {
                      securityName,
                      securityCode,
                      securityType,
                      combinationName,
                      reason,
                    } = child;
                    const openPayload = {
                      name: securityName,
                      code: securityCode,
                      type: securityType,
                    };
                    return (
                      <dd key={childKey}>
                        <div className={styles.titleBox}>
                          <a
                            className={styles.securityName}
                            title={securityName}
                            onClick={() => this.securityHandle(securityType, securityCode)}
                          >
                            {securityName} ({securityCode})
                          </a>
                          <a className={styles.combinationName} title={combinationName}>
                            {combinationName}
                          </a>
                        </div>
                        <div className={styles.timeBox}>
                          <span>{time.format(child.time, config.formatStr)}</span>
                          <a
                            className={styles.customerLink}
                            onClick={() => openCustomerListPage(openPayload)}
                          >
                            <Icon type="kehuzu" />
                          </a>
                        </div>
                        <div className={styles.reasonBox}>
                          <p title={reason}>{reason || '调仓理由：暂无'}</p>
                        </div>
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
