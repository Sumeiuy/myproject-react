/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-23 16:50:28
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-27 17:21:51
 */

import React, { PureComponent, PropTypes } from 'react';
import { Form, Input, message } from 'antd';
import Button from '../../common/Button';
import styles from './addNewGroup.less';

const FormItem = Form.Item;
const create = Form.create;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};

const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

@create()
export default class AddNewGroup extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    count: PropTypes.string.isRequired,
  };

  addNewGroupSubmit = (e) => {
    e.preventDefault();
    const { onSubmit } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { groupName } = values;
        if (groupName.indexOf('%') > -1 || groupName.indexOf('_') > -1) {
          message.error('分组名称不要包含特殊字符');
          return;
        }
        onSubmit(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { goBack, count } = this.props;
    return (
      <Form onSubmit={this.addNewGroupSubmit}>
        <FormItem
          {...formItemLayout}
          label="分组名称"
        >
          {getFieldDecorator('groupName', {
            rules: [{ max: 50, message: '字数限制：0-50字' }, { required: true, message: '请输入分组名称' }],
          })(
            <Input placeholder="请输入分组名称" />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout2}
          label="分组描述"
        >
          {getFieldDecorator('groupDesc', { rules: [{ max: 500, message: '字数限制：0-500字' }], initialValue: '' })(
            <Input type="textarea" placeholder="客户已达到办理业务的各项条件，可以联系客户并给客户介绍符合开通条件的业务，根据客户的反馈情况决定是否需要向客户推荐开通相关业务。" rows={5} style={{ width: '100%' }} />,
          )}
        </FormItem>
        <FormItem className={styles.btnContent}>
          <div className={styles.leftSection}>
            <span className={styles.description}>已选目标客户<b>&nbsp;{count}&nbsp;</b>户</span>
          </div>
          <div className={styles.rightSection}>
            <Button onClick={goBack}>
              取消
          </Button>
            <Button
              type="primary"
              htmlType="submit"
            >
              保存
          </Button>
          </div>
        </FormItem>
      </Form>
    );
  }

}
