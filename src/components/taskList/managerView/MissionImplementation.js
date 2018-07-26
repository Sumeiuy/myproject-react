/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 17:12:08
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-06-07 16:30:51
 * 任务实施简报
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import Icon from '../../common/Icon';
import LabelInfo from '../common/LabelInfo';
import CustManagerDetailScope from './CustManagerDetailScope';
import TabsExtra from '../../customerPool/home/TabsExtra';
import ServiceResultLayout from '../common/ServiceResultLayout';
import { permission, emp } from '../../../helper';
import { ORG_LEVEL1, ORG_LEVEL2 } from '../../../config/orgTreeLevel';
import {
  EMP_MANAGER_SCOPE_ITEM,
  EMP_COMPANY_ITEM,
  EMP_DEPARTMENT_ITEM,
} from '../../../config/managerViewCustManagerScope';
import { judgeCurrentOrgLevel } from './helper';
import { request } from '../../../config';
import styles from './missionImplementation.less';
import emptyImg from './img/empty.png';
import loadingImg from './img/loading.png';
import logable from '../../../decorators/logable';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const EMPTY_CONTENT = '本机构无服务客户';
const MAIN_MAGEGER_ID = 'msm';

export default class MissionImplementation extends PureComponent {

  static propTypes = {
    // 任务实施进度
    missionImplementationProgress: PropTypes.object,
    // 客户反馈结果
    custFeedback: PropTypes.array,
    isFold: PropTypes.bool,
    // 预览客户明细
    onPreviewCustDetail: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    empInfo: PropTypes.object,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 获取任务实施进度
    countFlowStatus: PropTypes.func.isRequired,
    // 客户反馈饼图
    countFlowFeedBack: PropTypes.func.isRequired,
    exportExcel: PropTypes.func.isRequired,
    // current taskId
    currentId: PropTypes.string,
    missionReport: PropTypes.object.isRequired,
    createMotReport: PropTypes.func.isRequired,
    queryMOTServeAndFeedBackExcel: PropTypes.func.isRequired,
    urlParams: PropTypes.object.isRequired,
    // 服务经理维度任务数据
    custManagerScopeData: PropTypes.object.isRequired,
    getCustManagerScope: PropTypes.func.isRequired,
    // 当前一级二级反馈
    currentFeedback: PropTypes.object.isRequired,
  }

  static defaultProps = {
    missionImplementationProgress: EMPTY_OBJECT,
    custFeedback: EMPTY_LIST,
    isFold: false,
    custRange: EMPTY_LIST,
    empInfo: EMPTY_OBJECT,
    currentId: '',
    custManagerDetailScopeData: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    const { custRange } = props;
    const { level, currentScopeList } = judgeCurrentOrgLevel({ custRange });

    this.state = {
      expandAll: false,
      currentOrgId: '',
      createCustRange: [],
      isDown: true,
      // 当前组织机构树层级
      level,
      currentScopeList,
    };
    // 首页指标查询,总部-营销活动管理岗,分公司-营销活动管理岗,营业部-营销活动管理岗权限
    this.isAuthorize = permission.hasCustomerPoolPermission();
  }

