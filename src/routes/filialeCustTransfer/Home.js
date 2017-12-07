/*eslint-disable */
/*
 * @Description: 分公司客户划转 home 页面
 * @Author: XuWenKang
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-11-30 14:34:44
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import { message, Button } from 'antd';
import _ from 'lodash';

import { emp } from '../../helper';
import InfoForm from '../../components/common/infoForm';
import DropDownSelect from '../../components/common/dropdownSelect';
import CommonTable from '../../components/common/biz/CommonTable';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';

import styles from './home.less';


const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const { filialeCustTransfer: { titleList } } = seibelConfig;
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 客户列表
  custList: state.filialeCustTransfer.custList,
  // 原服务经理
  oldManager: state.filialeCustTransfer.oldManager,
  // 新服务经理列表
  newManagerList: state.filialeCustTransfer.newManagerList,
});

const mapDispatchToProps = {
  // 获取客户列表
  getCustList: fetchDataFunction(false, 'filialeCustTransfer/getCustList'),
  // 获取原客户经理
  getOldManager: fetchDataFunction(false, 'filialeCustTransfer/getOldManager'),
  // 获取新客户经理
  getNewManagerList: fetchDataFunction(false, 'filialeCustTransfer/getNewManagerList'),
  // 提交保存
  saveChange: fetchDataFunction(false, 'filialeCustTransfer/saveChange'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class Contract extends PureComponent {
  static propTypes = {
    // 获取客户列表
    getCustList: PropTypes.func.isRequired,
    custList: PropTypes.array,
    // 获取原客户经理
    getOldManager: PropTypes.func.isRequired,
    oldManager: PropTypes.object,
    // 获取新客户经理
    getNewManagerList: PropTypes.func.isRequired,
    newManagerList: PropTypes.array,
  }

  static defaultProps = {
    custList: EMPTY_LIST,
    oldManager: EMPTY_OBJECT,
    newManagerList: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 所选客户
      client: EMPTY_OBJECT,
      // 所选新服务经理
      newManager: EMPTY_OBJECT,
    };
  }

  componentWillMount() {

  }

  // 选择客户
  @autobind
  handleSelectClient(v) {
    console.log('1',v);
    this.setState({
      client: v,
    },()=> {
      // 选择客户之后触发查询该客户的原服务经理
      const { getOldManager } = this.props;
      getOldManager({
        custId: v.custId,
      })
    })
  }

  // 查询客户
  @autobind
  handleSearchClient(v = '') {
    const { getCustList } = this.props;
    getCustList({
      keyword: v,
    });
  }

  // 选择新服务经理
  @autobind
  handleSelectNewManager(v) {
    this.setState({
      newManager: v,
    })
  }

  // 查询新服务经理
  @autobind
  handleSearchNewManager(v = '') {
    const { getNewManagerList } = this.props;
    getNewManagerList({
      login: v,
    })
  }

  render() {
    const {
      custList,
      newManagerList,
    } = this.props;
    return (
      <div className={styles.filialeCustTransferWrapper} >
        <div className={styles.filialeCustTransferBox} >
          <h3 className={styles.title}>分公司客户划转</h3>
          <div className={styles.selectBox}>
            <div className={styles.selectLeft}>
              <InfoForm label="选择客户" required>
                <DropDownSelect
                  placeholder="选择客户"
                  showObjKey="custName"
                  objId="custId"
                  value=''
                  searchList={custList}
                  emitSelectItem={this.handleSelectClient}
                  emitToSearch={this.handleSearchClient}
                  boxStyle={dropDownSelectBoxStyle}
                  ref={ref => this.selectCustComponent = ref}
                />
              </InfoForm>
            </div>
            <div className={styles.selectRight}>
              <InfoForm label="选择新服务经理" required>
                <DropDownSelect
                  placeholder="选择新服务经理"
                  showObjKey="empName"
                  objId="login"
                  value=''
                  searchList={newManagerList}
                  emitSelectItem={this.handleSelectNewManager}
                  emitToSearch={this.handleSearchNewManager}
                  boxStyle={dropDownSelectBoxStyle}
                  ref={ref => this.selectCustComponent = ref}
                />
              </InfoForm>
            </div>
          </div>
          <CommonTable
            data={EMPTY_LIST}
            titleList={titleList}
          />
        </div>
        <div className={styles.buttonBox}>
          <Button type="primary" size="large">确认</Button>
          <Button size="large">取消</Button>
        </div>
      </div>
    );
  }
}
/*eslint-disable */