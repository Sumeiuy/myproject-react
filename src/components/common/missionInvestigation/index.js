/*
 * @Author: xuxiaoqin
 * @Date: 2018-01-03 16:01:35
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-18 18:24:42
 * 任务调查
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Tooltip, message } from 'antd';
import _ from 'lodash';
// import classnames from 'classnames';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import Icon from '../Icon';
import { data } from '../../../helper';
import GroupTable from '../../customerPool/groupManage/GroupTable';
import GroupModal from '../../customerPool/groupManage/CustomerGroupUpdateModal';
import Clickable from '../Clickable';
import Button from '../Button';
// import tableStyles from '../../customerPool/groupManage/groupTable.less';
import RestoreScrollTop from '../../../decorators/restoreScrollTop';
import styles from './index.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const posi = 'bottom';
const INITIAL_PAGE_NUM = 1;
// 前端分页，下个迭代再干新接口
const INITIAL_REQUEST_PAGE_SIZE = 1000;
const INITIAL_PAGE_SIZE = 10;
const INITIAL_TOTAL_COUNT = 10;
const INITIAL_TOTAL_PAGE = 1;
// 1代表单选
// 2代表多选
const isSingleOrMultipleQuestion = quesTypeCode => quesTypeCode === '1' || quesTypeCode === '2';
const renderColumnTitle = () => {
  const columns = [
    {
      key: 'quesTypeValue',
      value: '问题类型',
    },
    {
      key: 'quesValue',
      value: '题目',
    },
  ];

  return columns;
};
@RestoreScrollTop
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
      list: EMPTY_LIST,
      page: {
        pageNum: INITIAL_PAGE_NUM,
        pageSize: INITIAL_PAGE_SIZE,
        totalCount: INITIAL_TOTAL_COUNT,
        totalPage: INITIAL_TOTAL_PAGE,
      },
    },
    isChecked: false,
    storedData: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    const { storedData, questionInfo: { list, page } } = props;
    const { missionInvestigationData = EMPTY_OBJECT } = storedData || EMPTY_OBJECT;
    const {
      // 是否选中
      isMissionInvestigationChecked = false,
      // 选择的问题
      questionList = EMPTY_LIST,
      // 当前选中的问题的key
      currentSelectRowKeys,
    } = missionInvestigationData;
    const idList = _.map(questionList, item => item.quesId) || [];
    let newQuestionAndAnswerGroup = EMPTY_LIST;
    const currentSelectedQuestionIdList = _.map(questionList, item => ({
      key: `question_${item.quesId}`,
      value: item.quesId,
    })) || EMPTY_LIST;

    if (!_.isEmpty(idList)) {
      newQuestionAndAnswerGroup = _.map(idList, (item, index) =>
        this.renderQuestion(
          currentSelectedQuestionIdList,
          questionList,
          questionList[index].quesId,
          questionList[index].quesValue,
        ));
    }

    this.state = {
      inputValue: '',
      // 默认任务调查不选中
      checked: isMissionInvestigationChecked,
      newQuestionAndAnswerGroup,
      currentSelectedQuestionIdList,
      questionList: list || EMPTY_LIST,
      currentSelectRowKeys,
      isShowTable: false,
      page,
      currentSelectRowKeysInTable: EMPTY_LIST,
    };
  }

  componentDidMount() {
    const { getQuestionList, questionInfo: { list } } = this.props;
    if (_.isEmpty(list)) {
      // 为空则需要去请求一次问题列表
      getQuestionList({
        pageNum: INITIAL_PAGE_NUM,
        pageSize: INITIAL_REQUEST_PAGE_SIZE,
      }).then(() => {
        const { questionInfo: nextQuestionInfo } = this.props;
        const { list: nextList, page } = nextQuestionInfo;
        // 将题目相同的问题过滤掉
        const questionList = _.uniqBy(nextList, 'quesValue') || EMPTY_LIST;
        this.setState({
          questionList,
          page,
        });
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
    const {
      currentSelectedQuestionIdList = [],
      checked,
      questionList = [],
      newQuestionAndAnswerGroup = [],
      currentSelectRowKeys,
    } = this.state;
    const idList = _.map(currentSelectedQuestionIdList, item => item.value);
    const selectedQuestionDetailList = [];
    _.each(idList, (item, index) => {
      const questionIndex = _.findIndex(questionList, questionItem => questionItem.quesId === item);
      if (questionIndex !== -1) {
        selectedQuestionDetailList.push({
          ...questionList[questionIndex],
          questionKey: currentSelectedQuestionIdList[index].key,
        });
      }
    });

    return {
      // 是否选中
      isMissionInvestigationChecked: checked,
      // 选择的问题idList
      questionList: selectedQuestionDetailList,
      // current select idList
      currentSelectedQuestionIdList,
      // 当前新增的问题选择个数
      addedQuestionSize: _.size(newQuestionAndAnswerGroup),
      // 当前选择的问题row
      currentSelectRowKeys,
    };
  }

  /**
 * 获取modalContainer引用
 */
  @autobind
  getModalContainerRef(ref) {
    return this.problemListModalContainerRef = ref;
  }

  /**
   * 删除问题
   * @param {*string} currentDeleteId 当前删除的问题id
   */
  @autobind
  handleDeleteQuestion(currentDeleteId, quesId) {
    const {
      newQuestionAndAnswerGroup,
      currentSelectedQuestionIdList,
      currentSelectRowKeys,
    } = this.state;

    this.setState({
      // 将当前列表去除一条
      newQuestionAndAnswerGroup: _.filter(newQuestionAndAnswerGroup,
        item => item.key !== currentDeleteId) || EMPTY_LIST,
      // 从当前列表里面去除quesId
      currentSelectedQuestionIdList: _.filter(currentSelectedQuestionIdList, item =>
        item.key !== currentDeleteId) || EMPTY_LIST,
      // 从当前选择的row里面去除当前要删除的quesId
      currentSelectRowKeys: _.filter(currentSelectRowKeys, item => item !== quesId),
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
    const { checked } = this.state;
    if (!checked) {
      message.error('请先勾选任务调查');
      return;
    }

    this.setState({
      isShowTable: true,
      // 将table的row选择置为空
      currentSelectRowKeysInTable: [],
    });
  }

  @autobind
  handleCheckChange() {
    const { checked } = this.state;
    this.setState({
      checked: !checked,
    });
    if (checked) {
      message.error('您已设置任务调查问题，如果取消选择将不对此任务进行任务调查');
    }
  }

  @autobind
  handleRowSelectionChange(selectedRowKeys) {
    this.setState({
      // 当前已经选中的问题列，就是已经展示在页面上的列表
      // 去除假值
      currentSelectRowKeys: _.compact(selectedRowKeys),
    });
  }

  @autobind
  handleSingleRowSelectionChange(record = EMPTY_OBJECT, selected) {
    const { quesId } = record;
    const { currentSelectRowKeysInTable } = this.state;
    let newSelectRowKeysInTable = currentSelectRowKeysInTable;
    if (selected) {
      newSelectRowKeysInTable = _.uniq(_.concat([quesId], newSelectRowKeysInTable));
    } else {
      newSelectRowKeysInTable = _.filter(newSelectRowKeysInTable, item => item !== quesId);
    }
    this.setState({
      currentSelectRecord: record,
      // 在表格里面选中的row
      currentSelectRowKeysInTable: newSelectRowKeysInTable,
    });
  }

  /**
   * 取消弹窗，则取消刚才勾选的selectedKeys
   */
  @autobind
  handleCancel() {
    const { currentSelectRowKeys, currentSelectRowKeysInTable, page } = this.state;
    this.scrollModalBodyToTop();
    this.setState({
      isShowTable: false,
    }, () => {
      this.setState({
        currentSelectRowKeysInTable: [],
        currentSelectRowKeys: _.filter(currentSelectRowKeys, item =>
          !_.includes(currentSelectRowKeysInTable, item)),
        // 重置分页
        page: {
          ...page,
          pageNum: INITIAL_PAGE_NUM,
        },
      });
    });
  }

  /**
   * 确认，关闭弹窗，将新加的问题加入列表
   */
  @autobind
  handleConfirm() {
    this.setState({
      isShowTable: false,
      // 重置分页
      page: {
        ...this.state.page,
        pageNum: INITIAL_PAGE_NUM,
      },
    });
    this.scrollModalBodyToTop();
    this.renderNextQuestion();
  }

  /**
   * 分页条目改变事件
   * @param {*number} curPageNum 当前页码
   * @param {*number} curPageSize 当前分页条目
   */
  @autobind
  handlePageChange(pageNum) {
    this.setState({
      page: {
        ...this.state.page,
        pageNum,
      },
    });
    this.scrollModalBodyToTop();
  }

  @autobind
  scrollModalBodyToTop() {
    // 翻页之后，恢复当前页面表格的滚动，在小屏的情况下
    const problemListModalContainer = document.querySelector('.problemListModalContainer .ant-modal-body');
    if (problemListModalContainer) {
      problemListModalContainer.scrollTop = 0;
    }
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, item => _.merge(item, { id: item.quesId }));
    }

    return [];
  }

  /**
   * 渲染下一个题目信息
   */
  @autobind
  renderNextQuestion() {
    const {
      questionList,
      currentSelectRowKeys,
    } = this.state;

    let finalSelectedQuestionIdList = [];
    let finalQuestionAndAnswerGroup = [];

    _.each(currentSelectRowKeys,
      (item) => {
        const question = _.find(questionList, questionItem =>
          questionItem.quesId === item) || EMPTY_OBJECT;
        finalSelectedQuestionIdList = _.concat(finalSelectedQuestionIdList, [{
          key: `question_${question.quesId}`,
          value: item,
        }]);
        finalQuestionAndAnswerGroup = _.concat(finalQuestionAndAnswerGroup,
          this.renderQuestion(
            finalSelectedQuestionIdList,
            questionList,
            question.quesId,
            question.quesValue));
      });

    this.setState({
      newQuestionAndAnswerGroup: finalQuestionAndAnswerGroup,
      currentSelectedQuestionIdList: finalSelectedQuestionIdList,
    });
  }

  /**
   * 悬浮框提示问题详情
   * @param {*object} currentQuestionDetail 当前问题详情
   */
  @autobind
  renderOption(currentQuestionDetail = EMPTY_OBJECT) {
    const quesTypeCode = currentQuestionDetail.quesTypeCode;
    if (isSingleOrMultipleQuestion(quesTypeCode)) {
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
  renderQuestionAndAnswerTooltip(finalSelectedQuestionIdList, questionList, questionId) {
    if (!questionId) {
      return null;
    }
    const currentQuestion = _.find(finalSelectedQuestionIdList, item => item.key === `question_${questionId}`) || EMPTY_OBJECT;
    const currentQuestionDetail = _.find(questionList,
      item => item.quesId === currentQuestion.value) || EMPTY_OBJECT;
    const { quesTypeCode } = currentQuestionDetail;
    if (_.isEmpty(currentQuestionDetail)) {
      return null;
    }

    return (
      <div className={styles.detailTip}>
        <div className={styles.questionSection}>
          <div>问题：</div>
          <div>{currentQuestionDetail.quesValue}</div>
        </div>
        <div className={styles.answerSection}>
          <div className={styles.title}>
            {
              isSingleOrMultipleQuestion(quesTypeCode) ?
                '答案：' : '描述：'
            }
          </div>
          {this.renderOption(currentQuestionDetail)}
        </div>
      </div>
    );
  }

  @autobind
  renderQuestion(
    finalSelectedQuestionIdList = EMPTY_LIST,
    questionList = EMPTY_LIST,
    quesId,
    quesValue) {
    return (
      <div
        className={classnames({
          [styles.questionLine]: true,
        })}
        key={`question_${quesId}`}
      >
        {/**
         * 当前选中的题目题干
         */}
        <span className={styles.questionTitle}>{quesValue || ''}</span>

        <Tooltip
          title={this.renderQuestionAndAnswerTooltip(
            finalSelectedQuestionIdList,
            questionList,
            quesId)}
          placement={posi}
          overlayClassName={styles.questionAndAnswer}
        >
          <span
            className={styles.detailLabel}
            ref={(ref) => {
              // ref多次重绘可能是null, 这里要判断一下
              if (!this.questionDetailElem && ref) {
                this.questionDetailElem = ref;
              }
            }}
          >
            问题详情
        </span>
        </Tooltip>

        <Icon
          type="close1"
          className={styles.deleteIcon}
          onClick={() => this.handleDeleteQuestion(`question_${quesId}`, quesId)}
        />
      </div>
    );
  }

  render() {
    const {
      checked,
      newQuestionAndAnswerGroup,
      currentSelectRowKeys,
      isShowTable,
      page,
      questionList,
    } = this.state;

    const {
      pageNum,
      totalCount,
    } = page;

    const titleColumn = renderColumnTitle();

    const dataSource = this.addIdToDataSource(questionList);

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
        <GroupModal
          wrappedComponentRef={this.getModalContainerRef}
          wrapperClass={`${styles.problemListModalContainer} problemListModalContainer`}
          closable
          visible={isShowTable}
          title={'问题列表'}
          onCancelHandler={this.handleCancel}
          footer={
            <div className={styles.btnSection}>
              <Clickable
                onClick={this.handleCancel}
                eventName="/click/missionInvestigation/cancel"
              >
                <Button type="default" size="default">取消</Button>
              </Clickable>
              <Clickable
                onClick={this.handleConfirm}
                eventName="/click/missionInvestigation/confirm"
              >
                <Button type="primary" size="default" className={styles.confirmBtn}>确定</Button>
              </Clickable>
            </div>
          }
          modalContent={
            <div className={styles.modalContainer}>
              {
                !_.isEmpty(dataSource) ?
                  <GroupTable
                    pageData={{
                      curPageNum: pageNum,
                      curPageSize: INITIAL_PAGE_SIZE,
                      totalRecordNum: totalCount,
                    }}
                    showHeader={false}
                    listData={dataSource}
                    tableClass={
                      classnames({
                        [styles.problemListTable]: true,
                      })
                    }
                    titleColumn={titleColumn}
                    columnWidth={['80px', '420px']}
                    bordered={false}
                    isNeedRowSelection
                    onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
                    onRowSelectionChange={this.handleRowSelectionChange}
                    currentSelectRowKeys={currentSelectRowKeys}
                    selectionType={'checkbox'}
                    needPagination={totalCount > INITIAL_TOTAL_COUNT}
                    // 分页器是否在表格内部
                    paginationInTable={false}
                    onPageChange={this.handlePageChange}
                    // 展示空白行
                    needShowEmptyRow
                    // 分页器样式
                    paginationClass={'selfPagination'}
                  />
                  :
                  <div className={styles.emptyContent}>
                    <span>
                      <Icon className={styles.emptyIcon} type="frown-o" />
                      暂无数据
                        </span>
                  </div>
              }
            </div>
          }
        />
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
