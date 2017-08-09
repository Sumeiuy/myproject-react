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
  empInfo: state.app.empInfo,
});

const mapDispatchToProps = {
  getEmpInfo: fectchDataFunction(false, effects.empInfo),
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool.isRequired,
    getEmpInfo: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  componentWillMount() {
    const { getEmpInfo } = this.props;
    getEmpInfo(); // 加载员工职责与职位
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

