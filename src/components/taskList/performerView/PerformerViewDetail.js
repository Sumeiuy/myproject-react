/*
 * @Description: 执行者视图右侧详情
 * @Author: WangJunjun
 * @Date: 2018-05-22 12:25:35
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-06-13 21:55:34
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import BasicInfo from './BasicInfo';
import TabsArea from './TabsArea';
import { fsp } from '../../../helper';
import styles from './performerViewDetail.less';

import {
  smallPageSize,
  mediumPageSize,
  largePageSize,
  extraLargePageSize,
} from '../../../routes/taskList/config';

// 当左侧列表或fsp中左侧菜单被折叠或者展开时，返回当前的服务实施列表的pageSize
// isFoldFspLeftMenu=true fsp的左侧菜单被折叠收起
// isFoldLeftList=true 执行者视图左侧列表被折叠收起
const getPageSize = (isFoldFspLeftMenu, isFoldLeftList) => {
  // 全部都折叠起来放12个
  if (isFoldFspLeftMenu && isFoldLeftList) {
    return extraLargePageSize;
  }
  // FSP左侧菜单折叠放9个
  if (isFoldFspLeftMenu) {
    return mediumPageSize;
  }
  // 任务列表折叠起来放10个
  if (isFoldLeftList) {
    return largePageSize;
  }
  // 其余的放6个
  return smallPageSize;
};

export default class PerformerViewDetail extends PureComponent {

  static propTypes = {
    basicInfo: PropTypes.object.isRequired,
    isFold: PropTypes.bool,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    parameter: PropTypes.object.isRequired,
    currentId: PropTypes.string.isRequired,
    changeParameter: PropTypes.func.isRequired,
    queryTargetCust: PropTypes.func.isRequired,
    getCustDetail: PropTypes.func.isRequired,
    targetCustList: PropTypes.object.isRequired,
    deleteFileResult: PropTypes.array.isRequired,
    currentMotServiceRecord: PropTypes.object.isRequired,
    answersList: PropTypes.object,
    getTempQuesAndAnswer: PropTypes.func.isRequired,
    isSubmitSurveySucceed: PropTypes.bool,
    saveAnswersByType: PropTypes.func.isRequired,
    // 左侧列表当前任务的状态码
    statusCode: PropTypes.string,
    eventId: PropTypes.string,
    taskTypeCode: PropTypes.string,
    // 自建任务的类型Code，与mot任务的eventId同理
    serviceTypeCode: PropTypes.string,
    // 涨乐财富通服务方式下的客户反馈列表以及查询方法
    queryCustFeedbackList4ZLFins: PropTypes.func.isRequired,
    custFeedbackList: PropTypes.array.isRequired,
    // 涨乐财富通服务方式下的审批人列表以及查询方法
    queryApprovalList: PropTypes.func.isRequired,
    zhangleApprovalList: PropTypes.array.isRequired,
    // 查询任务下的客户
    queryCustomer: PropTypes.func,
    // 搜索到的任务下客户列表
    customerList: PropTypes.array,
    // 投资建议文本撞墙检测
    testWallCollision: PropTypes.func.isRequired,
    // 投资建议文本撞墙检测是否有股票代码
    testWallCollisionStatus: PropTypes.bool.isRequired,
    performerViewCurrentTab: PropTypes.string.isRequired,
    changePerformerViewTab: PropTypes.func.isRequired,
    targetCustDetail: PropTypes.object.isRequired,
    serviceProgress: PropTypes.object.isRequired,
    custFeedBack: PropTypes.array.isRequired,
    custDetail: PropTypes.object.isRequired,
    queryExecutorFeedBack: PropTypes.func.isRequired,
    queryExecutorFlowStatus: PropTypes.func.isRequired,
    queryExecutorDetail: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isFold: true,
    answersList: {},
    isSubmitSurveySucceed: false,
    statusCode: '',
    eventId: '',
    taskTypeCode: '',
    serviceTypeCode: '',
    queryCustomer: _.noop,
    customerList: [],
  }

  componentDidMount() {
    const {
      queryTargetCust,
      currentId,
      isFold,
    } = this.props;
    const isFoldFspLeftMenu = fsp.isFSPLeftMenuFold();
    const newPageSize = getPageSize(isFoldFspLeftMenu, isFold);
    // 执行者视图服务实施客户列表中 状态筛选默认值 state='10' 未开始
    queryTargetCust({ missionId: currentId, state: '10', pageNum: 1, pageSize: newPageSize });
  }

  // 生成基本信息中的内容
  @autobind
  getBasicInfoData() {
    const { basicInfo = {}, currentId } = this.props;
    const {
      triggerTime,
      endTime,
      missionTarget,
    } = basicInfo;
    return [{
      id: 'id',
      key: '任务编号 :',
      value: `${currentId || '--'}`,
    }, {
      id: 'date',
      key: '任务有效期 :',
      value: `${triggerTime || '--'} ~ ${endTime || '--'}`,
    },
    {
      id: 'target',
      key: '任务目标 :',
      value: missionTarget || '--',
    }];
  }

  @autobind
  searchCustomer(value) {
    const { queryCustomer, changeParameter, parameter } = this.props;
    // pageSize传1000000，使能够查到足够的数据
    queryCustomer({
      keyWord: value,
    });
    // 保存搜索的关键字，方便在redux里面需要清空的时候，直接调用changeParameter，将关键字清空
    changeParameter({
      ...parameter,
      keyWord: value,
    });
  }

  /**
   * 添加服务记录成功后重新加载当前目标客户的详细信息
   */
  @autobind
  reloadTargetCustInfo(callback) {
    const { parameter: { targetCustId, targetMissionFlowId } } = this.props;
    this.requeryTargetCustDetail({
      custId: targetCustId,
      missionFlowId: targetMissionFlowId,
      callback,
    });
  }

  /**
   * 重新查询目标客户的详情信息
   */
  @autobind
  requeryTargetCustDetail({ custId, missionFlowId, callback }) {
    const {
      currentId,
      getCustDetail,
    } = this.props;
    getCustDetail({
      missionId: currentId,
      custId,
      missionFlowId,
      callback,
    });
  }

  render() {
    const {
      basicInfo = {},
      customerList,
    } = this.props;

    const {
      missionName,
      missionStatusName,
      hasSurvey,
      servicePolicy,
    } = basicInfo;
    // sticky-container 作为子元素悬停参照物
    return (
      <div className={`sticky-container ${styles.performerViewDetail}`}>
        <BasicInfo
          missionName={missionName}
          missionStatusName={missionStatusName}
          basicInfoData={this.getBasicInfoData()}
        />
        <TabsArea
          {...this.props}
          hasSurvey={hasSurvey}
          servicePolicy={servicePolicy}
          searchCustomer={this.searchCustomer}
          customerList={customerList}
          reloadTargetCustInfo={this.reloadTargetCustInfo}
        />
      </div>
    );
  }
}
