/**
 * @Author: hongguangqing
 * @Description: 公务手机卡号申请详情页面
 * @Date: 2018-04-19 18:46:58
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-25 17:11:32
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { message, Button } from 'antd';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import AddEmpList from './AddEmpList';
import Select from '../common/Select';
import { emp } from '../../helper';
import ApprovalRecord from '../permission/ApprovalRecord';
import styles from './applyEditForm.less';

// const COMMITOPERATE = 'commit'; // 提交的operate值
export default class ApplyEditForm extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    empAppBindingList: PropTypes.object.isRequired,
    advisorListData: PropTypes.object.isRequired,
    queryAdvisorList: PropTypes.func.isRequired,
    nextApprovalData: PropTypes.array.isRequired,
    queryNextApproval: PropTypes.func.isRequired,
    batchAdvisorListData: PropTypes.object.isRequired,
    queryBatchAdvisorList: PropTypes.func.isRequired,
    updateBindingFlowAppId: PropTypes.string.isRequired,
    updateBindingFlow: PropTypes.func.isRequired,
    doApprove: PropTypes.func.isRequired,
  }

  static defaultProps = {
    // attachmentList: [],
  }

  constructor(props) {
    super(props);
    const { empAppBindingList } = this.props;
    const { advisorBindList } = empAppBindingList;
    this.state = {
      // 选择添加的服务经理列表,默认为修改前添加的服务列表
      empLists: advisorBindList,
      // 选择的审批人
      approval: '',
    };
  }

  componentWillMount() {
    // 获取审批人
    this.props.queryNextApproval({});
  }

  // 将用户选择添加的服务经理列表返回到弹出层用于提交
  @autobind
  saveSelectedEmpList(list) {
    const { empLists } = this.state;
    const newEmpList = _.concat(list, empLists);
    this.setState({
      empLists: newEmpList,
    });
  }

  // 切换审批人
  @autobind
  handleApprovalSelectChange(name, value) {
    this.setState({
      approval: value,
    });
  }

  // 处理审批人数据
  @autobind
  handleApprovalData(data) {
    const options = [];
    _.forEach(data, (item) => {
      const { login, empName } = item;
      const approvalLabel = `${empName}(${login})`;
      options.push({
        show: true,
        label: approvalLabel,
        value: login,
      });
    });
    return options;
  }

  // 点击提交按钮进行重新提交需要先走更新接口，在走走流程接口
  @autobind
  handleOkBtnClick() {
    const { empLists, approval } = this.state;
    const { updateBindingFlow } = this.props;
    // 用empId去重
    const finalEmplists = _.uniqBy(empLists, 'empId');
    if (_.isEmpty(finalEmplists)) {
      message.error('请添加服务经理');
      return;
    } else if (_.isEmpty(approval)) {
      message.error('请选择审批人');
      return;
    }
    updateBindingFlow({
      advisorBindingList: finalEmplists,
    }).then(() => {
      this.sendDoApproveRequest('ok');
    });
  }

  // 点击终止按钮，只需要走走流程接口
  @autobind
  handleCancleBtnClick() {
    this.sendDoApproveRequest('cancle');
  }

  // 发送请求，走流程接口
  @autobind
  sendDoApproveRequest(item) {
    const {
      doApprove,
      getDetailInfo,
      detailInfo,
    } = this.props;
    const { flowId, appId } = detailInfo;
    const { approval } = this.state;
    doApprove({
      itemId: appId,
      flowId,
      wobNum: flowId,
      // 下一组ID
      groupName: item === 'ok' ? 'fgsfzr_group' : 'FINSH',
      operate: item === 'ok' ? 'commit' : 'falseOver',
      // 审批人
      auditors: item === 'ok' ? approval : emp.getId(),
    }).then(() => {
      if (item === 'ok') {
        message.success('公务手机申请修改成功');
      } else {
        message.success('公务手机申请已被终止');
      }
      getDetailInfo({ flowId });
    });
  }

  @autobind
  renderColumnTitle() {
    return [{
      key: 'empName',
      value: '姓名',
    },
    {
      key: 'empId',
      value: '工号',
    },
    {
      key: 'orgName',
      value: '所属营业部',
    }];
  }

  render() {
    const {
      id,
      empId,
      empName,
      orgName,
      createTime,
      statusDesc,
      currentApproval,
      workflowHistoryBeans,
      currentNodeName,
    } = this.props.detailInfo;
    const {
      queryAdvisorList,
      advisorListData,
      batchAdvisorListData,
      queryBatchAdvisorList,
      nextApprovalData,
      empAppBindingList,
    } = this.props;
    const { approval } = this.state;
    const { advisorBindList } = empAppBindingList;
    console.warn('advisorBindList', advisorBindList);
    const { advisorList } = advisorListData;
    if (_.isEmpty(this.props.detailInfo)) {
      return null;
    }
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    // 处理审批人数据
    const newNextApprovalData = this.handleApprovalData(nextApprovalData);
    return (
      <div className={styles.applyEditFormbox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div id="createApplyEmp_module" className={styles.module}>
              <InfoTitle head="服务经理" />
              <AddEmpList
                queryAdvisorList={queryAdvisorList}
                advisorList={advisorList}
                batchAdvisorListData={batchAdvisorListData}
                queryBatchAdvisorList={queryBatchAdvisorList}
                saveSelectedEmpList={this.saveSelectedEmpList}
                advisorBindList={advisorBindList}
                pageType="edit"
              />
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="拟稿人" value={drafter} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="申请请时间" value={createTime} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="状态" value={statusDesc} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="approval_module" className={styles.module}>
              <InfoTitle head="审批" />
              <span className={styles.approvalTip}><span>*</span>选择审批人：</span>
              <Select
                width="160px"
                name="approval"
                data={newNextApprovalData}
                value={approval}
                onChange={this.handleApprovalSelectChange}
              />
            </div>
            <div id="approvalRecord_module" className={styles.module}>
              <ApprovalRecord
                head="审批记录"
                info={workflowHistoryBeans}
                currentApproval={currentApproval}
                currentNodeName={currentNodeName}
                statusType="ready"
              />
            </div>
            <div id="button_module" className={styles.buttonModule}>
               <Button className={styles.cancleBtn} onClick={this.handleCancleBtnClick}>取消</Button>
               <Button className={styles.okBtn} onClick={this.handleOkBtnClick}>提交</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
