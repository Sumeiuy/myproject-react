/*
 * @Author: xuxiaoqin
 * @Date: 2018-01-03 16:01:35
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-15 09:49:04
 * 任务调查
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Checkbox, Tooltip, message } from 'antd';
import _ from 'lodash';
// import classnames from 'classnames';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import Icon from '../Icon';
import { data } from '../../../helper';
import styles from './index.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const Option = Select.Option;
const defaultQuestion = '请选择问题';
const posi = 'bottom';

export default class MissionInvestigation extends PureComponent {

  static propTypes = {
    // 问题列表，包括题干，选项所有信息，还有分页信息
    questionInfo: PropTypes.object,
    // 是否选中任务调查
    isChecked: PropTypes.bool,
    // 获取问题列表数据
    getQuestionList: PropTypes.func.isRequired,
    // 存储的任务流程数据
    storedData: PropTypes.object,
  }

  static defaultProps = {
    questionInfo: {
      list: [],
      page: {
        pageNum: 1,
        pageSize: 200,
        totalCount: 200,
        totalPage: 1,
      },
    },
    isChecked: false,
    storedData: {},
  }

  constructor(props) {
    super(props);
    const { storedData, questionInfo: { list } } = props;
    const { missionInvestigationData = {} } = storedData || {};
    const {
      // 是否选中
      isMissionInvestigationChecked = false,
      // 选择的问题
      questionList = [],
    } = missionInvestigationData;
    let questionId = 0;
    const idList = _.map(questionList, item => item.quesId) || [];
    let newQuestionAndAnswerGroup = [];
    if (!_.isEmpty(idList)) {
      newQuestionAndAnswerGroup = _.map(idList, (item, index) =>
        this.renderQuestion(
          ++questionId,
          isMissionInvestigationChecked,
          questionList[index].quesValue,
        ));
    }

    this.state = {
      inputValue: '',
      // 默认任务调查不选中
      checked: isMissionInvestigationChecked,
      newQuestionAndAnswerGroup,
      currentSelectedQuestionIdList: _.map(questionList, (item, index) => {
        const id = index + 1;
        return {
          key: `question_${id}`,
          value: item.quesId,
        };
      }),
      questionList: list || [],
      questionId,
    };
  }

  componentDidMount() {
    const { getQuestionList, questionInfo: { list } } = this.props;
    // const { newQuestionAndAnswerGroup, questionId } = this.state;
    if (_.isEmpty(list)) {
      // 为空则需要去请求一次问题列表
      getQuestionList({
        pageNum: 1,
        pageSize: 200,
      }).then(() => {
        const { questionInfo: nextQuestionInfo } = this.props;
        const { list: nextList } = nextQuestionInfo;
        this.setState({
          // 将题目相同的问题过滤掉
          questionList: _.uniqBy(nextList, 'quesValue') || EMPTY_LIST,
        });
        // this.renderNextQuestion(questionId, newQuestionAndAnswerGroup);
      });
    }
  }

  /**
   * 浮层渲染到父节点
   */
  @autobind
  getPopupContainer() {
    return this.questionDetailElem;
  }

  /**
   * 向外部组件提供数据
   */
  @autobind
  getData() {
    const { currentSelectedQuestionIdList, checked, questionList } = this.state;
    const idList = _.map(currentSelectedQuestionIdList, item => item.value);
    const selectedQuestionDetailList = _.filter(questionList,
      item => _.includes(idList, item.quesId));

    return {
      // 是否选中
      isMissionInvestigationChecked: checked,
      // 选择的问题idList
      questionList: selectedQuestionDetailList,
    };
  }

  /**
   * 删除问题
   * @param {*string} currentDeleteId 当前删除的问题id
   */
  @autobind
  handleDeleteQuestion(currentDeleteId) {
    const { newQuestionAndAnswerGroup, currentSelectedQuestionIdList } = this.state;
    this.setState({
      newQuestionAndAnswerGroup: _.filter(newQuestionAndAnswerGroup,
        item => item.key !== currentDeleteId) || EMPTY_LIST,
      currentSelectedQuestionIdList: _.filter(currentSelectedQuestionIdList, item =>
        item.key !== currentDeleteId) || EMPTY_LIST,
    }, () => {
      if (_.isEmpty(this.state.currentSelectedQuestionIdList)) {
        this.setState({
          currentDeleteId: '',
        });
      } else {
        this.setState({
          currentDeleteId,
        });
      }
    });
  }

  /**
   * 添加问题
   */
  @autobind
  addQuestion() {
    if (!this.state.checked) {
      message.error('请先勾选任务调查');
      return;
    }

    const { newQuestionAndAnswerGroup, questionId } = this.state;
    this.renderNextQuestion(questionId, newQuestionAndAnswerGroup);
  }

  @autobind
  handleCheckChange() {
    const { checked } = this.state;
    this.setState({
      checked: !checked,
    });
  }

  @autobind
  handleSelectChange(id, value) {
    const { currentSelectedQuestionIdList, questionList } = this.state;
    const currentQuestion = _.find(questionList, item =>
      item.quesValue === value) || EMPTY_OBJECT;
    let newIdList = currentSelectedQuestionIdList;
    const currentIndex = _.findIndex(newIdList, item => item.key === `question_${id}`);
    if (currentIndex === -1) {
      // 在当前编辑的里面没有，则新增
      newIdList = _.concat(newIdList, [{
        key: `question_${id}`,
        value: currentQuestion.quesId,
      }]);
    } else {
      newIdList[currentIndex].value = currentQuestion.quesId;
    }

    this.setState({
      currentSelectedQuestionIdList: newIdList,
    });
  }

  /**
   * select的一个bug，在有输入框的select聚焦时，select会聚焦两次
   * 只有当前激活的elem不是selectElem，才focus select
   */
  @autobind
  handleFocus() {
    const { activeElement } = document;
    let selectElem;
    if (this.questionLineElem) {
      selectElem = this.questionLineElem.childNodes[0].childNodes[0];
    }

    if (selectElem && activeElement !== selectElem) {
      selectElem.focus();
    }
  }

  @autobind
  handleBlur() {
    let selectElem;
    if (this.questionLineElem) {
      selectElem = this.questionLineElem.childNodes[0].childNodes[0];
    }

    if (selectElem) {
      selectElem.blur();
    }
  }

  @autobind
  filterOption(input, option) {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  @autobind
  renderNextQuestion(questionId, newQuestionAndAnswerGroup) {
    const newQuestionId = questionId + 1;
    // 最新添加的在最下面
    this.setState({
      questionId: newQuestionId,
      newQuestionAndAnswerGroup: _.concat(newQuestionAndAnswerGroup,
        this.renderQuestion(newQuestionId, this.state.checked)),
    });
  }

  @autobind
  renderOption(currentQuestionDetail = {}) {
    const quesTypeCode = currentQuestionDetail.quesTypeCode;
    // 1代表单选，2代表多选
    if (quesTypeCode === '1' || quesTypeCode === '2') {
      return (
        <div className={styles.content}>
          {
            _.map(currentQuestionDetail.optionInfoList, (item, index) =>
              <div className={styles.anwser} key={item.optionId}>
                <span>{data.convertNumToLetter((Number(index) + 1))}.</span>
                <span>{item.optionValue}</span>
              </div>,
            )
          }
        </div>
      );
    }

    return (
      <div className={styles.content}>
        <div className={styles.anwser}>
          <span>{currentQuestionDetail.quesDesp || ''}</span>
        </div>
      </div>
    );
  }

  @autobind
  renderQuestionAndAnswerTooltip(questionId) {
    const { currentSelectedQuestionIdList, questionList } = this.state;
    const currentQuestion = _.find(currentSelectedQuestionIdList, item => item.key === `question_${questionId}`) || {};
    const currentQuestionDetail = _.find(questionList,
      item => item.quesId === currentQuestion.value) || {};
    const { quesTypeCode } = currentQuestionDetail;
    if (_.isEmpty(currentQuestionDetail)) {
      return null;
    }
    return (
      <div className={styles.detailTip}>
        <div className={styles.questionSection}>
          <span>问题：</span>
          <span>{currentQuestionDetail.quesValue}？</span>
        </div>
        <div className={styles.answerSection}>
          <div className={styles.title}>
            {
              // 1代表单选，2代表多选
              quesTypeCode === '1' || quesTypeCode === '2' ?
                '答案：' : '描述：'
            }
          </div>
          {this.renderOption(currentQuestionDetail)}
        </div>
      </div>
    );
  }

  @autobind
  renderQuestion(questionId, checked, defaultQues) {
    const { questionInfo: { list } } = this.props;
    // const finalQuestionList = questionList || list;

    return (
      <div
        className={classnames({
          [styles.questionLine]: true,
          // [styles.hideQuestion]: currentDeleteId === `question_${questionId}`,
        })}
        key={`question_${questionId}`}
        ref={ref => (this.questionLineElem = ref)}
      >
        <Select
          onChange={value => this.handleSelectChange(questionId, value)}
          disabled={!checked}
          defaultValue={defaultQues || defaultQuestion}
          showSearch
          optionFilterProp="children"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {
            _.map(list, item =>
              <Option key={item.quesId} value={item.quesValue}>{item.quesValue}</Option>)
          }
        </Select>

        <Tooltip
          title={
            () => this.renderQuestionAndAnswerTooltip(questionId)
          }
          placement={posi}
          getPopupContainer={this.getPopupContainer}
          overlayClassName={styles.questionAndAnswer}
        >
          <span
            className={styles.detailLabel}
            ref={ref => (this.questionDetailElem = ref)}
          >
            问题详情
        </span>
        </Tooltip>

        <Icon
          type="close1"
          className={styles.deleteIcon}
          onClick={() => this.handleDeleteQuestion(`question_${questionId}`)}
        />
      </div>
    );
  }

  render() {
    const { checked, newQuestionAndAnswerGroup } = this.state;

    return (
      <div className={styles.missionInvestigationContainer}>
        <div className={styles.title}>
          <Checkbox checked={checked} onChange={this.handleCheckChange}>任务调查</Checkbox>
        </div>
        <div className={styles.divider} />
        <div className={styles.container}>
          <div className={styles.description}>
            任务调查是针对任务本身的调查，调查对象是任务实施者，即服务经理或投资顾问。定义了任务调查后，服务经理在完成任务之前必须完成调查问卷。
          </div>
          {/**
           * 新增的问题列表
           */}
          {
            newQuestionAndAnswerGroup
          }
        </div>
        <div
          className={styles.operationSection}
          disabled={!checked}
          onClick={this.addQuestion}
        >
          +新增问题
        </div>
      </div>
    );
  }
}
