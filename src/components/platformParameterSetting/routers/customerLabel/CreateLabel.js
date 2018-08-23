/**
 * @Descripter: 新建标签
 * @Author: K0170179
 * @Date: 2018/7/4
 */
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import styles from './customerLabel.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
// 标签名称可输入字符的正则
const LABEL_NAME_REG = /^[#&\-_@%A-Za-z0-9\u4e00-\u9fa5]+$/;

@Form.create()
export default class CreateLabelType extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    allLabels: PropTypes.array.isRequired,
    closeModal: PropTypes.func.isRequired,
    checkDuplicationName: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    addLabel: PropTypes.func.isRequired,
    queryLabelList: PropTypes.func.isRequired,
  };

  @autobind
  handleCreateLabelSubmit() {
    const { addLabel,
      closeModal,
      form: { validateFields, getFieldsError },
      queryLabelList,
    } = this.props;
    const { labelName: labelNameError } = getFieldsError();
    if (labelNameError) {
      validateFields(['labelDesc', 'labelTypeId']);
      return;
    }
    validateFields((error, values) => {
      if (!error) {
        addLabel({ ...values, labelFlag: 2 })
          .then((duplicationName) => {
            // 当校验标签重名时后端返回null
            if (_.isNull(duplicationName)) {
              this.props.form.setFields({
                labelType: {
                  value: values.labelType,
                  errors: [new Error('添加的标签已存在，请重新输入')],
                },
              });
            } else {
              closeModal();
              queryLabelList({ currentPage: 1 });
            }
          });
      } else {
        console.log('error', error, values);
      }
    });
  }

  // 实时校验标签名是否重复
  @autobind
  handleCheckLabelName() {
    const { checkDuplicationName, form } = this.props;
    const { labelName: labelNameError } = form.getFieldsError();
    if (labelNameError) {
      return;
    }
    form.validateFields(['labelName'], (error, values) => {
      if (!error) {
        checkDuplicationName({ ...values, labelFlag: 2 }).then((duplicationName) => {
          if (duplicationName) {
            this.props.form.setFields({
              labelName: {
                value: values.labelName,
                errors: [new Error('该标签已存在，请重新输入')],
              },
            });
          }
        });
      }
    });
  }
  render() {
    const { closeModal, visible, allLabels } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 3 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };

    return (
      <Modal
        title="新建标签"
        wrapClassName={styles.addLabel}
        width={540}
        visible={visible}
        maskClosable={false}
        onCancel={closeModal}
        onOk={this.handleCreateLabelSubmit}
        destroyOnClose
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="名称"
          >
            {getFieldDecorator('labelName', {
              rules: [{
                required: true, message: '请输入标签名称',
              }, {
                max: 8, message: '最多为8个字',
              }, {
                min: 4, message: '最少为4个字',
              }, {
                pattern: LABEL_NAME_REG, message: '可输入字符仅为汉字、数字、字母及合法字符(#&-_@%)',
              }],
            })(
              <Input onBlur={this.handleCheckLabelName} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
          >
            {getFieldDecorator('labelDesc', {
              rules: [{
                required: true, message: '请输入标签描述',
              }, {
                min: 10, message: '最少为10个字',
              }, {
                max: 500, message: '最多为500个字',
              }],
            })(
              <TextArea placeholder="请输入标签描述" autosize={{ minRows: 6, maxRows: 10 }} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            wrapperCol={{
              sm: { span: 8 },
            }}
            label="类型"
          >
            {getFieldDecorator('labelTypeId', {
              rules: [
                { required: true, message: '请选择标签类型名称' },
              ],
            })(
              <Select placeholder="标签类型">
                {
                  _.map(allLabels, item => (
                    <Option key={item.id} value={item.id}>{item.typeName}</Option>
                  ))
                }
              </Select>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
