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
import { constructPostBody, getEnv } from '../../utils/helper';
import '../../css/react-split-pane-master.less';
import './home.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const BROWSER = getEnv();
const DEFAULTSIZE = 430;
let splitPane;
let Pane;
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
      paneMinSize: 200,
      paneMaxSize: 600,
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
    this.panMov(DEFAULTSIZE);
    this.initPane();
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
    this.panMov(DEFAULTSIZE);
    this.initPane();
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
    // 重置外层容器样式
    // 防止影响其他界面
    /* eslint-disable */
    const UTBContentElem = ReactDOM.findDOMNode(document.getElementById('UTBContent'));
    if (UTBContentElem) {
      UTBContentElem.style.marginRight = '30px';
      UTBContentElem.style.marginBottom = '10px';
    }
    const containerElem = ReactDOM.findDOMNode(document.getElementById('container'));
    /* eslint-enable */
    containerElem.style.height = 'auto';

    // 取消事件监听
    window.removeEventListener('resize', this.onResizeChange, false);
  }

  @autobind
  onResizeChange() {
    this.setDocumentScroll();
    this.initPane();
  }

  setDocumentScroll() {
    /* eslint-disable */
    const UTBContentElem = ReactDOM.findDOMNode(document.getElementById('UTBContent'));
    if (UTBContentElem) {
      UTBContentElem.style.marginRight = '0px';
      UTBContentElem.style.marginBottom = '0px';
    }

    const docElemHeight = document.documentElement.clientHeight;
    const paginationElem = document.querySelector('.ant-pagination');
    const tableElem = ReactDOM.findDOMNode(document.querySelector('.ant-table'));
    const containerElem = ReactDOM.findDOMNode(document.getElementById('container'));
    const leftSectionElem = ReactDOM.findDOMNode(document.getElementById('leftSection'));
    const rightSectionElem = ReactDOM.findDOMNode(document.getElementById('rightSection'));
    const nullElem = ReactDOM.findDOMNode(document.getElementById('empty'));
    const workspaceElem = ReactDOM.findDOMNode(document.getElementById('workspace-content'));
    const innerElem = ReactDOM.findDOMNode(document.querySelector('.inner'));
    const resizerElem = ReactDOM.findDOMNode(document.querySelector('.Resizer'));
    const feedbackHeaderElem = ReactDOM.findDOMNode(document.querySelector('.feedbackHeader'));
    const feedbackListElem = ReactDOM.findDOMNode(document.querySelectorAll('.feedbackList')[1]);
    /* eslint-enable */

    let topDistance = 0;
    const boxPadding = 12;
    let paginationElemHeight = 0;
    let headerHeight = 0;

    if (paginationElem) {
      const computedStyle = window.getComputedStyle(paginationElem, null);
      paginationElemHeight = parseFloat(computedStyle.getPropertyValue('height'), 10) +
        parseFloat(computedStyle.paddingTop) +
        parseFloat(computedStyle.paddingBottom) +
        parseFloat(computedStyle.marginTop) +
        parseFloat(computedStyle.marginBottom);
    }
    if (feedbackHeaderElem) {
      headerHeight = feedbackHeaderElem.getBoundingClientRect().height;
    }

    if (feedbackListElem) {
      feedbackListElem.style.paddingLeft = '10px';
    }

    if (leftSectionElem && rightSectionElem) {
      topDistance = leftSectionElem.getBoundingClientRect().top;
      const sectionHeight = docElemHeight - topDistance;
      leftSectionElem.style.height = `${sectionHeight - boxPadding}px`;
      rightSectionElem.style.height = `${sectionHeight}px`;

      if (tableElem) {
        tableElem.style.height = `${sectionHeight - boxPadding - paginationElemHeight}px`;
        tableElem.style.overflow = 'auto';
      }
      if (innerElem) {
        innerElem.style.overflow = 'auto';
      }
      if (resizerElem) {
        resizerElem.style.height = `${sectionHeight}px`;
      }
    }

    if (containerElem) {
      if (workspaceElem) {
        // FSP内嵌里面
        containerElem.style.height = `${docElemHeight - headerHeight - boxPadding}px`;
      } else {
        containerElem.style.height = `${docElemHeight}px`;
      }
    }

    if (nullElem && this.state.isEmpty) {
      const top = nullElem.getBoundingClientRect().top;
      containerElem.style.height = `${docElemHeight - top}px`;
      feedbackListElem.style.height = `${docElemHeight - top}px`;
    }
  }

  /**
   * 检查部分属性是否相同
   * @param {*} prevQuery 前一次query
   * @param {*} nextQuery 后一次query
   */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, OMIT_ARRAY);
    const nextQueryData = _.omit(nextQuery, OMIT_ARRAY);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  // splitPan onChange回调函数
  @autobind
  panchange(size) {
    this.panMov(size);
    this.initPane();
    const boxWidth = splitPane.getBoundingClientRect().width;
    if (size > boxWidth * 0.5) {
      Pane.className = 'Pane vertical Pane2 allWidth';
    } else {
      Pane.className = 'Pane vertical Pane2';
    }
  }

  // 重新给pan2样式赋值
  panMov(size) {
    splitPane = ReactDOM.findDOMNode(document.querySelector('.SplitPane'));// eslint-disable-line
    Pane = ReactDOM.findDOMNode(document.querySelector('.Pane2'));// eslint-disable-line
    if (BROWSER.$browser === 'Internet Explorer') {
      Pane.style.paddingLeft = `${size + 20}px`;
    }
  }

  // 动态配置pane参数
  @autobind
  initPane() {
    const boxWidth = splitPane.getBoundingClientRect().width;
    const minsize = boxWidth * 0.3 || 200;
    const maxsize = boxWidth * 0.6 || 600;
    const { paneboxWidth } = this.state;
    if (paneboxWidth !== boxWidth) {
      this.setState({
        paneboxWidth: boxWidth,
        paneMaxSize: maxsize,
        paneMinSize: minsize,
      });
    }
  }

  render() {
    const { list, location, replace } = this.props;
    const { isEmpty, paneMaxSize, paneMinSize } = this.state;
    const emptyClass = classnames({
      none: !isEmpty,
      feedbackRow: true,
    });
    const existClass = classnames({
      none: isEmpty,
      feedbackRow: true,
    });
    const splitPaneClass = classnames({
      none: isEmpty,
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
        <div className={splitPaneClass}>
          <SplitPane
            onChange={this.panchange}
            split="vertical"
            minSize={paneMinSize}
            maxSize={paneMaxSize}
            defaultSize={DEFAULTSIZE}
            className="primary"
          >
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
      </div>
    );
  }
}

