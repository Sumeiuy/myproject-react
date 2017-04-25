/**
 * @file layouts/Main.js
 * @author maoquan(maoquan@htsc.com)
 */

import React, { Component, PropTypes } from 'react';
import { withRouter } from 'dva/router';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';

import { constants } from '../config';

import Header from './Header';
import Loading from './Loading';
import Footer from './Footer';
import Sider from './Sider';

import styles from './main.less';
import '../css/skin.less';

const mapStateToProps = state => ({
  ...state.app,
  loading: state.activity.global,
});

const mapDispatchToProps = {
  switchMenuPopover: () => ({
    type: 'app/switchMenuPopover',
  }),
  switchSider: () => ({
    type: 'app/switchSider',
  }),
  changeOpenKeys: openKeys => ({
    type: 'app/changeOpenKeys',
    payload: { navOpenKeys: openKeys },
  }),
  changeTheme: () => ({
    type: 'app/changeTheme',
  }),
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    // 侧栏折叠
    siderFold: PropTypes.bool.isRequired,
    // 是否深色主题
    darkTheme: PropTypes.bool.isRequired,
    siderAvailable: PropTypes.bool.isRequired,
    navOpenKeys: PropTypes.array.isRequired,

    switchMenuPopover: PropTypes.func.isRequired,
    switchSider: PropTypes.func.isRequired,
    changeOpenKeys: PropTypes.func.isRequired,
    changeTheme: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  render() {
    const {
      children,
      location,
      siderFold,
      darkTheme,
      siderAvailable,
      navOpenKeys,
      // 方法
      switchSider,
      changeOpenKeys,
      changeTheme,
      loading,
    } = this.props;

    const headerProps = {
      siderFold,
      switchSider,
    };

    const siderProps = {
      location,
      siderFold,
      darkTheme,
      navOpenKeys,
      changeTheme,
      changeOpenKeys,
    };

    return (
      <div>
        <Helmet>
          <link rel="icon" href={constants.logoSrc} type="image/x-icon" />
        </Helmet>
        <div
          className={
            classnames(
              styles.layout,
              {
                [styles.fold]: siderAvailable ? false : siderFold,
              },
              {
                [styles.withnavbar]: siderAvailable,
              },
            )
          }
        >
          {!siderAvailable
            ? (
              <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
                <Sider {...siderProps} />
              </aside>
            ) : ''
          }
          <div className={styles.main}>
            <Header {...headerProps} />
            {/* 此处在目前投顾业绩汇总模块中不需要 */}
            {/* <Bread location={location} /> */}
            <div className={styles.container}>
              <div className={styles.content}>
                <Loading loading={loading} />
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}


// export default connect(({ app, loading }) => ({ app, loading: loading.models.app }))(App)

