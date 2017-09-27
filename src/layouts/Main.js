/**
 * @file layouts/Main.js
 * @author maoquan(maoquan@htsc.com)
 */

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { withRouter } from 'dva/router';
import { connect } from 'dva';
import Loading from './Loading';

import CreateServiceRecord from '../components/customerPool/list/CreateServiceRecord';

import styles from './main.less';
import '../css/skin.less';

const effects = {
  dictionary: 'app/getDictionary',
  customerScope: 'customerPool/getCustomerScope',
  empInfo: 'app/getEmpInfo',
  addServeRecord: 'customerPool/addServeRecord',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  ...state.app,
  loading: state.activity.global,
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
});

const mapDispatchToProps = {
  getCustomerScope: fectchDataFunction(false, effects.customerScope),
  getEmpInfo: fectchDataFunction(false, effects.empInfo),
  getDictionary: fectchDataFunction(false, effects.dictionary),
  toggleServiceRecordModal: query => ({
    type: 'app/toggleServiceRecordModal',
    payload: query || false,
  }),
  addServeRecord: fectchDataFunction(false, effects.addServeRecord),
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool.isRequired,
    getCustomerScope: PropTypes.func.isRequired,
    getEmpInfo: PropTypes.func.isRequired,
    interfaceState: PropTypes.object.isRequired,
    getDictionary: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    serviceRecordModalVisible: PropTypes.bool,
    serviceRecordModalVisibleOfId: PropTypes.string,
    addServeRecordSuccess: PropTypes.bool.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
    serviceRecordModalVisible: false,
    serviceRecordModalVisibleOfId: '',
  }

  componentDidMount() {
    const { getCustomerScope, getEmpInfo, getDictionary } = this.props;
    getCustomerScope(); // 加载客户池客户范围
    getEmpInfo(); // 加载员工职责与职位
    getDictionary(); // 获取字典
  }

  render() {
    const {
      children,
      loading,
      interfaceState,
      dict,
      empInfo: { empInfo = {} },
      addServeRecordSuccess,
      addServeRecord,
      serviceRecordModalVisibleOfId,
      serviceRecordModalVisible,
      toggleServiceRecordModal,
    } = this.props;
    return (
      <div>
        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.container} id="container">
              <div className={styles.content} id="content">
                <Loading loading={loading} />
                {
                  (!_.isEmpty(interfaceState) &&
                    !interfaceState[effects.dictionary] &&
                    !interfaceState[effects.customerScope] &&
                    !interfaceState[effects.empInfo]) ?
                      <div>
                        {children}
                        <CreateServiceRecord
                          loading={interfaceState[effects.addServeRecord]}
                          id={serviceRecordModalVisibleOfId}
                          dict={dict}
                          empInfo={empInfo}
                          isShow={serviceRecordModalVisible}
                          addServeRecord={addServeRecord}
                          addServeRecordSuccess={addServeRecordSuccess}
                          onToggleServiceRecordModal={toggleServiceRecordModal}
                        />
                      </div>
                      :
                      null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// export default connect(({ app, loading }) => ({ app, loading: loading.models.app }))(App)

