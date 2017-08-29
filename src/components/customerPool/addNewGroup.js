/**
 *@file

 *@author zhuyanwen

 * */
import React, { PureComponent, PropTypes } from 'react';
import { withRouter } from 'dva/router';
import { Form, Input, Button } from 'antd';
import styles from './addNewGroup.less';

const FormItem = Form.Item;
const create = Form.create;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};
const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};
@create()
@withRouter
export default class AddNewGroup extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }
  addNewGroupSubmit = (e) => {
    const { onSubmit } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.addNewGroupSubmit}>
        <FormItem
          {...formItemLayout}
          label="新建分组名称"
        >
          {getFieldDecorator('groupName', {
            rules: [{ required: true, message: '请输入分组名称' }],
          })(
            <Input placeholder="请输入分组名称" />,
              )}
        </FormItem>
        <FormItem
          {...formItemLayout2}
          label="任务描述"
        >
          {getFieldDecorator('groupDesc', { initialValue: '' })(
            <Input type="textarea" rows={5} style={{ width: '100%' }} />,
              )}
        </FormItem>
        <FormItem className={styles.btnContent}>
          <Button>
            取消
          </Button>
          <Button
            type="primary"
            htmlType="submit"
          >
           保存
          </Button>
        </FormItem>
      </Form>
    );
  }

}
