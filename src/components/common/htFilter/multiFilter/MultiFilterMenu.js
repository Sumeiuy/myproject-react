import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import className from 'classnames';
import _ from 'lodash';
import styles from './multiFilterMenu.less';

function tansformLabel(value, defaultLabel) {
  return value === defaultLabel ? '清除选择的内容' : value;
}

export default class MultiFilterMenu extends PureComponent {
  static propTypes = {
    value: PropTypes.array.isRequired, // 默认带进来选中的Item数组
    data: PropTypes.array.isRequired, // Menu显示的数据源， [{key:,value: }]
    onChange: PropTypes.func.isRequired, // 选中某项的回调， function([{key, value}])
    defaultLabel: PropTypes.string.isRequired,
  }

  findDefaultItem = data => _.find(data, item => item.value === this.props.defaultLabel)

  isChecked = (item, selectedItems) => {
    if (_.find(selectedItems, key => key === item.key)) {
      return true;
    }
    return false;
  };

  handleItemCheck = (event, item) => {
    const { value } = this.props;
    let returnSelectedItems = [];
    if (item.value === this.props.defaultLabel) {
      returnSelectedItems = [];
    } else if (event.target.checked) {
      returnSelectedItems = _.concat(value, [item.key]).filter(key => key !== '');
    } else {
      returnSelectedItems =
        _.filter(value, key => key !== item.key && key !== '');
    }

    this.props.onChange([
      ...returnSelectedItems,
    ]);
  }

  render() {
    const { value, data } = this.props;
   /*  const renderData = [{ key: '', value: this.props.defaultLabel }].concat(data); */
    return (
      <ul className={styles.multiFilterMenu}>
        {_.map(data, item => (
          <li
            key={item.key}
            className={
              className({
                [styles.hiddenCheckbox]: item.value === this.props.defaultLabel,
                [styles.hidden]: item.value === this.props.defaultLabel &&
                  value[0] === '',
              })
          }
          >
            <Checkbox
              onChange={e => this.handleItemCheck(e, item)}
              checked={this.isChecked(item, value)}
            >
              {tansformLabel(item.value, this.props.defaultLabel)}
            </Checkbox>
          </li>
        ))}
      </ul>
    );
  }
}
