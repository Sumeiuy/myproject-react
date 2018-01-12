/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal, Button, Radio, Checkbox, Input, Form } from 'antd';
import _ from 'lodash';

import styles from './questionnaireSurvey.less';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const FormItem = Form.Item;

// 后台返回题目类型
const TYPE = {
  radioType: '1',
  checkboxType: '2',
  textAreaType: '3',
};
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};


export default class QuestionnaireSurvey extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCheckChange: PropTypes.func.isRequired,
    onRadioChange: PropTypes.func.isRequired,
    onAreaText: PropTypes.func.isRequired,
    answersList: PropTypes.object,
  }

  static defaultProps = {
    answersList: {},
  };

  // 根据返回的问题列表，判断不同类型显示
  @autobind
  renderOption() {
    const { form, onCheckChange, answersList, onRadioChange, onAreaText } = this.props;
    const { quesInfoList = EMPTY_ARRAY, answerVOList = EMPTY_ARRAY } = answersList;
    const { getFieldDecorator } = form;
    let content = null;
    const itemForm = _.isEmpty(quesInfoList) ? null : _.map(quesInfoList, (item, key) => {
      const { quesId } = item;
      // 判断是否已回答问卷
      const answerData = _.find(answerVOList, o => o.quesId === quesId) || EMPTY_OBJECT;
      // 已回答则查询该问题答案
      let defaultData = answerData;
      if (item.quesTypeCode === TYPE.radioType) {
        // 设置该问题默认值
        defaultData = answerData.answerdIds || EMPTY_ARRAY;
        content = (<FormItem key={quesId}>
          {getFieldDecorator(String(quesId), {
            initialValue: defaultData[0] || '',
            rules: [{ required: true, message: '此答案不能为空，请选择你的选项' }],
          })(
            <div className={styles.radioContent}>
              <p>{key + 1}.{item.quesValue}</p>
              <RadioGroup
                name={item.quesTypeCode}
                className={styles.radioGroup}
                onChange={onRadioChange}
                defaultValue={defaultData[0] || ''}
              >
                {
                  item.optionInfoList.map(childItem =>
                    <Radio
                      value={childItem.optionId}
                      dataVale={childItem.optionValue}
                      className={styles.radioOption}
                      dataQuesId={quesId}
                      key={childItem.optionId}
                    >
                      {childItem.optionValue}
                    </Radio>)
                }
              </RadioGroup>
            </div>,
          )}
        </FormItem>);
      } else if (item.quesTypeCode === TYPE.checkboxType) {
        defaultData = _.map(answerData.answerdIds, (childVal) => {
          // 拼接字符串
          const checkedData = _.find(item.optionInfoList, count => count.optionId === childVal);
          const values = `${checkedData.optionValue}+-+${childVal}+-+${quesId}`;
          return values;
        }) || [];
        content = (<FormItem key={quesId}>
          {getFieldDecorator(String(quesId), {
            initialValue: defaultData,
            rules: [{ required: true, message: '此答案不能为空，请选择你的选项' }],
          })(
            <div className={styles.radioContent}>
              <p>{key + 1}.{item.quesValue}</p>
              <CheckboxGroup
                style={{ width: '100%' }}
                className={styles.radioGroup}
                onChange={onCheckChange}
                defaultValue={defaultData}
              >
                {
                  item.optionInfoList.map(childItem => <Checkbox
                    value={`${childItem.optionValue}+-+${childItem.optionId}+-+${quesId}`}
                    className={styles.radioOption}
                    key={childItem.optionId}
                  >
                    {childItem.optionValue}
                  </Checkbox>)
                }
              </CheckboxGroup>
            </div>,
          )}
        </FormItem>);
      } else if (item.quesTypeCode === TYPE.textAreaType) {
        defaultData = answerData.answertext || '';
        content = (<FormItem key={quesId}>
          {getFieldDecorator(String(quesId), {
            initialValue: defaultData,
            rules: [{
              required: true, maxLength: '250', minLength: '10', message: '问题答案不能小于10个字符，最多250个字符!',
            }],
          })(
            <div className={styles.radioContent}>
              <p>{key + 1}.{item.quesValue}</p>
              <TextArea
                rows={4}
                className={styles.radioGroup}
                onChange={onAreaText}
                data={quesId}
                defaultValue={defaultData}
              />
            </div>,
          )}
        </FormItem>);
      }
      return content;
    });
    return itemForm;
  }

  render() {
    const {
      visible,
      onOk,
      onCancel,
      answersList,
    } = this.props;
    const { answerVOList } = answersList;
    // 已回答则显示确定按钮，否则显示提交
    const showBtn = _.isEmpty(answerVOList) ?
      (<Button key="submit" type="primary" onClick={onOk}>
        提交
      </Button>) :
      (<Button key="ok" type="primary" onClick={onCancel}>
        确定
      </Button>);
    return (
      <div>
        <Modal
          title="问卷调查"
          visible={visible}
          onCancel={onCancel}
          width={650}
          className={styles.question}
          footer={[showBtn]}
        >
          <Form layout="vertical">
            {this.renderOption()}
          </Form>
        </Modal>
      </div>
    );
  }
}
