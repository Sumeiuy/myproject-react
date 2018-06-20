/**
 * @Author: sunweibin
 * @Date: 2018-06-19 15:10:27
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-20 16:59:09
 * @description 重点监控账户首页
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { Input, Button, Table, Pagination } from 'antd';
import _ from 'lodash';

import Select from '../../components/common/Select';

import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { dva, emp } from '../../helper';
import { LIST_TABLE_COLUMNS } from './config';

import styles from './home.less';

const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 重点监控账户列表
  accountListInfo: state.keyMonitorAccount.accountListInfo,
});

const mapDispatchToProps = {
  // 重点监控账户列表获取 api
  getAccountList: effect('keyMonitorAccount/getAccountList', { forceFull: true }),
  // 清空数据 api
  clearRedux: effect('keyMonitorAccount/clearReduxState', { loading: false }),
};


@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class KeyMonitorAccountHome extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    accountListInfo: PropTypes.object.isRequired,
    getAccountList: PropTypes.func.isRequired,
    clearRedux: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const initialState = this.getStateFromLocation(props.location);
    this.state = initialState;
  }

  componentDidMount() {
    // 初始化的时候查询一把没有筛选条件的值
    this.queryAccountList();
  }

  @autobind
  getStateFromLocation(location) {
    const { query: {
      // 交易所选项
      exchangeType = '',
      // 监管措施类型
      punishType = '',
      // 证件号码
      idNo = '',
      // 经纪客户号
      custNumber = '',
      pageNum = 1,
      pageSize = 10,
    } } = location;
    return {
      exchangeType,
      punishType,
      idNo,
      custNumber,
      pageNum: Number.parseInt(pageNum, 10),
      pageSize: Number.parseInt(pageSize, 10),
    };
  }

  @autobind
  queryAccountList() {
    const query = this.getStateFromLocation();
    this.props.getAccountList({ ...query, orgId: emp.getOrgId(), postnId: emp.getPstnId() });
  }

  @autobind
  resetFilter(otherObj = {}) {
    this.setState({
      exchangeType: '',
      punishType: '',
      idNo: '',
      custNumber: '',
      ...otherObj,
    });
  }

  @autobind
  mapObjectToLocation(obj = {}) {
    const { replace } = this.context;
    const { location: { query, pathname } } = this.props;
    if (_.isEmpty(obj)) {
      // 如果未传obj，则表示清空参数
      replace({ pathname, query: {} });
    }
    replace({
      pathname,
      query: {
        ...query,
        ...obj,
      },
    });
  }

  @autobind
  handleExchangeTypeSelectChange(select, value) {
    this.setState({ exchangeType: value });
  }

  @autobind
  handlePunishTypeSelectChange(select, value) {
    this.setState({ punishType: value });
  }

  @autobind
  handleIDNoInputChange(e) {
    this.setState({ idNo: e.target.value });
  }

  @autobind
  handleCustNumberInputChange(e) {
    this.setState({ custNumber: e.target.value });
  }

  @autobind
  handleRestBtnClick() {
    // 重置按钮，查询默认值
    this.mapObjectToLocation();
    this.queryAccountList();
    this.resetFilter({ pageNum: 1 });
  }

  @autobind
  handleQueryBtnClick() {
    // 每次点击都是查询,查询完条件之后需要清空筛选项
    this.mapObjectToLocation({ pageNum: 1, ...this.state });
    this.queryAccountList();
    this.resetFilter();
  }

  @autobind
  handlePaginationChange(pageNum) {
    this.setState({ pageNum }, () => this.queryAccountList(false));
    this.mapObjectToLocation({ pageNum });
  }

  render() {
    const {
      exchangeType,
      punishType,
      idNo,
      custNumber,
    } = this.state;

    const { accountListInfo: { accountList = [], page = {} } } = this.props;

    return (
      <div className={styles.keyMonitorAccountWrap}>
        <div className={styles.filterArea}>
          <div className={styles.filterItem}>
            <div className={styles.item}>
              <span className={styles.label}>交易所：</span>
              <Select
                style={{ width: 90 }}
                name="exchangeType"
                value={exchangeType}
                onChange={this.handleExchangeTypeSelectChange}
              />
            </div>
          </div>
          <div className={styles.filterItem}>
            <div className={styles.item}>
              <span className={styles.label}>监管措施类型：</span>
              <Select
                style={{ width: 130 }}
                className={styles.selectItem}
                name="punishType"
                value={punishType}
                onChange={this.handlePunishTypeSelectChange}
              />
            </div>
          </div>
          <div className={styles.filterItem}>
            <div className={styles.item}>
              <span className={styles.label}>证件号码：</span>
              <Input
                className={styles.inputItem}
                value={idNo}
                onChange={this.handleIDNoInputChange}
              />
            </div>
          </div>
          <div className={styles.filterItem}>
            <div className={styles.item}>
              <span className={styles.label}>经纪客户号：</span>
              <Input
                className={styles.inputItem}
                value={custNumber}
                onChange={this.handleCustNumberInputChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.btnGroup}>
          <Button type="default" className={styles.resetBtn} onClick={this.handleRestBtnClick}>重置</Button>
          <Button type="primary" onClick={this.handleQueryBtnClick}>查询</Button>
        </div>
        <div className={styles.listArea}>
          <Table
            pagination={false}
            scroll={{ x: 3000 }}
            dataSource={accountList}
            columns={LIST_TABLE_COLUMNS}
          />
        </div>
        <div className={styles.pageArea}>
          {
            _.isEmpty(page) ? null :
            (
              <Pagination
                current={page.pageNum}
                pageSize={page.pageSize}
                total={page.totalCount}
                onChange={this.handlePaginationChange}
              />
            )
          }
        </div>
      </div>
    );
  }
}
