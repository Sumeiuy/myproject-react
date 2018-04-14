/**
 * @Author: sunweibin
 * @Date: 2018-04-12 12:03:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-14 22:16:45
 * @description 创建服务记录中的服务记录文本输入框组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';

import styles from './index.less';

const { TextArea } = Input;
const FormItem = Form.Item;

export default function ServeRecord(props) {
  const { showError, value, onChange } = props;

  const serviceContentErrorProps = showError ? {
    hasFeedback: false,
    validateStatus: 'error',
    help: '服务内容不能为空，最多输入1000汉字',
  } : null;

  return (
    <div className={styles.serveRecord}>
      <div className={styles.title}>服务记录:</div>
      <FormItem {...serviceContentErrorProps}>
        <div className={styles.content}>
          <TextArea
            rows={5}
            value={value}
            onChange={onChange}
          />
        </div>
      </FormItem>
    </div>
  );
}

ServeRecord.propTypes = {
  showError: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

ServeRecord.defaultProps = {
  showError: false,
  value: '',
};
