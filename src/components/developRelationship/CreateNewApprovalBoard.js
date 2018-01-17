import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { message, Modal } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import BottonGroup from '../permission/BottonGroup';
import CommonModal from '../common/biz/CommonModal';
import TableDialog from '../common/biz/TableDialog';
import InfoTitle from '../common/InfoTitle';
import CommonTable from '../common/biz/CommonTable';
import MultiUploader from '../common/biz/MultiUploader';
import BaseInfoModify from './BaseInfoModify';
import NewDevelopTeam from './NewDevelopTeam';
import { emp } from '../../helper';
import { seibelConfig } from '../../config';
import confirm from '../common/Confirm';
import commonHelpr from './developRelationshipHelpr';
import styles from './createNewApprovalBoard.less';

const {
  developTeamTableHeader, // 原开发团队表头
  attachmentMap,  // 附件类型数组
  approvalColumns, // 审批人列表表头
} = seibelConfig.developRelationship;
export default class CreateNewApprovalBoard extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onEmitClearModal: PropTypes.func.isRequired,
    addListenCreate: PropTypes.bool.isRequired,
    // 创建开发关系认定
    createDevelopRelationship: PropTypes.object.isRequired,
    getCreateDevelopRelationship: PropTypes.func.isRequired,
    // 员工信息
    empInfo: PropTypes.object.isRequired,
    // 可创建开发关系认定的客户
    createCustList: PropTypes.array.isRequired,
    getCreateCustList: PropTypes.func.isRequired,
    // 可创建开发关系认定的客户是否可用
    isValidCust: PropTypes.object.isRequired,
    getIsValidCust: PropTypes.func.isRequired,
    // 原开发团队
    oldDevelopTeamList: PropTypes.array.isRequired,
    getOldDevelopTeamList: PropTypes.func.isRequired,
    // 可添加新开发团队的服务经理
    addEmpList: PropTypes.array.isRequired,
    getAddEmpList: PropTypes.func.isRequired,
    // 获取按钮列表和下一步审批人
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    // 清除props数据
    clearPropsData: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      // 附件类型列表
      attachmentTypeList: attachmentMap,
      // 模态框是否显示   默认状态下是隐藏的
      isShowModal: true,
      // 备注信息
      remark: '',
      customer: {},
      // 新建时 选择的客户
      custId: '',
      // 新建时 选择的该客户类型
      custType: '',
      // 新建时 选择的该客户姓名
      custName: '',
      // 审批人弹框
      nextApproverModal: false,
      // 下一审批人列表
      nextApproverList: [],
      // 新开发团队列表
      serverInfo: [],
    };
  }

  componentWillMount() {
    // 按照给出的条件 搜索查询 下一审批人列表
    this.props.getButtonList({});
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.addListenCreate === true &&
      nextProps.addListenCreate === false &&
      nextProps.createDevelopRelationship.msg === 'success'
    ) {
      this.setState({ isShowModal: false });
    }
  }

  componentWillUnmount() {
    // 销毁组件时清空数据
    this.props.clearPropsData();
  }

  @autobind
  closeModal() {
    // 关闭 新建私密客户 模态框
    confirm({
      shortCut: 'close',
      onOk: this.clearBoardAllData,
    });
  }

  // 清空弹出层数据
  @autobind
  clearBoardAllData() {
    const that = this;
    that.setState({ isShowModal: false });
  }

    @autobind
  afterClose() {
    this.props.onEmitClearModal('isShowCreateModal');
  }

  @autobind
  updateValue(name, value) {
    this.setState({ [name]: value });
    switch (name) {
      case 'customer':
        this.setState({
          customer: {
            custName: value.custName,
            custNumber: value.cusId,
            brokerNumber: value.brokerNumber,
          },
          custId: value.cusId,
          custType: value.custType,
        }, () => {
          this.props.getOldDevelopTeamList({
            custId: value.cusId,
          });
        });
        break;
      default: break;
    }
  }

  // 文件上传成功
  @autobind
  handleUploadCallback(attachmentType, attachment) {
    const { attachmentTypeList } = this.state;
    const newAttachmentTypeList = attachmentTypeList.map((item) => {
      const { type, length } = item;
      if (type === attachmentType) {
        return {
          ...item,
          uuid: attachment,
          length: length + 1,
        };
      }
      return item;
    });
    this.setState({
      attachmentTypeList: newAttachmentTypeList,
    });
  }

  // 文件删除成功
  @autobind
  handleDeleteCallback(attachmentType) {
    const { attachmentTypeList } = this.state;
    const newAttachmentTypeList = attachmentTypeList.map((item) => {
      const { type, length } = item;
      if (type === attachmentType && length > 0) {
        return {
          ...item,
          length: length - 1,
        };
      }
      return item;
    });
    this.setState({
      attachmentTypeList: newAttachmentTypeList,
    });
  }

  @autobind
  handleButtonInfo(item) {
    // 修改状态下的提交按钮
    // 点击按钮后 弹出下一审批人 模态框
    this.setState({
      routeId: item.operate,
      btnName: item.btnName,
      btnId: item.flowBtnId,
      nextGroupId: item.nextGroupName,
      nextApproverList: item.flowAuditors,
      nextApproverModal: true,
    });
  }

  @autobind
  submitCreateInfo(item) {
    const { oldDevelopTeamList } = this.props;
    const { custId, serverInfo, attachmentTypeList } = this.state;
    const develop = attachmentTypeList[0].length;
    const weighSum = _.sumBy(serverInfo, value => Number(value.weigh));
    if (_.isEmpty(custId)) {
      message.error('请选择客户');
    } else if (_.isEmpty(serverInfo)) {
      message.error('新开发团队不能为空');
    } else if (weighSum !== 100) {
      message.error('新开发团队的权重合计必须等于100');
    } else if (Number(develop) === 0) {
      message.error('开发关系认定书首次认定时必传');
    } else if (_.isEmpty(oldDevelopTeamList)) {
      this.handleButtonInfo(item);
    } else {
      // 获取一个服务经理名称的数组
      const oldDevelopEmpArr = _.map(oldDevelopTeamList, 'activeLastName');
      // 用、连接服务经理名称的数组中的元素
      const oldDevelopEmpTip = _.join(oldDevelopEmpArr, '、');
      // 已有开发经理的提示语
      const custEmpTip = `该客户已有开发经理${oldDevelopEmpTip}`;
      // 过滤出是入岗投顾的对象数组
      const tgFlagOldDevelopEmpList = _.filter(oldDevelopTeamList, { tgFlag: 'Y' });
      // 获取是入岗投顾的服务经理名称的数组
      const tgFlagEmpArr = _.map(tgFlagOldDevelopEmpList, 'activeLastName');
      // 用、连接是入岗投顾的服务经理名称的数组中的元素
      const tgFlagoldDevelopEmp = _.join(tgFlagEmpArr, '、');
      // 是入岗投顾的服务经理提示语
      const tgFlagEmpTip = _.isEmpty(tgFlagoldDevelopEmp) ? '' : `且${tgFlagoldDevelopEmp}是入岗投顾,`;
      Modal.confirm({
        title: '提示',
        content: `${custEmpTip},${tgFlagEmpTip}是否需要重新认定开发关系！`,
        okText: '确认',
        onOk: () => this.handleButtonInfo(item),
        cancelText: '取消',
      });
    }
  }

  @autobind
  confirmSubmit(value) {
    const { empInfo } = this.props;
    const {
      serverInfo,
      subType,
      customer,
      remark,
      attachmentTypeList,
    } = this.state;

    // 登录人Id，新建私密客户必传
    const empId = emp.getId();
    // 登录人custName，新建私密客户必传
    const empName = empInfo.empName;
    // 登录人orgId，新建私密客户必传
    const orgId = emp.getOrgId();

    const queryConfig = {
      subType,
      remark,
      empList: serverInfo,
      approvalId: !_.isEmpty(value) ? value.login : '',
      empId,
      empName,
      orgId,
      custName: customer.custName,
      custNumber: customer.brokerNumber,
      developAttachment: attachmentTypeList[0].uuid,
      otherAttachment: attachmentTypeList[1].uuid,
    };
    this.props.getCreateDevelopRelationship(queryConfig);
    this.setState({ nextApproverModal: false });
  }

  render() {
    const {
      createCustList,
      getCreateCustList,
      isValidCust,
      getIsValidCust,
      oldDevelopTeamList,
      addEmpList,
      getAddEmpList,
      buttonList,
      clearPropsData,
    } = this.props;
    const { remark, customer, attachmentTypeList, custId } = this.state;
    const searchProps = {
      visible: this.state.nextApproverModal,
      onOk: this.confirmSubmit,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: this.state.nextApproverList,
      columns: approvalColumns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'nextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };
    const customerValue = !_.isEmpty(customer) ? `${customer.custName}（${customer.custNumber}）` : '';
    const btnGroupElement = (<BottonGroup
      list={buttonList}
      onEmitEvent={this.submitCreateInfo}
    />);
    const newOldDevelopTeamList = commonHelpr.convertTgFlag(oldDevelopTeamList);
    return (
      <CommonModal
        title="新建开发关系认定"
        visible={this.state.isShowModal}
        closeModal={this.closeModal}
        size="large"
        modalKey="myModal"
        afterClose={this.afterClose}
        selfBtnGroup={btnGroupElement}
      >
        <div className={styles.devRelcreateModalBox}>
          {/* 基本信息 */}
          <BaseInfoModify
            head="基本信息"
            remark={remark}
            customer={customerValue}
            createCustList={createCustList}
            getCreateCustList={getCreateCustList}
            onChangeBaseInfoState={this.updateValue}
            isValidCust={isValidCust}
            getIsValidCust={getIsValidCust}
            clearPropsData={clearPropsData}
          />
          {/* 原开发团队 */}
          <div id="oldDevelopTeam_module" className={styles.module}>
            <InfoTitle head="原开发团队" />
            <div className={styles.modContent}>
              <CommonTable
                data={newOldDevelopTeamList}
                titleList={developTeamTableHeader}
                pagination={{
                  pageSize: 5,
                }}
              />
            </div>
          </div>
          {/* 新开发团队 */}
          <div id="newDevelopTeam_module" className={styles.module}>
            <InfoTitle head="新开发团队" />
            <div className={styles.modContent}>
              <NewDevelopTeam
                titleList={developTeamTableHeader}
                addEmpList={addEmpList}
                getAddEmpList={getAddEmpList}
                type="serverInfo"
                onChangeNewDevelopTeam={this.updateValue}
                custId={custId}
              />
            </div>
          </div>
          {/* 附件信息 */}
          <div id="attachment_module" className={styles.module}>
            <InfoTitle head="附件信息" />
            {
              attachmentTypeList.map((item) => {
                const uploaderElement = item.show ? (
                  <div className={styles.mt10}>
                    <MultiUploader
                      key={item.type}
                      edit
                      type={item.type}
                      title={item.title}
                      required={item.required}
                      uploadCallback={this.handleUploadCallback}
                      deleteCallback={this.handleDeleteCallback}
                      ref={(ref) => { this[`uploader${item.type}`] = ref; }}
                      showDelete
                    />
                  </div>
                ) : null;
                return (
                  <div key={item.type}>
                    {uploaderElement}
                  </div>
                );
              })
            }
          </div>
          <TableDialog {...searchProps} />
        </div>
      </CommonModal>
    );
  }
}
