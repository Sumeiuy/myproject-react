/**
 * @Author: sunweibin
 * @Date: 2018-06-19 15:10:27
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-19 16:41:38
 * @description 重点监控账户首页
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';

import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { dva } from '../../helper';

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
    this.state = {
      // 交易所选项
      stockExchange: '',
      // 监管措施类型
      measure: '',
      // 证件号码
      certificate: '',
      // 经纪客户号
      custId: '',
      // 当前页码
      pageNum: 1,
      // 每页条数
      pageSize: 10,
    };
  }

  componentDidMount() {
    // 初始化的时候查询一把没有筛选条件的值
    this.queryAccountList();
  }

  @autobind
  queryAccountList() {
    this.props.getAccountList(this.state);
  }

  render() {
    return (
      <div className={styles.keyMonitorAccountWrap}>
        首页
      </div>
    );
  }
}
