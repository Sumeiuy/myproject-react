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
import Loading from './Loading';
import withRouter from '../decorators/withRouter';

import ConnectedCreateServiceRecord from '../components/customerPool/list/ConnectedCreateServiceRecord';
import ContextProvider from './ContextProvider';
import styles from './main.less';
import '../css/skin.less';

const effects = {
  dictionary: 'app/getDictionary',
  customerScope: 'customerPool/getCustomerScope',
  empInfo: 'app/getEmpInfo',
  addServeRecord: 'customerPool/addCommonServeRecord',
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
  // 显示隐藏添加服务记录弹窗
  serviceRecordModalVisible: state.app.serviceRecordModalVisible,
  // 发送保存服务记录请求成功状态
  currentCommonServiceRecord: state.customerPool.currentCommonServiceRecord,
  // 服务弹窗对应的客户的经纪客户号
  serviceRecordModalVisibleOfId: state.app.serviceRecordModalVisibleOfId,
  // 服务弹窗对应的客户的经纪客户名
  serviceRecordModalVisibleOfName: state.app.serviceRecordModalVisibleOfName,
  // 客户uuid
  custUuid: state.performerView.custUuid,
  // 自建任务平台的服务类型、任务反馈字典
  motSelfBuiltFeedbackList: state.app.motSelfBuiltFeedbackList,
  // 服务弹窗的调用方
  serviceRecordModalVisibleOfCaller: state.app.serviceRecordModalVisibleOfCaller,
  prevRecordInfo: state.app.prevRecordInfo,
});

const mapDispatchToProps = {
  getCustomerScope: fectchDataFunction(false, effects.customerScope),
  toggleServiceRecordModal: query => ({
    type: 'app/toggleServiceRecordModal',
    payload: query || false,
  }),
  addServeRecord: fectchDataFunction(false, effects.addServeRecord),
  handleCloseClick: fectchDataFunction(false, effects.handleCloseClick),
  ceFileDelete: fectchDataFunction(true, effects.ceFileDelete),
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool.isRequired,
    loadingForceFull: PropTypes.bool,
    getCustomerScope: PropTypes.func.isRequired,
    interfaceState: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    serviceRecordModalVisible: PropTypes.bool,
    serviceRecordModalVisibleOfId: PropTypes.string,
    serviceRecordModalVisibleOfName: PropTypes.string,
    currentCommonServiceRecord: PropTypes.object.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    motSelfBuiltFeedbackList: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    serviceRecordModalVisibleOfCaller: PropTypes.string,
    prevRecordInfo: PropTypes.object,
  }

  static defaultProps = {
    serviceRecordModalVisible: false,
    serviceRecordModalVisibleOfId: '',
    serviceRecordModalVisibleOfName: '',
    loadingForceFull: false,
    serviceRecordModalVisibleOfCaller: '',
    prevRecordInfo: {},
  }

  componentDidMount() {
    const { getCustomerScope } = this.props;
    getCustomerScope(); // 加载客户池客户范围
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
      serviceRecordModalVisibleOfId,
      serviceRecordModalVisibleOfName,
      serviceRecordModalVisible,
      toggleServiceRecordModal,
      loadingForceFull,
      handleCloseClick,
      custUuid,
      ceFileDelete,
      motSelfBuiltFeedbackList,
      serviceRecordModalVisibleOfCaller,
      prevRecordInfo,
    } = this.props;
    return (
      <LocaleProvider locale={zhCN}>
        <ContextProvider {...this.props} >
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
                            taskFeedbackList={motSelfBuiltFeedbackList}
                            caller={serviceRecordModalVisibleOfCaller}
                            prevRecordInfo={prevRecordInfo}
                          />
                        </div>
                      : null
                  }
                </div>
              </div>
            </div>
          </div>
        </ContextProvider>
      </LocaleProvider>
    );
  }
}
