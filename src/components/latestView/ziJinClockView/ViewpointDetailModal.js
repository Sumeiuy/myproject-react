/**
 * @Description: 紫金时钟观点列表打开的详情弹窗
 * @Author: Liujianshu
 * @Date: 2018-06-29 14:29:10
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-07-02 14:17:27
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';

import CommonModal from '../../common/biz/CommonModal';
// import { time as timeHelper } from '../../../helper';
// import config from '../config';
import styles from './viewpointDetailModal.less';

// const { dateFormatStr } = config;

export default class ViewpointDetailModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    modalKey: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  render() {
    const {
      // data: {
        // title,
        // time,
        // categoryName,
        // typeName,
        // content,
        // gradeName,
      // },
      visible,
      modalKey,
      closeModal,
    } = this.props;
    // Д 为替换后端返回数据中的换行符而设置，无实际价值
    // const newContent = _.isEmpty(content) ? '' : content;
    // const newDetail = newContent.replace(/\r\n|\n\t|\t\n|\n/g, 'Д');
    // const splitArray = newDetail.split('Д');
    return (
      <CommonModal
        title="行业/主题调整信息"
        visible={visible}
        closeModal={() => closeModal(modalKey)}
        size="normal"
        okText="关闭"
        showCancelBtn={false}
        modalKey={modalKey}
        wrapClassName={styles.detailModal}
        onOk={() => closeModal(modalKey)}
      >
        <h3>行业/主题：金牛实盘模拟投资组合20170918</h3>
        <dl className={styles.modalDl}>
          <dt>调整方向：</dt>
          <dd>调入</dd>
          <dt>调整时间：</dt>
          <dd>2018-06-20</dd>
          <dt>调整理由：</dt>
          <dd>这里是理由</dd>
        </dl>
      </CommonModal>
    );
  }
}
