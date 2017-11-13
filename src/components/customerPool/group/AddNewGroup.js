/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-23 16:50:28
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-10 15:12:00
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { autobind } from 'core-decorators';
import { checkSpecialCharacter } from '../../../decorators/checkSpecialCharacter';
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

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { groupName, groupDesc } = values;
        this.submitFormContent(groupName, groupDesc);
      }
    });
  };

  @autobind
  @checkSpecialCharacter
  submitFormContent(groupName, groupDesc) {
    const { onSubmit } = this.props;
    onSubmit({
      groupName,
      groupDesc,
    });
  }

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
            <Input type="textarea" placeholder="请输入分组描述" rows={5} style={{ width: '100%' }} />,
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
