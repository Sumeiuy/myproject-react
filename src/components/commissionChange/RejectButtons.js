/**
 * @Author: sunweibin
 * @Date: 2017-11-01 22:05:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-01 22:16:18
 */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '../common/Button';

import styles from './rejectButtons.less';

export default function RejectButtons(props) {
  const {
    onSubmit,
    onBack,
    onTerminate,
  } = props;

  return (
    <div className={styles.approvalBtnGroup}>
      <Button
        className={styles.rejectBtn}
        onClick={onSubmit}
        type="primary"
        size="large"
      >
        提交
      </Button>
      <Button
        className={styles.rejectBtn}
        onClick={onBack}
        size="large"
      >
        返回
      </Button>
      <Button
        className={styles.rejectBtn}
        onClick={onTerminate}
        size="large"
      >
        终止
      </Button>
    </div>
  );
}

RejectButtons.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onTerminate: PropTypes.func.isRequired,
};
