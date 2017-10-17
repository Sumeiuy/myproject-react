/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 10:53:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-09-22 15:39:10
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { autobind } from 'core-decorators';
import styles from './customerGroupUpdateModal.less';

export default class CustomerGroupUpdateModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    wrapperClass: PropTypes.string.isRequired,
    title: PropTypes.string,
    okText: PropTypes.string.isRequired,
    cancelText: PropTypes.string,
    okType: PropTypes.string,
    onOkHandler: PropTypes.func.isRequired,
    modalContent: PropTypes.node,
    onCancelHandler: PropTypes.func,
    footer: PropTypes.node,
  };

  static defaultProps = {
    visible: false,
    title: '',
    okType: 'primary',
    cancelText: '取消',
    modalContent: null,
    onCancelHandler: () => { },
    footer: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      footer: props.footer,
    };
  }

  /*
  // 设置默认footer
  componentWillMount() {
    this.setState({
      footer: <div className={styles.footerSection}>
        <Button key="back" size="default" onClick={this.handleCancel} className="cancel">取消</Button>
        <Button key="submit" type="primary" size="default" className="submit">
          提交
        </Button>
      </div>,
    });
  }
  */

  @autobind
  handleOk() {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  }

  @autobind
  handleCancel() {
    const { visible } = this.state;
    const { onCancelHandler } = this.props;
    this.setState({
      visible: !visible,
    });
    onCancelHandler();
  }

  render() {
    const {
      wrapperClass,
      title,
      okText,
      cancelText,
      okType,
      onOkHandler,
      modalContent,
    } = this.props;
    const { visible, footer } = this.state;
    // if (!visible) {
    //   return null;
    // }
    return (
      <div className={styles.groupUpdateWrapper}>
        <Modal
          wrapClassName={wrapperClass}
          visible={visible}
          title={title}
          onOk={onOkHandler}
          okText={okText}
          okType={okType}
          cancelText={cancelText}
          maskClosable={false}
          width={700}
          onCancel={this.handleCancel}
          closable={false}
          footer={footer}
        >
          {
            modalContent
          }
        </Modal>
      </div>
    );
  }
}
