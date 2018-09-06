/* 默认展示文本，点击文字区域后可编辑文字
 * @Author: WangJunJun
 * @Date: 2018-08-31 13:12:29
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-09-06 18:35:57
 *
 * @params
 *  name: 表单form中的唯一标识，外层通过form获取到该字段的值
 *  validateRules: 当前字段的校验规则
 *  onSave: 输入完成后的回调方法
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import cx from 'classnames';
import _ from 'lodash';
import { Input, Form } from 'antd';

import Icon from '../Icon';
import { logCommon } from '../../../decorators/logable';

import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
export default class EditableText extends PureComponent {

  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onSave: PropTypes.func,
    children: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    validateRules: PropTypes.arrayOf(PropTypes.object).isRequired,
    wrapperClass: PropTypes.string,
    normalBoxClass: PropTypes.string,
    disable: PropTypes.bool,
  }

  static defaultProps = {
    onSave: _.noop,
    wrapperClass: '',
    normalBoxClass: '',
    disable: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  componentDidMount() {
    if (!this.props.disable) {
      document.addEventListener('click', this.handleClickOutside, false);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, false);
  }

  // 点击了 √ 按钮保存修改
  @autobind
  handleOk() {
    this.saveData();
  }

  // 点击了 X 按钮取消修改
  @autobind
  handleCancel() {
    this.toggleEdit();
    this.input.blur();
    logCommon({
      type: 'ButtonClick',
      payload: {
        name: `取消编辑${this.props.label}`,
      },
    });
  }

  // 点击了其他区域
  @autobind
  handleClickOutside(e) {
    const { editing } = this.state;
    if (
      editing
      && e.target !== this.inputWrapper
      && !this.inputWrapper.contains(e.target)
    ) {
      this.saveData();
    }
  }

  // 点击了铅笔图标
  @autobind
  handleClickPen(e) {
    // 阻止冒泡
    e.nativeEvent.stopImmediatePropagation();
    this.toggleEdit();
  }

  // 点击文字编辑
  @autobind
  handleEdit() {
    logCommon({
      type: 'ButtonClick',
      payload: {
        name: `编辑${this.props.label}`,
      },
    });
    this.toggleEdit();
  }

  // 切换正常模式和编辑模式
  @autobind
  toggleEdit() {
    if (this.props.disable) {
      return;
    }
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  // 保存数据
  @autobind
  saveData() {
    const { onSave, form } = this.props;
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      onSave(values);
    });
  }

  // 编辑模式下的输入框
  @autobind
  saveInputRef(ref) {
    if (ref) {
      this.input = ref;
    }
  }

  // 保存编辑模式下，容器的dom节点
  @autobind
  saveInputWrapperRef(ref) {
    if (ref) {
      this.inputWrapper = ref;
    }
  }

  // 编辑模式的dom节点
  @autobind
  renderEditableNode() {
    const { name, children, form, validateRules } = this.props;
    return (
      <div className={styles.inputWrapper} ref={this.saveInputWrapperRef}>
        <FormItem>
          {
            form.getFieldDecorator(name, {
              rules: validateRules,
              initialValue: children,
              validateTrigger: 'onBlur',
            })(<Input.TextArea
              className={styles.input}
              ref={this.saveInputRef}
              autosize
              onPressEnter={this.saveData}
            />)
          }
        </FormItem>
        <div className={styles.operation}>
          <Icon
            type="cha"
            className={cx(styles.button, styles.cha)}
            onClick={this.handleCancel}
          />
          <Icon
            type="gou"
            className={cx(styles.button, styles.gou)}
            onClick={this.handleOk}
          />
        </div>
      </div>
    );
  }

  // 原始数据
  renderOriginalNode() {
    const { normalBoxClass, disable } = this.props;
    const cls = cx(
      [styles.editableCellValueWrap],
      {
        [styles.editable]: !disable,
        [normalBoxClass]: !!normalBoxClass,
      },
    );
    return (
      <div
        className={cls}
        onClick={this.handleEdit}
      >
        {this.props.children}
        <Icon
          type="shenqing"
          className={styles.pen}
          onClick={this.handleClickPen}
        />
      </div>
    );
  }

  render() {
    const { wrapperClass } = this.props;
    return (
      <div className={wrapperClass}>
        {this.state.editing ? this.renderEditableNode() : this.renderOriginalNode()}
      </div>
    );
  }
}
