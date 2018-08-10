/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:08:41
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-09 21:28:44
 * 管理者视图详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
// import classnames from 'classnames';

import MissionImplementation from './MissionImplementation';
import MissionFeedback from './MissionFeedback';
import CustDetail from './CustDetail';
import Button from '../../common/Button';
import GroupModal from '../../customerPool/groupManage/CustomerGroupUpdateModal';
import { openRctTab } from '../../../utils';
import { request } from '../../../config';
import { PIE_ENTRY, PROGRESS_ENTRY, TASK_CUST_SCOPE_ENTRY } from '../../../config/createTaskEntry';
import { emp, url as urlHelper } from '../../../helper';
import { printMissionImplementationLog } from './helper';
import styles from './managerViewDetail.less';
import InfoArea from './InfoArea';
import logable, { logCommon } from '../../../decorators/logable';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_SIZE = 10;
// const CONTROLLER = 'controller';

// 1代表是自建任务类型
const TASK_TYPE_SELF = '1';
const falseValue = false;

// 任务进度条下钻
const SERVE_CUSTS = 'SERVE_CUSTS';
// 客户反馈饼图下钻
const MOT_FEEDBACK_CUSTS = 'MOT_FEEDBACK_CUSTS';

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
    missionImplementationDetail: PropTypes.object,
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
    custServedByPostnResult: PropTypes.bool.isRequired,
    missionReport: PropTypes.object.isRequired,
    createMotReport: PropTypes.func.isRequired,
    queryMOTServeAndFeedBackExcel: PropTypes.func.isRequired,
    queryDistinctCustomerCount: PropTypes.func.isRequired,
    distinctCustomerCount: PropTypes.number.isRequired,
    // 服务经理维度任务数据
    custManagerScopeData: PropTypes.object.isRequired,
    getCustManagerScope: PropTypes.func.isRequired,
    previewCustDetailByScope: PropTypes.func.isRequired,
    queryDistinctCustListDetailOfMission: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isFold: false,
    mngrMissionDetailInfo: EMPTY_OBJECT,
    currentId: '',
    custFeedback: EMPTY_LIST,
    missionTypeDict: EMPTY_LIST,
    missionImplementationDetail: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowCustDetailModal: false,
      missionProgressStatus: '',
      progressFlag: '',
      canLaunchTask: false,
      isEntryFromProgressDetail: false,
      isEntryFromCustTotal: false,
      isEntryFromPie: false,
      currentFeedback: EMPTY_LIST,
      feedbackIdL1: '',
      destroyOnClose: false,
      feedbackIdL2: '',
      isEntryFromResultStatisfy: false,
      enterType: '',
      recordId: '',
    };
  }

  @autobind
  getCurrentOrgId() {
    if (this.missionImplementationElem) {
      return this.missionImplementationElem.getCurrentOrgId() || emp.getOrgId();
    }
    return emp.getOrgId();
  }

  /**
   * 构造客户反馈一级和二级
   */
  @autobind
  getCustFeedbackList() {
    // 构造一二级客户反馈
    let currentFeedback = _.map(this.props.custFeedback, item => ({
      feedbackIdL1: item.key,
      feedbackName: item.name,
      childList: _.map(item.children, child => ({
        feedbackIdL2: child.key,
        feedbackName: child.name,
      })),
    }));

    // 添加默认选中项，所有
    currentFeedback = _.concat([{
      feedbackIdL1: '',
      feedbackName: '所有反馈',
      childList: [{
        feedbackIdL2: '',
        feedbackName: '所有反馈',
      }],
    }], currentFeedback);

    return currentFeedback;
  }

  /**
   * 打开modal
   */
  @autobind
  setModalOpen() {
    this.setState({
      isShowCustDetailModal: true,
      destroyOnClose: false,
    });
  }

  @autobind
  handleExport() {
    const {
      currentId,
      mngrMissionDetailInfo,
    } = this.props;
    const { missionProgressStatus = null, progressFlag = null } = this.state;
    const params = {
      missionProgressStatus,
      progressFlag,
      missionName: mngrMissionDetailInfo.missionName,
      orgId: this.getCurrentOrgId(),
      missionId: currentId,
      serviceTips: _.isEmpty(mngrMissionDetailInfo.missionDesc) ? ' ' : mngrMissionDetailInfo.missionDesc,
      servicePolicy: mngrMissionDetailInfo.servicePolicy,
    };
    return params;
  }

  @autobind
  hideCustDetailModal() {
    this.setState({
      isShowCustDetailModal: false,
      destroyOnClose: true,
    });
  }

  /**
   * 关闭弹出框
   */
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '取消',
    },
  })
  handleCloseModal() {
    this.scrollModalBodyToTop();
    this.hideCustDetailModal();
  }

  // 点击客户总数
  @autobind
  @logable({
    type: 'DrillDown',
    payload: {
      name: '目标客户',
      element: '客户数',
    },
  })
  handleCustTotal(params = {}) {
    this.previewCustDetail(params);
  }

  // 点击客户详情
  @autobind
  handleCustDetail(params = {}) {
    this.previewCustDetail(params);
  }

  // 点击任务实施简报中的图表
  @autobind
  handleMissionImplementation(params = {}) {
    this.previewCustDetail(params);
    // 神策日志上报
    const payload = printMissionImplementationLog(params);
    logCommon({
      type: 'DrillDown',
      payload,
    });
  }

  /**
   * 预览客户明细
   */
  @autobind
  previewCustDetail(params = {}) {
    const {
      // 一二级客户反馈
      currentFeedback,
      // 当前选中的一级客户反馈
      feedbackIdL1 = '',
      // 当前选中的二级客户反馈
      feedbackIdL2 = '',
      pageNum = INITIAL_PAGE_NUM,
      pageSize = INITIAL_PAGE_SIZE,
      missionProgressStatus = '',
      progressFlag = '',
      canLaunchTask = false,
      // 当前入口是从客户总数来的
      isEntryFromCustTotal = false,
      // 当前入口是否从进度条过来
      isEntryFromProgressDetail = false,
      // 当前入口是否从饼图过来
      isEntryFromPie = false,
      // 当前入口是从进度条的结果达标过来的
      isEntryFromResultStatisfy = false,
      // 从任务维度信息下钻，服务经理维度、分公司维度、营业部维度
      enterType = '',
      // 任务维度的id，服务经理id、分公司id、营业部id
      recordId = '',
    } = params;

    const {
      previewCustDetail,
      previewCustDetailByScope,
      currentId,
      queryDistinctCustomerCount,
      queryDistinctCustListDetailOfMission,
      location: { query: { ptyMngId = '' } },
    } = this.props;

    // 基本入参
    // 按服务经理筛选时传ptyMngId的值
    let postBody = {
      pageNum,
      pageSize,
      orgId: this.getCurrentOrgId(),
      missionId: currentId,
      ptyMngId,
    };

    // 进度条下钻的入参
    const progressParam = {
      missionProgressStatus,
      progressFlag,
      queryType: SERVE_CUSTS,
    };

    // 饼下钻图的入参
    const pieParam = {
      // 后端字母拼错了
      feedBackIdL1: feedbackIdL1,
      feedBackIdL2: feedbackIdL2,
      queryType: MOT_FEEDBACK_CUSTS,
    };

    // 客户总数下钻的入参
    const totalCustParam = {
      queryType: SERVE_CUSTS,
      // 客户总数一进来，默认一二级客户反馈都是空
      feedBackIdL1: feedbackIdL1,
      feedBackIdL2: feedbackIdL2,
    };

    // 服务维度下钻入参
    let scopeCustParam = {
      enterType,
      recordId,
    };

    // 任务维度的下钻入参
    if (!_.isEmpty(enterType)) {
      // 从客户总数下钻，有客户反馈筛选
      if (isEntryFromCustTotal) {
        scopeCustParam = {
          ...scopeCustParam,
          // 客户总数一进来，默认一二级客户反馈都是空
          feedBackIdL1: feedbackIdL1,
          feedBackIdL2: feedbackIdL2,
        };
      } else if (isEntryFromProgressDetail || isEntryFromResultStatisfy) {
        scopeCustParam = {
          ...scopeCustParam,
          missionProgressStatus,
          progressFlag,
        };
      }
      postBody = {
        ...postBody,
        ...scopeCustParam,
      };
      previewCustDetailByScope({
        ...postBody,
      }).then(this.setModalOpen);
      // 查询去重后的客户数量
      queryDistinctCustListDetailOfMission(postBody);
    } else {
      // 不是从维度信息下钻的
      if (isEntryFromProgressDetail) {
        postBody = {
          ...postBody,
          ...progressParam,
        };
      }

      if (isEntryFromPie) {
        postBody = {
          ...postBody,
          ...pieParam,
        };
      }

      if (isEntryFromCustTotal) {
        postBody = {
          ...postBody,
          ...totalCustParam,
        };
      }
      previewCustDetail({
        ...postBody,
      }).then(this.setModalOpen);
      // 查询去重后的客户数量
      queryDistinctCustomerCount(postBody);
    }

    this.setState({
      ...progressParam,
      ...pieParam,
      ...totalCustParam,
      ...scopeCustParam,
      isEntryFromProgressDetail,
      isEntryFromPie,
      isEntryFromCustTotal,
      isEntryFromResultStatisfy,
      canLaunchTask,
      feedbackIdL1,
      feedbackIdL2,
      // 所有一级二级反馈
      // 添加客户反馈，所有反馈
      currentFeedback,
    });
  }

  /**
   * 发起新任务
   */
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '发起新任务' } })
  handleLaunchTask() {
    const { clearCreateTaskData } = this.props;
    const {
      isEntryFromProgressDetail,
      isEntryFromPie,
      // 当前任务下查看客户的维度
      enterType,
    } = this.state;
    let currentEntryName = '';
    let currentEntryId = '';
    let currentRoute = '';

    // 服务经理维度发起任务优先
    // 发起任务有以下几个入口，客户总数，饼图，进度条，服务经理维度客户总数，已服务，已完成，已达标
    // 服务经理维度发起任务source复用了isEntryFromProgressDetail，但是source需要单独区分一下，
    // 所以优先判断enterType
    // enterType有值，代表是从服务经理维度发起的任务
    if (!_.isEmpty(enterType)) {
      currentEntryName = TASK_CUST_SCOPE_ENTRY;
      currentEntryId = 'RCT_FSP_CREATE_TASK_FROM_MANAGERVIEW_CUST_SCOPE';
      currentRoute = '/customerPool/createTaskFromCustScope';
    } else if (isEntryFromPie) {
      currentEntryName = PIE_ENTRY;
      currentEntryId = 'RCT_FSP_CREATE_TASK_FROM_MANAGERVIEW_CUSTFEEDBACK_PIE';
      currentRoute = '/customerPool/createTaskFromPie';
    } else if (isEntryFromProgressDetail) {
      currentEntryName = PROGRESS_ENTRY;
      currentEntryId = 'RCT_FSP_CREATE_TASK_FROM_MANAGERVIEW_CUSTFEEDBACK_PROGRESS';
      currentRoute = '/customerPool/createTaskFromProgress';
    }

    // 发起新的任务之前，先清除数据
    clearCreateTaskData(currentEntryName);
    this.openByAllSelect(currentRoute, currentEntryId, '自建任务');
  }

  // 发起任务
  @autobind
  openByAllSelect(url, id, title) {
    const {
      currentId,
      push,
      missionType,
      missionTypeDict,
      distinctCustomerCount,
      location: { query: { ptyMngId } },
    } = this.props;
    const {
      missionProgressStatus,
      progressFlag,
      isEntryFromProgressDetail,
      isEntryFromPie,
      feedbackIdL1,
      feedbackIdL2,
      enterType,
      recordId,
    } = this.state;
    const { descText } = _.find(missionTypeDict, item => item.key === missionType) || {};
    let missionTypeObject = {};
    // 只有自建任务才需要传给自建任务流程
    if (descText === TASK_TYPE_SELF) {
      missionTypeObject = {
        missionType,
      };
    }

    // 如果是来自进度条，则发起任务时，需要将类型传给后台
    let progressParam = {};
    let newProgressFlag = progressFlag;
    if (isEntryFromProgressDetail) {
      progressParam = {
        missionProgressStatus,
      };
      // 针对进度条发起的任务需要将Y和N标记替换成DONE和NOT_DONE标记，后台需要这么干
      if (newProgressFlag) {
        newProgressFlag = progressFlag === 'Y' ? 'DONE' : 'NOT_DONE';
      }
      progressParam = {
        ...progressParam,
        progressFlag: newProgressFlag,
        // 来自不同的入口，entrance和source不一样
        entrance: PROGRESS_ENTRY,
        source: PROGRESS_ENTRY,
      };
    }

    let pieParam = {};
    // 如果是来自客户反馈饼图
    if (isEntryFromPie) {
      pieParam = {
        feedBackIdL1: feedbackIdL1,
        feedBackIdL2: feedbackIdL2,
        // 来自不同的入口，entrance和source不一样
        entrance: PIE_ENTRY,
        source: PIE_ENTRY,
      };
    }

    let custScopeParam = {};
    // 如果是服务经理维度客户下钻，发起任务，包括已服务、已完成、已达标、客户总数，四个都能发起任务
    if (!_.isEmpty(enterType)) {
      custScopeParam = {
        feedBackIdL1: feedbackIdL1,
        feedBackIdL2: feedbackIdL2,
        // 复用进度条发起任务的参数
        ...progressParam,
        // 替换source和entrance
        // 来自不同的入口，entrance和source不一样
        entrance: TASK_CUST_SCOPE_ENTRY,
        source: TASK_CUST_SCOPE_ENTRY,
        enterType,
        recordId,
      };
    }

    const urlParam = {
      ptyMngId,
      orgId: this.getCurrentOrgId(),
      missionId: currentId,
      count: distinctCustomerCount,
      // 任务类型
      ...missionTypeObject,
      // 进度条入参
      ...progressParam,
      // 饼图入参
      ...pieParam,
      // 服务经理维度入参
      ...custScopeParam,
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
  scrollModalBodyToTop() {
    // 翻页之后，恢复当前页面表格的滚动，在小屏的情况下
    const custDetailContainer = document.querySelector('.custDetailContainer .ant-modal-body');
    if (custDetailContainer) {
      custDetailContainer.scrollTop = 0;
    }
  }

  // 空方法，用于日志上报
  @logable({ type: 'Click', payload: { name: '导出' } })
  handleDownloadClick() { }

  @autobind
  renderTotalCust() {
    const { mngrMissionDetailInfo = {} } = this.props;
    const { custNumbers = 0 } = mngrMissionDetailInfo;

    return (
      <div
        className={styles.custValue}
        onClick={() => this.handleCustTotal({
          isEntryFromCustTotal: true,
          canLaunchTask: false,
          currentFeedback: this.getCustFeedbackList(),
        })}
      >
        <div
          className={styles.totalNum}
        >
          {custNumbers}
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
      location: { query: { ptyMngId } },
      replace,
      countFlowStatus,
      countFlowFeedBack,
      exportExcel,
      missionProgressStatusDic,
      missionFeedbackData,
      missionFeedbackCount,
      serveManagerCount,
      push,
      custServedByPostnResult,
      currentId,
      missionReport,
      createMotReport,
      queryMOTServeAndFeedBackExcel,
      getCustManagerScope,
      custManagerScopeData,
    } = this.props;

    const {
      isShowCustDetailModal,
      canLaunchTask,
      isEntryFromProgressDetail,
      isEntryFromPie,
      isEntryFromCustTotal,
      currentFeedback,
      feedbackIdL1,
      destroyOnClose,
      missionProgressStatus,
      progressFlag,
      feedbackIdL2,
      isEntryFromResultStatisfy,
      enterType,
      recordId,
    } = this.state;

    const {
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

    const {
      // 已服务客户
      servedNums = 0,
    } = missionImplementationDetail || EMPTY_OBJECT;

    const { list = EMPTY_LIST } = custDetailResult || EMPTY_OBJECT;
    const isDisabled = _.isEmpty(list);
    const basicInfoData = [{
      id: 'id',
      key: '任务编号 :',
      value: currentId || '--',
    }, {
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
      key: '客户数 :',
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
            {`${missionName || '--'}: ${missionStatusName || '--'}`}
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
            {/**
             * close时destory弹框
             */}
            {
              !destroyOnClose ?
                <GroupModal
                  wrapperClass={`${styles.custDetailContainer} custDetailContainer`}
                  closable
                  visible={isShowCustDetailModal}
                  title={'客户明细'}
                  onCancelHandler={this.handleCloseModal}
                  footer={
                    <div className={styles.operationBtnSection}>
                      <Button
                        className={styles.cancel}
                        onClick={this.handleCloseModal}
                      >
                        取消
                      </Button>
                      {/**
                       * 暂时隐藏导出按钮,等后台性能恢复，再放开
                       */}
                      {
                        falseValue ? (
                          <Button className={styles.export}>
                            <a
                              onClick={this.handleDownloadClick}
                              href={`${request.prefix}/excel/custlist/exportExcel?orgId=${urlParams.orgId}&missionName=${urlParams.missionName}&missionId=${urlParams.missionId}&serviceTips=${urlParams.serviceTips}&servicePolicy=${urlParams.servicePolicy}`}
                            >导出</a>
                          </Button>
                        ) : null
                      }
                      {
                        canLaunchTask ? (
                          <Button
                            className={styles.launchTask}
                            type="default"
                            disabled={isDisabled}
                            onClick={this.handleLaunchTask}
                          >
                            发起新任务
                          </Button>
                        ) : null
                      }
                    </div>
                  }
                  modalContent={
                    <CustDetail
                      ref={ref => (this.custDetailRef = ref)}
                      getCustDetailData={this.handleCustDetail}
                      data={custDetailResult}
                      onClose={this.handleCloseModal}
                      hideCustDetailModal={this.hideCustDetailModal}
                      push={push}
                      custServedByPostnResult={custServedByPostnResult}
                      // 代表是否是从进度条点击的
                      isEntryFromProgressDetail={isEntryFromProgressDetail}
                      // 代表是否是从饼图过来的
                      isEntryFromPie={isEntryFromPie}
                      // scrollTop恢复
                      scrollModalBodyToTop={this.scrollModalBodyToTop}
                      // 当前一级二级反馈
                      currentFeedback={currentFeedback}
                      // 当前选中的一级反馈条件
                      feedbackIdL1={feedbackIdL1}
                      // 当前选中的二级级反馈条件
                      feedbackIdL2={feedbackIdL2}
                      // 代表是从客户总数过来的
                      isEntryFromCustTotal={isEntryFromCustTotal}
                      // 是否可以发起任务
                      canLaunchTask={canLaunchTask}
                      // 进度条下钻、已服务、微未服务、已完成、未完成、已达标、未达标下钻
                      missionProgressStatus={missionProgressStatus}
                      // Y或者N，代表已或者未
                      progressFlag={progressFlag}
                      // 是否显示客户反馈筛选，只有已服务客户总数大于0，才需要展示客户反馈
                      isShowFeedbackFilter={servedNums > 0}
                      // 结果达标进度条下钻标记
                      isEntryFromResultStatisfy={isEntryFromResultStatisfy}
                      // 服务经理维度entertype
                      enterType={enterType}
                      // recordId
                      recordId={recordId}
                    />
                  }
                  modalStyle={{
                    maxWidth: 1165,
                    minWidth: 700,
                  }}
                  modalWidth={'auto'}
                />
                : null
            }
          </div>
          <div className={styles.missionImplementationSection}>
            <MissionImplementation
              isFold={isFold}
              custFeedback={custFeedback}
              onPreviewCustDetail={this.handleMissionImplementation}
              missionImplementationProgress={missionImplementationDetail}
              custRange={custRange}
              empInfo={empInfo}
              location={location}
              replace={replace}
              countFlowStatus={countFlowStatus}
              countFlowFeedBack={countFlowFeedBack}
              exportExcel={exportExcel}
              missionProgressStatusDic={missionProgressStatusDic}
              ref={ref => (this.missionImplementationElem = ref)}
              currentId={currentId}
              urlParams={urlParams}
              missionReport={missionReport}
              createMotReport={createMotReport}
              queryMOTServeAndFeedBackExcel={queryMOTServeAndFeedBackExcel}
              custManagerScopeData={custManagerScopeData}
              getCustManagerScope={getCustManagerScope}
              // 当前一级二级反馈
              currentFeedback={this.getCustFeedbackList()}
            />
          </div>
          {
            // 按服务经理过滤器筛选时，不显示任务反馈
            _.isEmpty(ptyMngId) && <div className={styles.missionFeedbackSection}>
              <MissionFeedback
                missionFeedbackData={missionFeedbackData}
                isFold={isFold}
                missionFeedbackCount={missionFeedbackCount}
                serveManagerCount={serveManagerCount}
                templateId={templateId}
                ref={ref => (this.missionFeedbackElem = ref)}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}