  componentDidMount() {
    const {
      custRange,
      empInfo: { empPostnList = {} },
    } = this.props;

    // 登录用户orgId，默认在fsp中中取出来的当前用户岗位对应orgId，本地时取用户信息中的occDivnNum
    this.orgId = emp.getOrgId();

    this.originOrgId = this.orgId;

    // 根据岗位orgId生成对应的组织机构树
    this.handleCreateCustRange({
      custRange,
      posOrgId: this.orgId,
      empPostnList,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { currentId = '' } = this.props;
    const {
      currentId: nextCurrentId = '',
      custRange,
      empInfo: { empPostnList = EMPTY_OBJECT },
    } = nextProps;

    if (currentId !== nextCurrentId) {
      // 当任务切换的时候,清除组织机构树选择项
      this.orgId = this.originOrgId;
      const { level, currentScopeList } = judgeCurrentOrgLevel({ custRange, orgId: this.orgId });
      this.setState({
        // 恢复当前orgId
        currentOrgId: this.orgId,
        // orgLevel恢复
        level,
        currentScopeList,
      });
      // 根据岗位orgId生成对应的组织机构树
      this.handleCreateCustRange({
        custRange,
        posOrgId: this.orgId,
        empPostnList,
      });
    }
  }

  @autobind
  getSourceSrc(source) {
    return source && source.fileName && `${request.prefix}/excel/custlist/excelExport?orgId=${source.orgId}&empId=${emp.getId()}&fileName=${window.encodeURIComponent(source.fileName)}`;
  }

  @autobind
  getPayload() {
    const {
      urlParams,
    } = this.props;
    const orgId = this.getCurrentOrgId();
    const {
      missionName,
      missionId,
      serviceTips,
      servicePolicy,
    } = urlParams;

    return {
      missionName,
      missionId,
      serviceTips,
      servicePolicy,
      orgId,
    };
  }

  @autobind
  getCurrentOrgId() {
    return this.state.currentOrgId || emp.getOrgId();
  }

  /**
   * 获取服务经理维度任务统计
   */
  @autobind
  getCustManagerScope({ pageNum, pageSize, orgId, enterType }) {
    this.props.getCustManagerScope({
      orgId: orgId || this.getCurrentOrgId(),
      pageNum,
      pageSize,
      enterType,
    });
  }

  /**
   * 当前组织机构树变化，更新维度可选项
   * @param {*string} level 组织机构层级
   */
  @autobind
  getCurrentScopeList(level) {
    // 默认维度服务经理
    let currentScopeList = [
      EMP_MANAGER_SCOPE_ITEM,
    ];
    if (level === ORG_LEVEL1) {
      // 经总层级，维度展示三个可选项
      currentScopeList = [EMP_COMPANY_ITEM, EMP_DEPARTMENT_ITEM, ...currentScopeList];
    } else if (level === ORG_LEVEL2) {
      // 分公司层级，维度展示营业部和服务经理
      currentScopeList = [EMP_DEPARTMENT_ITEM, ...currentScopeList];
    }

    return currentScopeList;
  }

  /**
   * 机构树的change回调
   */
  @autobind
  collectCustRange(value) {
    const { countFlowStatus, countFlowFeedBack, getCustManagerScope } = this.props;
    const { level, orgId } = value;

    this.setState({
      // 当前层级
      level,
      currentScopeList: this.getCurrentScopeList(level),
    });
    countFlowStatus(value);
    countFlowFeedBack(value);
    getCustManagerScope(value);
    this.orgId = orgId;
  }

  /**
   * 创建客户范围组件的tree数据
   * @param {*} props 最新的props
   */
  @autobind
  handleCreateCustRange({
    custRange,
    posOrgId,
    empPostnList,
  }) {
    // 职责的普通用户，取值 '我的客户'
    if (!this.isAuthorize) {
      return;
    }

    // 只要不是我的客户，都展开组织机构树
    // 用户职位是经总
    if (posOrgId === (custRange[0] || {}).id) {
      this.setState({
        expandAll: true,
        createCustRange: custRange,
      });
      return;
    }
    // posOrgId 在机构树中所处的分公司位置
    const groupInCustRange = _.find(custRange, item => item.id === posOrgId);
    if (groupInCustRange) {
      this.setState({
        expandAll: true,
        createCustRange: [groupInCustRange],
      });
      return;
    }
    // posOrgId 在机构树的营业部位置
    let department;
    _.each(custRange, (obj) => {
      if (!_.isEmpty(obj.children)) {
        const targetValue = _.find(obj.children, o => o.id === posOrgId);
        if (targetValue) {
          department = [targetValue];
        }
      }
    });

    if (department) {
      this.setState({
        createCustRange: department,
      });
      return;
    }
    // 有权限，但是posOrgId不在empOrg（组织机构树）中，
    // 用posOrgId去empPostnList中匹配，找出对应岗位的信息显示出来
    const curJob = _.find(empPostnList, obj => obj.orgId === posOrgId);
    this.setState({
      createCustRange: [{
        id: curJob.orgId,
        name: curJob.orgName,
      }],
    });
  }

  @autobind
  handleExportExcel() {
    return this.props.exportExcel(this.getCurrentOrgId());
  }

  @autobind
  updateQueryState({ orgId }) {
    this.setState({
      currentOrgId: orgId,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '生成最新报告' } })
  createMissionReport() {
    const {
      createMotReport,
    } = this.props;
    const payload = this.getPayload();
    createMotReport(payload);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '正在生成最新报告' } })
  queryMOTServeAndFeedBackExcel() {
    const { queryMOTServeAndFeedBackExcel } = this.props;
    const payload = this.getPayload();
    queryMOTServeAndFeedBackExcel(payload);
  }

  @autobind
  handlePreview(params) {
    const { onPreviewCustDetail } = this.props;
    onPreviewCustDetail(params);
  }

  // 空方法，用于日志上报
  @logable({ type: 'Click', payload: { name: '下载' } })
  handleDownloadClick() { }

  @logable({ type: 'Click', payload: { name: '报告' } })
  handleDownload() { }

