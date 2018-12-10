/*
 * @Author: zhangjun
 * @Date: 2018-11-20 15:16:31
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-08 15:22:17
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Icon from '../common/Icon';
import IfWrap from '../common/biz/IfWrap';
import CommonModal from '../common/biz/CommonModal';
import { logPV } from '../../decorators/logable';
import styles from './infoTitle.less';

export default class InfoTitle extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    // 是否需要信息提示
    isNeedTip: PropTypes.bool,
    // 弹窗标题
    modalTitle: PropTypes.string,
    // 弹窗显示的内容
    children: PropTypes.node,
  };

  static defaultProps = {
    title: '',
    isNeedTip: false,
    modalTitle: '',
    children: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      // 弹窗是否显示
      modalVisible: false,
    };
  }

  // 显示信息提示弹窗
  @autobind
  @logPV({ pathname: '/modal/openInfoTip', title: '打开信息提示弹窗' })
  handleShowModal() {
    this.setState({ modalVisible: true });
  }

  // 关闭弹窗
  @autobind
  handleCloseModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    const {
      title,
      isNeedTip,
      modalTitle,
      children,
    } = this.props;
    const { modalVisible } = this.state;
    return (
      <div className={styles.header}>
        <div className={styles.title}>
          {title}
          <IfWrap isRender={isNeedTip}>
            <div className={styles.infoTip}>
              <Icon
                type="tishi"
                className={styles.tipIcon}
                onClick={this.handleShowModal}
              />
            </div>
          </IfWrap>
        </div>
        <CommonModal
          title={modalTitle}
          visible={modalVisible}
          needBtn={false}
          wrapClassName={styles.infoModal}
          modalKey="infoTipModal"
          closeModal={this.handleCloseModal}
        >
          {children}
        </CommonModal>
      </div>
    );
  }
}
