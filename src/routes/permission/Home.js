/**
 * @file premission/Home.js
 *  权限申请
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { Col } from 'antd';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { constructPostBody } from '../../utils/helper';
import PageHeader from '../../components/permission/PageHeader';
import PermissionList from '../../components/permission/PermissionList';

import styles from './home.less';


const mapStateToProps = state => ({
  list: state.permission.list,
});

const getDataFunction = loading => query => ({
  type: 'permission/getPermissionList',
  payload: query || {},
  loading,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  getPermissionList: getDataFunction(true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Permission extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    getPermissionList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  componentWillMount() {
    const { getPermissionList, location: { query, query: {
      curPageNum,
      curPageSize,
     } } } = this.props;
    // 默认筛选条件
    getPermissionList(constructPostBody(query, curPageNum || 1, curPageSize || 10));
  }

  render() {
    const { list, location, replace } = this.props;
    return (
      <div className={styles.premissionbox}>
        <PageHeader
          location={location}
          replace={replace}
        />
        <div className={styles.pageBody}>
          <Col span="24" className={styles.leftSection}>
            <PermissionList
              list={list}
              replace={replace}
              location={location}
            />
          </Col>
          <Col span="24" className={styles.rightSection}>
            wfdgfjhk
          </Col>
        </div>
      </div>
    );
  }
}

