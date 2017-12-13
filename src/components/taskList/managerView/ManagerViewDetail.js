/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:08:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-12 13:56:40
 * 管理者视图详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import classnames from 'classnames';
import BasicInfo from '../common/BasicInfo';
import MissionDescription from './MissionDescription';
import MissionImplementation from './MissionImplementation';
import MissionFeedback from './MissionFeedback';
import CustDetail from './CustDetail';
import Clickable from '../../common/Clickable';
import Button from '../../common/Button';
import GroupModal from '../../customerPool/groupManage/CustomerGroupUpdateModal';
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
    custDetailResult: PropTypes.array.isRequired,
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
    getFlowStatus: PropTypes.func.isRequired,
    // 任务基本信息
    mngrMissionDetailInfo: PropTypes.object.isRequired,
    // 发起新任务
    launchNewTask: PropTypes.func.isRequired,
    // 当前任务Id
    currentId: PropTypes.string,
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
    };
  }

  /**
   * 预览客户明细
   */
  @autobind
  handlePreview() {
    const { previewCustDetail } = this.props;
    const { isShowCustDetailModal } = this.state;
    previewCustDetail({
      curPageNum: INITIAL_PAGE_NUM,
      curPageSize: INITIAL_PAGE_SIZE,
    }).then(() => {
      this.setState({
        isShowCustDetailModal: !isShowCustDetailModal,
      });
    });
  }

  /**
   * 关闭弹出框
   */
  @autobind
  handleCloseModal() {
    const { isShowCustDetailModal } = this.state;
    this.setState({
      isShowCustDetailModal: !isShowCustDetailModal,
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
    const { launchNewTask } = this.props;
    launchNewTask();
  }

  render() {
    const {
      isFold,
      mngrMissionDetailInfo = EMPTY_OBJECT,
      previewCustDetail,
      custDetailResult,
      custFeedback,
      missionImplementationDetail,
      custRange,
      empInfo,
      location,
      replace,
      getFlowStatus,
    } = this.props;

    const { isShowCustDetailModal } = this.state;

    const {
      missionId,
      missionName,
      missionStatusName,
      triggerTime,
      endTime,
      missionTarget,
      servicePolicy,
      custSource = 'import',
      // 客户总数
      custNumbers = 0,
      // 客户来源说明
      custSourceDesc,
      // 任务描述
      // missionDesc,
    } = mngrMissionDetailInfo;

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
            // 客户来源
            custSource={custSource}
            // 客户总数
            custTotal={custNumbers}
            // 客户来源说明
            custSourceDescription={custSourceDesc}
            onPreview={this.handlePreview}
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
                <Clickable
                  onClick={this.handleLaunchTask}
                  eventName="/click/managerViewCustDetail/launchTask"
                >
                  <Button
                    className={styles.launchTask}
                    type="primary"
                  >
                    发起新任务
                  </Button>
                </Clickable>
              </div>
            }
            modalContent={
              <CustDetail
                ref={ref => (this.custDetailRef = ref)}
                getCustDetailData={previewCustDetail}
                data={custDetailResult}
              />
            }
            modalStyle={{
              maxWidth: 1080,
              minWidth: 700,
              width: 1080,
            }}
            modalWidth={1080}
            onOkHandler={this.handleUpdateGroup}
          />
        </div>
        <div className={styles.descriptionSection}>
          <MissionDescription missionDescription={''} />
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
            getFlowStatus={getFlowStatus}
          />
        </div>
        <div className={styles.missionFeedbackSection}>
          <MissionFeedback isFold={isFold} />
        </div>
      </div>
    );
  }
}
