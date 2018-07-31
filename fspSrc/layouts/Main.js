/**
 * @file layouts/Main.js
 * 最外层的框架主组件
 * @author zhufeiyang
 */

import React, { PureComponent } from 'react';
import _ from 'lodash';
import qs from 'query-string';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import withRouter from '../../src/decorators/withRouter';

import Header from './Header';
import Footer from './Footer';
import Tab from '../components/layout/Tab';
import FSPUnwrap from '../components/layout/FSPUnwrap';
import { constants } from '../../src/config';
import ConnectedCreateServiceRecord from '../../src/components/customerPool/list/createServiceRecord/ConnectedCreateServiceRecord';

import ContextProvider from '../../src/layouts/ContextProvider';
import IEWarningModal from '../../src/components/common/IEWarningModal';
import ErrorBoundary from '../../src/layouts/ErrorBoundary';
import PhoneWrapper from '../../src/layouts/PhoneWrapper';
import styles from './main.less';
import '../css/fspFix.less';
import '../../src/css/skin.less';
import emp from '../../src/helper/emp';
import api from '../../src/api';

const effects = {
  dictionary: 'app/getDictionary',
  customerScope: 'customerPool/getCustomerScope',
  empInfo: 'app/getEmpInfo',
  addServeRecord: 'customerPool/addCommonServeRecord',
  handleCloseClick: 'serviceRecordModal/handleCloseClick', // 手动上传日志
  // 删除文件
  ceFileDelete: 'performerView/ceFileDelete',
  getMenus: 'global/getMenus',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  ...state.global,
  ...state.app,
  menus: state.global.menus,
  loading: state.activity.global,
  loadingForceFull: state.activity.forceFull,
  custRange: state.customerPool.custRange,
  dict: state.app.dict,
  empInfo: state.app.empInfo,
  interfaceState: state.loading.effects,
  // 发送保存服务记录请求成功的服务id
  currentCommonServiceRecord: state.customerPool.currentCommonServiceRecord,
  // 显示隐藏添加服务记录弹窗
  serviceRecordModalVisible: state.app.serviceRecordModalVisible,
  // 服务弹窗对应的客户的经纪客户号
  serviceRecordModalVisibleOfId: state.app.serviceRecordModalVisibleOfId,
  // 服务弹窗对应的客户的经纪客户名
  serviceRecordModalVisibleOfName: state.app.serviceRecordModalVisibleOfName,
  // 客户uuid
  custUuid: state.performerView.custUuid,
  // 自建任务平台的服务类型、任务反馈字典
  motSelfBuiltFeedbackList: state.app.motSelfBuiltFeedbackList,
  serviceRecordInfo: state.app.serviceRecordInfo,
  // 任务反馈的字典
  taskFeedbackList: state.performerView.taskFeedbackList,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  getCustomerScope: fectchDataFunction(false, effects.customerScope),
  addServeRecord: fectchDataFunction(true, effects.addServeRecord),
  handleCloseClick: fectchDataFunction(false, effects.handleCloseClick),
  ceFileDelete: fectchDataFunction(true, effects.ceFileDelete),
  getMenus: fectchDataFunction(true, effects.getMenus),
  toggleServiceRecordModal: query => ({
    type: 'app/toggleServiceRecordModal',
    payload: query || false,
  }),
};

