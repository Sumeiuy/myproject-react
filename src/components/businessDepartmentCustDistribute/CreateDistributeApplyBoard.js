/**
 * @Author: sunweibin
 * @Date: 2018-05-09 17:00:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-16 18:45:49
 * @description 营业部非投顾签约客户分配申请新建
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
import BussinessDepartCustBoard from './BussinessDepartmentCustBoard';

export default class CreatDistributeApplyBoard extends Component {
  static propTypes = {
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    callbacks: PropTypes.objectOf(PropTypes.func).isRequired,
    empList: PropTypes.array.isRequired,
    custListInExcel: PropTypes.array.isRequired,
    custListByFilter: PropTypes.object.isRequired,
    custListByQuery: PropTypes.array.isRequired,
    empListByQuery: PropTypes.array.isRequired,
    devEmpListByQuery: PropTypes.array.isRequired,
  }

  static defaultProps = {
    visible: false,
    onClose: _.noop,
    onSubmit: _.noop,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 点击提交后，弹出层区域的Loading
      modalLoading: false,
    };
  }

  @autobind
  handleModalClose() {
    this.props.onClose();
  }

  @autobind
  handleSubmitApprovals() {
    // 需要传递提交用参数
    this.props.onSubmit();
  }

  render() {
    const {
      modalKey,
      visible,
      callbacks,
      empList,
      custListInExcel,
      custListByFilter,
      custListByQuery,
      empListByQuery,
      devEmpListByQuery,
    } = this.props;
    const { modalLoading } = this.state;
    return (
      <div>
        <CommonModal
          title="新建营业部客户分配"
          modalKey={modalKey}
          needBtn
          maskClosable={false}
          modalLoading={modalLoading}
          size="large"
          visible={visible}
          closeModal={this.handleModalClose}
          okText="提交"
          onOk={this.handleSubmitApprovals}
          onCancel={this.handleModalClose}
        >
          <BussinessDepartCustBoard
            callbacks={callbacks}
            empList={empList}
            custListInExcel={custListInExcel}
            custListByFilter={custListByFilter}
            custListByQuery={custListByQuery}
            empListByQuery={empListByQuery}
            devEmpListByQuery={devEmpListByQuery}
          />
        </CommonModal>
      </div>
    );
  }
}

