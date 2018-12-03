
/*
 * @Description: 执行者视图问卷调查
 * @Author: xuxiaoqin
 * @Date: 2018-05-22 12:26:05
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-06-14 13:18:13
 * 只是将原先的问卷调查逻辑单独提取成组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import {
  Button, Radio, Checkbox, Input, Form, message
} from 'antd';
import _ from 'lodash';

import { emp } from '../../../../helper';
// 信息提示框
import InfoModal from '../../../common/infoModal';
import logable from '../../../../decorators/logable';
import styles from './questionnaireSurvey.less';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const FormItem = Form.Item;
const create = Form.create;


// 后台返回题目类型
const TYPE = {
  radioType: '1',
  checkboxType: '2',
  textAreaType: '3',
};
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

// 多选题的value分隔符
// CHECKBOX_VALUE_SEPARATOR 在CheckBox value中拼接字符，为获取改答案answerId和改问题quesId
const CHECKBOX_VALUE_SEPARATOR = '+-+';

@create()
export default class QuestionnaireSurvey extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    answersList: PropTypes.object,
    getTempQuesAndAnswer: PropTypes.func.isRequired,
    isSubmitSurveySucceed: PropTypes.bool,
    saveAnswersByType: PropTypes.func.isRequired,
    basicInfo: PropTypes.object.isRequired,
    currentId: PropTypes.string.isRequired,
    // 是否能够提交
    canSubmit: PropTypes.bool,
  }

  static defaultProps = {
    answersList: EMPTY_OBJECT,
    isSubmitSurveySucceed: false,
    canSubmit: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      checkboxData: {},
      radioData: [],
      areaTextData: [],
      errorCheckboxIdList: [],
      // 所有的多选题Id集合
      checkBoxQuesId: [],
      visible: false,
      currentId: props.currentId,
    };
  }

  componentDidMount() {
    this.getQuesAndAnswer();
  }

  componentDidUpdate(prevProps) {
    // 当templateId不一样的时候，请求问卷调查
    if (prevProps.basicInfo.templateId !== this.props.basicInfo.templateId) {
      this.getQuesAndAnswer();
    }
  }

  /**
   * 请求问卷调查题目与答案
   */
  @autobind
  getQuesAndAnswer() {
    const { getTempQuesAndAnswer, basicInfo: { templateId } } = this.props;
    getTempQuesAndAnswer({
      // 问卷传参测试
      templateId,
      // 分页信息固定参数
      pageNum: 1,
      pageSize: 200,
      examineeId: emp.getId(),
    }).then(this.handleGetQuesSuccess);
  }

  @autobind
  resetFormFields() {
    // 重置组件表单值
    this.props.form.resetFields();
  }

  // 处理请求问卷题目是否成功
  @autobind
  handleGetQuesSuccess() {
    const { answersList = EMPTY_OBJECT } = this.props;
    const { quesInfoList } = answersList;
    const checkBoxQuesId = _.filter(quesInfoList, ['quesTypeCode', '2']);
    this.setState({
      // 存储多选题Id
      checkBoxQuesId: _.map(checkBoxQuesId, item => item.quesId),
      visible: true,
    });
  }

  /**
   * 单选题change事件
   */
  @autobind
  @logable({ type: 'Click', payload: { name: '问卷调查radios事件' } })
  handleRadioChange({ target }) {
    const { radioData } = this.state;
    const initRadio = radioData;
    const checkedData = [{
      quesId: target.dataQuesId,
      answerId: target.value,
      answerText: target.dataVale,
    }];
    this.handleRepeatData(initRadio, checkedData, 'radioData');
  }

  // 处理选中答案数据
  @autobind
  @logable({ type: 'Click', payload: { name: '问卷调查check事件' } })
  handleCheckChange(keyIndex, quesId) {
    const { checkboxData, errorCheckboxIdList } = this.state;
    const initCheck = checkboxData;
    const arr = _.map(keyIndex, item => _.split(item, CHECKBOX_VALUE_SEPARATOR));
    let params = _.flatten(_.map(arr, (item) => {
      const childs = {
        answerId: item[1],
        answerText: item[0],
        quesId: item[2],
      };
      return childs;
    }));
    if (_.isEmpty(keyIndex)) {
      params = keyIndex;
    }
    initCheck[quesId] = params;
    this.setState({
      checkboxData: initCheck,
      // 存储多选框是否选中状态
      // 当前question有选项选中，那么将当前quesId从错误列表中移除
      // 否则将当前quesId加入错误列表中
      errorCheckboxIdList: _.isEmpty(initCheck[quesId])
        ? _.uniq([...errorCheckboxIdList, quesId])
        : _.filter(errorCheckboxIdList, item => item !== quesId),
    });
    // 强制checkbox渲染
    this.forceUpdate();
  }

  /**
   * 提交问卷
   */
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  handleOk() {
    const { saveAnswersByType, basicInfo: { templateId }, form } = this.props;
    const {
      checkboxData,
      radioData,
      areaTextData,
      errorCheckboxIdList,
      checkBoxQuesId,
    } = this.state;

    // 是否有多选题没选答案
    // 只要isShowErrorCheckbox不为空，就代表有checkbox没选答案
    // 这次提交，有哪几个checkbox没选答案，需要一个个比较
    let hasCheckboxError = !_.isEmpty(errorCheckboxIdList);

    // 将checkbox已经选择答案的的id组成questionId
    // checkboxData是这种格式：
    /*
      {
        111: [{},{}],
        222: [{},{}],
      }
    */
    const checkedCheckboxIdList = _.compact(
      _.map(Object.keys(checkboxData),
        item => !_.isEmpty(checkboxData[item]) && Number(item), ),
    );

    // 找出已经完成的checkbox与初始化的checkbox之间的questionId
    const diffQuestionId = _.difference(checkBoxQuesId, checkedCheckboxIdList);

    if (_.isEmpty(diffQuestionId)) {
      hasCheckboxError = false;
    } else {
      hasCheckboxError = true;
      this.setState({
        errorCheckboxIdList: diffQuestionId,
      });
    }

    form.validateFields((err) => {
      if (!err && !hasCheckboxError) {
        // 最后的checkboxData提交给后台
        const finalCheckboxData = _.flatten(_.values(checkboxData));
        const checkedData = [...finalCheckboxData, ...radioData, ...areaTextData];

        const params = {
          // 提交问卷传参测试
          answerReqs: checkedData,
          // 答题者类型参数固定
          examineetype: 'employee',
          examineeId: emp.getId(),
          templateId,
        };
        saveAnswersByType(params).then(this.handleSaveSuccess);
      }
    });
  }

  /**
   * 主观题事件
   */
  @autobind
  handleTextAreaChange(e) {
    const { areaTextData } = this.state;
    const initAreaText = areaTextData;
    const params = [{
      quesId: e.target.getAttribute('data'),
      answerText: e.target.value,
    }];
    this.handleRepeatData(initAreaText, params, 'areaTextData');
  }

  // 处理问卷选中重复答案
  @autobind
  handleRepeatData(initData, checkedData, stv) {
    if (_.isEmpty(initData)) {
      this.setState({
        [stv]: checkedData,
      });
    } else {
      let newRadio = EMPTY_ARRAY;
      const ques = _.findIndex(initData, o => o.quesId === checkedData[0].quesId);
      if (ques === -1) {
        newRadio = _.concat(initData, checkedData);
      } else {
        newRadio = initData.splice(ques, 1, checkedData[0]);
        newRadio = initData;
      }
      this.setState({
        [stv]: newRadio,
      });
    }
  }

  // 处理问卷提交成功
  @autobind
  handleSaveSuccess() {
    const { isSubmitSurveySucceed } = this.props;
    if (!isSubmitSurveySucceed) {
      message.error('提交失败');
    } else {
      message.success('提交成功');
      // 提交成功之后，请求已经提交的问卷调查，禁用表单的再次提交
      this.getQuesAndAnswer();
    }
  }

  // 根据返回的问题列表，判断不同类型显示
  @autobind
  renderOption() {
    const {
      errorCheckboxIdList, radioData, checkboxData, areaTextData
    } = this.state;
    const {
      form,
      answersList,
    } = this.props;
    const { quesInfoList = EMPTY_ARRAY, answerVOList = EMPTY_ARRAY } = answersList;
    const isDisabled = !_.isEmpty(answerVOList);
    const { getFieldDecorator } = form;
    let content = null;
    const itemForm = _.isEmpty(quesInfoList) ? null
      : _.map(quesInfoList, (item, key) => {
        const { quesId } = item;
        // 自定义多选题校验
        const CheckboxErrorProps = _.includes(errorCheckboxIdList, quesId) ? {
          validateStatus: 'error',
          help: '此答案不能为空，请选择你的选项',
        } : null;

        // 判断是否已回答问卷
        const answerData = _.find(answerVOList, o => o.quesId === quesId)
          || EMPTY_OBJECT;

        // 已回答则查询该问题答案
        if (item.quesTypeCode === TYPE.radioType) {
          // 设置该问题默认值
          const defaultData = answerData.answerdIds || EMPTY_ARRAY;

          const currentQuestion = _.find(radioData, radio => radio.quesId === quesId) || EMPTY_OBJECT;

          content = (
            <FormItem key={quesId}>
              {getFieldDecorator(String(quesId), {
                rules: [{ required: true, message: '此答案不能为空，请选择你的选项' }],
              })(
                <div className={styles.radioContent}>
                  <p className={styles.title}>
                    {key + 1}
.
                    {item.quesValue}
                  </p>
                  <RadioGroup
                    name={item.quesTypeCode}
                    className={styles.radioGroup}
                    onChange={this.handleRadioChange}
                  // 禁用情况下,取defaultData
                  // 编辑状态下，取radioData第一个
                    value={isDisabled ? defaultData[0]
                      : currentQuestion.answerId}
                  >
                    {
                    item.optionInfoList.map(childItem => (
                      <Radio
                        value={childItem.optionId}
                        dataVale={childItem.optionValue}
                        className={styles.radioOption}
                        dataQuesId={quesId}
                        key={childItem.optionId}
                        disabled={isDisabled}
                      >
                        {childItem.optionValue}
                      </Radio>
                    ))
                  }
                  </RadioGroup>
                </div>,
              )}
            </FormItem>
          );
        } else if (item.quesTypeCode === TYPE.checkboxType) {
          // 默认值，根据后台返回值来设置默认值，以checkbox分隔符分隔
          const defaultData = _.map(answerData.answerdIds, (childVal) => {
            // 拼接字符串
            const checkedData = _.find(item.optionInfoList, count => count.optionId === childVal);
            const values = `${checkedData.optionValue}${CHECKBOX_VALUE_SEPARATOR}${childVal}${CHECKBOX_VALUE_SEPARATOR}${quesId}`;
            return values;
          }) || EMPTY_ARRAY;

          // 当前表单处于编辑状态，设置value，受控模式
          let currentData = EMPTY_ARRAY;
          const currentCheckboxQuestion = checkboxData[quesId];
          currentData = _.map(currentCheckboxQuestion, childItem => `${childItem.answerText}${CHECKBOX_VALUE_SEPARATOR}${childItem.answerId}${CHECKBOX_VALUE_SEPARATOR}${quesId}`);

          content = (
            <FormItem key={quesId} {...CheckboxErrorProps}>
              <div className={styles.radioContent}>
                <p className={styles.title}>
                  {key + 1}
.
                  {item.quesValue}
                </p>
                <CheckboxGroup
                  style={{ width: '100%' }}
                  className={styles.radioGroup}
                  onChange={keyIndex => this.handleCheckChange(keyIndex, quesId)}
                  value={isDisabled ? defaultData : currentData}
                >
                  {
                  item.optionInfoList.map(childItem => (
                    <Checkbox
                      value={`${childItem.optionValue}${CHECKBOX_VALUE_SEPARATOR}${childItem.optionId}${CHECKBOX_VALUE_SEPARATOR}${quesId}`}
                      className={styles.radioOption}
                      key={childItem.optionId}
                      disabled={isDisabled}
                    >
                      {childItem.optionValue}
                    </Checkbox>
                  ),)
                }
                </CheckboxGroup>
              </div>
            </FormItem>
          );
        } else if (item.quesTypeCode === TYPE.textAreaType) {
          // 从后台取主观题答案默认值
          const defaultData = answerData.answertext || '';

          // 当前编辑状态下的主观题
          const currentQuestion = _.find(areaTextData,
            text => +text.quesId === quesId) || EMPTY_OBJECT;
          const currentData = currentQuestion.answerText || '';

          content = (
            <FormItem key={quesId}>
              {getFieldDecorator(String(quesId), {
                rules: [{
                  required: true,
                  max: 250,
                  min: 10,
                  message: '问题答案不能小于10个字符，最多250个字符',
                }],
              })(
                <div className={styles.radioContent}>
                  <p className={styles.title}>
                    {key + 1}
.
                    {item.quesValue}
                  </p>
                  <TextArea
                    rows={4}
                    className={styles.radioGroup}
                    onChange={this.handleTextAreaChange}
                    data={quesId}
                    value={isDisabled ? defaultData : currentData}
                    placeholder={item.quesDesp}
                    disabled={isDisabled}
                    maxLength={250}
                    minLength={10}
                  />
                </div>,
              )}
            </FormItem>
          );
        }
        return content;
      });
    return itemForm;
  }

  render() {
    const { answersList, canSubmit } = this.props;
    const { visible } = this.state;
    const { answerVOList } = answersList;
    // 已回答则显示确定按钮，否则显示提交
    const showBtn = visible && _.isEmpty(answerVOList) && canSubmit
      ? (
        <Button
          key="submit"
          type="primary"
          className={styles.btn}
          onClick={_.debounce(this.handleOk, 300, { leading: true })}
        >
        提交
        </Button>
      ) : null;

    return (
      <div className={styles.container}>
        <Form layout="vertical">
          {this.renderOption()}
          {showBtn}
          {!canSubmit
            ? (
              <InfoModal
                visible
                content="调查问卷需在任务到期前完成，到期后只可查看不可提交"
              />
            ) : null}
        </Form>
      </div>
    );
  }
}
