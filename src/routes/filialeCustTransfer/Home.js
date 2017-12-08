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
import { withRouter } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import { message, Button, Modal } from 'antd';
import _ from 'lodash';

import InfoForm from '../../components/common/infoForm';
import DropDownSelect from '../../components/common/dropdownSelect';
import CommonTable from '../../components/common/biz/CommonTable';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';

import styles from './home.less';

const confirm = Modal.confirm;
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
  // 服务经理数据
  managerData: state.filialeCustTransfer.managerData,
  // 新服务经理列表
  newManagerList: state.filialeCustTransfer.newManagerList,
});

const mapDispatchToProps = {
  // 获取客户列表
  getCustList: fetchDataFunction(false, 'filialeCustTransfer/getCustList'),
  // 获取原服务经理
  getOldManager: fetchDataFunction(false, 'filialeCustTransfer/getOldManager'),
  // 获取新服务经理
  getNewManagerList: fetchDataFunction(false, 'filialeCustTransfer/getNewManagerList'),
  // 选择新服务经理
  selectNewManager: fetchDataFunction(false, 'filialeCustTransfer/selectNewManager'),
  // 提交保存
  saveChange: fetchDataFunction(false, 'filialeCustTransfer/saveChange'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class FilialeCustTransfer extends PureComponent {
  static propTypes = {
    // 获取客户列表
    getCustList: PropTypes.func.isRequired,
    custList: PropTypes.array,
    // 获取原服务经理
    getOldManager: PropTypes.func.isRequired,
    // 获取新服务经理
    getNewManagerList: PropTypes.func.isRequired,
    newManagerList: PropTypes.array,
    // 选择新的服务经理
    selectNewManager: PropTypes.func.isRequired,
    // 服务经理数据
    managerData: PropTypes.array,
    // 提交保存
    saveChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    custList: EMPTY_LIST,
    managerData: EMPTY_LIST,
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

  // 选择客户
  @autobind
  handleSelectClient(v) {
    this.setState({
      client: v,
    }, () => {
      // 选择客户之后触发搜索，清空关键词
      this.handleSearchClient();
      this.selectCustComponent.clearSearchValue();
      // 选择客户之后触发查询该客户的原服务经理
      const { getOldManager } = this.props;
      getOldManager({
        custId: v.custId,
      });
    });
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
    }, () => {
      // 选择服务经理之后触发搜索，清空关键词
      this.handleSearchNewManager();
      this.selectManagerComponent.clearSearchValue();
      // 将选择的新服务经理和原服务经理数据合并用作展示
      console.log('111', v);
      const { selectNewManager } = this.props;
      selectNewManager(v);
    });
  }

  // 查询新服务经理
  @autobind
  handleSearchNewManager(v = '') {
    const { getNewManagerList } = this.props;
    getNewManagerList({
      login: v,
    });
  }

  // 提交
  @autobind
  handleSubmit() {
    const { client, newManager } = this.state;
    const { managerData } = this.props;
    const managerDataItem = managerData[0];
    if (_.isEmpty(client)) {
      message.error('请选择客户');
      return;
    }
    if (_.isEmpty(newManager)) {
      message.error('请选择新客户经理');
      return;
    }
    if (managerDataItem.hasContract) {
      const that = this;
      confirm({
        title: '确认要划转吗?',
        content: '该客户名下有生效中的合作合约，请确认是否划转?',
        onOk() {
          that.sendRequest();
        },
      });
      return;
    }
    this.sendRequest();
  }

  // 发送请求
  @autobind
  sendRequest() {
    const { client, newManager } = this.state;
    const { saveChange } = this.props;
    console.log('abcd');
    saveChange({
      custId: client.custId,
      custType: client.custType,
      integrationId: newManager.newIntegrationId,
      orgName: newManager.newOrgName,
      postnName: newManager.newPostnName,
      postnId: newManager.newPostnId,
    });
  }

  // 取消
  @autobind
  handleCancel() {
    console.log('cancel');
  }

  render() {
    const {
      custList,
      newManagerList,
      managerData,
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
                  value=""
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
                  showObjKey="showSelectName"
                  objId="newLogin"
                  value=""
                  searchList={newManagerList}
                  emitSelectItem={this.handleSelectNewManager}
                  emitToSearch={this.handleSearchNewManager}
                  boxStyle={dropDownSelectBoxStyle}
                  ref={ref => this.selectManagerComponent = ref}
                />
              </InfoForm>
            </div>
          </div>
          <CommonTable
            data={managerData}
            titleList={titleList}
          />
        </div>
        <div className={styles.buttonBox}>
          <Button
            type="primary"
            size="large"
            onClick={this.handleSubmit}
          >确认
          </Button>
          <Button
            size="large"
            onClick={this.handleCancel}
          >取消
          </Button>
        </div>
      </div>
    );
  }
}
