/**
 * @Description: 合约详情-附件列表
 * @Author: Liujianshu-K0240007
 * @Date: 2018-12-05 13:29:40
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-12-05 13:39:34
 */

import React from 'react';
import PropTypes from 'prop-types';

import CommonUpload from '../common/biz/CommonUpload';

export default function AttachmentList(props) {
  const {
    data = {},
  } = props;
  const { list = [] } = data;
  return (
    <CommonUpload
      attachmentList={list}
      edit={false}
      attachment=""
    />
  );
}

AttachmentList.propTypes = {
  data: PropTypes.object,
};

AttachmentList.defaultProps = {
  data: {},
};
