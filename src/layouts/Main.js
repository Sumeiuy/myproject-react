/**
 * @file layouts/Main.js
 * @author maoquan(maoquan@htsc.com)
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { autobind } from 'core-decorators';

import ErrorBoundary from './ErrorBoundary';
import Loading from './Loading';
import withRouter from '../decorators/withRouter';

import ConnectedCreateServiceRecord from '../components/customerPool/list/createServiceRecord/ConnectedCreateServiceRecord';
import ContextProvider from './ContextProvider';
import Phone from '../components/common/phone';
import IEWarningModal from '../components/common/IEWarningModal';
import Mask from '../components/common/mask';
import fspGlobal from '../utils/fspGlobal';
import { date } from '../helper';
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
    currentCommonServiceRecord: PropTypes.object.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    motSelfBuiltFeedbackList: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    serviceRecordInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {
    loadingForceFull: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      showMask: false,
    };
    this.startTime = '';
    this.endTime = '';
  }

  componentDidMount() {
    const { getCustomerScope } = this.props;
    getCustomerScope(); // 加载客户池客户范围
  }

  // 电话挂断和继续回调函数
  @autobind
  phoneCallback(data) {
    const { type } = data;
    if (type === 'connected') {
      this.handlePhoneConnected(data);
    }
    if (type === 'end') {
      this.handlePhoneEnd(data);
    }
  }

  // 电话接通方法
  @autobind
  handlePhoneConnected() {
    this.startTime = moment();
  }

  // 电话挂断方法
  @autobind
  handlePhoneEnd(data) {
    // 没有成功发起通话
    if (!moment.isMoment(this.startTime)) {
      return;
    }
    this.endTime = moment();
    const phoneDuration = date.calculateDuration(
      this.startTime.valueOf(),
      this.endTime.valueOf(),
    );
    this.setState({ showMask: false });
    const serviceContentDesc = `${this.startTime.format('HH:mm:ss')}给客户发起语音通话，时长${phoneDuration}。`;
    const payload = {
      ...data,
      // 服务方式
      serveWay: 'HTSC Phone',
      // 任务类型，1：MOT  2：自建
      taskType: '2',
      // 服务记录内容
      serveContentDesc: serviceContentDesc,
      // 服务时间
      serveTime: this.endTime.format('YYYY-MM-DD HH:mm'),
      // 反馈时间
      feedBackTime: moment().format('YYYY-MM-DD'),
      // 添加成功后需要显示message提示
      noHints: true,
    };
    fspGlobal.phoneCallback(payload);
  }

  // 显示和隐藏通话蒙版
  @autobind
  handleShowMask(data) {
    this.setState({ showMask: data });
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
      serviceRecordInfo,
      location,
    } = this.props;
    const { showMask } = this.state;
    return (
      <LocaleProvider locale={zhCN}>
        <ContextProvider {...this.props} >
          <ErrorBoundary location={location}>
            <div className={styles.layout}>
              <div className={styles.main}>
                <div className={styles.container} id="container">
                  <div className={styles.content} id="content">
                    <IEWarningModal />
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
                            />
                          </div>
                        : null
                    }
                  </div>
                </div>
                <Phone
                  headless
                  onEnd={this.phoneCallback}
                  onConnected={this.phoneCallback}
                  handleShowMask={this.handleShowMask}
                />
                <Mask visible={showMask} />
              </div>
            </div>
          </ErrorBoundary>
        </ContextProvider>
      </LocaleProvider>
    );
  }
}
