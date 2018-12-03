/*
 * @Description: 附带编辑图标的 input
 * @Author: LiuJianShu
 * @Date: 2017-12-25 14:48:26
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-30 13:46:16
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
    onEditConfirm: PropTypes.func.isRequired,
    editable: PropTypes.bool,
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
    editable: false,
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
    const { editable, value } = props;
    this.state = {
      // 编辑状态
      editable,
      // 值
      value,
      // 编辑前的值
      oldValue: value,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value: preValue, editable: preEdit } = this.props;
    const { value: nextValue, editable: nextEdit } = nextProps;
    if (preValue !== nextValue) {
      this.setState({
        oldValue: nextValue,
        value: nextValue,
        editable: false,
      });
    }
    if (preEdit !== nextEdit) {
      this.setState({
        editable: nextEdit,
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
  @logable({ type: 'Click', payload: { name: '客户反馈选项维护-编辑', value: '$state.oldValue' } })
  onEdit(e) {
    e.stopPropagation();
    const { editable } = this.state;
    this.setState({
      editable: !editable,
    });
  }

  // 提交按钮事件
  // 此处由于新的需求需要针对服务经理可选项还有涨乐客户可选项进行区分处理
  // 所以将原有在此处进行，值是否与以前的相等判断挪到外部有调用者来判断，
  @autobind
  @logable({
    type: 'Submit',
    payload: {
      name: '新增反馈类型',
      type: '客户反馈选项维护',
      subtype: '服务经理可选项',
      value: '$state.value',
    }
  })
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
      this.props.onEditConfirm(value, item);
      this.setState({
        editable: false,
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
      editable: false,
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
    const { editable, value } = this.state;
    const { btnGroup } = this.props;
    return (
      <div className={styles.editInput}>
        {
          !editable
            ? (
              <div className={styles.noInput}>
                {this.renderInputTextDomByValue(value)}
                <Icon type="edit" onClick={this.onEdit} title="编辑" />
                {btnGroup}
              </div>
            )
            : (
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
            )
        }
      </div>
    );
  }
}
