/**
 * @file layouts/ErrorBoundary.js
 * @author maoquan
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { logCommon } from '../decorators/logable';
import styles from './errorBoundary.less';

export default class ErrorBoundary extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  static getDerivedStateFromProps() {
    return {
      error: false,
    };
  }

  reportError({ error, info, errorId }) {
    logCommon({
      type: 'ReactError',
      payload: {
        name: errorId,
        message: error.message,
        stack: error.stack,
        componentStack: info.componentStack,
      },
    });
  }

  componentDidCatch(error, info) {
    const errorId = `${Math.random()}`.slice(2);
    this.setState({
      error,
      info,
      errorId,
    });
    this.reportError({ error, info, errorId });
  }

  render() {
    const { error, errorId } = this.state;
    if (error) {
      return (
        <div className={styles.container}>
          <p className={styles.message}>当前页面遇到问题，请稍后再试（{errorId}）</p>
        </div>
      );
    }
    return this.props.children;
  }
}
