/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:08:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-25 14:14:11
 * 管理者视图详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import { Tooltip } from 'antd';

// import BasicInfo from '../common/BasicInfo';
import Icon from '../../common/Icon';
// import MissionDescription from './MissionDescription';
import MissionImplementation from './MissionImplementation';
import MissionFeedback from './MissionFeedback';
import CustDetail from './CustDetail';
// import TargetCustomer from './TargetCustomer';
import Clickable from '../../common/Clickable';
import Button from '../../common/Button';
import GroupModal from '../../customerPool/groupManage/CustomerGroupUpdateModal';
import { closeRctTab, openRctTab } from '../../../utils';
import { emp, url as urlHelper } from '../../../helper';
import styles from './managerViewDetail.less';
import InfoArea from './InfoArea';

const EMPTY_OBJECT = {};
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_SIZE = 5;

export default class ManagerViewDetail extends PureComponent {

  static propTypes = {
    // 视图是否处于折叠状态
    isFold: PropTypes.bool,
    // 预览客户明细
    previewCustDetail: PropTypes.func.isRequired,
    // 预览客户明细结果
    custDetailResult: PropTypes.object.isRequired,
    // 获取客户反馈结果
    onGetCustFeedback: PropTypes.func.isRequired,
    // 客户反馈结果
    custFeedback: PropTypes.array,
    // 客户池用户范围
    custRange: PropTypes.array.isRequired,
    // 职位信息
    empInfo: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 任务实施进度
    missionImplementationDetail: PropTypes.object.isRequired,
    // 获取任务实施进度
    countFlowStatus: PropTypes.func.isRequired,
    // 任务基本信息
    mngrMissionDetailInfo: PropTypes.object.isRequired,
    // 发起新任务
    launchNewTask: PropTypes.func.isRequired,
    // 当前任务Id
    currentId: PropTypes.string,
    // push
    push: PropTypes.func.isRequired,
    // clearCreateTaskData
    clearCreateTaskData: PropTypes.func.isRequired,
    // 任务类型
    missionType: PropTypes.string.isRequired,
    // 反馈饼图数据
    countFlowFeedBack: PropTypes.func.isRequired,
    // 任务类型字典
    missionTypeDict: PropTypes.array,
    exportCustListExcel: PropTypes.func.isRequired,
    exportExcel: PropTypes.func.isRequired,
    missionProgressStatusDic: PropTypes.object.isRequired,
    missionFeedbackData: PropTypes.array.isRequired,
    missionFeedbackCount: PropTypes.number.isRequired,
    serveManagerCount: PropTypes.number.isRequired,
    isCustServedByPostn: PropTypes.func.isRequired,
    custServedByPostnResult: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    isFold: false,
    mngrMissionDetailInfo: EMPTY_OBJECT,
    currentId: '',
    custFeedback: [],
    missionTypeDict: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowCustDetailModal: false,
      title: '已反馈客户',
      missionProgressStatus: '',
      progressFlag: '',
      canLaunchTask: true,
    };
  }

  /**
   * 预览客户明细
   */
  @autobind
  handlePreview(params = {}) {
    const { title, pageNum, pageSize, missionProgressStatus, progressFlag, canLaunchTask } = params;
    const { previewCustDetail, currentId, mngrMissionDetailInfo } = this.props;
    const { orgName } = mngrMissionDetailInfo;
    const progressParam = {
      missionProgressStatus,
      progressFlag,
    };
    this.setState({
      missionProgressStatus,
      progressFlag,
    });
    previewCustDetail({
      pageNum: pageNum || INITIAL_PAGE_NUM,
      pageSize: pageSize || INITIAL_PAGE_SIZE,
      orgId: emp.getOrgId(),
      // orgId: 'ZZ001041',
      missionId: currentId,
      // missionId: '101111171108181',
      ...progressParam,
    }).then(() => {
      this.setState({
        isShowCustDetailModal: true,
        canLaunchTask,
        title: title || `当前${orgName}有效客户总数`,
      });
    });
  }

  /**
   * 关闭弹出框
   */
  @autobind
  handleCloseModal() {
    closeRctTab({
      id: 'RCT_FSP_CREATE_TASK_FROM_MANAGERVIEW',
    });

    this.hideCustDetailModal();
  }

  @autobind
  hideCustDetailModal() {
    this.setState({
      isShowCustDetailModal: false,
    });
  }

  @autobind
  handleExport() {
    const {
      location: { query: { currentId } },
      mngrMissionDetailInfo,
      exportCustListExcel,
    } = this.props;
    const { missionProgressStatus = null, progressFlag = null } = this.state;
    const params = {
      missionProgressStatus,
      progressFlag,
      missionName: mngrMissionDetailInfo.missionName,
      orgId: emp.getOrgId(),
      missionId: currentId,
      serviceTips: _.isEmpty(mngrMissionDetailInfo.missionDesc) ? '' : mngrMissionDetailInfo.missionDesc,
      servicePolicy: mngrMissionDetailInfo.servicePolicy,
    };
    exportCustListExcel(params);
  }

  /**
   * 发起新任务
   */
  @autobind
  handleLaunchTask() {
    const { clearCreateTaskData } = this.props;
    // 发起新的任务之前，先清除数据
    clearCreateTaskData('managerView');
    this.openByAllSelect('/customerPool/createTask', 'RCT_FSP_CREATE_TASK_FROM_MANAGERVIEW', '自建任务');
  }

  // 发起任务
  @autobind
  openByAllSelect(url, id, title) {
    const { currentId, push, mngrMissionDetailInfo, missionType } = this.props;
    const urlParam = {
      orgId: emp.getOrgId(),
      // orgId: 'ZZ001041',
      missionId: currentId,
      // missionId: '101111171108181',
      entrance: 'managerView',
      source: 'managerView',
      count: mngrMissionDetailInfo.custNumbers,
      // 任务类型
      missionType,
    };
    const condition = encodeURIComponent(JSON.stringify(urlParam));
    const query = {
      condition,
      ...urlParam,
    };
    const finalUrl = `${url}?${urlHelper.stringify(query)}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id,
      title,
    };
    openRctTab({
      routerAction: push,
      url: finalUrl,
      param,
      pathname: url,
      query,
    });
  }

  @autobind
  renderTotalCust() {
    const { mngrMissionDetailInfo = {} } = this.props;
    const { custNumbers = 0, orgName } = mngrMissionDetailInfo;
    return (
      <div className={styles.custValue}>
        <div
          className={styles.totalNum}
          onClick={() => { this.handlePreview({ canLaunchTask: false }); }}
        >
          {custNumbers}
        </div>
        <div className={styles.numDetail}>
          <Tooltip placement="right" title={`当前${orgName}有效客户总数`}>
            <Icon className={styles.tip} type="tishi" />
          </Tooltip>
        </div>
      </div>
    );
  }

  render() {
    const {
      isFold,
      mngrMissionDetailInfo = EMPTY_OBJECT,
      custDetailResult,
      custFeedback,
      missionImplementationDetail,
      custRange,
      empInfo,
      location,
      replace,
      countFlowStatus,
      countFlowFeedBack,
      exportExcel,
      missionProgressStatusDic,
      missionFeedbackData,
      missionFeedbackCount,
      serveManagerCount,
      push,
      isCustServedByPostn,
      custServedByPostnResult,
    } = this.props;

    const { isShowCustDetailModal, title, canLaunchTask } = this.state;

    const {
      missionId,
      missionName,
      missionStatusName,
      triggerTime,
      endTime,
      missionTarget,
      servicePolicy,
      custSource,
      // 客户总数
      // custNumbers = 0,
      // 客户来源说明
      custSourceDesc,
      // 任务描述
      missionDesc,
      // 当前机构名
      // orgName,
    } = mngrMissionDetailInfo;

    const { list = [] } = custDetailResult || EMPTY_OBJECT;
    const isDisabled = _.isEmpty(list);
    const basicInfoData = [{
      key: '任务有效期 :',
      value: `${triggerTime || '--'} ~ ${endTime || '--'}`,
    },
    {
      key: '任务目标 :',
      value: missionTarget || '--',
    },
    {
      key: '服务策略 :',
      value: servicePolicy || '--',
    }];

    let targetCustInfoData = [{
      key: '客户总数 :',
      value: this.renderTotalCust(),
    },
    {
      key: '客户来源 :',
      value: custSource || '--',
    },
    {
      key: '客户来源说明 :',
      value: '--',
    }];
    if (!_.isEmpty(custSourceDesc)) {
      targetCustInfoData = [
        ...targetCustInfoData,
        {
          key: '客户来源说明 :',
          value: custSourceDesc,
        },
      ];
    }

    const descriptInfoData = [{
      key: '',
      value: missionDesc || '--',
    }];

    return (
      <div className={styles.managerViewDetail}>
        <div className={styles.titleSection}>
          <div className={styles.taskTitle}>
            {`编号${missionId || '--'} ${missionName || '--'}: ${missionStatusName || '--'}`}
          </div>
        </div>
        <div className={styles.detailContent}>
          <div className={styles.basicInfoSection}>
            <InfoArea
              data={basicInfoData}
              headLine={'基本信息'}
            />
            <InfoArea
              data={targetCustInfoData}
              headLine={'目标客户'}
            />
            <InfoArea
              data={descriptInfoData}
              headLine={'描述'}
            />
            <GroupModal
              wrapperClass={
                classnames({
                  [styles.custDetailContainer]: true,
                })
              }
              visible={isShowCustDetailModal}
              title={'客户明细'}
              onCancelHandler={this.handleCloseModal}
              footer={
                <div className={styles.operationBtnSection}>
                  <Clickable
                    onClick={this.handleCloseModal}
                    eventName="/click/managerViewCustDetail/cancel"
                  >
                    <Button className={styles.cancel}>取消</Button>
                  </Clickable>
                  <Clickable
                    onClick={this.handleExport}
                    eventName="/click/managerViewCustDetail/export"
                  >
                    <Button className={styles.export}>导出</Button>
                  </Clickable>
                  {
                    canLaunchTask ?
                      <Clickable
                        onClick={this.handleLaunchTask}
                        eventName="/click/managerViewCustDetail/launchTask"
                      >
                        <Button
                          className={styles.launchTask}
                          type="default"
                          disabled={isDisabled}
                        >
                          发起新任务
                        </Button>
                      </Clickable> : null
                  }

                </div>
              }
              modalContent={
                <CustDetail
                  ref={ref => (this.custDetailRef = ref)}
                  getCustDetailData={this.handlePreview}
                  data={custDetailResult}
                  title={title}
                  onClose={this.handleCloseModal}
                  hideCustDetailModal={this.hideCustDetailModal}
                  push={push}
                  isCustServedByPostn={isCustServedByPostn}
                  custServedByPostnResult={custServedByPostnResult}
                />
              }
              modalStyle={{
                maxWidth: 1080,
                minWidth: 700,
                width: 1080,
              }}
              modalWidth={1080}
            />
          </div>
          <div className={styles.missionImplementationSection}>
            <MissionImplementation
              isFold={isFold}
              custFeedback={custFeedback}
              onPreviewCustDetail={this.handlePreview}
              missionImplementationProgress={missionImplementationDetail}
              custRange={custRange}
              empInfo={empInfo}
              location={location}
              replace={replace}
              countFlowStatus={countFlowStatus}
              countFlowFeedBack={countFlowFeedBack}
              exportExcel={exportExcel}
              missionProgressStatusDic={missionProgressStatusDic}
            />
          </div>
          <div className={styles.missionFeedbackSection}>
            <MissionFeedback
              missionFeedbackData={missionFeedbackData}
              isFold={isFold}
              missionFeedbackCount={missionFeedbackCount}
              serveManagerCount={serveManagerCount}
            />
          </div>
        </div>
      </div>
    );
  }
}
