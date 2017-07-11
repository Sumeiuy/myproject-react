/**
 * @file invest/item.js 单项数据统计组件
 * @author LiuJianShu
 */
import React, { PureComponent, PropTypes } from 'react';
import { iconTypeMap } from '../../config';
import Icon from '../common/Icon';
import styles from './item.less';
import { toUnit } from '../../utils/helper';

const getIcon = iconTypeMap.getIcon;

export default class Item extends PureComponent {

  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  render() {
    const { data: { unit, value, name, parentName } } = this.props;
    const data = toUnit(value, unit, 5);
    const IndexIcon = getIcon(unit);
    const newName = parentName ? `${parentName}-${name}` : name;
    return (
      <div className={styles.content}>
        <h3 className={styles.title} title={newName}>
          <Icon type={IndexIcon} />
          {newName}
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
