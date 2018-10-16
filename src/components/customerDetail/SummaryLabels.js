/*
 * @Author: sunweibin
 * @Date: 2018-10-16 09:15:12
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 14:14:49
 * @description 新版客户360详情重点标签区域
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import CustLabel from './CustLabel';
import Modal from '../common/biz/CommonModal';

import styles from './summaryLabels.less';

export default class SummaryLabels extends PureComponent {
  static propTypes = {
    // 概要信息中显示的15个标签
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      // 重点标签更多弹出层
      moreLabelsModal: false,
    };
  }

  // 打开更多重点标签弹出层
  @autobind
  handleMoreLabelClick() {
    this.setState({ moreLabelsModal: true });
  }

  // 关闭更多重点标签弹出层
  @autobind
  handleMoreLabelModalClose() {
    this.setState({ moreLabelsModal: false });
  }

  render() {
    const { data } = this.props;
    const { moreLabelsModal } = this.state;
    return (
      <div className={styles.wrap}>
        <div className={styles.header}>
          <span className={styles.title}>重点标签</span>
          <span className={styles.xq} onClick={this.handleMoreLabelClick}>更多</span>
        </div>
        <div className={styles.body}>
          {
            _.map(data, label => (<CustLabel labelData={label} />))
          }
        </div>
        {
          moreLabelsModal
            ? (
              <Modal
                modalKey="custKeyLabelMoreModal"
                visible={moreLabelsModal}
                title="重点标签"
                needBtn={false}
                closeModal={this.handleMoreLabelModalClose}
              >
              </Modal>
            )
            : null
        }
      </div>
    );
  }
}
