/**
 * @Author: sunweibin
 * @Date: 2018-05-09 17:00:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-17 17:49:04
 * @description 营业部非投顾签约客户分配申请新建
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import confirm from '../common/confirm_';
import TableDialog from '../common/biz/TableDialog';
import CommonModal from '../common/biz/CommonModal';
import BussinessDepartCustBoard from './BussinessDepartmentCustBoard';

import {
  CUST_LIST_BOUNDARY_VALUE,
  CUST_DISTRIBUTE_BTN,
  approvalColumns,
} from './config';

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
    approvalList: PropTypes.array.isRequired,
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
      // 选择审批人
      nextApproverModal: false,
    };
    // 用于提交的数据
    this.submitData = null;
  }

  componentDidMount() {
    // 进入页面写查一遍审批人列表
    this.props.callbacks.getApprovals({ btnId: CUST_DISTRIBUTE_BTN });
  }

  @autobind
  showWarningModal(content) {
    confirm({ title: '', content });
  }

  // 校验提交用数据
  @autobind
  checkSubmitData() {
    const { custList = [], managerList = [], rule } = this.submitData;
    const custListSize = _.size(custList);
    const managerListSize = _.size(managerList);
    if (custListSize === 0) {
      this.showWarningModal('客户列表不能为空');
      return false;
    }
    if (custListSize > CUST_LIST_BOUNDARY_VALUE) {
      this.showWarningModal(`客户列表数量不能超过 ${CUST_LIST_BOUNDARY_VALUE}`);
    }
    if (managerListSize === 0) {
      this.showWarningModal('服务经理不能为空');
      return false;
    }
    if (managerListSize > custListSize) {
      this.showWarningModal('服务经理数量必须小于等于分配的客户数量');
      return false;
    }
    if (managerListSize > 1 && rule === '') {
      this.showWarningModal('请选择客户分配规则');
      return false;
    }
    return true;
  }

  // 判断是否客户列表的原服务经理和服务经理列表里面是否有入岗投顾
  @autobind
  hasTGManager() {
    const { custList = [], managerList = [] } = this.submitData;
    return !!_.find(custList, 'isTg') || !!_.find(managerList, 'isTg');
  }

  @autobind
  handleApprovalModalCancel() {
    this.setState({ nextApproverModal: false });
  }

  @autobind
  handleSelectApprovalOk(approval) {
    if (_.isEmpty(approval)) {
      this.showWarningModal('请选择审批人');
      return;
    }
    // 选择了审批人后提交
    const { custList, managerList, rule = '' } = this.submitData;
    this.props.onSubmit({ custList, managerList, rule, approval });
  }

  @autobind
  handleModalClose() {
    this.props.onClose();
  }

  @autobind
  handleSubmitApprovals() {
    // 需要传递提交用参数
    // 提交前需要检验参数
    if (this.checkSubmitData()) {
      // 校验数据后，需要判断是否需要选择审批人
      if (this.hasTGManager()) {
        // 如果有则需要选择审批人
        this.setState({
          nextApproverModal: true,
        });
      } else {
        // 如果没有，则直接提交
        const { custList, managerList, rule = '' } = this.submitData;
        this.props.onSubmit({ custList, managerList, rule });
      }
    }
  }

  // 每次改变数据之后，将改变后的所有数据传递给Modal,用于后续提交等操作
  @autobind
  hangldeBusinessDepartCustBoardChange(data) {
    this.submitData = data;
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
      approvalList,
    } = this.props;
    const { modalLoading, nextApproverModal } = this.state;
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
            onChange={this.hangldeBusinessDepartCustBoardChange}
            callbacks={callbacks}
            empList={empList}
            custListInExcel={custListInExcel}
            custListByFilter={custListByFilter}
            custListByQuery={custListByQuery}
            empListByQuery={empListByQuery}
            devEmpListByQuery={devEmpListByQuery}
          />
        </CommonModal>
        {
          !nextApproverModal ? null
          : (
            <TableDialog
              visible={nextApproverModal}
              onOk={this.handleSelectApprovalOk}
              onCancel={this.handleApprovalModalCancel}
              dataSource={approvalList}
              columns={approvalColumns}
              title="选择下一审批人员"
              modalKey="distributeApplyApprovalModal"
              rowKey="login"
              searchShow={false}
            />
          )
        }
      </div>
    );
  }
}

