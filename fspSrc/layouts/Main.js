/**
 * @file layouts/Main.js
 * @author maoquan(maoquan@htsc.com)
 */

import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import { routerRedux, withRouter } from 'dva/router';

import Header from './Header';
// import Footer from './Footer';
import Tab from '../components/layout/Tab';

import { constants } from '../../src/config';
import ConnectedCreateServiceRecord from '../../src/components/customerPool/list/ConnectedCreateServiceRecord';

import styles from './main.less';
import '../../src/css/skin.less';

const effects = {
  dictionary: 'app/getDictionary',
  customerScope: 'customerPool/getCustomerScope',
  empInfo: 'app/getEmpInfo',
  addServeRecord: 'customerPool/addServeRecord',
  handleCloseClick: 'serviceRecordModal/handleCloseClick', // 手动上传日志
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  ...state.global,
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
  addServeRecordSuccess: state.customerPool.addServeRecordSuccess,
  // 服务弹窗对应的客户的经纪客户号
  serviceRecordModalVisibleOfId: state.app.serviceRecordModalVisibleOfId,
  // 服务弹窗对应的客户的经纪客户名
  serviceRecordModalVisibleOfName: state.app.serviceRecordModalVisibleOfName,
  // 客户uuid
  custUuid: state.performerView.custUuid,
});

const mapDispatchToProps = {
  push: routerRedux.push,
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
export default class Main extends PureComponent {

  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadingForceFull: PropTypes.bool,
    isBlockRemovePane: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    getCustomerScope: PropTypes.func.isRequired,
    interfaceState: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    serviceRecordModalVisible: PropTypes.bool,
    serviceRecordModalVisibleOfId: PropTypes.string,
    serviceRecordModalVisibleOfName: PropTypes.string,
    addServeRecordSuccess: PropTypes.bool.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    changePost: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    serviceRecordModalVisible: false,
    serviceRecordModalVisibleOfId: '',
    serviceRecordModalVisibleOfName: '',
    loadingForceFull: false,
  }

  componentDidMount() {
    const { getCustomerScope } = this.props;
    getCustomerScope(); // 加载客户池客户范围
  }

  render() {
    const {
      children,
      location,
      loading,
      isBlockRemovePane,
      loadingForceFull,
      // 方法
      push,
      interfaceState,
      dict,
      empInfo: { empInfo = {}, empPostnList = [] },
      addServeRecordSuccess,
      addServeRecord,
      serviceRecordModalVisibleOfId,
      serviceRecordModalVisibleOfName,
      serviceRecordModalVisible,
      toggleServiceRecordModal,
      handleCloseClick,
      custUuid,
      ceFileDelete,
    } = this.props;

    return (
      <div>
        <Helmet>
          <link rel="icon" href={constants.logoSrc} type="image/x-icon" />
        </Helmet>
        <div
          className={styles.layout}
        >
          <Header empInfo={empInfo} empRspList={empPostnList} />
          <div className={styles.main}>
            <div className={styles.content}>
              <Tab
                location={location}
                push={push}
                loading={loading}
                loadingForceFull={loadingForceFull}
                isBlockRemovePane={isBlockRemovePane}
              >
                <div>
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
                            addServeRecordSuccess={addServeRecordSuccess}
                            onToggleServiceRecordModal={toggleServiceRecordModal}
                            custUuid={custUuid}
                            ceFileDelete={ceFileDelete}
                          />
                        </div>
                        :
                        null
                  }
                </div>
              </Tab>
            </div>
            {/*  <Footer /> */}
          </div>
        </div>
      </div>
    );
  }
}