  @autobind
  renderTabsExtra() {
    const { replace, location } = this.props;
    const {
      expandAll,
      isDown,
      createCustRange,
      cycleSelect,
    } = this.state;

    // curOrgId   客户范围回填
    // 当url中由 orgId 则使用orgId
    // 有权限时默认取所在岗位的orgId
    // 无权限取 MAIN_MAGEGER_ID
    let curOrgId = MAIN_MAGEGER_ID;

    if (this.orgId) {
      curOrgId = this.orgId;
    } else if (!this.isAuthorize) {
      curOrgId = MAIN_MAGEGER_ID;
    }

    const extraProps = {
      custRange: createCustRange,
      replace,
      collectCustRange: this.collectCustRange,
      expandAll,
      location,
      orgId: curOrgId,
      exportOrgId: cycleSelect,
      isDown,
      iconType: 'juxing23',
      exportExcel: this.handleExportExcel,
      updateQueryState: this.updateQueryState,
    };
    return (<TabsExtra {...extraProps} />);
  }

  @autobind
  renderCreateFileInfo(currentMissionReport) {
    const { isCreatingMotReport, createTime } = currentMissionReport;
    if (isCreatingMotReport) {
      const text = '生成报告需要一些时间，请稍后点击此处刷新状态'; // 提示文本(来自需求)；
      return (
        <div>
          <span className={styles.line}>|</span>
          <Tooltip placement="bottomLeft" title={text}>
            <span className={styles.creatingBtn} onClick={this.queryMOTServeAndFeedBackExcel}>
              <img src={loadingImg} alt="刷新" />
              <span>正在生成最新报告</span>
            </span>
          </Tooltip>
        </div>
      );
    } else if (createTime) {
      return (
        <div className={styles.downLoading}>
          <span className={styles.line}>|</span>
          <a
            onClick={this.handleDownloadClick}
            href={this.getSourceSrc(currentMissionReport)}
          >
            <Icon type="xiazai" className={`icon ${styles.icon_mr}`} />
          </a>
          <a
            onClick={this.handleDownload}
            href={this.getSourceSrc(currentMissionReport)}
          >
            <span>{createTime}报告</span>
          </a>
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      missionImplementationProgress = EMPTY_OBJECT,
      isFold,
      custFeedback = EMPTY_LIST,
      missionReport,
      currentId,
      custManagerScopeData,
      custRange,
      onPreviewCustDetail,
      currentFeedback,
    } = this.props;
    const { level, currentScopeList } = this.state;
    const currentMissionReport = currentId ? missionReport[currentId] || {} : {};
    const {
      isCreatingMotReport,
    } = currentMissionReport;

    const notMissionCust = _.isEmpty(missionImplementationProgress) && _.isEmpty(custFeedback);
    const canCreateReport = _.isBoolean(isCreatingMotReport) ?
      notMissionCust || isCreatingMotReport :
      true;
    return (
      <div className={styles.missionImplementationSection}>
        <div className={styles.title}>
          <div className={styles.leftSection}>
            <LabelInfo value={'任务实施简报'} />
          </div>
          <div className={styles.rightSection}>
            <div className={styles.report}>
              <span
                className={
                  classNames({
                    [styles.noCreateBtn]: canCreateReport,
                    [styles.createBtn]: !canCreateReport,
                  })
                }
                onClick={canCreateReport ? null : this.createMissionReport}
              >
                <Icon type="wenben" className={`icon ${styles.icon_mr}`} />
                生成最新报告
              </span>
              {
                this.renderCreateFileInfo(currentMissionReport)
              }
            </div>
          </div>
        </div>
        <div className={styles.orgTreeSection}>
          {this.renderTabsExtra()}
        </div>
        {
          notMissionCust ?
            <div className={styles.emptyContent}>
              <img src={emptyImg} alt={EMPTY_CONTENT} />
              <div className={styles.tip}>{EMPTY_CONTENT}</div>
            </div> :
            <ServiceResultLayout
              missionImplementationProgress={missionImplementationProgress}
              onPreviewCustDetail={this.handlePreview}
              custFeedback={custFeedback}
            />
        }
        {
          !notMissionCust ?
            <div className={styles.custManagerDetailSection}>
              <CustManagerDetailScope
                detailData={custManagerScopeData}
                currentOrgLevel={level}
                isFold={isFold}
                getCustManagerScope={this.getCustManagerScope}
                currentScopeList={currentScopeList}
                // 当前任务id
                currentId={currentId}
                custRange={custRange}
                orgId={this.getCurrentOrgId()}
                onPreviewCustDetail={onPreviewCustDetail}
                currentFeedback={currentFeedback}
              />
            </div> : null
        }
      </div>
    );
  }
}
