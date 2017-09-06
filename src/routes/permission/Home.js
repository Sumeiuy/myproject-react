/**
 * @file premission/Home.js
 *  权限申请
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { Col } from 'antd';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import PageHeader from '../../components/permission/PageHeader';
import styles from './home.less';


const mapStateToProps = () => ({

});


const mapDispatchToProps = {
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Permission extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }
  render() {
    const { location, replace } = this.props;
    return (
      <div className={styles.premissionbox}>
        <PageHeader
          location={location}
          replace={replace}
        />
        <div className={styles.pageBody}>
          <Col span="24" className={styles.leftSection}>
            123456
          </Col>
          <Col span="24" className={styles.rightSection}>
            wfdgfjhk
          </Col>
        </div>
      </div>
    );
  }
}

