/*
 * @Description: 附带编辑图标的 input
 * @Author: LiuJianShu
 * @Date: 2017-12-25 14:48:26
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-25 21:39:16
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
import logable from '../../../decorators/logable';

import Icon from '../../common/Icon';
import styles from './editInput.less';

export default class EditInput extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    id: PropTypes.string,
    editCallback: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    onCancel: PropTypes.func,
    maxLen: PropTypes.number,
    // data: PropTypes.array,
    // idx: PropTypes.number,
    item: PropTypes.object,
    btnGroup: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.element,
      PropTypes.node,
    ]),
  }

  static defaultProps = {
    id: '',
    value: '',
    edit: false,
    btnGroup: '',
    maxLen: 30,
    // data: [],
    // idx: 0,
    onCancel: () => {},
    item: {},
  }

  constructor(props) {
    super(props);
    const { edit, value } = props;
    this.state = {
      // 编辑状态
      edit,
      // 值
      value,
      // 编辑前的值
      oldValue: value,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value: preValue, edit: preEdit } = this.props;
    const { value: nextValue, edit: nextEdit } = nextProps;
    if (preValue !== nextValue) {
      this.setState({
        value: nextValue,
        edit: false,
      });
    }
    if (preEdit !== nextEdit) {
      this.setState({
        edit: nextEdit,
      });
    }
  }

  // 输入框编辑事件
  @autobind
  onChange(e) {
    const { maxLen } = this.props;
    if (e.target.value.length >= maxLen) {
      return;
    }
    this.setState({
      value: e.target.value,
    });
  }

  // 编辑按钮事件
  @autobind
  @logable({ type: 'Click', payload: { name: '编辑' } })
  onEdit(e) {
    e.stopPropagation();
    const { edit } = this.state;
    this.setState({
      edit: !edit,
    });
  }

  // 提交按钮事件
  // 此处由于新的需求需要针对服务经理可选项还有涨乐客户可选项进行区分处理
  // 所以将原有在此处进行，值是否与以前的相等判断挪到外部有调用者来判断，
  @autobind
  @logable({ type: 'Click', payload: { name: '确定' } })
  onSubmit(e) {
    e.stopPropagation();
    // 此处由于新的需求需要针对服务经理可选项还有涨乐客户可选项进行区分处理
    // 所以将原有在此处进行，值是否与以前的相等判断挪到外部有调用者来判断，
    const { value } = this.state;
    const { item } = this.props;
    this.props.editCallback(value, item);
  }

  // 取消按钮事件
  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  onCancel(e) {
    e.stopPropagation();
    const { oldValue } = this.state;
    const { onCancel } = this.props;
    this.setState({
      value: oldValue,
      edit: false,
    }, onCancel);
  }

  render() {
    const { edit, value } = this.state;
    const { btnGroup } = this.props;
    return (
      <div className={styles.editInput}>
        {
          !edit ?
            <div className={styles.noInput}>
              <em>{value}</em>
              <Icon type="edit" onClick={this.onEdit} title="编辑" />
              {btnGroup}
            </div>
          :
            <div className={styles.hasInput}>
              <Input
                value={value}
                onChange={this.onChange}
                onPressEnter={this.onClick}
                onClick={e => e.stopPropagation()}
              />
              <Icon type="success" onClick={this.onSubmit} title="确定" />
              <Icon type="close" onClick={this.onCancel} title="取消" />
            </div>
        }
      </div>
    );
  }
}
