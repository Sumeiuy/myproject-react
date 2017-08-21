/**
 * @file layouts/Main.js
 * @author maoquan(maoquan@htsc.com)
 */

import React, { Component, PropTypes } from 'react';
import { withRouter } from 'dva/router';
import { connect } from 'dva';
import Loading from './Loading';

import styles from './main.less';
import '../css/skin.less';

const effects = {
  customerScope: 'customerPool/getCustomerScope',
  empAllInfo: 'app/getEmpInfo',
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
  empAllInfo: state.app.empAllInfo,
});

const mapDispatchToProps = {
  getCustomerScope: fectchDataFunction(false, effects.customerScope),
  getEmpAllInfo: fectchDataFunction(false, effects.empAllInfo),
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool.isRequired,
    getCustomerScope: PropTypes.func.isRequired,
    getEmpAllInfo: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  componentWillMount() {
    const { getCustomerScope, getEmpAllInfo } = this.props;
    getCustomerScope(); // 加载客户池客户范围
    getEmpAllInfo(); // 加载员工职责与职位
  }

  render() {
    const { children, loading } = this.props;
    return (
      <div>
        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.container} id="container">
              <div className={styles.content} id="content">
                <Loading loading={loading} />
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// export default connect(({ app, loading }) => ({ app, loading: loading.models.app }))(App)

