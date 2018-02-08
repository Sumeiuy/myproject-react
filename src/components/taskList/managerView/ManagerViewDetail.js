/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:08:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-02-07 11:00:07
 * 管理者视图详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import { Tooltip } from 'antd';

import Icon from '../../common/Icon';
import MissionImplementation from './MissionImplementation';
import MissionFeedback from './MissionFeedback';
import CustDetail from './CustDetail';
import Clickable from '../../common/Clickable';
import Button from '../../common/Button';
import GroupModal from '../../customerPool/groupManage/CustomerGroupUpdateModal';
import { openRctTab } from '../../../utils';
import { request } from '../../../config';
import { emp, url as urlHelper } from '../../../helper';
import styles from './managerViewDetail.less';
import InfoArea from './InfoArea';

const EMPTY_OBJECT = {};
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_SIZE = 5;
// const CONTROLLER = 'controller';

// 1代表是自建任务类型
const TASK_TYPE_SELF = '1';
const falseValue = false;

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
    exportExcel: PropTypes.func.isRequired,
    missionProgressStatusDic: PropTypes.array.isRequired,
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
      isEntryFromProgressDetail: false,
    };
  }

  /**
   * 预览客户明细
   */
  @autobind
  handlePreview(params = {}) {
    const {
      title,
      pageNum,
      pageSize,
      missionProgressStatus,
      progressFlag,
      canLaunchTask,
      isEntryFromProgressDetail,
    } = params;
    const { previewCustDetail, currentId, mngrMissionDetailInfo } = this.props;
    const { orgName } = mngrMissionDetailInfo;
    const {
      title: nextTitle,
      missionProgressStatus: nextStatus,
      progressFlag: nextFlag,
    } = this.state;
    let postBody = {
      pageNum: pageNum || INITIAL_PAGE_NUM,
      pageSize: pageSize || INITIAL_PAGE_SIZE,
      orgId: emp.getOrgId(),
      missionId: currentId,
    };

    const progressParam = {
      missionProgressStatus: missionProgressStatus || nextStatus,
      progressFlag: progressFlag || nextFlag,
      title: isEntryFromProgressDetail ? (title || nextTitle) : `当前${orgName || ''}有效客户总数`,
    };

    if (isEntryFromProgressDetail) {
      postBody = {
        ...postBody,
        ..._.omit(progressParam, 'title'),
      };
    }

    this.setState({
      ...progressParam,
      isEntryFromProgressDetail,
    });

    previewCustDetail({
      ...postBody,
    }).then(() => {
      this.setState({
        isShowCustDetailModal: true,
        canLaunchTask: isEntryFromProgressDetail ? true : canLaunchTask,
      });
    });
  }

  /**
   * 关闭弹出框
   */
  @autobind
  handleCloseModal() {
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
    } = this.props;
    const { missionProgressStatus = null, progressFlag = null } = this.state;
    const params = {
      missionProgressStatus,
      progressFlag,
      missionName: mngrMissionDetailInfo.missionName,
      orgId: emp.getOrgId(),
      missionId: currentId,
      serviceTips: _.isEmpty(mngrMissionDetailInfo.missionDesc) ? ' ' : mngrMissionDetailInfo.missionDesc,
      servicePolicy: mngrMissionDetailInfo.servicePolicy,
    };
    return params;
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
    const {
      currentId,
      push,
      missionType,
      custDetailResult,
      missionTypeDict,
    } = this.props;
    const { page = {} } = custDetailResult || EMPTY_OBJECT;
    const totalCustNumber = page.totalCount || 0;
    const { descText } = _.find(missionTypeDict, item => item.key === missionType) || {};
    let missionTypeObject = {};
    // 只有自建任务才需要传给自建任务流程
    if (descText === TASK_TYPE_SELF) {
      missionTypeObject = {
        missionType,
      };
    }
    const urlParam = {
      orgId: emp.getOrgId(),
      // orgId: 'ZZ001041',
      missionId: currentId,
      // missionId: '101111171108181',
      entrance: 'managerView',
      source: 'managerView',
      count: totalCustNumber,
      // 任务类型
      ...missionTypeObject,
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
      pathname: '/taskCenter/selfbuildTask/createTask',
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

    const { isShowCustDetailModal, title, canLaunchTask, isEntryFromProgressDetail } = this.state;

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
      templateId,
    } = mngrMissionDetailInfo;

    const { list = [] } = custDetailResult || EMPTY_OBJECT;
    const isDisabled = _.isEmpty(list);
    const basicInfoData = [{
      id: 'date',
      key: '任务有效期 :',
      value: `${triggerTime || '--'} ~ ${endTime || '--'}`,
    },
    {
      id: 'target',
      key: '任务目标 :',
      value: missionTarget || '--',
    },
    {
      id: 'policy',
      key: '服务策略 :',
      value: servicePolicy || '--',
    }, {
      id: 'tip',
      key: '任务提示 :',
      value: missionDesc || '--',
    }];

    let targetCustInfoData = [{
      id: 'total',
      key: '客户总数 :',
      value: this.renderTotalCust(),
    },
    {
      id: 'source',
      key: '客户来源 :',
      value: custSource || '--',
    }];
    if (!_.isEmpty(custSourceDesc)) {
      targetCustInfoData = [
        ...targetCustInfoData,
        {
          id: 'custDesc',
          key: '客户来源说明 :',
          value: custSourceDesc,
        },
      ];
    }

    const urlParams = this.handleExport();
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
                  {/**
                  * 暂时隐藏导出按钮,等后台性能恢复，再放开
                  */}
                  {
                    falseValue ? <Clickable
                      eventName="/click/managerViewCustDetail/export"
                    >
                      <Button className={styles.export}>
                        <a
                          href={`${request.prefix}/excel/custlist/exportExcel?orgId=${urlParams.orgId}&missionName=${urlParams.missionName}&missionId=${urlParams.missionId}&serviceTips=${urlParams.serviceTips}&servicePolicy=${urlParams.servicePolicy}`}
                        >导出</a>
                      </Button>
                    </Clickable> : null
                  }
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
                      </Clickable>
                      : null
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
                  // 代表是否是从进度条点击的
                  isEntryFromProgressDetail={isEntryFromProgressDetail}
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
          {
            _.isEmpty(templateId) ? null :
            <div className={styles.missionFeedbackSection}>
              <MissionFeedback
                missionFeedbackData={missionFeedbackData}
                isFold={isFold}
                missionFeedbackCount={missionFeedbackCount}
                serveManagerCount={serveManagerCount}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}
