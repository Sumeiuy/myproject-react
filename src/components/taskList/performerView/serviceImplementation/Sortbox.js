/*
 * @Description: 排序
 * @Author: WangJunjun
 * @Date: 2018-05-22 20:03:47
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-23 00:19:19
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
// import Icon from '../../../common/Icon';
import descImg from '../img/desc.png';
import ascImg from '../img/asc.png';

import styles from './Sortbox.less';

export default function Sortbox(props) {
  const {
    name, isDesc, onChange, sortId
  } = props;
  const handleClick = () => {
    onChange({
      sortId,
      isDesc: !isDesc,
    });
  };
  const imgSrc = isDesc ? descImg : ascImg;
  return (
    <div className={styles.sortButton} onClick={handleClick}>
      <Button className={styles.button}>
        <span className={styles.name}>{name}</span>
        <img className={styles.icon} src={imgSrc} alt="" />
      </Button>
    </div>
  );
}

Sortbox.propTypes = {
  isDesc: PropTypes.bool,
  sortId: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

Sortbox.defaultProps = {
  isDesc: true,
  sortId: '',
  name: '',
  onChange: () => {},
};
