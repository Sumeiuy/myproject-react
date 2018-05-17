/**
 * @Author: sunweibin
 * @Date: 2018-04-12 12:03:56
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-17 15:25:06
 * @description 创建服务记录中的服务记录文本输入框组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';

import { PHONE } from './utils';

import styles from './index.less';

const { TextArea } = Input;
const FormItem = Form.Item;

export default function ServeRecord(props) {
  const { showError, value, onChange, serviceRecordInfo = {} } = props;
  const { caller = '', autoGenerateRecordInfo = {} } = serviceRecordInfo;
  const serviceContentErrorProps = showError ? {
    hasFeedback: false,
    validateStatus: 'error',
    help: '服务记录不能为空，最多输入1000汉字',
  } : null;
  const { serveContentDesc = '' } = autoGenerateRecordInfo;
  return (
    <div className={styles.serveRecord}>
      <div className={styles.title}>服务记录:</div>
      <FormItem {...serviceContentErrorProps}>
        <div className={styles.content}>
          {
            caller === PHONE
            && <p className={styles.yuyintishi}>{serveContentDesc}</p>
          }
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
  serviceRecordInfo: PropTypes.object,
};

ServeRecord.defaultProps = {
  showError: false,
  value: '',
  serviceRecordInfo: {},
};
