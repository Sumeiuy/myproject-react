/**
 * @file invest/item.js 单项数据统计组件
 * @author LiuJianShu
 */
import React, { PureComponent, PropTypes } from 'react';
import iconTypeMap from '../../config/iconTypeMap';
import Icon from '../common/Icon';
import styles from './item.less';

export default class Item extends PureComponent {

  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  render() {
    const { data } = this.props;
    return (
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Icon type={iconTypeMap[data.icon]} />
          {data.title}
        </h3>
        <h4 className={styles.num}>
          {data.num}
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
