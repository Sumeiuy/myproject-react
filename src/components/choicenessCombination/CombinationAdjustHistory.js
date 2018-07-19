/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合调仓组件
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-11 14:53:05
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
import logable, { logPV } from '../../decorators/logable';

const titleStyle = {
  fontSize: '16px',
};

const { directionRange, sourceType, overlayStyle } = config;
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
    openDetailPage: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  // 证券名称点击事件
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '组合调仓',
      value: '$args[2]',
    },
  })
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
  @logPV({
    pathname: '/modal/adjustHistoryModal',
    title: '调仓历史弹框',
  })
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
      if (!_.isEmpty(list[i]) && !_.isEmpty(list[i].reason)) {
        reasonFlag = true;
      }
    }
    return reasonFlag;
  }

  // 组合名称点击事件
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '组合调仓',
      value: '$args[0].name',
    },
  })
  handleNameClick(obj) {
    const { openDetailPage } = this.props;
    openDetailPage(obj);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '组合调仓',
      value: '$args[0].name',
    },
  })
  handleOpenCustomerListPage(openPayload) {
    const { openCustomerListPage } = this.props;
    openCustomerListPage(openPayload);
  }

  // 设置 popover
  @autobind
  renderPopover(value) {
    let reactElement = null;
    if (!_.isEmpty(value)) {
      const trimValue = _.trim(value);
      reactElement = (<Popover
        placement="bottomLeft"
        content={trimValue}
        trigger="hover"
        overlayStyle={overlayStyle}
      >
        <div className={styles.ellipsis}>
          {trimValue}
        </div>
      </Popover>);
    } else {
      reactElement = '调仓理由：暂无';
    }
    return reactElement;
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
                        combinationCode,
                        reason,
                      } = child;
                      const openPayload = {
                        name: securityName,
                        code: securityCode,
                        type: securityType,
                        source: sourceType.security,
                      };
                      const childKey = `${securityCode}${index}`;
                      const openDetailPayload = {
                        id: combinationCode,
                        name: combinationName,
                      };
                      return (
                        <div className={styles.rightItem} key={childKey}>
                          <div className={styles.titleBox}>
                            <a
                              className={styles.securityName}
                              title={securityName}
                              onClick={() =>
                                this.handleSecurityClick(securityType, securityCode, `${securityName}(${securityCode})`)
                              }
                            >
                              {securityName} ({securityCode})
                            </a>
                            <a
                              className={styles.combinationName}
                              title={combinationName}
                              onClick={() => this.handleNameClick(openDetailPayload)}
                            >
                              {combinationName}
                            </a>
                          </div>
                          <div className={styles.timeBox}>
                            <span>{time.format(child.time, config.formatStr)}</span>
                            <a
                              className={styles.customerLink}
                              onClick={() => this.handleOpenCustomerListPage(openPayload)}
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
