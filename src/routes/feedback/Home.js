/**
 * @file feedback/Home.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PureComponent, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { Row, Col } from 'antd';
import Icon from '../../components/common/Icon';
import Detail from '../../components/feedback/Detail';
import FeedbackList from '../../components/feedback/FeedbackList';
import FeedbackHeader from '../../components/feedback/FeedbackHeader';
import { constructPostBody } from '../../utils/helper';
import styles from './home.less';

const EMPTY_LIST = [];
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

  constructor(props) {
    super(props);
    this.state = {
      isNull: false,
    };
  }

  componentWillMount() {
    const { getFeedbackList, location: { query, query: {
      curPageNum,
      curPageSize,
     } } } = this.props;
    // 默认筛选条件
    getFeedbackList(constructPostBody(query, curPageNum || 1, curPageSize || 10));
  }

  componentDidMount() {
    // this.setDocumentScroll();
    // window.addEventListener('resize', this.onResizeChange, false);
  }

  componentWillReceiveProps(nextProps) {
    const { list: nextList } = nextProps;
    const { list: preList } = this.props;
    if (nextList !== preList) {
      const { resultData = EMPTY_LIST } = nextList;
      this.setState({
        isNull: !(resultData.length > 0),
      });
    }
  }

  componentDidUpdate() {
    // this.setDocumentScroll();
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.onResizeChange, false);
  }

  @autobind
  onResizeChange() {
    this.setDocumentScroll();
  }

  setDocumentScroll() {
    const docElemHeight = document.documentElement.clientHeight;
    /* eslint-disable */
    const leftSectionElem = ReactDOM.findDOMNode(document.getElementsByClassName('feedbackList')[0]);
    const rightSectionElem = ReactDOM.findDOMNode(document.getElementsByClassName('detail_box')[0]);
    /* eslint-enable */
    let topDistance = 0;
    const bottomDistance = 48;
    if (leftSectionElem) {
      topDistance = leftSectionElem.getBoundingClientRect().top;
      leftSectionElem.style.height = `${docElemHeight - topDistance - bottomDistance}px`;
    }
    if (rightSectionElem) {
      rightSectionElem.style.height = `${docElemHeight - topDistance - bottomDistance}px`;
    }
    document.documentElement.style.overflow = 'hidden';
  }

  render() {
    const { list, location, getFeedbackList, replace } = this.props;
    const { isNull } = this.state;
    return (
      <div className={styles.feedbackbox}>
        <FeedbackHeader
          location={location}
          replace={replace}
        />
        {
          isNull ?
            <Row className={styles.feedbackRow}>
              <Col span="24" className={styles.rightSection}>
                <div className="feedbackList">
                  <div className={styles.isnull_dv}>
                    <div className={styles.inner_dv}>
                      <Icon type="meiyouxiangguanjieguo" className={styles.myxgjg} />
                      <p>抱歉！没有找到相关结果</p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            :
            <Row className={styles.feedbackRow}>
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
        }
      </div>
    );
  }
}

