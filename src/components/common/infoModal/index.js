/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-21 14:01:43
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-31 09:37:55
 * 通用信息提示框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Modal } from 'antd';

import Icon from '../Icon';
import Button from '../Button';
import logable from '../../../decorators/logable';

import styles from './index.less';

export default class InfoModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    content: PropTypes.node,
    onConfirm: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    content: null,
    onConfirm: _.noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  /**
   * 确认按钮事件
   */
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确认' } })
  handleConfirm() {
    this.setState({
      visible: !this.state.visible,
    });
    this.props.onConfirm();
  }

  render() {
    const { visible } = this.state;
    const { content } = this.props;
    if (visible) {
      return (
        <Modal
          closable={false}
          width={400}
          height={160}
          wrapClassName={styles.infoModal}
          visible={visible}
          footer={(
            <Button
              className="confirm"
              type="primary"
              onClick={this.handleConfirm}
            >
确认
            </Button>
)}
        >
          <div className="info">
            <Icon type="jingshi" className="tishi" />
            <span className="content">{content || ''}</span>
          </div>
        </Modal>
      );
    }

    return null;
  }
}
