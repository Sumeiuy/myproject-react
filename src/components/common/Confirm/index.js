/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 10:53:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-11 17:43:21
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
    this.state = {
      content: props.type === 'delete' ?
        '亲~~此操作不可恢复，您确认删除吗？'
        : '亲~~弹框关闭以后，您所填写的信息是不会保存的哟！！！',
    };
  }

  showConfirm() {
    const { title, content, type, onOkHandler, onCancelHandler } = this.props;
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
