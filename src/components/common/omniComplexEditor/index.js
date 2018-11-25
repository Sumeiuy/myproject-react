/*
 * @Author: sunweibin
 * @Date: 2018-11-19 11:11:19
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-22 16:14:50
 * @description 多功能复合编辑框
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { autobind } from 'core-decorators';
import { Form, Icon, Input, Select } from 'antd';
import _ from 'lodash';

import styles from './index.less';
import logable from '../../../decorators/logable';

const FormItem = Form.Item;
const create = Form.create;

const Option = Select.Option;
// 默认的校验数据
const DEFAULT_VALIDATE = { validate: true, msg: '' };

@create()
export default class OmniComplexEditor extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    // 编辑器模式，默认default,为输入框，select为下拉框
    mode: PropTypes.string,
    // 每一个编辑器的唯一ID
    editorId: PropTypes.string.isRequired,
    // 编辑器的名字，表示该编辑器用于修改什么信息的Label
    editorName: PropTypes.string.isRequired,
    // 是否可以编辑
    editable: PropTypes.bool,
    // 展示用数据,因为比如在Select模式下,传递给select的值是选项的value,而不是用于展示的值，所以此处需要区分下
    displayValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    // 初始数据,一般与dispalyValue一起变动
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
    ]),
    style: PropTypes.object,
    // 点击OK键的回调函数,返回必须是一个Promise
    onEditOK: PropTypes.func,
    // 提交编辑成功后的回调
    onSuccess: PropTypes.func,
    // 如果mode是select的时候的option
    options: PropTypes.array,
    // option对应的value和text的key字段名映射
    optionValueKey: PropTypes.string,
    optionTextKey: PropTypes.string,
    // 如果mode是select的时候，select的props
    selectProps: PropTypes.object,
    // 数据校验回调函数
    onCheck: PropTypes.func,
    // 需要自定义数据校验
    checkable: PropTypes.bool,
  }

  static defaultProps = {
    editable: true,
    style: {},
    children: null,
    editorId: '',
    displayValue: '',
    value: '',
    loading: false,
    onEditOK: _.noop,
    onSuccess: _.noop,
    options: [],
    selectProps: {},
    onCheck: () => DEFAULT_VALIDATE,
    checkable: false,
    optionValueKey: 'key',
    optionTextKey: 'value',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { displayValue, value } = nextProps;
    const { prevValue } = prevState;
    if (!_.isEqual(value, prevValue)) {
      // 一般情况如果props中的value值变化了则需要相应的变化state
      return {
        prevProps: value,
        originalValue: displayValue,
        editorValue: value,
        loading: false,
        editing: false,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { value, displayValue } = props;
    this.state = {
      loading: false,
      // 保存原始的props
      prevValue: value,
      // 原始值
      originalValue: displayValue,
      // 用户修改的值
      editorValue: value,
      // 编辑状态
      editing: false,
      // select下拉框的展开状态
      selectState: false,
      // 数据校验结果
      validateResult: DEFAULT_VALIDATE,
    };

    this.editorContentRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOutsideClick);
  }

  // 获取编辑框内容区域的Ref
  @autobind
  getEditorContentRef() {
    return this.editorContentRef.current;
  }

  // 当点击非下拉框区域时，收起Select的下拉框
  @autobind
  handleOutsideClick(e) {
    if (e.type === 'click' && this.isSelectMode() ) {
      const el = this.getEditorContentRef();
      if (el && !el.contains(e.target)) {
        this.closeSelectDropdown();
      }
    }
  }

  // 获取编辑器实际使用的表单元素
  @autobind
  renderEditroNodeByMode() {
    if (this.isSelectMode()) {
      const { selectState } = this.state;
      const { selectProps, options, optionTextKey, optionValueKey } = this.props;
      const restProps = _.pick(selectProps, ['onChange', 'open', 'showArrow']);
      return (
        <Select
          showArrow={false}
          open={selectState}
          onChange={this.handleSelectChange}
          {...restProps}
        >
         {_.map(options, option => (<Option value={option[optionValueKey]}>{option[optionTextKey]}</Option>) )}
        </Select>
      );
    }
    return (<Input autoComplete="off" onChange={this.handleInputChange} />);
  }

  // 判断是否是Select
  @autobind
  isSelectMode() {
    return this.props.mode === 'select';
  }

  // 关闭下拉框
  @autobind
  closeSelectDropdown() {
    this.setState({ selectState: false });
  }

  // 校验数据
  @autobind
  checkData(value) {
    const { checkable } = this.props;
    if (checkable) {
      return this.props.onCheck(value);
    }
    return DEFAULT_VALIDATE;
  }


  // 改变select选项,需要将校验信息的区域隐藏
  @autobind
  @logable({ type: 'Click', payload: { name: '$props.editorName', value: '$args[0]' } })
  handleSelectChange(value) {
    this.closeSelectDropdown();
    this.setState({ validateResult: DEFAULT_VALIDATE });
  }

  // 修改输入框值的时候，需要将校验信息的区域隐藏
  @autobind
  handleInputChange() {
    this.setState({ validateResult: DEFAULT_VALIDATE });
  }

  // 点击确认按钮
  @autobind
  @logable({ type: 'Click', payload: { name: '确认' } })
  handleEditorConfirmClick(e) {
    const { editorId, form } = this.props;
    const newValue = form.getFieldValue(editorId);
    // 判断数据是否通过校验
    const checkResult = this.checkData(newValue);
    if (checkResult.validate) {
      // 通过校验
      this.props.onEditOK(newValue).then(this.handleEditorAfterSubmit);
    } else {
      // 未通过校验
      this.setState({ validateResult: checkResult });
    }
    e.stopPropagation();
    // 阻止原生事件传播
    e.nativeEvent.stopImmediatePropagation();
  }

  // 当提交编辑后的操作
  @autobind
  handleEditorAfterSubmit(flag) {
    // 无论成功与否都必须将loading消失
    this.setState({ loading: false });
    if (flag) {
      // 提交成功
      this.exitEditState();
      this.props.onSuccess();
    }
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleEditorCancelClick(e) {
    const { form } = this.props;
    form.resetFields();
    this.exitEditState();
    // 阻止React合成事件传播
    e.stopPropagation();
    // 阻止原生事件传播
    e.nativeEvent.stopImmediatePropagation();
  }

  // 当点击编辑内容区域的时候，在编辑状态下的时候
  // 如果此时是Select，因为Select的下拉框的展开收缩的行为，变成了人为来控制，
  // 所以需要给内容编辑区域注册点击事件，来再次控制收缩/展开行为
  @autobind
  @logable({ type: 'Click', payload: { name: '收缩/展示下拉框' } })
  handleEditorContentClick() {
    const { selectState, editing } = this.state;
    if (this.isSelectMode() && editing) {
      this.setState({ selectState: !selectState });
    }
  }

  // 进入编辑状态
  @autobind
  enterEditState() {
    this.setState({ editing: true });
    if (this.isSelectMode()) {
      this.setState({ selectState: true });
    }
  }

  // 退出编辑状态
  @autobind
  exitEditState() {
    this.setState({ editing: false });
    if (this.isSelectMode()) {
      this.setState({ selectState: false });
    }
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '编辑图标' } })
  handleEditWrapperClick(e) {
    const { form, editorId, editable } = this.props;
    if (!editable) {
      return;
    }
    const editor = form.getFieldInstance(editorId);
    if (editor.focus) {
      editor.focus();
    }
    this.enterEditState();
    // 阻止React合成事件传播
    e.stopPropagation();
    // 阻止原生事件传播
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { editable, style, editorId, mode } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      originalValue,
      editing,
      editorValue,
      selectState,
      validateResult,
      loading,
    } = this.state;
    // 编辑器外部包装的classname
    const editWrapperClass = cx({
      [styles.editWrapper]: true,
      [styles.editable]: editable,
      [styles.editing]: editing,
    });
    // 编辑按钮classname
    const editIconClass = cx({
      [styles.editIcon]: true,
      [styles.showIcon]: editable && !editing,
    });
    // 编辑Form的classname
    const editorFormCls = cx({
      [styles.editorForm]: editable && editing,
    });
    // 下拉框的实心箭头class
    const selectArrowCls = cx({
      [styles.selectArrow]: true,
      [styles.selectArrowShow]: this.isSelectMode() && editing && !loading,
      [styles.selectArrowUp]: selectState,
    });
    // 操作区域的classname
    const operateBoxCls = cx({
      [styles.operateBox]: true,
      [styles.operateBoxShow]: editable && editing,
    });
    // 校验区域的classname
    const validateCls = cx({
      [styles.validateBox]: true,
      [styles.validate]: validateResult.validate,
    });
    // loading的classname
    const loadingCls = cx({
      [styles.loading]: true,
      [styles.showLoading]: loading,
    });

    const editorNode = this.renderEditroNodeByMode(mode);

    return (
      <div className={editWrapperClass} style={style}>
        <div
          className={styles.editContextBox}
          ref={this.editorContentRef}
          onClick={this.handleEditorContentClick}
        >
          <div className={styles.editContent}>{originalValue}</div>
          <Form className={editorFormCls}>
            <FormItem>
              { getFieldDecorator(editorId, { initialValue: editorValue })(editorNode) }
            </FormItem>
          </Form>
          <div className={editIconClass} onClick={this.handleEditWrapperClick}><Icon type="edit" /></div>
          <div className={selectArrowCls}><Icon type="caret-down"/></div>
          <div className={loadingCls}><Icon type="loading" /></div>
        </div>
        <div className={operateBoxCls}>
          <div className={validateCls}>{validateResult.msg}</div>
          <div className={styles.editButtonGroup}>
            <div className={`${styles.editBt} ${styles.OKBtn}`} onClick={this.handleEditorConfirmClick}><Icon type="check" /></div>
            <div className={styles.split} />
            <div className={`${styles.editBt} ${styles.cancelBtn}`} onClick={this.handleEditorCancelClick}><Icon type="close" /></div>
          </div>
        </div>
      </div>
    );
  }
}
