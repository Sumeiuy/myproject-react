/*
 * @Author: XuWenKang
 * @Description: 精选组合-近一周表现前十的证券
 * @Date: 2018-04-17 16:38:02
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-11 14:55:24
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table, Popover } from 'antd';
// import { Table, Popover, Tabs } from 'antd';
import classnames from 'classnames';

import InfoTitle from '../common/InfoTitle';
import Icon from '../common/Icon';
import { time } from '../../helper';
import {
  sourceType,
  overlayStyle,
  securityType as securityTypeConfig,
  titleList as titleListConfig,
  formatDateStr,
} from './config';
import styles from './weeklySecurityTopTen.less';
import logable from '../../decorators/logable';

const titleStyle = {
  fontSize: '16px',
};
// securityType 里股票对应的值
const STOCK_CODE = securityTypeConfig[0].value;
const titleList = titleListConfig.tenStocks;

// const TabPane = Tabs.TabPane;

export default class WeeklySecurityTopTen extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    permission: PropTypes.bool.isRequired,
    orgId: PropTypes.string,
    openCustomerListPage: PropTypes.func.isRequired,
    openStockPage: PropTypes.func.isRequired,
    openDetailPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    orgId: '',
  }

  // 设置表格表头
  @autobind
  getTitleColumns(array) {
    const newTitleList = [...array];
    // 证券名称与证券代码组合列，点击跳转到个股资讯页面
    newTitleList[0].render = (text, record) => {
      const {
        code,
        name,
        securityType,
        reason,
      } = record;
      return (
        <div className={styles.securityName}>
          <a
            title={`${name} ${code}`}
            onClick={() => this.handleSecurityClick(securityType, code, `${name}(${code})`)}
          >
            {name}
（
            {code}
）
          </a>
          <div className={styles.reason}>{this.renderPopover(reason)}</div>
        </div>
      );
    };
    // 证券调入时间
    newTitleList[1].render = text => (<div>{time.format(text, formatDateStr)}</div>);
    // 涨跌幅
    newTitleList[2].render = (text) => {
      const change = this.handlePercentChange((text || 0).toFixed(2));
      const bigThanZero = text >= 0;
      const changeClassName = classnames({
        [styles.up]: bigThanZero,
        [styles.down]: !bigThanZero,
      });
      return (
        <span className={changeClassName}>
          {change}
%
        </span>
      );
    };
    // 组合名称
    newTitleList[3].render = (text, record) => {
      const openDetailPayload = {
        id: record.combinationCode,
        name: record.combinationName,
      };
      return (
        <div
          className={styles.name}
        >
          <a
            title={text}
            onClick={() => this.handleNameClick(openDetailPayload)}
          >
            {text}
          </a>
        </div>
      );
    };
    // 查看持仓客户链接，点击打开持仓客户
    newTitleList[4].render = (text, record) => {
      const openPayload = {
        name: record.name,
        code: record.code,
        type: record.securityType,
        source: sourceType.security,
      };
      return <a className={styles.customerLink} onClick={() => this.handleOpenCustomerListPage(openPayload)}><Icon type="kehuzu" /></a>;
    };
    return newTitleList;
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '近一周表现前十的证券',
      value: '$args[0].name',
    },
  })
  handleOpenCustomerListPage(openPayload) {
    const { openCustomerListPage } = this.props;
    openCustomerListPage(openPayload);
  }

  // 组合名称点击事件
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '近一周表现前十的证券',
      value: '$args[0].name',
    },
  })
  handleNameClick(obj) {
    const { openDetailPage } = this.props;
    openDetailPage(obj);
  }

  // 证券名称点击事件
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '近一周表现前十的证券',
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
  handlePercentChange(value) {
    let newValue = value;
    if (value > 0) {
      newValue = `+${newValue}`;
    }
    return newValue;
  }

  // 设置单元格的 popover
  @autobind
  renderPopover(value) {
    let reactElement = null;
    if (value) {
      reactElement = (
        <Popover
          placement="bottomLeft"
          content={value}
          trigger="hover"
          overlayStyle={overlayStyle}
        >
          <div className={styles.ellipsis}>
            {value}
          </div>
        </Popover>
      );
    } else {
      reactElement = '调入理由：暂无';
    }
    return reactElement;
  }

  render() {
    const { data } = this.props;
    const newTitleList = this.getTitleColumns(titleList);
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
              scroll={{ y: 289 }}
              rowKey="code"
            />
          </div>
          {/* <Tabs defaultActiveKey="1">
            <TabPane tab="证券" key="1">
              <div className={styles.bodyBox}>
                <Table
                  columns={newTitleList}
                  dataSource={data}
                  pagination={false}
                  scroll={{ y: 289 }}
                  rowKey="code"
                />
              </div>
            </TabPane>
            <TabPane tab="组合" key="2">
              <div className={styles.bodyBox}>
                <Table
                  columns={newTitleList}
                  dataSource={data}
                  pagination={false}
                  scroll={{ y: 289 }}
                  rowKey="code"
                />
              </div>
            </TabPane>
          </Tabs> */}
        </div>
      </div>
    );
  }
}
