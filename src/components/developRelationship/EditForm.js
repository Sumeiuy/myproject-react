/**
 * @Author: hongguangqing
 * @Description: 开发关系认定的新开发团队页面
 * @Date: 2018-01-04 13:59:02
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-16 09:48:22
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { message, Modal } from 'antd';
import { autobind } from 'core-decorators';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonTable from '../common/biz/CommonTable';
import TableDialog from '../common/biz/TableDialog';
import MultiUploader from '../common/biz/MultiUploader';
import ApprovalRecord from '../permission/ApprovalRecord';
import TextareaComponent from '../common/textareacomponent';
import BottonGroup from '../permission/BottonGroup';
import NewDevelopTeam from './NewDevelopTeam';
import { seibelConfig } from '../../config';
import commonHelpr from './developRelationshipHelpr';
import { emp } from '../../helper';
import styles from './editForm.less';

// 表头
const {
  developTeamTableHeader,
  approvalColumns, // 审批人列表表头
} = seibelConfig.developRelationship;
const overFlowBtnId = 118006; // 终止按钮的flowBtnId
export default class EditForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    // 可添加新开发团队的服务经理
    addEmpList: PropTypes.array.isRequired,
    getAddEmpList: PropTypes.func.isRequired,
    // 获取按钮列表和下一步审批人
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    // 开发关系认定修改
    handleModifyPrivateApp: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { newTeam, developAttachment, otherAttachmnet, develop, other } = props.data;
    this.state = {
      // 附件类型列表
      attachmentTypeList: commonHelpr.handleAttachmentData(develop, other,
        developAttachment, otherAttachmnet),
      remark: '',
      // 审批人弹框
      nextApproverModal: false,
      // 附件的key
      developAttachment: '',
      // 附件的key
      otherAttachment: '',
      // 下一审批人列表
      nextApproverList: [],
      // 新开发团队列表
      serverInfo: newTeam,
      // 下一组ID
      nextGroupId: '',
      // 下一组Name
      nextGroupName: '',
      // 下一步按钮名称
      btnName: '',
      // 下一步操作id
      routeId: '',
    };
  }

  componentWillMount() {
    const {
      flowId,
    } = this.props.data;
    // 获取下一步骤按钮列表
    this.props.getButtonList({ flowId });
  }


  // 更改备注信息
  @autobind
  handleChangeRemark(value) {
    this.setState({
      remark: value,
    });
  }

  @autobind
  handleChangeNewTeam(name, value) {
    this.setState({ [name]: value });
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
      nextGroupId: item.nextGroupName,
      nextGroupName: item.nextGroupName,
      nextApproverList: item.flowAuditors,
    }, () => {
      if (item.flowBtnId !== overFlowBtnId) {
        this.setState({
          nextApproverModal: true,
        });
      } else {
        this.confirmSubmit();
      }
    });
  }

  @autobind
  submitCreateInfo(item) {
    const { originTeam } = this.props.data;
    const { serverInfo, attachmentTypeList } = this.state;
    const develop = attachmentTypeList[0].length;
    const weighSum = _.sumBy(serverInfo, value => Number(value.weigh));
    if (_.isEmpty(serverInfo)) {
      message.error('新开发团队不能为空');
    } else if (weighSum !== 100) {
      message.error('新开发团队的权重合计必须等于100');
    } else if (Number(develop) === 0) {
      message.error('开发关系认定书首次认定时必传');
    } else if (_.isEmpty(originTeam)) {
      this.handleButtonInfo(item);
    } else {
      // 获取一个服务经理名称的数组
      const oldDevelopEmpArr = _.map(originTeam, 'activeLastName');
      // 用、连接服务经理名称的数组中的元素
      const oldDevelopEmpTip = _.join(oldDevelopEmpArr, '、');
      // 已有开发经理的提示语
      const custEmpTip = `该客户已有开发经理${oldDevelopEmpTip}`;
      // 过滤出是入岗投顾的对象数组
      const tgFlagOldDevelopEmpList = _.filter(originTeam, { tgFlag: 'Y' });
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
    const { flowId } = this.props.data;
    const { serverInfo, remark, attachmentTypeList } = this.state;
    console.warn('serverInfo', serverInfo);
    // 登录人Id，新建私密客户必传
    const empId = emp.getId();
    // 登录人orgId，新建私密客户必传
    const orgId = emp.getOrgId();

    const queryConfig = {
      flowId,
      remark,
      empList: serverInfo,
      approvalId: !_.isEmpty(value) ? value.login : '',
      empId,
      orgId,
      developAttachment: attachmentTypeList[0].uuid,
      otherAttachment: attachmentTypeList[1].uuid,
      // 下一组ID
      nextGroupId: this.state.nextGroupId,
      nextGroupName: this.state.nextGroupName,
      btnName: this.state.btnName,
      routeId: this.state.routeId,
    };
    this.props.handleModifyPrivateApp(queryConfig);
    this.setState({ nextApproverModal: false });
  }

  render() {
    const {
      id,
      custName,
      custNumber,
      originTeam,
      currentApproval,
      workflowHistoryBeans,
    } = this.props.data;
    const {
      addEmpList,
      getAddEmpList,
      buttonList,
    } = this.props;
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
    const { remark, attachmentTypeList, serverInfo } = this.state;
    console.warn('serverInfo', serverInfo);
    console.warn('attachmentTypeList', attachmentTypeList);
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    // 客户信息
    const custInfo = `${custName} (${custNumber})`;
    const originTeamData = commonHelpr.convertTgFlag(originTeam);
    return (
      <div className={styles.editFormBox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div id="detailModule" className={styles.module}>
              <InfoTitle head="基本信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="客户" value={custInfo} width='93px' />
                  </li>
                  <li className={styles.item}>
                    <TextareaComponent
                      title="备注"
                      value={remark}
                      onEmitEvent={this.handleChangeRemark}
                      placeholder="请输入您的备注信息"
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div id="oldDevelopTeam_module" className={styles.module}>
              <InfoTitle head="原开发团队" />
              <div className={styles.modContent}>
                <CommonTable
                  data={originTeamData}
                  titleList={developTeamTableHeader}
                  pagination={{
                    pageSize: 5,
                  }}
                />
              </div>
            </div>
            <div id="newDevelopTeam_module" className={styles.module}>
              <InfoTitle head="新开发团队" />
              <div className={styles.modContent}>
                <NewDevelopTeam
                  data={serverInfo}
                  titleList={developTeamTableHeader}
                  addEmpList={addEmpList}
                  getAddEmpList={getAddEmpList}
                  type="serverInfo"
                  onChangeNewDevelopTeam={this.handleChangeNewTeam}
                />
              </div>
            </div>
            <div id="developAttachment" className={styles.module}>
              <InfoTitle head="附件信息" />
              {
                !_.isEmpty(attachmentTypeList) ?
                attachmentTypeList.map(item => (
                  <MultiUploader
                    edit
                    title={item.title}
                    attachment={item.uuid}
                    attachmentList={item.attachmentList}
                    uploadCallback={this.handleUploadCallback}
                    deleteCallback={this.handleDeleteCallback}
                    ref={(ref) => { this[`uploader${item.type}`] = ref; }}
                    showDelete
                  />
                  ))
                  :
                <div className={styles.fileList}>
                  <div className={styles.noFile}>暂无附件</div>
                </div>
              }
            </div>
            <div id="approvalRecord_module">
              <ApprovalRecord
                head="审批记录"
                info={workflowHistoryBeans}
                currentApproval={currentApproval}
                statusType="modify"
              />
            </div>
            <div id="buuton_module">
              <BottonGroup
                list={buttonList}
                onEmitEvent={this.submitCreateInfo}
              />
            </div>
            <TableDialog {...searchProps} />
          </div>
        </div>
      </div>
    );
  }
}
