/**
 * @Description: 首席观点和组合推荐
 * @Author: Liujianshu
 * @Date: 2018-09-11 15:47:01
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-09-11 16:43:17
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Tabs } from 'antd';


import styles from './keyAttention.less';

const TabPane = Tabs.TabPane;
export default function ViewAndIntro(props) {
  const { data } = props;

  const callback = (key) => {
    console.warn(key);
  };

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
  const renderList = tempData.map(item => {
    const { name, code, value, title } = item;
    return (
      <li className={styles.item} key={code}>
        <div title={name}>{name}</div>
        <div title={title}>{value}</div>
      </li>
    );
  });

  console.warn('data', data);

  return (
    <div className={styles.keyAttention}>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="首席观点" key="1">Content of Tab Pane 1</TabPane>
        <TabPane tab="组合推荐" key="2">
          <ul className={styles.list}>
            <li>
              <span>近30天收益率</span>
              组合名称
            </li>
            { renderList }
          </ul>
        </TabPane>
      </Tabs>
    </div>
  );
}

ViewAndIntro.propTypes = {
  data: PropTypes.object,
};

ViewAndIntro.defaultProps = {
  data: {},
};
