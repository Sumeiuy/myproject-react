/**
 * @Author: sunweibin
 * @Date: 2018-08-06 15:06:28
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-08 17:52:01
 * @desc MOT回访类任务展示使用的回访结果和回访失败原因输入框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Radio, Input, Form } from 'antd';

import styles from './mOTReturnVisitTaskContent.less';

const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const FormItem = Form.Item;

export default class MOTReturnVisitTaskContent extends PureComponent {
  static propTypes = {
    onVisitResultChange: PropTypes.func.isRequired,
    onFailReasonChange: PropTypes.func.isRequired,
    failReasonValue: PropTypes.string.isRequired,
    visitResultValue: PropTypes.string.isRequired,
    visitResultValidate: PropTypes.bool,
    failReasonValidate: PropTypes.bool,
  }

  static defaultProps = {
    visitResultValidate: false,
    failReasonValidate: false,
  }

  render() {
    const {
      onFailReasonChange,
      onVisitResultChange,
      failReasonValue,
      visitResultValue,
      failReasonValidate,
      visitResultValidate,
    } = this.props;

    const returnVisitResultProps = visitResultValidate ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: '请选择回访结果',
    } : null;

    const failReasonFormProps = failReasonValidate ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: '请填写失败原因',
    } : null;

    return (
      <div className={styles.motReturnVisitContent}>
        <div className={styles.visitReturnBlock}>
          <div className={styles.title}>回访结果:</div>
          <div className={styles.content}>
            <FormItem {...returnVisitResultProps}>
              <RadioGroup
                onChange={onVisitResultChange}
                value={visitResultValue}
              >
                <Radio value="Success">成功</Radio>
                <Radio value="Lost">失败</Radio>
              </RadioGroup>
            </FormItem>
          </div>
        </div>
        {
          visitResultValue !== 'Lost' ? null
            : (
              <div className={styles.visitReturnBlock}>
                <div className={styles.title}>失败原因:</div>
                <div className={styles.content}>
                  <FormItem {...failReasonFormProps}>
                    <TextArea
                      rows={5}
                      value={failReasonValue}
                      onChange={onFailReasonChange}
                    />
                  </FormItem>
                </div>
              </div>
            )
        }
      </div>
    );
  }
}
