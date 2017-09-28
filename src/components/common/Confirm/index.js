/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 10:53:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-09-28 17:27:55
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
    content: '此操作不可恢复，您确认删除吗？',
    type: 'delete',
    onOkHandler: () => { },
    onCancelHandler: () => { },
  };

  showConfirm() {
    const { title, content, type, onOkHandler, onCancelHandler } = this.props;
    confirm({
      title,
      content,
      okText: '确认',
      okType: type === 'delete' ? 'danger' : 'primary',
      cancelText: '取消',
      onOk() {
        console.log('确认');
        onOkHandler();
      },
      onCancel() {
        console.log('取消');
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
