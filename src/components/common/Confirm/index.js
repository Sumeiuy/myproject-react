/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 10:53:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-27 14:31:08
 * 确认提示框，用于删除提示与表单返回提示，传入type
 * type === delete，删除提示
 * type ==== edit，表单返回提示
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import styles from './index.less';

const confirm = Modal.confirm;

export default class Confirm extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    type: PropTypes.string,
    onOkHandler: PropTypes.func,
    onCancelHandler: PropTypes.func,
  };

  static defaultProps = {
    title: '系统提示',
    content: '',
    type: 'delete',
    onOkHandler: () => { },
    onCancelHandler: () => { },
  };

  constructor(props) {
    super(props);
    let content;
    switch (props.type) {
      case 'delete':
        content = '确定要删除吗？';
        break;
      case 'edit':
        content = '直接返回后，您编辑的信息将不会被保存，确认返回？';
        break;
      case 'close':
        content = '关闭弹框后，您编辑的信息将不会被保存，确认关闭？';
        break;
      case 'tooltip':
        content = props.content;
        break;
      default:
        content = '';
    }

    this.state = {
      content,
    };
  }

  showConfirm() {
    const { title, type, onOkHandler, onCancelHandler } = this.props;
    const { content } = this.state;
    confirm({
      title,
      content,
      okText: '确认',
      okType: type === 'delete' ? 'danger' : 'primary',
      cancelText: '取消',
      onOk() {
        onOkHandler();
      },
      onCancel() {
        onCancelHandler();
      },
    });
  }

  render() {
    return (
      <div className={styles.confirmWrapper}>
        {
          this.showConfirm()
        }
      </div>
    );
  }
}
