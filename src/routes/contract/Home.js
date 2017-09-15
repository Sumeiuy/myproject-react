/**
 * @file contract/Home.js
 *  合作合约
 * @author wanghan
 */

import React, { PureComponent, PropTypes } from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
// import _ from 'lodash';
// import classnames from 'classnames';
// import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
// import { getEnv } from '../../utils/helper';
import './home.less';
// import ContractDetail from '../../components/contract/ContractDetail';

// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
// const BROWSER = getEnv();
const getDataFunction = loading => query => ({
  type: 'feedback/getFeedbackList',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  list: state.feedback.list,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  getFeedbackList: getDataFunction(true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Contract extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      paneMinSize: 200,
      paneMaxSize: 600,
    };
  }

  // componentWillMount() {
  // }

  // componentDidMount() {
  // }

  // componentWillReceiveProps(nextProps) {
  // }

  // componentDidUpdate() {
  // }

  // componentWillUnmount() {
  // }

  render() {
    return (
      <div>
        list
      </div>
    );
  }
}
