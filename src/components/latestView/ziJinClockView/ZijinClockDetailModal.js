/**
 * @Description: 紫金时钟观点列表打开的详情弹窗
 * @Author: Liujianshu
 * @Date: 2018-06-29 14:29:10
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-30 14:43:03
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';

import CommonModal from '../../common/biz/CommonModal';
import { time as timeHelper } from '../../../helper';
import config from '../config';
import styles from './zijinClockDetailModal.less';

const { dateFormatStr } = config;

export default class ZijinClockDetailModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    modalKey: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  render() {
    const {
      data: {
        cyclePoint,
        macroPoint,
        marketPoint,
        name,
        recommend,
        time,
      },
      visible,
      modalKey,
      closeModal,
    } = this.props;
    return (
      <CommonModal
        title="紫金时钟"
        visible={visible}
        closeModal={() => closeModal(modalKey)}
        size="large"
        okText="关闭"
        showCancelBtn={false}
        modalKey={modalKey}
        wrapClassName={styles.detailModal}
        onOk={() => closeModal(modalKey)}
      >
        <h3>当前周期：{name}</h3>
        <dl className={styles.modalDl}>
          <dt>发布日期：</dt>
          <dd>{timeHelper.format(time, dateFormatStr)}</dd>
          <dt>周期描述：</dt>
          <dd>{cyclePoint}</dd>
          <dt>宏观观点：</dt>
          <dd>{macroPoint}</dd>
          <dt>市场策略：</dt>
          <dd>{marketPoint}</dd>
          <dt>仓位推荐：</dt>
          <dd>{recommend}</dd>
        </dl>
      </CommonModal>
    );
  }
}
