/**
 * @file feedback/Home.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
// import { Row, Col } from 'antd';
// import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import FeedbackHeader from '../../components/feedback/FeedbackHeader';
import styles from './home.less';


const mapStateToProps = ({
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class FeedBack extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  render() {
    const { location, push, replace } = this.props;
    return (
      <div className={styles.feedbackbox}>
        <FeedbackHeader
          location={location}
          push={push}
          replace={replace}
        />
      </div>
    );
  }
}

