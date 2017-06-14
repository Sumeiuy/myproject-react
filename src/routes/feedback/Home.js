/**
 * @file feedback/Home.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { Row, Col } from 'antd';
// import _ from 'lodash';
import Detail from '../../components/feedback/Detail';
import FeedbackList from '../../components/feedback/FeedbackList';
import styles from './home.less';

const mapStateToProps = state => ({
  list: state.feedback.list,
});

const getDataFunction = loading => query => ({
  type: 'feedback/getFeedbackList',
  payload: query || {},
  loading,
});

const mapDispatchToProps = {
  getFeedbackList: getDataFunction(true),
  push: routerRedux.push,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class FeedBack extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    getFeedbackList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  // constructor(props) {
  //   super(props);
  // }

  componentWillMount() {
    const { getFeedbackList, location: { query } } = this.props;
    // 默认筛选条件
    getFeedbackList({
      ...query,
      pageNum: 1,
      pageSize: 10,
    });
  }

  render() {
    const { list, location, getFeedbackList } = this.props;
    return (
      <div className={styles.feedbackbox}>
        <div className="tab-box">
          <h3>tab</h3>
        </div>
        <Row>
          <Col span="10">
            <FeedbackList
              list={list}
              location={location}
              getFeedbackList={getFeedbackList}
            />
          </Col>
          <Col span="14">
            <Detail />
          </Col>
        </Row>
      </div>
    );
  }
}

