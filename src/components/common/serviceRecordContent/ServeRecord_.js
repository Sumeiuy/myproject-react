/**
 * @Author: sunweibin
 * @Date: 2018-04-12 12:03:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-20 22:42:39
 * @description 创建服务记录中的服务记录文本输入框组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';

import Icon from '../Icon';
import { PHONE } from './utils';

import styles from './index.less';

const { TextArea } = Input;
const FormItem = Form.Item;

export default function ServeRecord(props) {
  const { showError, value, onChange, caller } = props;

  const serviceContentErrorProps = showError ? {
    hasFeedback: false,
    validateStatus: 'error',
    help: '服务记录不能为空，最多输入1000汉字',
  } : null;

  return (
    <div className={styles.serveRecord}>
      <div className={styles.title}>服务记录:</div>
      <FormItem {...serviceContentErrorProps}>
        <div className={styles.content}>
          {
            caller === PHONE &&
            <p className={styles.yuyintishi}>2017年4月1日给客户发起语音通话，时长3分2秒</p>
          }
          <TextArea
            rows={5}
            value={value}
            onChange={onChange}
          />
          {
            caller === PHONE &&
            <p className={styles.wenxin}>
              <Icon type="wenxintishi" className={styles.wenxinIcon} />
              温馨提醒：请写下您和客户的沟通记录
            </p>
          }
        </div>
      </FormItem>
    </div>
  );
}

ServeRecord.propTypes = {
  showError: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  caller: PropTypes.string.isRequired,
};

ServeRecord.defaultProps = {
  showError: false,
  value: '',
};
