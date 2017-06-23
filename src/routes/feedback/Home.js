/**
 * @file feedback/Home.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { Row, Col } from 'antd';
import Detail from '../../components/feedback/Detail';
import FeedbackList from '../../components/feedback/FeedbackList';
import FeedbackHeader from '../../components/feedback/FeedbackHeader';
import { constructPostBody } from '../../utils/helper';
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
  replace: routerRedux.replace,
  getFeedbackList: getDataFunction(true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class FeedBack extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    getFeedbackList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  componentWillMount() {
    const { getFeedbackList, location: { query, query: {
      curPageNum,
      curPageSize,
     } } } = this.props;
    // 默认筛选条件
    getFeedbackList(constructPostBody(query, curPageNum || 1, curPageSize || 10));
  }


  render() {
    const { list, location, getFeedbackList, replace } = this.props;
    return (
      <div className={styles.feedbackbox}>
        <FeedbackHeader
          location={location}
          replace={replace}
        />
        <Row>
          <Col span="10" className={styles.leftSection}>
            <FeedbackList
              list={list}
              location={location}
              getFeedbackList={getFeedbackList}
              replace={replace}
            />
          </Col>
          <Col span="14" className={styles.rightSection}>
            <Detail
              location={location}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

