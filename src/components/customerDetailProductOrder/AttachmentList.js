/*
 * @Author: yuanhaojie
 * @Date: 2018-11-26 19:16:14
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-26 20:11:48
 * @Description: 服务订单详情-附件
 */

import React from 'react';
import PropTypes from 'prop-types';
import CommonUpload from '../common/biz/CommonUpload';
import styles from './attachmentList.less';

export default function AttachmentList(props) {
  return(
    <div className={styles.attachmentListWrap}>
      <CommonUpload
        attachmentList={props.attachmentList}
        popoverPlacement="bottom"
      />
    </div>
  );
}

AttachmentList.propTypes = {
  attachmentList: PropTypes.array.isRequired,
};
