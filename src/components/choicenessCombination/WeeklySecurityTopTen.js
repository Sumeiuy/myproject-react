/*
 * @Author: XuWenKang
 * @Description: 精选组合-近一周表现前十的证券
 * @Date: 2018-04-17 16:38:02
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-18 14:26:10
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import classnames from 'classnames';

import InfoTitle from '../common/InfoTitle';
import Icon from '../common/Icon';
import { time } from '../../helper';
import config from './config';
import styles from './weeklySecurityTopTen.less';

const titleStyle = {
  fontSize: '16px',
};
// securityType 里股票对应的值
const STOCK_CODE = config.securityType[0].value;
const titleList = config.titleList.ten;

export default class WeeklySecurityTopTen extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    permission: PropTypes.bool.isRequired,
    orgId: PropTypes.string,
    openCustomerListPage: PropTypes.func.isRequired,
    openStockPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    orgId: '',
  }

  // constructor(props) {
  //   super(props);
  // }

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
  percentChange(value) {
    let newValue = value;
    if (value > 0) {
      newValue = `+${newValue}`;
    }
    return newValue;
  }

  @autobind
  getTitleList(array) {
    const { openCustomerListPage } = this.props;
    const newTitleList = [...array];
    newTitleList[0].render = (text, record) => {
      const {
        code,
        name,
        securityType,
        reason,
      } = record;
      return (<div className={styles.securityName}>
        <a
          title={`${name} ${code}`}
          onClick={() => this.securityHandle(securityType, code)}
        >
          {name}（{code}）
        </a>
        <div className={styles.reason}>{reason || '调入理由：暂无'}</div>
      </div>);
    };
    newTitleList[1].render = text => (<div>{time.format(text, 'YYYY-MM-DD HH:MM')}</div>);
    newTitleList[2].render = (text) => {
      const change = this.percentChange(text.toFixed(2));
      const bigThanZero = text > 0;
      const changeClassName = classnames({
        [styles.up]: bigThanZero,
        [styles.down]: !bigThanZero,
      });
      return (<span className={changeClassName}>{change}%</span>);
    };
    newTitleList[3].render = text => (<div className={styles.name} title={text}>{text}</div>);
    newTitleList[4].render = (text, record) => {
      const openPayload = {
        name: record.name,
        code: record.code,
        type: record.securityType,
      };
      return <a className={styles.customerLink} onClick={() => openCustomerListPage(openPayload)}><Icon type="kehuzu" /></a>;
    };
    return newTitleList;
  }

  render() {
    const { data } = this.props;
    const newTitleList = this.getTitleList(titleList);
    return (
      <div className={styles.weeklySecurityTopTenBox}>
        <div className={styles.weeklyTtitle}>
          <InfoTitle
            head="近一周表现前十的证券"
            titleStyle={titleStyle}
          />
        </div>
        <div className={styles.weeklySecurityTopTenContainer}>
          <div className={styles.bodyBox}>
            <Table
              columns={newTitleList}
              dataSource={data}
              pagination={false}
              scroll={{ y: 276 }}
            />
          </div>
        </div>
      </div>
    );
  }
}
