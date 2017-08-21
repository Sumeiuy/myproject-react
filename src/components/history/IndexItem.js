/**
 * @file components/history/IndexItem.js
 * 指标项
 * @author yangquanjian
 */
import React, { PropTypes, PureComponent } from 'react';
import _ from 'lodash';

import Icon from '../common/Icon';
import { iconTypeMap } from '../../config';
import { toUnit } from '../../utils/helper';
import styles from './indexItem.less';

const {
  getCoreIcon,
  getCoreIconColor,
  getCoreIconSize,
} = iconTypeMap;

export default class IndexItem extends PureComponent {
  static propTypes = {
    itemIndex: PropTypes.string,
    itemData: PropTypes.object,
    active: PropTypes.bool,
  }

  static defaultProps = {
    itemIndex: '',
    active: '',
    itemData: {},
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  numberComparison(num) {
    if (!_.isEmpty(num)) {
      if (num.indexOf('-') !== -1) {
        return (<span className={styles.less}>{num}</span>);
      }
      return (<span>+{num}</span>);
    }
    return (<span>--%</span>);
  }

  render() {
    const {
      itemData:
      { unit, value, name, parentName, incrementRate }, active } = this.props;
    const data = toUnit(value, unit, 5);
    const IndexIcon = getCoreIcon(unit);
    const IndexIconColor = getCoreIconColor(unit);
    const IndexIconSize = getCoreIconSize(unit);
    const newName = parentName ? `${parentName}-${name}` : name;
    return (
      <div className={styles.indexItem}>
        <div className={active ? 'active am-bd-dv' : 'am-bd-dv'}>
          <div className={styles.innderDv}>
            <span className={styles.iconBox} style={{ color: IndexIconColor }}>
              <Icon type={IndexIcon} style={{ fontSize: IndexIconSize }} />
            </span>
            <div className={styles.mglDv}>
              <h4>{newName}</h4>
              <div className={styles.numberDv}>
                <span>{data.value}</span>
                {data.unit}
              </div>
              <div className={styles.infoDv}>
                较上期
                {this.numberComparison(incrementRate)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
