import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Select } from 'antd';
import _ from 'lodash';
import { Button } from 'lego-react-filter/src';
import styles from './tagFilterMenu.less';

const Option = Select.Option;

function syncValueAndOption(value, optionValue) {
  return _.map(value, (item) => {
    const currentOption = _.find(optionValue, option => option.key === item.key);
    return currentOption || item;
  });
}

export default class TagFilterMenu extends PureComponent {
  static propTypes = {
    value: PropTypes.array, // collection
    data: PropTypes.array.isRequired, // Menu显示的数据源， [{key,value}]
    onChange: PropTypes.func, // 选中某项的回调， function({label, value})
    onCheck: PropTypes.func,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    onCheck: _.noop,
    onSelect: _.noop,
    onChange: _.noop,
    value: [],
  }

  state = {
    value: this.props.value,
    optionValue: this.props.value,
  }

  getSelectKey = (obj, value) => {
    const currentValue = _.find(value, item => item.key === obj.filterId);
    return currentValue ? currentValue.optionKey : '';
  }

  isChecked = (obj, value) => !!_.find(value, item => item.key === obj.filterId)

  handleResetBtnClick = () => {
    this.setState({
      value: [],
      optionValue: [],
    });

    this.props.onChange([]);
  }

  handleSubmitBtnClick = () => {
    const { value } = this.state;
    this.props.onChange(value, {
      inVisible: true,
    });
  }

  handleItemCheck = (event, item) => {
    const { value, optionValue } = this.state;
    const currentOption = _.find(optionValue, obj => obj.key === item.filterId);
    if (event.target.checked) {
      if (_.isEmpty(optionValue) || !currentOption) {
        this.setState({
          value: value.concat({
            key: item.filterId,
            optionKey: '',
          }),
        });
      } else {
        this.setState({
          value: value.concat({
            key: item.filterId,
            optionKey: currentOption.optionKey,
          }),
        });
      }
    } else {
      this.setState({
        value: _.filter(value, obj => obj.key !== item.filterId),
      });
    }
  }

  handleSelectChange = (select, obj) => {
    const { optionValue, value } = this.state;
    let nextOptionValue;
    let syncValue;

    if (_.isEmpty(optionValue)
      || !_.find(optionValue, item => item.key === obj.filterId)) {
      nextOptionValue = optionValue.concat({
        key: obj.filterId,
        optionKey: select,
      });
      syncValue = syncValueAndOption(value, nextOptionValue);
      this.setState({
        value: syncValue,
        optionValue: nextOptionValue,
      });
    } else {
      nextOptionValue = _.map(optionValue, (item) => {
        if (item.key === obj.filterId) {
          return {
            key: obj.filterId,
            optionKey: select,
          };
        }
        return item;
      });
      syncValue = syncValueAndOption(value, nextOptionValue);
      this.setState({
        value: syncValue,
        optionValue: nextOptionValue,
      });
    }
  }

  render() {
    const { value, optionValue } = this.state;
    const { data } = this.props;
    return (
      <div className={styles.tagFilterMenu}>
        {
          _.map(data, obj => (
            <Checkbox
              key={obj.filterId}
              className={styles.checkbox}
              onChange={e => this.handleItemCheck(e, obj)}
              checked={this.isChecked(obj, value)}
            >
              <span
                className={styles.label}
                title={obj.filterDesc}
              >
                {obj.filterDesc}
              </span>
              <Select
                className={styles.optionSelect}
                title={this.getSelectKey(obj, optionValue)}
                value={this.getSelectKey(obj, optionValue)}
                getPopupContainer={() => this.elem}
                onChange={select => this.handleSelectChange(select, obj)}
              >
                {
                    _.map(obj.items, option => (
                      <Option
                        key={option.itemCode}
                        className={styles.option}
                        value={option.itemCode}
                        title={option.itemDesc}
                      >
                        {option.itemDesc}
                      </Option>
                    ))
                  }
              </Select>
            </Checkbox>
          ))
        }
        <div className={styles.container} ref={ref => this.elem = ref} />
        <div className={styles.btnGroup}>
          <Button onClick={this.handleResetBtnClick} type="cancel">重置</Button>
          <Button onClick={this.handleSubmitBtnClick} type="submit">确定</Button>
        </div>
      </div>
    );
  }
}
