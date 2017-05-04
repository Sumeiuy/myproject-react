/**
 * @file invest/item.js 单项数据统计组件
 * @author LiuJianShu
 */
import React, { PureComponent, PropTypes } from 'react';
import { iconTypeMap } from '../../config';
import Icon from '../common/Icon';
import styles from './item.less';
import { toUnit } from '../../utils/helper';

export default class Item extends PureComponent {

  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  render() {
    const { data: { icon, unit, num, title } } = this.props;
    return (
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Icon type={iconTypeMap[icon]} />
          {title}
        </h3>
        <h4 className={styles.num}>
          {toUnit(num, 5).value}
          <span className={styles.span}>
            {toUnit(num, 5).unit}{unit}
          </span>
        </h4>
      </div>
    );
  }
}
Item.propTypes = {
  data: PropTypes.object,
};
