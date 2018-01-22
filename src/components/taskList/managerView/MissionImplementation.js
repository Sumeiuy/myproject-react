/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 17:12:08
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-22 15:37:22
 * 任务实施简报
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Row, Col } from 'antd';
import LabelInfo from '../common/LabelInfo';
import MissionProgress from './MissionProgress';
import CustFeedback from './CustFeedback';
import TabsExtra from '../../customerPool/home/TabsExtra';
import { env, power } from '../../../helper';
import styles from './missionImplementation.less';
import emptyImg from './img/empty.png';

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
  }

  static defaultProps = {
    missionImplementationProgress: EMPTY_OBJECT,
    custFeedback: EMPTY_LIST,
    isFold: false,
    custRange: EMPTY_LIST,
    empInfo: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      expandAll: false,
      cycleSelect: '',
      createCustRange: [],
      isDown: true,
    };
    // 首页指标查询,总部-营销活动管理岗,分公司-营销活动管理岗,营业部-营销活动管理岗权限
    this.isAuthorize = power.hasCustomerPoolPermission();
  }

  componentDidMount() {
    const {
      custRange,
      empInfo: { empInfo = {}, empPostnList = {} },
    } = this.props;
    // 获取登录用户empId和occDivnNum
    const { occDivnNum = '' } = empInfo;

    // 登录用户orgId，默认在fsp中中取出来的当前用户岗位对应orgId，本地时取用户信息中的occDivnNum
    if (env.isInFsp()) {
      this.orgId = window.forReactPosition.orgId;
    } else {
      this.orgId = occDivnNum;
    }

    // 根据岗位orgId生成对应的组织机构树
    this.handleCreateCustRange({
      custRange,
      posOrgId: this.orgId,
      empPostnList,
    });
  }

  @autobind
  handlePreview(title) {
    const { onPreviewCustDetail } = this.props;
    onPreviewCustDetail(title);
  }

  /**
   * 机构树的change回调
   */
  @autobind
  collectCustRange(value) {
    const { countFlowStatus, countFlowFeedBack } = this.props;
    countFlowStatus(value);
    countFlowFeedBack(value);
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
    // const myCustomer = {
    //   id: MAIN_MAGEGER_ID,
    //   name: '我的客户',
    // };
    // 无‘HTSC 首页指标查询’‘总部-营销活动管理岗’,
    // ‘分公司-营销活动管理岗’,‘营业部-营销活动管理岗’职责的普通用户，取值 '我的客户'
    if (!this.isAuthorize) {
      //   this.setState({
      //     createCustRange: [myCustomer],
      //   });
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
  renderTabsExtra() {
    const { replace, location } = this.props;
    const {
      expandAll,
      isDown,
      createCustRange,
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
      isDown,
      iconType: 'juxing23',
    };
    return (<TabsExtra {...extraProps} />);
  }

  render() {
    const {
      missionImplementationProgress = EMPTY_OBJECT,
      isFold,
      custFeedback = EMPTY_LIST,
    } = this.props;

    const colSpanValue = isFold ? 12 : 24;

    return (
      <div className={styles.missionImplementationSection}>
        <div className={styles.title}>
          <div className={styles.leftSection}>
            <LabelInfo value={'任务实施简报'} />
          </div>
          <div className={styles.rightSection}>
            <div>
              {this.renderTabsExtra()}
            </div>
          </div>
        </div>
        {
          _.isEmpty(missionImplementationProgress) && _.isEmpty(custFeedback) ?
            <div className={styles.emptyContent}>
              <img src={emptyImg} alt={EMPTY_CONTENT} />
              <div className={styles.tip}>{EMPTY_CONTENT}</div>
            </div> :
            <div className={styles.content}>
              <Row>
                <Col span={colSpanValue}>
                  <MissionProgress
                    missionImplementationProgress={missionImplementationProgress}
                    onPreviewCustDetail={this.handlePreview}
                  />
                </Col>
                <Col span={colSpanValue}>
                  <CustFeedback
                    custFeedback={custFeedback}
                  />
                </Col>
              </Row>
            </div>
        }
      </div>
    );
  }
}
