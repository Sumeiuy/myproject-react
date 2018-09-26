/**
 * @Description: 丰富首页-公用单元
 * @Author: Liujianshu
 * @Date: 2018-09-12 17:11:52
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-09-21 17:34:15
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover } from 'antd';
import classnames from 'classnames';


import antdStyles from '../../css/antd.less';
import { number } from '../../helper';
import styles from './commonCell.less';
import classes from '../customerPool/home/performanceIndicators__.less';

export default function CommonCell(props) {
  const {
    isNeedTitle,
    title,
    icon,
    data,
    isNeedExtra,
    extraText,
    onExtraClick,
    onClick,
    valueStyle,
  } = props;
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
  const renderList = !_.isEmpty(data) && data.map(item => {
    const { code, id = '', value, title } = item;
    return (
      <li className={styles.item} key={code || id}>
        <div onClick={() => onClick(item)}>
          {renderPopver(item)}
        </div>
        <div>
          <span title={title || value} style={valueStyle}>
            {number.formatToUnit({
              // 传入的数字
              num: value,
              // 是否格式化千分符
              isThousandFormat: true,
              // 小数部分长度
              floatLength: 1,
            })}
          </span>
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
      {
        _.isEmpty(data)
        ? <div className={styles.noData}>暂无数据</div>
        : <ul className={styles.list}>
          { renderList }
        </ul>
      }
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
  onClick: PropTypes.func,
  // 数值的样式
  valueStyle: PropTypes.object,
};

CommonCell.defaultProps = {
  isNeedTitle: true,
  title: '标题',
  icon: '',
  data: [],
  isNeedExtra: false,
  extraText: '更多',
  onExtralick: _.noop,
  onClick: _.noop,
  valueStyle: {},
};
