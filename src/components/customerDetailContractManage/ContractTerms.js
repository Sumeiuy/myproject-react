/**
 * @Description: 合约条款
 * @Author: Liujianshu-K0240007
 * @Date: 2018-12-04 16:52:04
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-12-05 16:17:14
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Table from '../common/table';
import IfTableWrap from '../common/IfTableWrap';
import {
  TERMS_COLUMNS,
} from './config';

export default function ContractTerms(props) {
  const {
    data = {},
    effect,
  } = props;
  const { list = [] } = data;
  const isRender = !_.isEmpty(list);
  return (
    <div>
      <IfTableWrap
        isRender={isRender}
        text="暂无合约条款信息"
        effect={effect}
      >
        <Table
          columns={TERMS_COLUMNS}
          dataSource={list}
          rowKey="name"
          pagination={false}
        />
      </IfTableWrap>
    </div>
  );
}

ContractTerms.propTypes = {
  effect: PropTypes.string,
  data: PropTypes.object,
};

ContractTerms.defaultProps = {
  effect: '',
  data: {},
};
