/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合调仓组件
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-11 09:25:38
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Popover } from 'antd';

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
  handleSecurityClick(type, code) {
    if (type === STOCK_CODE) {
      const { openStockPage } = this.props;
      const openPayload = {
        code,
      };
      openStockPage(openPayload);
    }
  }

  @autobind
  handleMoreClick(value) {
    const { showModal } = this.props;
    const payload = {
      directionCode: value,
      type: HISTORY_TYPE,
    };
    showModal(payload);
  }

  @autobind
  calcReason(list) {
    let reasonFlag = false;
    for (let i = 0; i < 2; i++) {
      console.warn('list', list);
      if (!_.isEmpty(list[i]) && !_.isEmpty(list[i].reason)) {
        reasonFlag = true;
      }
    }
    return reasonFlag;
  }

  // 设置 popover
  @autobind
  renderPopover(value) {
    let reactElement = null;
    if (!_.isEmpty(value)) {
      reactElement = (<Popover
        placement="bottomLeft"
        content={value}
        trigger="hover"
        overlayStyle={{
          width: '240px',
          padding: '10px',
          wordBreak: 'break-all',
        }}
      >
        <div className={styles.ellipsis}>
          {value}
        </div>
      </Popover>);
    } else {
      reactElement = '调仓理由：暂无';
    }
    return reactElement;
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
          directionArray.map((item, idx) => {
            const { icon, title, value } = item;
            const showList = _.filter(list, o => o.directionCode === Number(value));
            const itemKey = `${value}${idx}`;
            const flag = this.calcReason(showList);
            return (
              <div className={styles.adjustIn} key={itemKey}>
                <div className={styles.left}>
                  <i>{icon}</i>
                  <span>{title}</span>
                </div>
                <div className={styles.right}>
                  {
                    showList.map((child, index) => {
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
                      const childKey = `${securityCode}${index}`;
                      return (
                        <div className={styles.rightItem} key={childKey}>
                          <div className={styles.titleBox}>
                            <a
                              className={styles.securityName}
                              title={securityName}
                              onClick={() => this.handleSecurityClick(securityType, securityCode)}
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
                          {
                            flag
                            ?
                              <div className={styles.reasonBox}>
                                {this.renderPopover(reason)}
                              </div>
                            :
                              null
                          }
                        </div>
                      );
                    })
                  }
                </div>
                <div className={styles.more}>
                  <a onClick={() => this.handleMoreClick(value)}>{'更多 >'}</a>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}
