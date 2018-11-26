/**
 * @Description: 客户360-合约管理页面
 * @Author: Liujianshu-K0240007
 * @Date: 2018-11-20 14:41:29
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-11-22 10:52:30
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import { Tabs } from 'antd';

import { dva } from '../../../../helper';
import withRouter from '../../../../decorators/withRouter';
import logable, { logCommon } from '../../../../decorators/logable';
import ProtocolTab from '../../../../components/customerDetailContractManage/ProtocolTab';
import AgreementTab from '../../../../components/customerDetailContractManage/AgreementTab';
import {
  DEFAULT_ACTIVE_TAB,
  CONTRACT_MANAGE_TABS,
} from '../../../../components/customerDetailContractManage/config';
import styles from './home.less';

const dispatch = dva.generateEffect;

const TabPane = Tabs.TabPane;

const effects = {
  // 查询协议列表
  queryProtocolList: 'contractManage/queryProtocolList',
  // 获取登陆人信息
  queryLoginInfo: 'contractManage/queryLoginInfo',
  // 查询是否通过前置条件
  queryPassPrecondition: 'contractManage/queryPassPrecondition',
  // 提交协议
  submitProtocol: 'contractManage/submitProtocol',
  // 删除协议
  deleteProtocol: 'contractManage/deleteProtocol',
  // 查询合同列表
  queryAgreementList: 'contractManage/queryAgreementList',
};

const mapStateToProps = state => ({
  // 员工基本信息
  empInfo: state.app.empInfo,
  // 顾客信息
  custInfo: state.customerDetail.customerBasicInfo,
  // 协议列表数据
  protocolList: state.contractManage.protocolList,
  // 登陆人信息
  loginInfo: state.contractManage.loginInfo,
  // 通过前置条件
  passPrecondition: state.contractManage.passPrecondition,
  // 提交接口数据
  submitData: state.contractManage.submitData,
  // 删除接口数据
  deleteData: state.contractManage.deleteData,
  // 合同列表数据
  agreementList: state.contractManage.agreementList,
});

const mapDispatchToProps = {
  // 获取协议列表
  queryProtocolList: dispatch(effects.queryProtocolList, { forceFull: true }),
  // 查询登陆人信息
  queryLoginInfo: dispatch(effects.queryLoginInfo, { forceFull: true }),
  // 查询前置条件
  queryPassPrecondition: dispatch(effects.queryPassPrecondition, { forceFull: true }),
  // 提交协议
  submitProtocol: dispatch(effects.submitProtocol, { forceFull: true }),
  // 删除协议
  deleteProtocol: dispatch(effects.deleteProtocol, { forceFull: true }),
  // 获取合同列表
  queryAgreementList: dispatch(effects.queryAgreementList, { forceFull: true }),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ContractManage extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    custInfo: PropTypes.object.isRequired,
    queryProtocolList: PropTypes.func.isRequired,
    protocolList: PropTypes.object.isRequired,
    queryLoginInfo: PropTypes.func.isRequired,
    loginInfo: PropTypes.object.isRequired,
    queryPassPrecondition: PropTypes.func.isRequired,
    passPrecondition: PropTypes.object.isRequired,
    submitProtocol: PropTypes.func.isRequired,
    submitData: PropTypes.object.isRequired,
    deleteProtocol: PropTypes.func.isRequired,
    deleteData: PropTypes.object.isRequired,
    queryAgreementList: PropTypes.func.isRequired,
    agreementList: PropTypes.object.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { location: { query: { contractTabKey = DEFAULT_ACTIVE_TAB } } } = props;
    this.state = {
      // 默认激活的Tab，协议
      activeTabKey: contractTabKey,
    };
  }

  // 切换Tab,并且记录日志，这样主要是由于切换Tab的onChange回调没有返回Tab的名称
  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey }, () => {
      const { replace } = this.context;
      const { location: { query = {} } } = this.props;
      replace({
        query: {
          ...query,
          contractTabKey: activeTabKey,
        }
      });
    });
    logCommon({
      type: 'Click',
      payload: {
        name: `${CONTRACT_MANAGE_TABS[activeTabKey]}tab`,
      },
    });
  }

  render() {
    const { activeTabKey } = this.state;
    const {
      empInfo,
      location,
      custInfo,
      protocolList,
      queryProtocolList,
      loginInfo,
      queryLoginInfo,
      queryPassPrecondition,
      passPrecondition,
      submitProtocol,
      submitData,
      deleteProtocol,
      deleteData,
      queryAgreementList,
      agreementList,
    } = this.props;
    return (
      <div className={styles.wrapper}>
        <Tabs type="card" onChange={this.handleTabChange} activeKey={activeTabKey}>
          <TabPane tab="协议" key="protocol">
            <div className={styles.tabPaneWrap}>
              <ProtocolTab
                location={location}
                empInfo={empInfo}
                custInfo={custInfo}
                data={protocolList}
                queryList={queryProtocolList}
                loginInfo={loginInfo}
                queryLoginInfo={queryLoginInfo}
                queryPassPrecondition={queryPassPrecondition}
                passPrecondition={passPrecondition}
                submitProtocol={submitProtocol}
                submitData={submitData}
                deleteProtocol={deleteProtocol}
                deleteData={deleteData}
              />
            </div>
          </TabPane>
          <TabPane tab="合约" key="contract">
            <div className={styles.tabPaneWrap}>
              456
            </div>
          </TabPane>
          <TabPane tab="合同" key="agreement">
            <div className={styles.tabPaneWrap}>
              <AgreementTab
                location={location}
                data={agreementList}
                queryList={queryAgreementList}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
