/**
 * @Description: 丰富首页-公用单元
 * @Author: Liujianshu
 * @Date: 2018-09-12 17:11:52
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-09-21 15:06:02
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover } from 'antd';
import classnames from 'classnames';


import antdStyles from '../../css/antd.less';
import styles from './commonCell.less';
import classes from '../customerPool/home/performanceIndicators__.less';

export default function CommonCell(props) {
  const { isNeedTitle, title, icon, data, isNeedExtra, extraText, onExtraClick, onValueClick } = props;
  // 渲染 Popover
  const renderPopver = item => {
    const { name, description = '' } = item;
    if (!_.isEmpty(description)) {
      return <Popover
        title={name}
        content={description}
        placement="bottom"
        mouseEnterDelay={0.2}
        overlayStyle={{ maxWidth: '320px' }}
        overlayClassName={antdStyles.popoverClass}
      >
        <span
          className={classes.chartLabel}
        >
          {name}
        </span>
      </Popover>;
    }
    return <span title={name}>{name}</span>;
  };
  // 渲染列表
  const renderList = _.isEmpty(data)
  ? <li className={styles.noData}>暂无数据</li>
  : data.map(item => {
    const { code, id = '', value, title } = item;
    return (
      <li className={styles.item} key={code || id}>
        <div>
          {renderPopver(item)}
        </div>
        <div>
          <span onClick={() => onValueClick(item)} title={title || value}>{value}</span>
        </div>
      </li>
    );
  });
  // 渲染-更多
  const renderMore = isNeedExtra
  ? <a onClick={onExtraClick}>{extraText}</a>
  : null;
  // 标题样式
  const titleClass = classnames({
    [styles.title]: true,
    [styles[icon]]: !_.isEmpty(icon),
  });
  // 渲染标题
  const renderTitle = isNeedTitle
  ? <h2 className={titleClass}>
    {renderMore}
    {title}
  </h2>
  : null;

  return (
    <div className={styles.commonWrapper}>
      {renderTitle}
      <ul className={styles.list}>
        { renderList }
      </ul>
    </div>
  );
}

CommonCell.propTypes = {
  // 是否需要标题
  isNeedTitle: PropTypes.bool,
  // 标题
  title: PropTypes.string,
  // 标题图标
  icon: PropTypes.string,
  // 数据
  data: PropTypes.array,
  // 是否需要额外显示
  isNeedExtra: PropTypes.bool,
  // 额外显示的文字
  extraText: PropTypes.string,
  // 额外的点击事件
  onExtralick: PropTypes.func,
  // value 的点击事件
  onValueClick: PropTypes.func,
};

CommonCell.defaultProps = {
  isNeedTitle: true,
  title: '标题',
  icon: '',
  data: [],
  isNeedExtra: false,
  extraText: '更多',
  onExtralick: _.noop,
  onValueClick: _.noop,
};
