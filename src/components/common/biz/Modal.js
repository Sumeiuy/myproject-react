/*
 * @Author: LiuJianShu
 * @Date: 2017-09-14 14:44:35
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-14 15:14:31
 */
/**
 * 常用说明
 * 参数          类型         说明
 * title         string      弹窗的标题
 * visible       boolean     弹窗是否可见
 * onOk          function    点击确定回调
 * onCancel      function    点击遮罩层或右上角叉或取消按钮的回调
 * okText        string      确认按钮文字，默认为 【确认】
 * okType        string      确认按钮类型，类型参照 commom/Button 下的类型
 * cancelText    string      取消按钮文字，默认为 【取消】
 * maskClosable  boolean     点击蒙层是否允许关闭
 * 新增参数
 * size          string      弹窗的大小，可选值 [large, normal, small] 默认为 noral
 * btnStatus     boolean     确认按钮的禁用状态， 默认 【false】
 * children      string/DOM  弹窗内需要显示的元素
 * 其他参数与 Antd.Modal 相同，具体见下方链接
 * https://ant.design/components/modal-cn/
 * 示例
 <CommonModal
   title="这是一个弹出层"
   visible={visible}
   onOk={this.onOk}
   onCancel={this.onCancel}
   size="small"
 >
   <div style={{ width: '1200px', height: '1200px', border: '1px solid #ccc' }}>
     打开弹出层
   </div>
 </CommonModal>
 */

import React, { PropTypes, PureComponent } from 'react';
import { Modal, Button } from 'antd';
// import Button from '../Button';
import styles from './Modal.less';

export default class CommonModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    okText: PropTypes.string,
    size: PropTypes.string,
    cancelText: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    btnStatus: PropTypes.bool,
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object,
    ]),
  }

  static defaultProps = {
    btnStatus: false,
    okText: '确认',
    cancelText: '取消',
    children: '子元素内容区域',
    size: 'normal',
  }

  render() {
    const {
      size,
      children,
      onCancel,
      cancelText,
      onOk,
      okText,
      btnStatus,
    } = this.props;
    const modalSize = `modal${size}`;
    return (
      <Modal
        {...this.props}
        onCancel={onCancel}
        wrapClassName={`${styles.commonModal} ${styles[modalSize]}`}
        footer={[
          <Button
            key="back"
            size="large"
            onClick={onCancel}
          >
            {cancelText}
          </Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            disabled={btnStatus}
            onClick={onOk}
          >
            {okText}
          </Button>,
        ]}
      >
        {children}
      </Modal>
    );
  }
}
