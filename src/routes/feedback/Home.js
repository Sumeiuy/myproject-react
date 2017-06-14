/**
 * @file feedback/Home.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
// import { Row, Col } from 'antd';
// import { autobind } from 'core-decorators';
import { withRouter } from 'dva/router';
import FeedbackHeader from '../../components/feedback/FeedbackHeader';
import styles from './home.less';

@withRouter
export default class FeedBack extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  render() {
    const { location } = this.props;
    return (
      <div className={styles.feedbackbox}>
        <FeedbackHeader
          location={location}
        />
      </div>
    );
  }
}

