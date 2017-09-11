/**
 * @file premission/Home.js
 *  权限申请
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Col } from 'antd';
import './home.less';
import Detail from '../../components/permission/Detail';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  detailMessage: state.permission.detailMessage,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  getDetailMessage: fetchDataFunction(true, 'permission/getDetailMessage'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Permission extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    detailMessage: PropTypes.object.isRequired,
    getDetailMessage: PropTypes.func.isRequired,
  }
  componentWillMount() {
    this.props.getDetailMessage({ code: 111 });
  }
  get getDetailComponent() {
    if (_.isEmpty(this.props.detailMessage)) {
      return null;
    }
    return <Detail {...this.props.detailMessage} />;
  }
  render() {
    return (
      <div className="premissionbox">
        <div className="pageBody">
          <Col span="24" className="leftSection" id="leftSection">
            123456
          </Col>
          <Col span="24" className="rightSection" id="rightSection">
            {this.getDetailComponent}
          </Col>
        </div>
      </div>
    );
  }
}

