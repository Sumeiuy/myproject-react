/**
 * @file layouts/ErrorBoundary.js
 * @author maoquan
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { logCommon } from '../decorators/logable';
import ErrorPage from '../components/common/errorPage';
import styles from './errorBoundary.less';

export default class ErrorBoundary extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location.pathname !== nextProps.location.pathname) {
      return {
        error: false,
        location: nextProps.location,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      location: props.location,
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
          <ErrorPage errorId={errorId} location={this.props.location} />
        </div>
      );
    }
    return this.props.children;
  }
}
