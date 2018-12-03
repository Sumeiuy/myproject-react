/**
 * @Description: 紫金时钟观点列表打开的详情弹窗
 * @Author: Liujianshu
 * @Date: 2018-06-29 14:29:10
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-07-02 14:17:27
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import CommonModal from '../../common/biz/CommonModal';
import { time as timeHelper } from '../../../helper';
import config from '../config';
import styles from './viewpointDetailModal.less';

const { dateFormatStr } = config;

const INDUSTRY = '行业';
const TITLE = '主题';

export default class ViewpointDetailModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    modalKey: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  render() {
    const {
      data: {
        title,
        time,
        reason,
        direction,
        industry,
      },
      visible,
      modalKey,
      closeModal,
    } = this.props;
    const titleName = _.isEmpty(title) ? INDUSTRY : TITLE;
    const modalTitle = `${titleName}调整信息`;
    return (
      <CommonModal
        title={modalTitle}
        visible={visible}
        closeModal={() => closeModal(modalKey)}
        size="normal"
        okText="关闭"
        showCancelBtn={false}
        modalKey={modalKey}
        wrapClassName={styles.detailModal}
        onOk={() => closeModal(modalKey)}
      >
        <h3 className={styles.title}>
          {titleName}
:
          {' '}
          {title || industry}
        </h3>
        <dl className={styles.modalDl}>
          <dt>调整方向：</dt>
          <dd>{direction}</dd>
          <dt>调整时间：</dt>
          <dd>{timeHelper.format(time, dateFormatStr)}</dd>
          <dt>调整理由：</dt>
          <dd>{reason}</dd>
        </dl>
      </CommonModal>
    );
  }
}
