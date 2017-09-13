/**
 * @file layouts/Main.js
 * @author maoquan(maoquan@htsc.com)
 */

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { withRouter } from 'dva/router';
import { connect } from 'dva';
import Loading from './Loading';

import styles from './main.less';
import '../css/skin.less';

const effects = {
  dictionary: 'customerPool/dictionary',
  customerScope: 'customerPool/getCustomerScope',
  empInfo: 'app/getEmpInfo',
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
  empInfo: state.app.empInfo,
  interfaceState: state.loading.effects,
});

const mapDispatchToProps = {
  getCustomerScope: fectchDataFunction(false, effects.customerScope),
  getEmpInfo: fectchDataFunction(false, effects.empInfo),
  getDictionary: fectchDataFunction(false, effects.dictionary),
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
  }

  static defaultProps = {
  }

  componentWillMount() {
    const { getCustomerScope, getEmpInfo, getDictionary } = this.props;
    getCustomerScope(); // 加载客户池客户范围
    getEmpInfo(); // 加载员工职责与职位
    getDictionary(); // 获取字典
  }

  render() {
    const { children, loading, interfaceState } = this.props;
    console.log('interfaceState>>>>', interfaceState);
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
                  children
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

