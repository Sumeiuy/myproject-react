/*
 * @Description: 我的反馈 页面
 * @Author: 张俊丽
 * @Date: 2018-06-5 14:49:16
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { Input, Modal, message } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';

import SplitPanel from '../../components/common/splitPanel/CutScreen';
import PersonFeedbackList from '../../components/common/appList';
import FeedbackRow from '../../components/feedback/FeedbackRow';
import MyDetail from '../../components/feedback/MyDetail';
import { emp } from '../../helper';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { logCommon } from '../../decorators/logable';
import styles from './myFeedback.less';

const width = 540; // modal框的宽度
const TextArea = Input.TextArea;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  personFeedback: state.feedback.personFeedback,
  feedbackDetail: state.feedback.fbDetail,
  processList: state.feedback.processList,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 请求反馈列表
  getFeedbackList: fetchDataFunction(true, 'feedback/getPersonFeedbackList'),
  // 请求反馈详情
  getFeedbackDetail: fetchDataFunction(true, 'feedback/getFeedbackDetail'),
  // 请求反馈 问题答复 列表
  getProcessList: fetchDataFunction(true, 'feedback/getAnserOfQustionList'),
  // 更新反馈信息
  updateFeedback: fetchDataFunction(true, 'feedback/updateFeedback'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class MyFeedback extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    personFeedback: PropTypes.object.isRequired,
    feedbackDetail: PropTypes.object.isRequired,
    processList: PropTypes.array.isRequired,
    getFeedbackList: PropTypes.func.isRequired,
    getFeedbackDetail: PropTypes.func.isRequired,
    getProcessList: PropTypes.func.isRequired,
    updateFeedback: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      showError: false,
      visible: false,
    };
  }

  componentDidMount() {
    const {
      location: {
        query: {
          curPageNum = '',
          activeId = '',
        },
      },
    } = this.props;
    if (_.isEmpty(curPageNum) ||
      _.isEmpty(activeId)
    ) {
      this.changeLocation({
        curPageNum: 1,
      });
    }
    // 请求数据
    this.requstListInfo(curPageNum);
  }

  // componentDidUpdate
  componentDidUpdate(preProps) {
    const {
      location: {
        query: {
          curPageNum,
          activeId,
        },
      },
    } = this.props;
    const {
      location: {
        query: {
          curPageNum: prePageNum,
          activeId: preActive,
        },
      },
    } = preProps;

    if (prePageNum !== curPageNum && curPageNum) {
      this.requstListInfo(curPageNum);
    } else if (preActive !== activeId && activeId) {
      this.requstDetailInfo(activeId);
    }
  }

  @autobind
  requstListInfo(curPageNum = 1) {
    // 请求数据
    if (!_.isEmpty(curPageNum)) {
      this.props.getFeedbackList({
        page: {
          pageSize: 20,
          curPageNum,
        },
        userId: emp.getId(),
      }).then(
        () => {
          const {
            personFeedback,
            location: {
              query: {
                activeId,
              },
            },
          } = this.props;
          const { list = [] } = personFeedback || {};
          if (!_.isEmpty(list)) {
            this.requstDetailInfo(activeId);
          }
        },
      );
    }
  }

  @autobind
  requstDetailInfo(detailId) {
    const {
      personFeedback,
      getProcessList,
      getFeedbackDetail,
    } = this.props;
    const { list = [] } = personFeedback || {};
    const { id = '' } = _.head(list) || {};

    getFeedbackDetail({
      id: parseInt(detailId, 10) || id,
    });
    getProcessList({
      feedbackId: parseInt(detailId, 10) || id,
    });
  }

  @autobind
  changeLocation(param) {
    const {
      replace,
      location: {
        query,
        pathname,
      },
    } = this.props;

    replace({
      pathname,
      query: {
        ...query,
        ...param,
        pageSize: 20,
      },
    });
  }

  @autobind
  handlePageNumberChange(page) {
    this.changeLocation({
      curPageNum: page,
      activeId: '',
    });
  }

  @autobind
  handleRowClick(record) {
    this.changeLocation({
      activeId: record.id,
    });
    // log日志 选择左侧行
    logCommon({
      type: 'Click',
      payload: {
        name: '选择行',
        value: JSON.stringify(record),
      },
    });
  }

  @autobind
  handleQuestionClick() {
    this.setState({
      value: '',
      visible: true,
      showError: false,
    });
  }

  @autobind
  handleResolveClick() {
    const {
      feedbackDetail: {
        resultData: { id },
      },
      location: { query },
    } = this.props;

    this.props.updateFeedback({
      flag: 'person',
      currentQuery: query,
      request: {
        id,
        feedbackId: id,
        processerEmpId: emp.getId(),
        status: 'CLOSED',
      },
    }).then(
      () => message.success('操作成功！'),
    );
  }

  @autobind
  handleSumit() {
    // 内容不能为空
    const { value, showError } = this.state;
    if (_.isEmpty(value)) {
      if (!showError) {
        this.setState({
          showError: true,
        });
      }
      return;
    }
    // 弹框隐藏
    this.setState({
      visible: false,
    });
    // 发起请求
    const {
      feedbackDetail: {
        resultData: { id },
      },
      location: { query },
    } = this.props;

    this.props.updateFeedback({
      flag: 'person',
      currentQuery: query,
      request: {
        id,
        processerEmpId: emp.getId(),
        question: value,
      },
    });
  }

  @autobind
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  handleAreaChange(e) {
    const value = _.trim(e.target.value);
    this.setState({
      value,
      showError: _.isEmpty(value),
    });
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const {
      location: {
        query: {
          activeId = '',
        },
      },
    } = this.props;
    const activable = _.isEmpty(activeId) ?
      index === 0 : record.id === parseInt(activeId, 10);

    return (
      <FeedbackRow
        key={record.id}
        data={record}
        active={activable}
        onClick={this.handleRowClick}
        index={index}
        iconType="fankui1"
      />
    );
  }

  render() {
    const {
      processList,
      personFeedback,
      feedbackDetail,
      location: {
        query: {
          curPageNum = 1,
          pageSize = 20,
        },
      },
    } = this.props;
    const {
      list = [],
      page = {},
    } = personFeedback || {};

    const {
      value,
      visible,
      showError,
    } = this.state;

    // 生成页码器，此页码器配置项与Antd的一致
    const paginationOptions = {
      current: parseInt(curPageNum, 10),
      total: page.totalRecordNum || 0,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
    };

    const leftPanel = (
      <PersonFeedbackList
        list={list}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );
    const rightPanel = (
      <MyDetail
        processList={processList}
        feedbackDetail={feedbackDetail.resultData || {}}
        showQuestionModal={this.handleQuestionClick}
        resolveQuestion={this.handleResolveClick}
      />
    );
    return (
      <div className={styles.personFeedbackContainer} >
        <SplitPanel
          isEmpty={_.isEmpty(list)}
          topPanel={<div />}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          headerStyle={styles.topClass}
          leftListClassName="feedbackList"
        />
        <Modal
          title={'您还有什么需要提问？'}
          visible={visible}
          onOk={this.handleSumit}
          onCancel={this.handleCancel}
          width={width}
          wrapClassName={styles.problemwrap}
          okText="提交"
        >
          <div className={styles.problembox}>
            <div className={styles.title}>反馈详情描述</div>
            <TextArea
              rows={6}
              value={value}
              className={styles.area}
              onChange={this.handleAreaChange}
              placeholder={'问题未解决？继续输入您的想法和建议...'}
            />
            <div className={styles.errorTip}>
              {showError ? '反馈详情描述不能为空' : ''}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
