/*
 * @Description: 附带编辑图标的 input
 * @Author: LiuJianShu
 * @Date: 2017-12-25 14:48:26
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-29 19:54:26
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Tooltip, Modal } from 'antd';

import logable from '../../../decorators/logable';
import Icon from '../../common/Icon';
import styles from './editInput.less';

export default class EditInput extends PureComponent {
  static propTypes = {
    // 对应的使用的名称
    editName: PropTypes.string.isRequired,
    value: PropTypes.string,
    id: PropTypes.string,
    editCallback: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    onCancel: PropTypes.func,
    maxLen: PropTypes.number,
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
    isInHeader: false,
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
        oldValue: nextValue,
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
    const { item, maxLen, editName } = this.props;
    // 如果超长则弹框提示，不给更新
    if (value.length > maxLen) {
      Modal.warning({
        content: `${editName} 反馈文字长度不得超过 ${maxLen} 个字符`,
        okText: '确认',
      });
    } else {
      this.props.editCallback(value, item);
      this.setState({
        edit: false,
      });
    }
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

  // 根据需要显示的文字的长度，来判断是否需要提示框
  // 文本长度超过20个字符，则显示文本提示框
  @autobind
  renderInputTextDomByValue(value) {
    if (value.length > 20) {
      return (
        <Tooltip title={value}>
          <em className={styles.noTnputText}>{value}</em>
        </Tooltip>
      );
    }
    return (<em className={styles.noTnputText}>{value}</em>);
  }

  render() {
    const { edit, value } = this.state;
    const { btnGroup } = this.props;
    return (
      <div className={styles.editInput}>
        {
          !edit ?
            <div className={styles.noInput}>
              {this.renderInputTextDomByValue(value)}
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