const PHONE = 'phone';

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends PureComponent {
  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    loading: PropTypes.number.isRequired,
    loadingForceFull: PropTypes.bool,
    push: PropTypes.func.isRequired,
    getCustomerScope: PropTypes.func.isRequired,
    interfaceState: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    currentCommonServiceRecord: PropTypes.object.isRequired,
    menus: PropTypes.object.isRequired,
    serviceRecordModalVisible: PropTypes.bool,
    serviceRecordModalVisibleOfId: PropTypes.string,
    serviceRecordModalVisibleOfName: PropTypes.string,
    addServeRecord: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    motSelfBuiltFeedbackList: PropTypes.array.isRequired,
    serviceRecordInfo: PropTypes.object.isRequired,
    taskFeedbackList: PropTypes.array.isRequired,
    getMenus: PropTypes.func.isRequired,
  }

  static defaultProps = {
    serviceRecordModalVisible: false,
    serviceRecordModalVisibleOfId: '',
    serviceRecordModalVisibleOfName: '',
    loadingForceFull: false,
  }

  componentDidMount() {
    const { getCustomerScope, getMenus } = this.props;
    getCustomerScope(); // 加载客户池客户范围
    getMenus();
  }

  @autobind
  setWinLocationSearch(postnId) {
    let newSearchStr = '';
    const nativeSearch = qs.parse(window.location.search);
    nativeSearch.postnId = postnId;
    newSearchStr = qs.stringify(nativeSearch);
    window.location.search = `?${newSearchStr}`;
  }

  @autobind
  handleHeaderSwitchRsp(rsp) {
    let fullUrl = '/chgPstn?';
    fullUrl += _.keys(rsp)
      .map(key => `${key}=${encodeURIComponent(rsp[key])}`)
      .join('&');
    api
      .postFspData(fullUrl,
        {},
        { isFullUrl: true, ignoreCatch: true },
      )
      .then(() => this.setWinLocationSearch(rsp.pstnId));
  }

  @autobind
  isMenuExists(menus) {
    return menus && !_.isEmpty(menus) && !_.isEmpty(menus.primaryMenu);
  }

  render() {
    const {
      children,
      location,
      loading,
      loadingForceFull,
      // 方法
      push,
      interfaceState,
      dict,
      empInfo: { empInfo = {}, empPostnList = [] },
      menus,
      currentCommonServiceRecord,
      addServeRecord,
      serviceRecordModalVisibleOfId,
      serviceRecordModalVisibleOfName,
      serviceRecordModalVisible,
      toggleServiceRecordModal,
      handleCloseClick,
      custUuid,
      ceFileDelete,
      serviceRecordInfo,
      taskFeedbackList,
    } = this.props;

    const { caller = '' } = serviceRecordInfo;

    // 当前服务记录弹窗是否由电话调起的
    const isPhoneCall = caller === PHONE;
    // 获取当前职位
    const empCurrentPosition = emp.getPstnId();
    return (
      <LocaleProvider locale={zhCN}>
        <ContextProvider {...this.props} >
          <IEWarningModal />
          <Helmet>
            <link rel="icon" href={constants.logoSrc} type="image/x-icon" />
          </Helmet>
          <ErrorBoundary location={location}>
            {
              this.isMenuExists(menus) ?
                <div id="react-layout" className={styles.layout}>
                  <Header
                    push={push}
                    location={location}
                    secondaryMenu={menus.secondaryMenu}
                    empInfo={empInfo}
                    empRspList={empPostnList}
                    empCurrentPosition={empCurrentPosition}
                    onSwitchRsp={this.handleHeaderSwitchRsp}
                    onIsolationWallModalShow={this.handleIsolationWallModalShow}
                  />
                  <div className={styles.main}>
                    <Tab
                      location={location}
                      push={push}
                      primaryMenu={menus.primaryMenu}
                    />
                    <FSPUnwrap
                      path={location.pathname}
                      loading={loading}
                      loadingForceFull={loadingForceFull}
                    >
                      <div id="react-content" className={styles.content}>
                        {
                          (!_.isEmpty(interfaceState) &&
                            !interfaceState[effects.dictionary] &&
                            !interfaceState[effects.customerScope] &&
                            !interfaceState[effects.empInfo] &&
                            React.isValidElement(children)) ?
                            children :
                            <div />
                        }
                      </div>
                      <Footer />
                    </FSPUnwrap>
                    <ConnectedCreateServiceRecord
                      handleCloseClick={handleCloseClick}
                      loading={interfaceState[effects.addServeRecord]}
                      key={serviceRecordModalVisibleOfId}
                      id={serviceRecordModalVisibleOfId}
                      name={serviceRecordModalVisibleOfName}
                      dict={dict}
                      empInfo={empInfo}
                      isShow={serviceRecordModalVisible}
                      addServeRecord={addServeRecord}
                      currentCommonServiceRecord={currentCommonServiceRecord}
                      onToggleServiceRecordModal={toggleServiceRecordModal}
                      custUuid={custUuid}
                      ceFileDelete={ceFileDelete}
                      taskFeedbackList={taskFeedbackList}
                      serviceRecordInfo={serviceRecordInfo}
                      isPhoneCall={isPhoneCall}
                    />
                    <PhoneWrapper />
                  </div>
                </div> : <div>Loading...</div>
            }
          </ErrorBoundary>
        </ContextProvider>
      </LocaleProvider>
    );
  }
}
