/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情-重复客户分析
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-05 15:49:11
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Table } from 'antd';
import moment from 'moment';
import { number, time } from '../../../helper';
import { sourceType, titleList as titleListConfig } from '../config';
import styles from './customerRepeatAnalyze.less';
import logable from '../../../decorators/logable';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const titleList = titleListConfig.custRepeat;
const timeFormater = 'YYYY年MM月DD日';
// 当前日期减一天为默认日期
const DEFAULT_TIME = moment().subtract(1, 'days').format('YYYY-MM-DD');
export default class CustomerRepeatAnalyze extends PureComponent {
  static propTypes = {
    // 当前组合code
    combinationCode: PropTypes.string,
    // 订购客户数据
    data: PropTypes.object.isRequired,
    // 组合数据，用于跳转到客户列表页面
    combinationData: PropTypes.object,
    // 打开持仓查客户页面
    openCustomerListPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    combinationCode: '',
    combinationData: EMPTY_OBJECT,
  }

  @autobind
  getNewTitleList(list) {
    const newTitleList = [...list];
    _.find(newTitleList, item => item.key === 'custProportion').render = text => (
      <div className={styles.processBox}>
        <div className={styles.processContainer}>
          <span style={{ width: text }} />
        </div>
        <em>{text}</em>
      </div>
    );
    return newTitleList;
  }

  // 由于后端返回的列表数据存在id重复的情况，所以拼一个不会重复的rowKey用作渲染时的key
  @autobind
  getTransformList(list) {
    return list.map((item, index) => (
      {
        ...item,
        rowKey: `${item.customerId}${index}`,
      }
    ));
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '客户持仓重合比例分析',
      value: '$args[0].name',
    },
  })
  handleOpenCustomerListPage(openPayload) {
    const { openCustomerListPage } = this.props;
    openCustomerListPage(openPayload);
  }

  render() {
    const {
      data,
      data: {
        list = EMPTY_LIST,
      },
      combinationData,
      combinationCode,
    } = this.props;
    const newTitleList = this.getNewTitleList(titleList);
    const openPayload = {
      name: combinationData.composeName,
      code: combinationData.productCode,
      source: sourceType.combination,
      combinationCode,
    };
    return (
      <div className={styles.orderingCustomerBox}>
        <div className={`${styles.headBox} clearfix`}>
          <h3>客户持仓重合比例分析</h3>
          <a onClick={() => this.handleOpenCustomerListPage(openPayload)}>进入客户列表</a>
        </div>
        <div className={styles.tipsBox}>
          截止
          {time.format(data.time || DEFAULT_TIME, timeFormater)}
，当前组合订购客户共计
          <span className={styles.total}>{number.thousandFormat(data.total || 0)}</span>
人
        </div>
        <Table
          columns={newTitleList}
          dataSource={this.getTransformList(list)}
          pagination={false}
          rowKey="rowKey"
        />
      </div>
    );
  }
}
