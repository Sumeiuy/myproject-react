/**
 * @Descripter: 新建客户标签类型
 * @Author: K0170179
 * @Date: 2018/7/4
 */
import React, { PureComponent } from 'react';
import { Modal, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { onlyWordNumAlphabet } from '../../../../helper/regexp';
import styles from './customerLabel.less';

const FormItem = Form.Item;

@Form.create()
export default class CreateLabelType extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    addLabelType: PropTypes.func.isRequired,
    queryLabelType: PropTypes.func.isRequired,
  };

  @autobind
  handleCreateTypeSubmit() {
    const {
      addLabelType,
      closeModal,
      form: { validateFields, getFieldsError },
      queryLabelType,
    } = this.props;
    const { typeName: typeNameError } = getFieldsError();
    if (typeNameError) {
      return;
    }
    validateFields((error, values) => {
      if (!error) {
        addLabelType(values)
          .then((addLabelTypeResult) => {
            if (addLabelTypeResult) {
              closeModal();
              queryLabelType();
            } else {
              this.props.form.setFields({
                typeName: {
                  value: values.typeName,
                  errors: [new Error('添加的标签类型已存在，请重新输入')],
                },
              });
            }
          });
      } else {
        console.log('error', error, values);
      }
    });
  }

  render() {
    const { visible, closeModal } = this.props;
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
        title="新增标签类型"
        wrapClassName={styles.addLabelType}
        width={540}
        maskClosable={false}
        visible={visible}
        onCancel={closeModal}
        onOk={this.handleCreateTypeSubmit}
        destroyOnClose
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="名称"
          >
            {getFieldDecorator('typeName', {
              rules: [{
                required: true, message: '请输入标签类型名称',
              }, {
                max: 10, message: '最多为10个字',
              }, {
                pattern: onlyWordNumAlphabet, message: '可输入字符仅为汉字、数字、字母',
              }],
            })(
              <Input />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
