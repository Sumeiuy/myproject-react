/**
 * @file feedback/Home.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PureComponent, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { Row, Col } from 'antd';
import SplitPane from 'react-split-pane';
import Icon from '../../components/common/Icon';
import Detail from '../../components/feedback/Detail';
import FeedbackList from '../../components/feedback/FeedbackList';
import FeedbackHeader from '../../components/feedback/FeedbackHeader';
import { constructPostBody } from '../../utils/helper';
import '../../css/react-split-pane-master.less';
import './home.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
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
      isEmpty: true,
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
    this.setDocumentScroll();
    window.addEventListener('resize', this.onResizeChange, false);
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: nextQuery = EMPTY_OBJECT } } = nextProps;
    const { location: { query: prevQuery = EMPTY_OBJECT }, getFeedbackList } = this.props;
    const { isResetPageNum = 'N', curPageNum, curPageSize } = nextQuery;

    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        // 只监测筛选条件是否变化
        getFeedbackList(constructPostBody(
          nextQuery,
          isResetPageNum === 'Y' ? 1 : curPageNum,
          isResetPageNum === 'Y' ? 10 : curPageSize,
        ));
      }
    }
  }

  componentDidUpdate() {
    this.setDocumentScroll();

    const { location: { pathname, query, query: { isResetPageNum } }, replace,
      list: { resultData = EMPTY_LIST } } = this.props;
    // 重置pageNum和pageSize
    if (isResetPageNum === 'Y') {
      replace({
        pathname,
        query: {
          ...query,
          isResetPageNum: 'N',
        },
      });
    }

    if (_.isEmpty(resultData)) {
      this.setState({ // eslint-disable-line
        isEmpty: true,
      });
    } else {
      this.setState({ // eslint-disable-line
        isEmpty: false,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeChange, false);
  }

  @autobind
  onResizeChange() {
    this.setDocumentScroll();
  }

  setDocumentScroll() {
    const docElemHeight = document.documentElement.clientHeight;
    /* eslint-disable */
    const containerElem = ReactDOM.findDOMNode(document.getElementById('container'));
    const leftSectionElem = ReactDOM.findDOMNode(document.getElementById('leftSection'));
    const rightSectionElem = ReactDOM.findDOMNode(document.getElementById('rightSection'));
    const nullElem = ReactDOM.findDOMNode(document.getElementById('empty'));
    const workspaceElem = ReactDOM.findDOMNode(document.getElementById('workspace-content'));
    /* eslint-enable */

    let topDistance = 0;
    const padding = 10;
    const boxPadding = 12;
    const bottomDistance = 48;

    if (leftSectionElem && rightSectionElem) {
      topDistance = leftSectionElem.getBoundingClientRect().top;
      const sectionHeight = docElemHeight - topDistance -
        bottomDistance - padding - boxPadding;
      leftSectionElem.style.height = `${sectionHeight}px`;
      rightSectionElem.style.height = `${sectionHeight}px`;
    }

    if (containerElem) {
      containerElem.style.overflow = 'auto';
      if (workspaceElem) {
        // FSP内嵌里面
        containerElem.style.height = `${docElemHeight - bottomDistance - padding - top}px`;
      } else {
        containerElem.style.height = `${docElemHeight - bottomDistance - padding}px`;
      }
    }

    if (nullElem) {
      const top = nullElem.getBoundingClientRect().top;
      nullElem.style.height = `${docElemHeight - top - bottomDistance - (2 * padding)}px`;
    }
  }

  /**
  * 检查两个对象部分属性是否完全相同
  * @param {*} dic 字典
  * @param {*} prevQuery 上一次query
  * @param {*} nextQuery 下一次query
  */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, OMIT_ARRAY);
    const nextQueryData = _.omit(nextQuery, OMIT_ARRAY);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  render() {
    const { list, location, replace } = this.props;
    const { isEmpty } = this.state;
    const emptyClass = classnames({
      none: !isEmpty,
      feedbackRow: true,
    });
    const existClass = classnames({
      none: isEmpty,
      feedbackRow: true,
    });
    return (
      <div className="feedbackbox">
        <FeedbackHeader
          location={location}
          replace={replace}
        />
        <Row className={emptyClass}>
          <Col span="24" className="rightSection" id="empty">
            <div className="feedbackList">
              <div className="isnull_dv">
                <div className="inner_dv">
                  <Icon type="meiyouxiangguanjieguo" className="myxgjg" />
                  <p>抱歉！没有找到相关结果</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <SplitPane split="vertical" minSize={518} maxSize={700} defaultSize={700} className="primary">
          <Row className={existClass}>
            <Col span="24" className="leftSection" id="leftSection">
              <FeedbackList
                list={list}
                replace={replace}
                location={location}
              />
            </Col>
          </Row>
          <Row className={existClass}>
            <Col span="24" className="rightSection" id="rightSection">
              <Detail
                location={location}
              />
            </Col>
          </Row>
        </SplitPane>
      </div>
    );
  }
}

