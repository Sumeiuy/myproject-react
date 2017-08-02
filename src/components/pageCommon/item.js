/**
 * @file invest/item.js 单项数据统计组件
 * @author LiuJianShu
 */
import React, { PureComponent, PropTypes } from 'react';
import { Tooltip } from 'antd';
import { autobind } from 'core-decorators';

import styles from './item.less';
import { fspContainer } from '../../config';
import { toUnit } from '../../utils/helper';

const reactApp = fspContainer.reactApp;

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
    return document.querySelector(reactApp);
  }

  render() {
    const { data: { unit, value, name, parentName, description } } = this.props;
    const data = toUnit(value, unit, 5);
    const newName = parentName ? `${parentName}-${name}` : name;
    const toolTipHtnml = (<div className={styles.summuryToolTip}>
      <h3>{newName}</h3>
      {
        description ?
          <h4>{description}</h4>
        :
          ''
      }
    </div>);
    return (
      <div className={styles.content}>
        <div className={styles.contentBorder}>
          <Tooltip
            placement="bottom"
            title={toolTipHtnml}
            autoAdjustOverflow={false}
            overlayClassName="visibleRangeToolTip"
            getPopupContainer={this.getTooltipContainer}
          >
            <h3 className={styles.title}>
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
      </div>
    );
  }
}
Item.propTypes = {
  data: PropTypes.object,
};
