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
import { emp } from '../../../../helper';

const FormItem = Form.Item;
const { TextArea } = Input;

// 标签名称可输入字符的正则
const LABEL_NAME_REG = /^[#&\-_@%A-Za-z0-9\u4e00-\u9fa5]+$/;

@Form.create()
export default class CreateLabelType extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { visible, labelName } = props;
    if (visible !== state.preVisible) {
      return {
        visible,
        preVisible: visible,
        inputValue: labelName,
      };
    }
    return null;
  }

  static propTypes = {
    form: PropTypes.object.isRequired,
    labelName: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    addLabel: PropTypes.func.isRequired,
    checkDuplicationName: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { visible } = this.props;
    this.state = {
      visible,
      inputValue: props.labelName,
      preVisible: visible,
    };
    // 新建标签id
    this.newLabelId = '';
  }

  @autobind
  handleCreateLabelSubmit() {
    const {
      addLabel,
      form: { validateFields, getFieldsError },
    } = this.props;

    const { inputValue } = this.state;
    const { labelName: labelNameError } = getFieldsError();

    if (labelNameError) {
      validateFields(['labelDesc']);
      return;
    }

    validateFields((error, values) => {
      if (!error) {
        addLabel({
          ...values,
          labelName: inputValue,
          labelFlag: '1',
          orgId: emp.getOrgId(),
        })
          .then((labelId) => {
            this.setState({
              visible: false,
            });
            this.newLabelId = labelId;
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
    closeModal(this.newLabelId);
    // 新建标签结束,重置新建标签id
    this.newLabelId = '';
  }

  @autobind
  handleInputChange(value) {
    this.setState({
      inputValue: value.target.value,
    });
  }

    // 实时校验标签名是否重复
  @autobind
  handleCheckLabelName() {
    const { checkDuplicationName, form } = this.props;
    const { labelName: labelNameError } = form.getFieldsError();
    // 校验规则不通过或编辑标签不校验重名
    if (labelNameError) {
      return;
    }
    form.validateFields(['labelName'], (error, values) => {
      if (!error) {
        checkDuplicationName({
          labelName: values.labelName,
          labelFlag: '1'
        }).then((duplicationName) => {
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
    const { labelName } = this.props;
    const { visible /* inputValue */ } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 3 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };

    // const labelText = inputValue ? `“${inputValue}”` : '';

    return (
      <Modal
        title="新建标签"
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
              initialValue: labelName,
            })(
              <Input onChange={this.handleInputChange} onBlur={this.handleCheckLabelName} />,
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
        </Form>
      </Modal>
    );
  }
}
