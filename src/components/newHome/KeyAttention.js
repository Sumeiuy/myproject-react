/**
 * @Description: 重点关注组件
 * @Author: Liujianshu
 * @Date: 2018-09-11 09:49:21
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-09-11 16:43:10
 */
import React from 'react';
import PropTypes from 'prop-types';

import styles from './keyAttention.less';

export default function KeyAttention(props) {
  const { data } = props;
  const tempData = [
    {
      name: '新开客户',
      code: '11111',
      value: '22112',
      title: '新开客户1',
    },
    {
      name: '新开客户',
      code: '11112',
      value: '22112',
      title: '新开客户2',
    },
    {
      name: '新开客户',
      code: '11113',
      value: '22112',
      title: '新开客户3',
    },
    {
      name: '新开客户',
      code: '11114',
      value: '22112',
      title: '新开客户4',
    },
  ];
  console.warn('data', data);
  const renderList = tempData.map(item => {
    const { name, code, value, title } = item;
    return (
      <li className={styles.item} key={code}>
        <div title={name}>{name}</div>
        <div title={title}>{value}</div>
      </li>
    );
  });
  return (
    <div className={styles.keyAttention}>
      <h2 className={styles.title}>重点关注</h2>
      <ul className={styles.list}>
        { renderList }
      </ul>
    </div>
  );
}

KeyAttention.propTypes = {
  data: PropTypes.array,
};

KeyAttention.defaultProps = {
  data: [],
};
