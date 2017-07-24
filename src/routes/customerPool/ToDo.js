/**
 * @file customerPool/ToDo.js
 *  目标客户池 待办流程列表页
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'dva/router';
// import { connect } from 'react-redux';

// const mapStateToProps = state => ({
// });

// const mapDispatchToProps = {
//   push: routerRedux.push,
//   replace: routerRedux.replace,
// };

// @connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ToDo extends PureComponent {

  // static propTypes = {
  //   push: PropTypes.func.isRequired,
  //   replace: PropTypes.func.isRequired,
  // }

  render() {
    return (
      <div>todo</div>
    );
  }
}
