import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import KeyCode from 'rc-util/lib/KeyCode';
import classnames from 'classnames';
import {
  getPropValue, getValuePropValue,
  isMultiple, toArray,
  getTreeNodesStates, flatToHierarchy, filterParentPosition,
  isPositionPrefix, labelCompatible, loopAllChildren, filterAllCheckedData,
  processSimpleTreeData, saveRef,
} from './util';
import SelectTrigger from './SelectTrigger';
import _TreeNode from './TreeNode';
import { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './strategies';
import { SelectPropTypes } from './PropTypes';

import './select.less';

function noop() {
}

function filterFn(input, child) {
  return String(getPropValue(child, labelCompatible(this.props.treeNodeFilterProp)))
    .indexOf(input) > -1;
}

function loopTreeData(data, level = 0, treeCheckable) {
  return data.map((item, index) => {
    const pos = `${level}-${index}`;
    const {
      label,
      value,
      disabled,
      key,
      hasOwnProperty,
      selectable,
      children,
      isLeaf,
      ...otherProps
    } = item;
    const props = {
      value,
      title: label,
      // value: value || String(key || label), // cause onChange callback error
      key: key || value || pos,
      disabled: disabled || false,
      selectable: selectable === false ? selectable : !treeCheckable,
      ...otherProps,
    };
    let ret;
    if (children && children.length) {
      ret = (<_TreeNode {...props}>{loopTreeData(children, pos, treeCheckable)}</_TreeNode>);
    } else {
      ret = (<_TreeNode {...props} isLeaf={isLeaf} />);
    }
    return ret;
  });
}

class Select extends Component {
  static propTypes = SelectPropTypes;

  static defaultProps = {
    filterName: '',
    defaultLabel: '不限',
    labelStyle: {},
    prefixCls: 'ht',
    filterTreeNode: filterFn, // [Legacy] TODO: Set false and filter not hide?
    showSearch: false,
    allowClear: false,
    placeholder: '',
    searchPlaceholder: '',
    labelInValue: false,
    onClick: noop,
    onChange: noop,
    onSelect: noop,
    onDeselect: noop,
    onSearch: noop,
    showArrow: true,
    dropdownMatchSelectWidth: false,
    dropdownStyle: {},
    onDropdownVisibleChange: () => true,
    notFoundContent: '没有找到结果',
    showCheckedStrategy: SHOW_CHILD,
    // skipHandleInitValue: false, // Deprecated (use treeCheckStrictly)
    treeCheckStrictly: false,
    treeIcon: false,
    treeLine: false,
    treeDataSimpleMode: false,
    treeDefaultExpandAll: false,
    treeCheckable: false,
    treeNodeFilterProp: 'value',
    treeNodeLabelProp: 'title',
  };

  constructor(props) {
    super(props);
    let value = [];
    if ('value' in props) {
      value = toArray(props.value);
    } else {
      value = toArray(props.defaultValue);
    }
    // save parsed treeData, for performance (treeData may be very big)
    this.renderedTreeData = this.renderTreeData();
    value = this.addLabelToValue(props, value);
    value = this.getValue(props, value, props.inputValue ? '__strict' : true);
    const inputValue = props.inputValue || '';
    // if (props.combobox) {
    //   inputValue = value.length ? String(value[0].value) : '';
    // }
    this.state = {
      value,
      inputValue,
      open: props.open || props.defaultOpen,
      focused: false,
    };
  }

  componentDidMount() {
    const { autoFocus, disabled } = this.props;
    if (autoFocus && !disabled) {
      this.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    // save parsed treeData, for performance (treeData may be very big)
    this.renderedTreeData = this.renderTreeData(nextProps);
    // Detecting whether the object of `onChange`'s argument  is old ref.
    // Better to do a deep equal later.
    this._cacheTreeNodesStates = this._cacheTreeNodesStates !== 'no' &&
                                 this._savedValue &&
                                 nextProps.value === this._savedValue;
    if (this.props.treeData !== nextProps.treeData ||
      this.props.children !== nextProps.children) {
      // refresh this._treeNodesStates cache
      this._treeNodesStates = getTreeNodesStates(
        this.renderedTreeData || nextProps.children,
        this.state.value.map(item => item.value),
      );
    }
    if ('value' in nextProps) {
      let value = toArray(nextProps.value);
      value = this.addLabelToValue(nextProps, value);
      value = this.getValue(nextProps, value);
      this.setState({
        value,
      }, this.forcePopupAlign);
      // if (nextProps.combobox) {
      //   this.setState({
      //     inputValue: value.length ? String(value[0].key) : '',
      //   });
      // }
    }
    if (nextProps.inputValue !== this.props.inputValue) {
      this.setState({
        inputValue: nextProps.inputValue,
      });
    }
    if ('open' in nextProps) {
      this.setState({
        open: nextProps.open,
      });
    }
  }

  componentWillUpdate(nextProps) {
    if (this._savedValue && nextProps.value &&
      nextProps.value !== this._savedValue &&
      nextProps.value === this.props.value) {
      this._cacheTreeNodesStates = false;
      this.getValue(nextProps, this.addLabelToValue(nextProps, toArray(nextProps.value)));
    }
  }

  componentWillUnmount() {
    this.clearDelayTimer();
    if (this.dropdownContainer) {
      ReactDOM.unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  }

  onInputChange = (event) => {
    const val = event.target.value;
    const { props } = this;
    this.setState({
      inputValue: val,
      open: true,
    }, this.forcePopupAlign);
    if (props.treeCheckable && !val) {
      this.setState({
        value: this.getValue(props, [...this.state.value], false),
      });
    }
    props.onSearch(val);
  }

  onDropdownVisibleChange = (open) => {
    // selection inside combobox cause click
    if (!open && document.activeElement === this.getInputDOMNode()) {
      // return;
    }
    this.setOpenState(open, undefined, !open);
  }

  // combobox ignore
  onKeyDown = (event) => {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const keyCode = event.keyCode;
    if (this.state.open && !this.getInputDOMNode()) {
      this.onInputKeyDown(event);
    } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
      this.setOpenState(true);
      event.preventDefault();
    }
  }

  onInputKeyDown = (event) => {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const state = this.state;
    const keyCode = event.keyCode;
    if (isMultiple(props) && !event.target.value && keyCode === KeyCode.BACKSPACE) {
      const value = state.value.concat();
      if (value.length) {
        const popValue = value.pop();
        this.removeSelected(this.isLabelInValue() ? popValue : popValue.value);
      }
      return;
    }
    if (keyCode === KeyCode.DOWN) {
      if (!state.open) {
        this.openIfHasChildren();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    } else if (keyCode === KeyCode.ESC) {
      if (state.open) {
        this.setOpenState(false);
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
  }

  onSelect = (selectedKeys, info) => {
    const item = info.node;
    let value = this.state.value;
    const props = this.props;
    const selectedValue = getValuePropValue(item);
    const selectedLabel = this.getLabelFromNode(item);
    const checkableSelect = props.treeCheckable && info.event === 'select';
    let event = selectedValue;
    if (this.isLabelInValue()) {
      event = {
        value: event,
        label: selectedLabel,
      };
    }
    if (info.selected === false) {
      this.onDeselect(info);
      if (!checkableSelect) return;
    }
    props.onSelect(event, item, info);

    const checkEvt = info.event === 'check';
    if (isMultiple(props)) {
      this.clearSearchInput();
      if (checkEvt) {
        value = this.getCheckedNodes(info, props).map(n => ({
          value: getValuePropValue(n),
          label: this.getLabelFromNode(n),
        }));
      } else {
        if (value.some(i => i.value === selectedValue)) {
          return;
        }
        value = value.concat([{
          value: selectedValue,
          label: selectedLabel,
        }]);
      }
    } else {
      if (value.length && value[0].value === selectedValue) {
        this.setOpenState(false);
        return;
      }
      value = [{
        value: selectedValue,
        label: selectedLabel,
      }];
      this.setOpenState(false);
    }

    const extraInfo = {
      triggerValue: selectedValue,
      triggerNode: item,
    };
    if (checkEvt) {
      extraInfo.checked = info.checked;
      // if inputValue existing, tree is checkStrictly
      extraInfo.allCheckedNodes = props.treeCheckStrictly || this.state.inputValue ?
        info.checkedNodes : flatToHierarchy(info.checkedNodesPositions);
      this._checkedNodes = info.checkedNodesPositions;
      const _tree = this.trigger.popupEle;
      this._treeNodesStates = _tree.checkKeys;
    } else {
      extraInfo.selected = info.selected;
    }

    this.fireChange(value, extraInfo);
    if (props.inputValue === null) {
      this.setState({
        inputValue: '',
      });
    }
  }

  onDeselect = (info) => {
    this.removeSelected(getValuePropValue(info.node));
    if (!isMultiple(this.props)) {
      this.setOpenState(false);
    } else {
      this.clearSearchInput();
    }
  }

  onPlaceholderClick = () => {
    this.getInputDOMNode().focus();
  }

  onClearSelection = (event) => {
    const props = this.props;
    const state = this.state;
    if (props.disabled) {
      return;
    }
    event.stopPropagation();
    this._cacheTreeNodesStates = 'no';
    this._checkedNodes = [];
    if (state.inputValue || state.value.length) {
      this.setOpenState(false);
      if (typeof props.inputValue === 'undefined') {
        this.setState({
          inputValue: '',
        }, () => {
          this.fireChange([]);
        });
      } else {
        this.fireChange([]);
      }
    }
  }

  onChoiceAnimationLeave = () => {
    this.forcePopupAlign();
  }

  getLabelFromNode(child) {
    return getPropValue(child, this.props.treeNodeLabelProp);
  }

  getLabelFromProps(props, value) {
    if (value === undefined) {
      return null;
    }
    let label = null;
    loopAllChildren(this.renderedTreeData || props.children, (item) => {
      if (getValuePropValue(item) === value) {
        label = this.getLabelFromNode(item);
      }
    });
    if (label === null) {
      return value;
    }
    return label;
  }

  getDropdownContainer() {
    if (!this.dropdownContainer) {
      this.dropdownContainer = document.createElement('div');
      document.body.appendChild(this.dropdownContainer);
    }
    return this.dropdownContainer;
  }

  getSearchPlaceholderElement(hidden) {
    const props = this.props;
    const placeholder = props.searchPlaceholder;
    if (placeholder) {
      return (
        <span
          style={{ display: hidden ? 'none' : 'inline-block' }}
          onClick={this.onPlaceholderClick}
          className={`${props.prefixCls}-search__field__placeholder`}
        >
          {placeholder}
        </span>
      );
    }
    return null;
  }

  getInputElement() {
    const { inputValue } = this.state;
    const { prefixCls, disabled } = this.props;
    return (
      <span className={`${prefixCls}-search__field__wrap`}>
        <input
          ref={saveRef(this, 'inputInstance')}
          onChange={this.onInputChange}
          onKeyDown={this.onInputKeyDown}
          value={inputValue}
          disabled={disabled}
          className={`${prefixCls}-search__field`}
        />
        <span
          ref={saveRef(this, 'inputMirrorInstance')}
          className={`${prefixCls}-search__field__mirror`}
        >
          {inputValue}&nbsp;
        </span>
        {this.getSearchPlaceholderElement(!!inputValue)}
        <span className="ht-sousuo-icon ht-iconfont ht-icon-sousuo" />
      </span>
    );
  }

  getInputDOMNode = () => {
    if(this.props.showSearch) {
      return this.inputInstance;
    }
    return null;
  }

  getPopupDOMNode() {
    return this.trigger.getPopupDOMNode();
  }

  getPopupComponentRefs() {
    return this.trigger.getPopupEleRefs();
  }

  getValue(_props, val, init = true) {
    let value = val;
    // if inputValue existing, tree is checkStrictly
    const _strict = init === '__strict' ||
      init && (this.state && this.state.inputValue ||
      this.props.inputValue !== _props.inputValue);
    if (_props.treeCheckable &&
      (_props.treeCheckStrictly || _strict)) {
      this.halfCheckedValues = [];
      value = [];
      val.forEach((i) => {
        if (!i.halfChecked) {
          value.push(i);
        } else {
          this.halfCheckedValues.push(i);
        }
      });
    }
    // if (!(_props.treeCheckable && !_props.treeCheckStrictly)) {
    if (!!!_props.treeCheckable || _props.treeCheckable &&
      (_props.treeCheckStrictly || _strict)) {
      return value;
    }
    let checkedTreeNodes;
    if (this._cachetreeData && this._cacheTreeNodesStates && this._checkedNodes &&
      this.state && !this.state.inputValue) {
      this.checkedTreeNodes = checkedTreeNodes = this._checkedNodes;
    } else {
      /**
       * Note: `this._treeNodesStates`'s treeNodesStates must correspond to nodes of the
       * final tree (`processTreeNode` function from SelectTrigger.jsx produce the final tree).
       *
       * And, `this._treeNodesStates` from `onSelect` is previous value,
       * so it perhaps only have a few nodes, but the newly filtered tree can have many nodes,
       * thus, you cannot use previous _treeNodesStates.
       */
      // getTreeNodesStates is not effective.
      this._treeNodesStates = getTreeNodesStates(
        this.renderedTreeData || _props.children,
        value.map(item => item.value),
      );
      this.checkedTreeNodes = checkedTreeNodes = this._treeNodesStates.checkedNodes;
    }
    const mapLabVal = arr => arr.map(itemObj => ({
      value: getValuePropValue(itemObj.node),
      label: getPropValue(itemObj.node, _props.treeNodeLabelProp),
    }));
    const props = this.props;
    let checkedValues = [];
    if (props.showCheckedStrategy === SHOW_ALL) {
      checkedValues = mapLabVal(checkedTreeNodes);
    } else if (props.showCheckedStrategy === SHOW_PARENT) {
      const posArr = filterParentPosition(checkedTreeNodes.map(itemObj => itemObj.pos));
      checkedValues =
        mapLabVal(checkedTreeNodes.filter(itemObj => posArr.indexOf(itemObj.pos) !== -1));
    } else {
      checkedValues = mapLabVal(checkedTreeNodes.filter(itemObj => !itemObj.node.props.children));
    }
    return checkedValues;
  }

  getCheckedNodes(info, props) {
    // TODO treeCheckable does not support tags/dynamic
    let { checkedNodes } = info;
    // if inputValue existing, tree is checkStrictly
    if (props.treeCheckStrictly || this.state.inputValue) {
      return checkedNodes;
    }
    const checkedNodesPositions = info.checkedNodesPositions;
    if (props.showCheckedStrategy === SHOW_ALL) {
      checkedNodes = checkedNodes;
    } else if (props.showCheckedStrategy === SHOW_PARENT) {
      const posArr = filterParentPosition(checkedNodesPositions.map(itemObj => itemObj.pos));
      checkedNodes = checkedNodesPositions.filter(itemObj => posArr.indexOf(itemObj.pos) !== -1)
        .map(itemObj => itemObj.node);
    } else {
      checkedNodes = checkedNodes.filter(n => !n.props.children);
    }
    return checkedNodes;
  }

  getDeselectedValue(selectedValue) {
    const checkedTreeNodes = this.checkedTreeNodes;
    let unCheckPos;
    checkedTreeNodes.forEach((itemObj) => {
      if (itemObj.node.props.value === selectedValue) {
        unCheckPos = itemObj.pos;
      }
    });
    const newVals = [];
    const newCkTns = [];
    checkedTreeNodes.forEach((itemObj) => {
      if (isPositionPrefix(itemObj.pos, unCheckPos) || isPositionPrefix(unCheckPos, itemObj.pos)) {
        // Filter ancestral and children nodes when uncheck a node.
        return;
      }
      newCkTns.push(itemObj);
      newVals.push(itemObj.node.props.value);
    });
    this.checkedTreeNodes = this._checkedNodes = newCkTns;
    const nv = this.state.value.filter(val => newVals.indexOf(val.value) !== -1);
    this.fireChange(nv, { triggerValue: selectedValue, clear: true });
  }

  setOpenState(open, needFocus, documentClickClose = false) {
    this.clearDelayTimer();
    const { props } = this;
    // can not optimize, if children is empty
    // if (this.state.open === open) {
    //   return;
    // }
    if (!this.props.onDropdownVisibleChange(open, { documentClickClose })) {
      return;
    }
    this.setState({
      open,
    }, () => {
      if (needFocus || open) {
        // Input dom init after first time component render
        // Add delay for this to get focus
        Promise.resolve().then(() => {
          if (open || isMultiple(props)) {
            const input = this.getInputDOMNode();
            if (input && document.activeElement !== input) {
              input.focus();
            }
          } else if (this.selection) {
            this.selection.focus();
          }
        });
      }
    });
  }

  clearSearchInput() {
    this.getInputDOMNode() && this.getInputDOMNode().focus();
    if (!('inputValue' in this.props)) {
      this.setState({ inputValue: '' });
    }
  }

  addLabelToValue(props, value_) {
    let value = value_;
    if (this.isLabelInValue()) {
      value.forEach((v, i) => {
        if (Object.prototype.toString.call(value[i]) !== '[object Object]') {
          value[i] = {
            value: '',
            label: '',
          };
          return;
        }
        v.label = v.label || this.getLabelFromProps(props, v.value);
      });
    } else {
      value = value.map(v => ({
        value: v,
        label: this.getLabelFromProps(props, v),
      }));
    }
    return value;
  }

  clearDelayTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  }

  removeSelected(selectedVal, e) {
    const props = this.props;
    if (props.disabled) {
      return;
    }

    // Do not trigger Trigger popup
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    this._cacheTreeNodesStates = 'no';
    if (props.treeCheckable &&
      (props.showCheckedStrategy === SHOW_ALL || props.showCheckedStrategy === SHOW_PARENT)
      && !(props.treeCheckStrictly || this.state.inputValue)) {
      this.getDeselectedValue(selectedVal);
      return;
    }
    // click the node's `x`(in select box), likely trigger the TreeNode's `unCheck` event,
    // cautiously, they are completely different, think about it, the tree may not render at first,
    // but the nodes in select box are ready.
    let label;
    const value = this.state.value.filter((singleValue) => {
      if (singleValue.value === selectedVal) {
        label = singleValue.label;
      }
      return (singleValue.value !== selectedVal);
    });
    const canMultiple = isMultiple(props);

    if (canMultiple) {
      let event = selectedVal;
      if (this.isLabelInValue()) {
        event = {
          value: selectedVal,
          label,
        };
      }
      props.onDeselect(event);
    }
    if (props.treeCheckable) {
      if (this.checkedTreeNodes && this.checkedTreeNodes.length) {
        this.checkedTreeNodes = this._checkedNodes =
          this.checkedTreeNodes.filter(item => value.some(i => i.value === item.node.props.value));
      }
    }

    this.fireChange(value, { triggerValue: selectedVal, clear: true });
  }

  openIfHasChildren() {
    const props = this.props;
    if (React.Children.count(props.children) || !isMultiple(props)) {
      this.setOpenState(true);
    }
  }

  onClearSelected = (event) => {
    const props = this.props;
    const state = this.state;
    if (props.disabled) {
      return;
    }
    event.stopPropagation();
    this._cacheTreeNodesStates = 'no';
    this._checkedNodes = [];
    if (state.inputValue || state.value.length) {
      this.setOpenState(true);
      if (typeof props.inputValue === 'undefined') {
        this.setState({
          inputValue: '',
        }, () => {
          this.fireChange([]);
        });
      } else {
        this.fireChange([]);
      }
    }
  }

  fireChange(value, extraInfo = {}) {
    const props = this.props;
    const vals = value.map(i => i.value);
    const sv = this.state.value.map(i => i.value);
    if (vals.length !== sv.length || !vals.every((val, index) => sv[index] === val)) {
      const ex = {
        preValue: [...this.state.value],
        ...extraInfo,
      };
      let labs = null;
      let vls = value;
      if (!this.isLabelInValue()) {
        labs = value.map(i => i.label);
        vls = vls.map(v => v.value);
      } else if (this.halfCheckedValues && this.halfCheckedValues.length) {
        this.halfCheckedValues.forEach((i) => {
          if (!vls.some(v => v.value === i.value)) {
            vls.push(i);
          }
        });
      }
      if (props.treeCheckable && ex.clear) {
        const treeData = this.renderedTreeData || props.children;
        ex.allCheckedNodes = flatToHierarchy(filterAllCheckedData(vals, treeData));
      }
      if (props.treeCheckable && this.state.inputValue) {
        const _vls = [...this.state.value];
        if (ex.checked) {
          value.forEach((i) => {
            if (_vls.every(ii => ii.value !== i.value)) {
              _vls.push({ ...i });
            }
          });
        } else {
          let index;
          const includeVal = _vls.some((i, ind) => {
            if (i.value === ex.triggerValue) {
              index = ind;
              return true;
            }

            return false;
          });
          if (includeVal) {
            _vls.splice(index, 1);
          }
        }
        vls = _vls;
        if (!this.isLabelInValue()) {
          labs = _vls.map(v => v.label);
          vls = _vls.map(v => v.value);
        }
      }
      this._savedValue = isMultiple(props) ? vls : vls[0];
      props.onChange(this._savedValue, labs, ex);
      if (!('value' in props)) {
        this._cacheTreeNodesStates = false;
        this.setState({
          value: this.getValue(props, toArray(this._savedValue).map((v, i) => (this.isLabelInValue() ? v : {
            value: v,
            label: labs && labs[i],
          }))),
        }, this.forcePopupAlign);
      }
    }
  }

  isLabelInValue() {
    const { treeCheckable, treeCheckStrictly, labelInValue } = this.props;
    if (treeCheckable && treeCheckStrictly) {
      return true;
    }
    return labelInValue || false;
  }

  focus() {
    if (!isMultiple(this.props)) {
      this.selection.focus();
    } else {
      this.getInputDOMNode() && this.getInputDOMNode().focus();
    }
  }

  blur() {
    if (!isMultiple(this.props)) {
      this.selection.blur();
    } else {
      this.getInputDOMNode() && this.getInputDOMNode().blur();
    }
  }

  forcePopupAlign = () => {
    this.trigger.trigger.forcePopupAlign();
  };

  renderTopControlNode() {
    const { value } = this.state;
    const props = this.props;
    const { prefixCls } = props;
    const multiple = isMultiple(props);

    // single and not combobox, input is inside dropdown
    if (!multiple) {
      let innerNode = (
        <span
          key="placeholder"
          className={`${prefixCls}-selection__placeholder`}
        >
          {props.placeholder}
        </span>);
      if (value.length) {
        innerNode = (
          <span
            key="value"
            title={value[0].label}
            style={props.labelStyle}
            className={`${prefixCls}-selection-selected-value`}
          >
            {value[0].label}
          </span>);
      }
      return (
        <span
          className={`${prefixCls}-selection__rendered`}
        >
          <span className={`${prefixCls}-selection-selected-filterName`}>{`${props.filterName}：`}</span>{innerNode}
        </span>);
    }

    let selectedValue = value.map(singleValue => singleValue.label).join('，');

    if (!selectedValue) {
      selectedValue = props.defaultLabel;
    }
    const selectedValueNode = (
      <span
        key="value"
        title={selectedValue}
        style={props.labelStyle}
        className={`${prefixCls}-selection-selected-value`}
      >
        {selectedValue}
      </span>);

    return (
      <span className={`${prefixCls}-selection__rendered`}>
        <span className={`${prefixCls}-selection-selected-filterName`}>{`${props.filterName}：`}</span>{selectedValueNode}
      </span>);
  }

  renderTreeData(props) {
    const validProps = props || this.props;
    if (validProps.treeData) {
      if (props && props.treeData === this.props.treeData && this.renderedTreeData) {
        // cache and use pre data.
        this._cachetreeData = true;
        return this.renderedTreeData;
      }
      this._cachetreeData = false;
      let treeData = [...validProps.treeData];
      // process treeDataSimpleMode
      if (validProps.treeDataSimpleMode) {
        let simpleFormat = {
          id: 'id',
          pId: 'pId',
          rootPId: null,
        };
        if (Object.prototype.toString.call(validProps.treeDataSimpleMode) === '[object Object]') {
          simpleFormat = { ...simpleFormat, ...validProps.treeDataSimpleMode };
        }
        treeData = processSimpleTreeData(treeData, simpleFormat);
      }
      return loopTreeData(treeData, undefined, this.props.treeCheckable);
    }
  }

  render() {
    const props = this.props;
    const multiple = isMultiple(props);
    const state = this.state;
    const { className, disabled, prefixCls } = props;
    const ctrlNode = this.renderTopControlNode();
    let extraSelectionProps = {};
    if (!multiple) {
      extraSelectionProps = {
        onKeyDown: this.onKeyDown,
        tabIndex: 0,
      };
    }
    const rootCls = {
      [className]: !!className,
      [prefixCls]: 1,
      [`${prefixCls}-open`]: state.open,
      [`${prefixCls}-focused`]: state.open || state.focused,
      // [`${prefixCls}-combobox`]: isCombobox(props),
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
      [`${prefixCls}-allow-clear`]: !!props.allowClear,
    };

    return (
      <SelectTrigger
        {...props}
        treeNodes={props.children}
        treeData={this.renderedTreeData}
        _cachetreeData={this._cachetreeData}
        _treeNodesStates={this._treeNodesStates}
        halfCheckedValues={this.halfCheckedValues}
        multiple={multiple}
        disabled={disabled}
        visible={state.open}
        inputValue={state.inputValue}
        inputElement={this.getInputElement()}
        value={state.value}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        getPopupContainer={props.getPopupContainer}
        onSelect={this.onSelect}
        ref={saveRef(this, 'trigger')}
        onClearSelected={this.onClearSelected}
      >
        <span
          style={props.style}
          onClick={props.onClick}
          className={classnames(rootCls)}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
        >
          <span
            ref={saveRef(this, 'selection')}
            key="selection"
            className={`${prefixCls}-selection
          ${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`}
            aria-autocomplete="list"
            aria-haspopup="true"
            aria-expanded={state.open}
            {...extraSelectionProps}
          >
            {ctrlNode}
            <span key="arrow" className={`${prefixCls}-arrow ht-svg-xiangxia`} />
          </span>
        </span>
      </SelectTrigger>
    );
  }
}

Select.SHOW_ALL = SHOW_ALL;
Select.SHOW_PARENT = SHOW_PARENT;
Select.SHOW_CHILD = SHOW_CHILD;

export default Select;
