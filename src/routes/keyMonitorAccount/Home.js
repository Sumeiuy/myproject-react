/**
 * @Author: sunweibin
 * @Date: 2018-06-19 15:10:27
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-28 11:56:36
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
import { dva, emp, permission } from '../../helper';
import { openFspTab } from '../../utils';
import { LIST_TABLE_COLUMNS, DEFAULT_OPTION } from './config';

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

// 筛选条件的key的集合
const FILTER_INPUT_KEYS = ['exchangeType', 'punishType', 'idNo', 'custNumber'];

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
    dict: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 交易所选项
      exchangeType: '',
      // 监管措施类型
      punishType: '',
      // 证件号码
      idNo: '',
      // 经纪客户号
      custNumber: '',
      pageNum: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    // 初始化的时候查询一把没有筛选条件的值
    const query = this.getQueryFromLocation(this.props.location);
    this.queryAccountList(query);
  }

  @autobind
  getQueryFromLocation(location) {
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
      pageNum: parseInt(pageNum, 10),
      pageSize: parseInt(pageSize, 10),
    };
  }

  @autobind
  getSelectOptions(list) {
    if (_.isEmpty(list)) {
      return [];
    }
    return _.map([DEFAULT_OPTION, ...list], (option) => {
      const { key, value } = option;
      return {
        label: value,
        value: key,
      };
    });
  }

  @autobind
  queryAccountList(query) {
    this.props.getAccountList({
      ...query,
      orgId: emp.getOrgId(),
    });
  }

  @autobind
  resetFilter() {
    this.setState({
      punishType: '',
      idNo: '',
      custNumber: '',
      pageNum: 1,
      exchangeType: '',
    });
  }

  @autobind
  mapObjectToLocation(obj = {}) {
    const { replace } = this.context;
    const { location: { query, pathname } } = this.props;
    if (_.isEmpty(obj)) {
      // 如果未传obj，则表示清空参数
      replace({
        pathname,
        query: {},
      });
    } else {
      replace({
        pathname,
        query: {
          ...query,
          ...obj,
        },
      });
    }
  }

  @autobind
  addOnCellPropsForColumns(columns) {
    return _.map(columns, (column) => {
      const { key } = column;
      // 给客户号的单元格添加点击事件
      if (key === 'custNumber') {
        return {
          ...column,
          render(text) {
            return (<span className={styles.custNumberCell}>{text}</span>);
          },
          onCell: record => ({
            onClick: () => this.handleCustNumberCellClick(record),
          }),
        };
      }
      return column;
    });
  }

  @autobind
  hasJumpTo360CustViewPermission(record) {
    // 若登录人是该客户的主服务经理
    const isMainManager = emp.getId() === record.managerNo;
    const hasPermission = permission.hasJumpTo360CustViewKeyMonitorAccountPermission();
    return isMainManager || hasPermission;
  }

  @autobind
  handleCustNumberCellClick(record) {
    if (_.isEmpty(record.custNumber)) {
      return;
    }
    // 此处需要增加权限控制
    if (!this.hasJumpTo360CustViewPermission(record)) {
      return;
    }
    const { custType, custNumber } = record;
    const { push } = this.context;
    const param = {
      id: 'FSP_360VIEW_M_TAB',
      title: '客户360视图-客户信息',
      // 必须要写上，否则，在360视图存在的情况下，再跳转到360视图时，
      // 360视图不会刷新，且React界面如果有弹框存在，不会消失
      forceRefresh: true,
      activeSubTab: ['投资者评估管理', '重点监控账户'],
    };
    const url = `/customerCenter/360/${custType}/main?id=${custNumber}`;
    openFspTab({
      routerAction: push,
      url,
      pathname: '/customerCenter/customerDetail',
      param,
      state: {
        url,
      },
    });
  }


  @autobind
  handleExchangeTypeSelectChange(select, value) {
    this.setState({
      exchangeType: value,
    });
  }

  @autobind
  handlePunishTypeInputChange(e) {
    this.setState({ punishType: e.target.value });
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
    this.mapObjectToLocation();
    this.queryAccountList({
      exchangeType: '',
      punishType: '',
      idNo: '',
      custNumber: '',
      pageNum: 1,
      pageSize: 10,
    });
    this.resetFilter();
  }

  @autobind
  handleQueryBtnClick() {
    const query = _.pick(this.state, FILTER_INPUT_KEYS);
    this.mapObjectToLocation({
      pageNum: 1,
      ...query,
    });
    this.queryAccountList({
      pageNum: 1,
      pageSize: 10,
      ...query,
    });
  }

  @autobind
  handlePaginationChange(pageNum) {
    const query = this.getQueryFromLocation(this.props.location);
    this.setState({ pageNum });
    this.queryAccountList({
      ...query,
      pageNum,
      pageSize: 10,
    });
    this.mapObjectToLocation({ pageNum });
  }

  render() {
    const {
      exchangeType,
      punishType,
      idNo,
      custNumber,
    } = this.state;
    const { dict } = this.context;
    if (_.isEmpty(dict)) {
      return null;
    }
    const {
      exchangeType: EXCHANGETYPE,
    } = dict;
    const { accountListInfo: { accountList = [], page = {} } } = this.props;
    const columns = this.addOnCellPropsForColumns(LIST_TABLE_COLUMNS);
    const exchangeTypeSelectOptions = this.getSelectOptions(EXCHANGETYPE);

    return (
      <div className={styles.keyMonitorAccountWrap}>
        <div className={styles.filterArea}>
          <div className={styles.filterItem}>
            <div className={styles.item}>
              <span className={styles.label}>交易所：</span>
              <Select
                needShowKey={false}
                data={exchangeTypeSelectOptions}
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
              <Input
                className={styles.inputItem}
                value={punishType}
                onChange={this.handlePunishTypeInputChange}
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
            rowKey="moniKey"
            pagination={false}
            scroll={{ x: 3050 }}
            dataSource={accountList}
            columns={columns}
          />
        </div>
        <div className={styles.pageArea}>
          {
            _.isEmpty(page) ? null :
            (
              <Pagination
                current={page.curPageNum}
                pageSize={page.pageSize}
                total={page.totalRecordNum}
                onChange={this.handlePaginationChange}
              />
            )
          }
        </div>
      </div>
    );
  }
}
