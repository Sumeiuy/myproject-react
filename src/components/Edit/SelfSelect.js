/**
 * @description 自定义下拉选项
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Icon, Checkbox, Row, Col } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import selectHandlers from './selectHelper';
import styles from './SelfSelect.less';

const CheckboxGroup = Checkbox.Group;

export default class SelfSelect extends PureComponent {
  static propTypes = {
    // value: PropTypes.object, // 初始值
    options: PropTypes.array.isRequired, // 全部的选项
    onChange: PropTypes.func, // 改版form表单的值得方法
    level: PropTypes.string.isRequired, // 用户的级别
    style: PropTypes.object, // 用户的级别
  }

  static defaultProps = {
    style: { height: '35px' },
    onChange: () => {},
  }

  constructor(props) {
    super(props);
    // 此value为Form组件使用getFieldDecorator方式的initialValue传递过来的初始值
    // value为一个对象,{ label, currency }
    const newProps = this.props;
    const value = newProps.value || {};
    const allCheckedNode = selectHandlers.getAllCheckboxNode(props.level);
    this.state = {
      visibleRangeNames: value.label, // 显示的Label文本
      expand: false,
      groupCheckedList: value.currency, // 所有分公司/营业部，选中的checkbox的列表
      checkAll: false, // 全选按钮的状态
      getFinalLabel: selectHandlers.afterSelected(props.options, allCheckedNode),
      allCheckedNode,
    };
  }

  componentWillReceiveProps(nextProps) {
    // 此处需要将恢复到默认值状态
    const newNextProps = nextProps;
    const newThisProps = this.props;
    const { value: { currency, label } } = newNextProps;
    const { value: { currency: preCurrency }, options } = newThisProps;
    const chldrenOptions = options.slice(1);
    // 通过判断当前选中的值的变化
    if ('value' in nextProps && !_.isEqual(currency, preCurrency)) {
      // const value = nextProps.value;
      this.setState({
        groupCheckedList: currency,
        checkAll: chldrenOptions.length === currency.length,
        visibleRangeNames: label,
      });
    }
  }

  @autobind
  setVisibleRangeNames(groupCheckedList) {
    const { getFinalLabel } = this.state;
    const visibleRangeNames = getFinalLabel(groupCheckedList);
    this.setState({
      visibleRangeNames,
    });
    return visibleRangeNames;
  }

  @autobind
  triggerChange(v) {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(v);
    }
  }

  @autobind
  handleAllCheckboxChange(e) {
    const { options } = this.props;
    const childrenOptions = options.slice(1).map(item => item.id);
    this.setState({
      groupCheckedList: e.target.checked ? childrenOptions : [],
      checkAll: e.target.checked,
    },
    () => {
      const { groupCheckedList } = this.state;
      const label = this.setVisibleRangeNames(groupCheckedList);
      // 需要触发Form组件getFieldDecorator方式设置的onChange方式
      this.triggerChange({
        label,
        currency: groupCheckedList,
      });
    });
  }

  @autobind
  handleCheckboxGroupChange(groupCheckedList) {
    const { options } = this.props;
    const childrenOptions = options.slice(1);
    this.setState({
      groupCheckedList,
      checkAll: groupCheckedList.length === childrenOptions.length,
    });
    const label = this.setVisibleRangeNames(groupCheckedList);
    // 需要触发Form组件getFieldDecorator方式设置的onChange方式
    this.triggerChange({
      label,
      currency: groupCheckedList,
    });
  }

  @autobind
  stopClick(e) {
    e.stopPropagation();
  }
  @autobind
  hasClass(ele, classname) {
    return ele.className.indexOf(classname) > -1;
  }

  // 收起下拉列表
  @autobind
  unExpandSelfSelect(e) {
    const targetHasClass = this.hasClass(e.target, 'checkbox');
    const parentHasClass = this.hasClass(e.target.parentNode, 'checkbox');
    if (targetHasClass || parentHasClass) {
      return;
    }
    this.setState({
      expand: false,
    });
    document.removeEventListener('click', this.unExpandSelfSelect);
  }
  // 打开下拉列表
  @autobind
  expandSelect() {
    this.setState({
      expand: true,
    });
    document.addEventListener('click', this.unExpandSelfSelect, false);
  }

  render() {
    const { options, style } = this.props;
    const firstRequiredCheck = options[0];
    const { expand, checkAll, groupCheckedList, visibleRangeNames, allCheckedNode } = this.state;
    const iconType = expand ? 'up' : 'down';
    const selfSelectHd = classnames({
      [styles.selfSelectHeader]: true,
      [styles.selfSelectHdActive]: expand,
    });
    const selfSelectBd = classnames({
      [styles.show]: expand,
      [styles.selfSelectBody]: true,
    });

    const selectHDLineHeight = Number.parseFloat(style.height) - 2;
    return (
      <div className={styles.selfSelect} style={style}>
        <div
          className={selfSelectHd}
          onClick={this.expandSelect}
          style={{
            lineHeight: `${selectHDLineHeight}px`,
          }}
        >
          <div className={styles.selectNames}>{visibleRangeNames}</div>
          <span className={styles.selfSelectArrow}><Icon type={iconType} /></span>
        </div>
        <div className={selfSelectBd}>
          <Checkbox
            value={firstRequiredCheck.id}
            defaultChecked
            disabled
          >
            {firstRequiredCheck.name}
          </Checkbox>
          <Checkbox
            value="all"
            onChange={this.handleAllCheckboxChange}
            checked={checkAll}
          >
            {allCheckedNode.name}
          </Checkbox>
          <CheckboxGroup
            value={groupCheckedList}
            onChange={this.handleCheckboxGroupChange}
          >
            <Row>
              {
                options.slice(1).map(
                  item =>
                    (
                      <Col key={item.id} span={24}>
                        <Checkbox value={item.id}>{item.name}</Checkbox>
                      </Col>
                    ),
                )
              }
            </Row>
          </CheckboxGroup>
        </div>
      </div>
    );
  }
}

