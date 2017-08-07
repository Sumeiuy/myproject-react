/**
 * @file customerPool/CustomerList.js
 *  客户列表
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'dva/router';
// import { connect } from 'react-redux';
import { Row, Col } from 'antd';

// const mapStateToProps = state => ({
// });

// const mapDispatchToProps = {
//   push: routerRedux.push,
//   replace: routerRedux.replace,
// };

// @connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CustomerList extends PureComponent {
  // static propTypes = {
  //   location: PropTypes.object.isRequired,
  //   push: PropTypes.func.isRequired,
  //   replace: PropTypes.func.isRequired,
  // }

  // static defaultProps = {}

  render() {
    return (
      <div className="page-customerlist">
        <Row type="flex" justify="space-between" align="middle">
          <Col span={12}>
            <p className="total-num">找到满足业务办理条件的客户<em>&nbsp;{40}&nbsp;</em>户</p>
          </Col>
          <Col span={12} />
        </Row>
      </div>
    );
  }
}
