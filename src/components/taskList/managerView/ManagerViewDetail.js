/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:08:41
 * @Last Modified by: zhushengnan
 * @Last Modified time: 2017-12-26 14:25:27
 * 管理者视图详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import BasicInfo from '../common/BasicInfo';
import MissionDescription from './MissionDescription';
import MissionImplementation from './MissionImplementation';
import MissionFeedback from './MissionFeedback';
import CustDetail from './CustDetail';
import TargetCustomer from './TargetCustomer';
import Clickable from '../../common/Clickable';
import Button from '../../common/Button';
import GroupModal from '../../customerPool/groupManage/CustomerGroupUpdateModal';
import { helper, fspGlobal } from '../../../utils';
import { env, url as urlHelper } from '../../../helper';
import styles from './managerViewDetail.less';

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
    custFeedback: PropTypes.array.isRequired,
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
  }

  static defaultProps = {
    isFold: false,
    mngrMissionDetailInfo: EMPTY_OBJECT,
    currentId: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowCustDetailModal: false,
      title: '已反馈客户',
    };
  }

  /**
   * 预览客户明细
   */
  @autobind
  handlePreview(params = {}) {
    const { title, pageNum, pageSize } = params;
    const { previewCustDetail, currentId, mngrMissionDetailInfo } = this.props;
    const { orgName } = mngrMissionDetailInfo;

    previewCustDetail({
      pageNum: pageNum || INITIAL_PAGE_NUM,
      pageSize: pageSize || INITIAL_PAGE_SIZE,
      orgId: helper.getOrgId(),
      // orgId: 'ZZ001041',
      missionId: currentId,
      // missionId: '101111171108181',
    }).then(() => {
      this.setState({
        isShowCustDetailModal: true,
        title: title || `当前${orgName}有效客户总数`,
      });
    });
  }

  /**
   * 关闭弹出框
   */
  @autobind
  handleCloseModal() {
    this.setState({
      isShowCustDetailModal: false,
    });
  }

  @autobind
  handleExport() {
    console.log('导出');
  }

  /**
   * 发起新任务
   */
  @autobind
  handleLaunchTask() {
    const { clearCreateTaskData } = this.props;
    // 发起新的任务之前，先清除数据
    clearCreateTaskData();
    this.openByAllSelect('/customerPool/createTask', '发起任务', 'RCT_FSP_MANAGER_VIEW_CREATE_TASK');
  }

  // 发起任务
  @autobind
  openByAllSelect(url, id, title) {
    const { currentId, push, mngrMissionDetailInfo, missionType } = this.props;
    const urlParam = {
      orgId: helper.getOrgId(),
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

    if (env.isInFsp()) {
      const param = {
        closable: true,
        forceRefresh: true,
        isSpecialTab: true,
        id,
        title,
      };
      fspGlobal.openRctTab({ url: finalUrl, param });
    } else {
      push({
        pathname: url,
        query: {
          condition,
          ...urlParam,
        },
      });
    }
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
    } = this.props;

    const { isShowCustDetailModal, title } = this.state;

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
      custNumbers = 0,
      // 客户来源说明
      custSourceDesc,
      // 任务描述
      missionDesc,
      // 当前机构名
      orgName,
    } = mngrMissionDetailInfo;

    const { list = [] } = custDetailResult || EMPTY_OBJECT;
    const isDisabled = _.isEmpty(list);

    return (
      <div className={styles.managerViewDetail}>
        <div className={styles.titleSection}>
          <div className={styles.taskTitle}>
            {`编号${missionId || '--'} ${missionName || '--'}: ${missionStatusName || '--'}`}
          </div>
        </div>
        <div className={styles.basicInfoSection}>
          <BasicInfo
            // 有效期开始时间
            triggerTime={triggerTime}
            // 有效期结束时间
            endTime={endTime}
            // 任务目标
            missionTarget={missionTarget}
            // 服务策略
            servicePolicy={servicePolicy}
            // 父容器宽度变化,默认宽度窄
            isFold={isFold}
          />
          <TargetCustomer
            // 父容器宽度变化,默认宽度窄
            isFold={isFold}
            // 客户来源
            custSource={custSource}
            // 客户总数
            custTotal={custNumbers}
            // 客户来源说明
            custSourceDescription={custSourceDesc}
            // 预览明细客户
            onPreview={this.handlePreview}
            // 当前机构名
            orgName={orgName}
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
                  <Button className={styles.export} disabled={isDisabled}>导出</Button>
                </Clickable>
                <Clickable
                  onClick={this.handleLaunchTask}
                  eventName="/click/managerViewCustDetail/launchTask"
                >
                  <Button
                    className={styles.launchTask}
                    type="primary"
                    disabled={isDisabled}
                  >
                    发起新任务
                  </Button>
                </Clickable>
              </div>
            }
            modalContent={
              <CustDetail
                ref={ref => (this.custDetailRef = ref)}
                getCustDetailData={this.handlePreview}
                data={custDetailResult}
                title={title}
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
        {
          !_.isEmpty(missionDesc) ?
            <div className={styles.descriptionSection}>
              <MissionDescription missionDescription={missionDesc} />
            </div>
            : null
        }
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
          />
        </div>
        <div className={styles.missionFeedbackSection}>
          <MissionFeedback isFold={isFold} />
        </div>
      </div>
    );
  }
}
