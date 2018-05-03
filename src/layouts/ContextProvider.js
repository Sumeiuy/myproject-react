/**
 * @file layouts/ContextProvider.js
 * 提供context
 * @author wangjunjun
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { stringify } from 'query-string';

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(null, mapDispatchToProps)
export default class ContextProvider extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    empInfo: PropTypes.object,
    dict: PropTypes.object,
    push: PropTypes.func,
    replace: PropTypes.func,
  };

  getChildContext() {
    const { empInfo, dict } = this.props;
    return {
      empInfo,
      dict,
      push: this.hackPush,
      replace: this.hackReplace,
    };
  }

  @autobind
  hackReplace(...args) {
    const { replace } = this.props;
    if (typeof args[0] === 'string') {
      return replace(...args);
    }
    const params = {
      search: `?${stringify(args[0].query)}`,
      ...args[0],
    };
    return replace(params);
  }

  @autobind
  hackPush(...args) {
    const { push } = this.props;
    // TODO 针对相同的地址，不切换
    if (typeof args[0] === 'string') {
      return push(...args);
    }
    const params = {
      search: `?${stringify(args[0].query)}`,
      ...args[0],
    };
    return push(params);
  }

  render() {
    const { children } = this.props;
    return (
      <div>{children}</div>
    );
  }
}
