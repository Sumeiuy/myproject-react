/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import { Modal, Button, Radio, Checkbox, Input, Form } from 'antd';
// import RestoreScrollTop from '../../../decorators/restoreScrollTop';
import _ from 'lodash';

import styles from './questionnaireSurvey.less';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const FormItem = Form.Item;
// 后台返回题目类型
const TYPE = {
  radioType: '1',
  checkboxType: '2',
  textAreaType: '3',
};

// @RestoreScrollTop
export default class QuestionnaireSurvey extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCheckChange: PropTypes.func.isRequired,
    onRadioChange: PropTypes.func.isRequired,
    answersList: PropTypes.object,
  }

  static defaultProps = {
    answersList: {},
  };

  // 根据返回的问题列表，判断不同类型显示
  renderOption() {
    const { form, onCheckChange, answersList = {}, onRadioChange } = this.props;
    // console.log(answersList);
    const { quesInfoList } = answersList;
    const { getFieldDecorator } = form;
    let content = null;
    const itemForm = _.map(quesInfoList, (item, key) => {
      const { quesId } = item;
      if (item.quesTypeCode === TYPE.radioType) {
        content = (<FormItem>
          {getFieldDecorator(quesId, { rules: [{ required: true, message: '此答案不能为空，请选择你的选项' }] })(
            <div className={styles.radioContent}>
              <p>{key + 1}.{item.quesValue}</p>
              <RadioGroup
                name={item.quesTypeCode}
                className={styles.radioGroup}
                onChange={onRadioChange}
              >
                {
                  item.optionInfoList.map(itemChild =>
                    <Radio
                      value={itemChild.optionValue}
                      dataId={itemChild.optionId}
                      className={styles.radioOption}
                      dataQuesId={quesId}
                    >
                      {itemChild.optionValue}
                    </Radio>)
                }
              </RadioGroup>
            </div>,
          )}
        </FormItem>);
      } else if (item.quesTypeCode === TYPE.checkboxType) {
        // const dataQues = itemChild.optionValue - itemChild.optionId
        content = (<FormItem>
          {getFieldDecorator(quesId, { rules: [{ required: true, message: '此答案不能为空，请选择你的选项' }] })(
            <div className={styles.radioContent}>
              <p>{key + 1}.{item.quesValue}</p>
              <Checkbox.Group style={{ width: '100%' }} className={styles.radioGroup} onChange={onCheckChange}>
                {
                  item.optionInfoList.map(itemChild => <Checkbox
                    value={`${itemChild.optionValue}-${itemChild.optionId}-${quesId}`}
                    className={styles.radioOption}
                  >
                    {itemChild.optionValue}
                  </Checkbox>)
                }
              </Checkbox.Group>
            </div>,
          )}
        </FormItem>);
      } else if (item.quesTypeCode === TYPE.textAreaType) {
        content = (<FormItem>
          {getFieldDecorator(quesId, {
            rules: [{
              required: true, maxLength: '250', message: '问题答案不能小于10个字符，最多250个字符!',
            }],
          })(
            <div className={styles.radioContent}>
              <p>{key + 1}.{item.quesValue}</p>
              <TextArea rows={4} className={styles.radioGroup} />
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
    } = this.props;
    return (
      <div>
        <Modal
          title="问卷调查"
          visible={visible}
          onCancel={onCancel}
          width={650}
          className={styles.question}
          footer={[
            <Button key="submit" type="primary" onClick={onOk}>
              提交
            </Button>,
          ]}
        >
          <Form layout="vertical" >
            {this.renderOption()}
          </Form>
        </Modal>
      </div>
    );
  }
}
