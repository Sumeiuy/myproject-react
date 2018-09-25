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
import classNames from 'classnames';
import withRouter from '../../src/decorators/withRouter';

import Header from './Header';
import Footer from './Footer';
import Tab from '../components/layout/Tab';
import FSPUnwrap from '../components/layout/FSPUnwrap';
import { constants } from '../../src/config';
import ConnectedCreateServiceRecord from '../../src/components/customerPool/list/createServiceRecord/ConnectedCreateServiceRecord';
import ConnectedSignCustomerLabel from '../../src/components/customerPool/list/modal/ConnectedSignCustomerLabel';

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
  // 获取客户反馈字典
  getMotCustfeedBackDict: 'app/getMotCustfeedBackDict',
  customerScope: 'customerPool/getCustomerScope',
  addServeRecord: 'customerPool/addCommonServeRecord',
  // 服务记录和电话记录关联
  addCallRecord: 'customerPool/addCallRecord',
  handleCloseClick: 'serviceRecordModal/handleCloseClick', // 手动上传日志
  // 删除文件
  ceFileDelete: 'performerView/ceFileDelete',
  getEmpInfoAndMenu: 'app/getEmpInfoAndMenu',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  ...state.global,
  ...state.app,
  menus: state.app.menus,
  loading: state.activity.global,
  loadingForceFull: state.activity.forceFull,
  custRange: state.customerPool.custRange,
  dict: state.app.dict,
  empInfo: state.app.empInfo,
  interfaceState: state.loading.effects,
  // 发送保存服务记录请求成功的服务id
  currentCommonServiceRecord: state.customerPool.currentCommonServiceRecord,
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
  toggleServiceRecordModal: query => ({
    type: 'app/toggleServiceRecordModal',
    payload: query || false,
  }),
  getMotCustfeedBackDict: fectchDataFunction(true, effects.getMotCustfeedBackDict),
  // 服务记录和电话记录关联
  addCallRecord: fectchDataFunction(true, effects.addCallRecord),
  getEmpInfoAndMenu: fectchDataFunction(true, effects.getEmpInfoAndMenu),
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
    addServeRecord: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    motSelfBuiltFeedbackList: PropTypes.array.isRequired,
    getMotCustfeedBackDict: PropTypes.func.isRequired,
    serviceRecordInfo: PropTypes.object.isRequired,
    getEmpInfoAndMenu: PropTypes.func.isRequired,
  }

  static defaultProps = {
    loadingForceFull: false,
  }

  constructor(props) {
    super(props);
    this.handleMousewheel = _.throttle(this.handleBackToTopVisible, 1000);
  }

  state = {
    backToTopVisible: false,
  }

  componentDidMount() {
    this.wheelEventArray.forEach(eventType =>
      document.documentElement.addEventListener(eventType, this.handleMousewheel));
    this.props.getEmpInfoAndMenu();
    this.props.getCustomerScope(); // 加载客户池客户范围
  }

  componentWillUnmount() {
    this.wheelEventArray.forEach(eventType =>
      document.documentElement.removeEventListener(eventType, this.handleMousewheel));
  }

  @autobind
  setWinLocationSearch(postnId) {
    let newSearchStr = '';
    const nativeSearch = qs.parse(window.location.search);
    nativeSearch.postnId = postnId;
    newSearchStr = qs.stringify(nativeSearch);
    window.location.search = `?${newSearchStr}`;
  }

  setCanCallPhoneState(empInfo = {}) {
    window.canCallPhone = empInfo.canCall;
  }

  wheelEventArray = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll']

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
  handleBackToTopVisible() {
    if (document.documentElement.scrollTop > 120) {
      this.setState({
        backToTopVisible: true,
      });
    } else {
      this.setState({
        backToTopVisible: false,
      });
    }
  }

  @autobind
  handleBackToTopClick() {
    document.documentElement.scrollTop = 0;
    this.setState({
      backToTopVisible: false,
    });
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
      toggleServiceRecordModal,
      handleCloseClick,
      custUuid,
      ceFileDelete,
      serviceRecordInfo,
      motSelfBuiltFeedbackList,
      getMotCustfeedBackDict,
      addCallRecord,
    } = this.props;

    const { caller = '' } = serviceRecordInfo;

    // 当前服务记录弹窗是否由电话调起的
    const isPhoneCall = caller === PHONE;
    // 获取当前职位
    const empCurrentPosition = emp.getPstnId();

    this.setCanCallPhoneState(this.props.empInfo);

    const backToTopCls = classNames({
      [styles.backToTop]: true,
      [styles.show]: this.state.backToTopVisible,
    });

    return (
      <LocaleProvider locale={zhCN}>
        <ContextProvider {...this.props} >
          <IEWarningModal />
          <Helmet>
            <link rel="icon" href={constants.logoSrc} type="image/x-icon" />
          </Helmet>
          <ErrorBoundary location={location}>
            {
              this.isMenuExists(menus) && !_.isEmpty(empInfo) ?
                <div id="react-layout" className={styles.layout}>
                  <div className={backToTopCls} onClick={this.handleBackToTopClick} />
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
                      key={serviceRecordInfo.id}
                      dict={dict}
                      empInfo={empInfo}
                      addServeRecord={addServeRecord}
                      currentCommonServiceRecord={currentCommonServiceRecord}
                      onToggleServiceRecordModal={toggleServiceRecordModal}
                      custUuid={custUuid}
                      ceFileDelete={ceFileDelete}
                      taskFeedbackList={motSelfBuiltFeedbackList}
                      serviceRecordInfo={serviceRecordInfo}
                      isPhoneCall={isPhoneCall}
                    />
                    <ConnectedSignCustomerLabel />
                    <PhoneWrapper
                      motSelfBuiltFeedbackList={motSelfBuiltFeedbackList}
                      getMotCustfeedBackDict={getMotCustfeedBackDict}
                      currentCommonServiceRecord={currentCommonServiceRecord}
                      addServeRecord={addServeRecord}
                      addCallRecord={addCallRecord}
                      toggleServiceRecordModal={toggleServiceRecordModal}
                    />
                  </div>
                </div> : <div>Loading...</div>
            }
          </ErrorBoundary>
        </ContextProvider>
      </LocaleProvider>
    );
  }
}
