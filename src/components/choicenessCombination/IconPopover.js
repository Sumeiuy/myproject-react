/**
 * @Author: XuWenKang
 * @Description: 组合详情-问号气泡提示框
 * @Date: 2018-06-05 13:17:03
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-05 14:59:54
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Icon } from 'antd';

const iconStyle = {
  color: '#ffe15f',
};
export default function IconPopover({ title }) {
  return (
    <div>
      <span>
        {title}
        {' '}
      </span>
      <Popover
        placement="top"
        content="客户当前持仓与组合当前构成中重合的证券数量/组合当前构成中证券数量"
        trigger="hover"
        overlayStyle={{ maxWidth: 310 }}
      >
        <Icon type="question-circle" style={iconStyle} />
      </Popover>
    </div>
  );
}

IconPopover.propTypes = {
  title: PropTypes.string.isRequired,
};
