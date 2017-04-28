/**
 * @file layouts/Main.js
 * @author maoquan(maoquan@htsc.com)
 */

import React, { Component, PropTypes } from 'react';
import { withRouter } from 'dva/router';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import { constants } from '../config';
import Loading from './Loading';
import Footer from './Footer';

import styles from './main.less';
import '../css/skin.less';

const mapStateToProps = state => ({
  ...state.app,
  loading: state.activity.global,
});

const mapDispatchToProps = {
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool.isRequired,
  }

  render() {
    const { children, loading } = this.props;
    return (
      <div>
        <Helmet>
          <link rel="icon" href={constants.logoSrc} type="image/x-icon" />
        </Helmet>
        <div className={styles.layout}>
          <div className={styles.main}>
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

