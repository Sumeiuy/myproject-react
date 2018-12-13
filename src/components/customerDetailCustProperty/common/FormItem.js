/*
 * @Author: sunweibin
 * @Date: 2018-12-13 18:07:26
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-13 18:23:57
 * @description 表单项布局容器组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import IfWrap from '../../common/biz/IfWrap';
import styles from './formItem.less';

function FormItem(props) {
  const {
    title,
    children,
    isRequired,
    position,
  } = props;

  const labelClass = cx({
    [styles.itemLable]: true,
    [styles.width76]: position === 'left',
    [styles.width90]: position === 'right',
  });

  return (
    <div className={styles.formItem}>
      <div className={labelClass}>
        <IfWrap isRender={isRequired}>
          <span className={styles.requried}>*</span>
        </IfWrap>
        {`${title}：`}
      </div>
      <div className={styles.valueArea}>
        {children}
      </div>
    </div>
  );
}

FormItem.propTypes = {
  title: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isRequired: PropTypes.bool,
};
FormItem.defaultProps = {
  isRequired: false,
};

export default FormItem;
