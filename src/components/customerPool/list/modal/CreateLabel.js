/**
 * @Descripter: 新建标签
 * @Author: K0170179
 * @Date: 2018/7/4
 */
import React, { PureComponent } from 'react';
import { Modal, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import styles from './createLabel.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
export default class CreateLabelType extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { visible } = props;
    if (visible !== state.preVisible) {
      return {
        visible,
        preVisible: visible,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { visible } = this.props;
    this.state = {
      visible,
      preVisible: visible,
    };
  }

  static propTypes = {
    form: PropTypes.object.isRequired,
    labelName: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    addLabel: PropTypes.func.isRequired,
  };

  @autobind
  handleCreateLabelSubmit() {
    const { addLabel,
      form: { validateFields },
      labelName,
    } = this.props;
    validateFields((error, values) => {
      if (!error) {
        addLabel({ ...values, labelName })
          .then(() => {
            this.setState({
              visible: false,
            });
          });
      } else {
        console.log('error', error, values);
      }
    });
  }

  @autobind
  handleCloseModal() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  handleAfterClose() {
    const { closeModal } = this.props;
    closeModal();
  }

  render() {
    const { labelName } = this.props;
    const { visible } = this.state;
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
        title={`新建“${labelName}”标签`}
        wrapClassName={styles.addLabel}
        width={540}
        visible={visible}
        maskClosable={false}
        onCancel={this.handleCloseModal}
        onOk={this.handleCreateLabelSubmit}
        afterClose={this.handleAfterClose}
        destroyOnClose
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="名称"
          >
            {labelName}
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
        </Form>
      </Modal>
    );
  }
}
