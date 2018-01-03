/*
 * @Description: 附带编辑图标的 input
 * @Author: LiuJianShu
 * @Date: 2017-12-25 14:48:26
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-01-02 14:15:42
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
// import _ from 'lodash';

import Icon from '../Icon';
// import Button from '../Button';
import styles from './index.less';

export default class EditInput extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    id: PropTypes.string,
    editCallback: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    onCancel: PropTypes.func,
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
    onCancel: () => {},
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
    this.setState({
      value: e.target.value,
    });
  }

  // 编辑按钮事件
  @autobind
  onEdit(e) {
    e.stopPropagation();
    const { edit } = this.state;
    this.setState({
      edit: !edit,
    });
  }

  // 提交按钮事件
  @autobind
  onSubmit(e) {
    e.stopPropagation();
    const { value } = this.state;
    const { editCallback, id } = this.props;
    editCallback(value, id);
  }

  // 取消按钮事件
  @autobind
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
              <Icon type="1" onClick={this.onCancel} title="取消" />
            </div>
        }
      </div>
    );
  }
}
