/**
 * @Author: sunweibin
 * @Date: 2017-11-01 22:05:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-04 16:30:30
 */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '../common/Button';

import styles from './rejectButtons.less';

export default function RejectButtons(props) {
  const { btnList, onClick, disabled } = props;

  return (
    <div className={styles.approvalBtnGroup}>
      {
        btnList.map((btn, index) => {
          const { btnName } = btn;
          let type = 'primary';
          if (index > 0) {
            type = 'default';
          }
          return (
            <Button
              disabled={disabled}
              className={styles.rejectBtn}
              onClick={() => onClick(btn)}
              type={type}
              size="large"
            >
              {btnName}
            </Button>
          );
        })
      }
    </div>
  );
}

RejectButtons.propTypes = {
  onClick: PropTypes.func.isRequired,
  btnList: PropTypes.array.isRequired,
  disabled: PropTypes.bool.isRequired,
};
