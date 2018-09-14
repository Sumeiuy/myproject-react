/**
 * @Description: 丰富首页-公用单元
 * @Author: Liujianshu
 * @Date: 2018-09-12 17:11:52
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-09-14 14:38:48
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

import styles from './commonCell.less';

export default function CommonCell(props) {
  const { isNeedTitle, title, icon, data, isNeedExtra, extraText, onExtraClick } = props;
  if (_.isEmpty(data)) {
    return null;
  }
  // 渲染列表
  const renderList = data.map(item => {
    const { name, code, value, title } = item;
    return (
      <li className={styles.item} key={code}>
        <div title={name}>{name}</div>
        <div title={title || value}>{value}</div>
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
};

CommonCell.defaultProps = {
  isNeedTitle: true,
  title: '标题',
  icon: '',
  data: [],
  isNeedExtra: false,
  extraText: '更多',
  onExtralick: _.noop,
};
