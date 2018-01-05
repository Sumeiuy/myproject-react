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
// import _ from 'lodash';

import styles from './performerViewDetail.less';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const FormItem = Form.Item;

// @RestoreScrollTop
export default class QuestionnaireSurvey extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  }



  render() {
    const {
      form,
      visible,
      onOk,
      onCancel,
      onChange,
    } = this.props;
    const { getFieldDecorator } = form;
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
            <FormItem>
              {getFieldDecorator('questionOne', { rules: [{ required: true }] })(
                <div className={styles.radioContent}>
                  <p>1.此任务是否合理？</p>
                  <RadioGroup name="radiogroup" className={styles.radioGroup}>
                    <Radio value={1} className={styles.radioOption}>A</Radio>
                    <Radio value={2}>B</Radio>
                    <Radio value={3}>C</Radio>
                    <Radio value={4}>D</Radio>
                  </RadioGroup>
                </div>,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('questionTwo', { rules: [{ required: true }] })(
                <div className={styles.radioContent}>
                  <p>1.此任务是否合理？</p>
                  <Checkbox.Group style={{ width: '100%' }} className={styles.radioGroup} onChange={onChange}>
                    <Checkbox value="A" className={styles.radioOption}>E</Checkbox>
                    <Checkbox value="B" className={styles.radioOption}>E</Checkbox>
                    <Checkbox value="C" className={styles.radioOption}>E</Checkbox>
                    <Checkbox value="D" className={styles.radioOption}>E</Checkbox>
                    <Checkbox value="E" className={styles.radioOption}>E</Checkbox>
                  </Checkbox.Group>
                </div>,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('questionThr', {
                rules: [{ required: true, maxLength: '250', message: 'Please input the title of collection!' }],
              })(
                <div className={styles.radioContent}>
                  <p>1.此任务是否合理？</p>
                  <TextArea rows={4} className={styles.radioGroup} />
                </div>,
              )}
            </FormItem>
          </Form>

          {/*<div className={styles.radioContent}>
              <p>1.此任务是否合理？</p>
              <RadioGroup name="radiogroupTwo" className={styles.radioGroup}>
                <Radio value={1} className={styles.radioOption}>合理</Radio>
                <Radio value={2} className={styles.radioOption}>偏多，来不及联系</Radio>
                <Radio value={3} className={styles.radioOption}>筛选精确率不够，客户不适合本产品</Radio>
                <Radio value={4} className={styles.radioOption}>近期重复营销</Radio>
                <Radio value={5} className={styles.radioOption}>近期重复营销</Radio>
              </RadioGroup>
            </div>*/}


        </Modal>
      </div>
    );
  }
}
