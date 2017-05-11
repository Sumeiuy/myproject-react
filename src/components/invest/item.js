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
    const { data: { key, unit, value, name } } = this.props;
    const data = toUnit(value, unit, 5);
    return (
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Icon type={iconTypeMap[key]} />
          {name}
        </h3>
        <h4 className={styles.num}>
          {data.value}
          <span className={styles.span}>
            {data.unit}
          </span>
        </h4>
      </div>
    );
  }
}
Item.propTypes = {
  data: PropTypes.object,
};
