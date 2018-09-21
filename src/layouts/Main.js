/**
 * @file layouts/Main.js
 * @author maoquan(maoquan@htsc.com)
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'dva';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ErrorBoundary from './ErrorBoundary';
import Loading from './Loading';
import withRouter from '../decorators/withRouter';

import ConnectedCreateServiceRecord from '../components/customerPool/list/createServiceRecord/ConnectedCreateServiceRecord';
import ConnectedSignCustomerLabel from '../components/customerPool/list/modal/ConnectedSignCustomerLabel';
import ContextProvider from './ContextProvider';
import IEWarningModal from '../components/common/IEWarningModal';
import PhoneWrapper from './PhoneWrapper';
import styles from './main.less';
import '../css/skin.less';

const effects = {
  dictionary: 'app/getDictionary',
  getMotCustfeedBackDict: 'app/getMotCustfeedBackDict',
  customerScope: 'customerPool/getCustomerScope',
  addServeRecord: 'customerPool/addCommonServeRecord',
  // 服务记录和电话记录关联
  addCallRecord: 'customerPool/addCallRecord',
  handleCloseClick: 'serviceRecordModal/handleCloseClick', // 手动上传日志
  // 删除文件
  ceFileDelete: 'performerView/ceFileDelete',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  ...state.app,
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
});

const mapDispatchToProps = {
  getCustomerScope: fectchDataFunction(false, effects.customerScope),
  toggleServiceRecordModal: query => ({
    type: 'app/toggleServiceRecordModal',
    payload: query || false,
  }),
  addServeRecord: fectchDataFunction(true, effects.addServeRecord),
  handleCloseClick: fectchDataFunction(false, effects.handleCloseClick),
  ceFileDelete: fectchDataFunction(true, effects.ceFileDelete),
  getMotCustfeedBackDict: fectchDataFunction(true, effects.getMotCustfeedBackDict),
  // 服务记录和电话记录关联
  addCallRecord: fectchDataFunction(true, effects.addCallRecord),
};

const PHONE = 'phone';

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.number.isRequired,
    loadingForceFull: PropTypes.bool,
    getCustomerScope: PropTypes.func.isRequired,
    interfaceState: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    currentCommonServiceRecord: PropTypes.object.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    motSelfBuiltFeedbackList: PropTypes.array.isRequired,
    getMotCustfeedBackDict: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    serviceRecordInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {
    loadingForceFull: false,
  }

  componentDidMount() {
    this.props.getCustomerScope(); // 加载客户池客户范围
  }
  render() {
    const {
      children,
      loading,
      interfaceState,
      dict,
      empInfo: { empInfo = {} },
      currentCommonServiceRecord,
      addServeRecord,
      toggleServiceRecordModal,
      loadingForceFull,
      handleCloseClick,
      custUuid,
      ceFileDelete,
      motSelfBuiltFeedbackList,
      getMotCustfeedBackDict,
      serviceRecordInfo,
      addCallRecord,
      location,
    } = this.props;

    const { caller = '' } = serviceRecordInfo;
    // 当前服务记录弹窗是否由电话调起的
    const isPhoneCall = caller === PHONE;
    return (
      <LocaleProvider locale={zhCN}>
        <ContextProvider {...this.props} >
          <IEWarningModal />
          <ErrorBoundary location={location}>
            <div className={styles.layout}>
              <div className={styles.main}>
                <div className={styles.container} id="container">
                  <div className={styles.content} id="content">
                    <Loading loading={loading} forceFull={loadingForceFull} />
                    {
                      (!_.isEmpty(interfaceState) &&
                        !interfaceState[effects.dictionary] &&
                        !interfaceState[effects.customerScope] &&
                        !interfaceState[effects.empInfo]) ?
                          <div>
                            {children}
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
                        : null
                    }
                  </div>
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </ContextProvider>
      </LocaleProvider>
    );
  }
}
