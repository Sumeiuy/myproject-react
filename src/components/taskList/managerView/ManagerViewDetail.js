/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:08:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-05 09:11:03
 * 管理者视图详情
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
// import { Row, Col } from 'antd';
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

export default class ManagerViewDetail extends PureComponent {

  static propTypes = {
    // 视图是否处于折叠状态
    isFold: PropTypes.bool,
    // 基本信息
    basicInfo: PropTypes.object,
    previewCustDetail: PropTypes.func.isRequired,
    // 预览客户明细结果
    custDetailResult: PropTypes.array.isRequired,
  }

  static defaultProps = {
    isFold: false,
    basicInfo: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowCustDetailModal: false,
    };
  }

  @autobind
  handlePreview() {
    const { previewCustDetail } = this.props;
    const { isShowCustDetailModal } = this.state;
    previewCustDetail().then(() => {
      this.setState({
        isShowCustDetailModal: !isShowCustDetailModal,
      });
    });
  }

  @autobind
  handleCloseModal() {
    const { isShowCustDetailModal } = this.state;
    this.setState({
      isShowCustDetailModal: !isShowCustDetailModal,
    });
  }

  render() {
    const {
      isFold,
      basicInfo = EMPTY_OBJECT,
      previewCustDetail,
      custDetailResult,
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
      custTotal,
      custSourceDescription,
    } = basicInfo;

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
            custTotal={custTotal}
            // 客户来源说明
            custSourceDescription={custSourceDescription}
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
                  // 加入节流函数
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
                <Clickable
                  onClick={this.handleExport}
                  eventName="/click/managerViewCustDetail/export"
                >
                  <Button className={styles.export}>导出</Button>
                </Clickable>
                <Clickable
                  onClick={this.handleCloseModal}
                  eventName="/click/managerViewCustDetail/cancel"
                >
                  <Button className={styles.cancel}>取消</Button>
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
            onOkHandler={this.handleUpdateGroup}
          />
        </div>
        <div className={styles.descriptionSection}>
          <MissionDescription missionDescription={''} />
        </div>
        <div className={styles.missionImplementationSection}>
          <MissionImplementation />
        </div>
        <div>
          <MissionFeedback isFold={isFold} />
        </div>
      </div>
    );
  }
}
