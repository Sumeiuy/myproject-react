/**
 * @file invest/item.js 单项数据统计组件
 * @author LiuJianShu
 */
import React, { PureComponent, PropTypes } from 'react';
import { Tooltip } from 'antd';
import { autobind } from 'core-decorators';

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
  // tooltip
  @autobind
  getTooltipContainer() {
    return document.querySelector('.react-app');
  }

  render() {
    const { data: { unit, value, name, parentName, description } } = this.props;
    const data = toUnit(value, unit, 5);
    const IndexIcon = getIcon(unit);
    const newName = parentName ? `${parentName}-${name}` : name;
    const toolTipHtnml = (<div className={styles.summuryToolTip}>
      <h3>{newName}</h3>
      {
        description ?
          <h4>{newName}</h4>
        :
          ''
      }
    </div>);
    return (
      <div className={styles.content}>
        <Tooltip
          placement="bottom"
          title={toolTipHtnml}
          overlayClassName="visibleRangeToolTip"
          getPopupContainer={this.getTooltipContainer}
        >
          <h3 className={styles.title}>
            <Icon type={IndexIcon} />
            {newName}
          </h3>
        </Tooltip>
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
