import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Affix } from 'antd';
import { autobind } from 'core-decorators';

import ConnectCustomer from '../common/connectCustomer/ConnectCustomer';
import Tooltip from '../common/Tooltip';
import { dva, url as urlHelper, emp } from '../../helper';
import { openRctTab } from '../../utils';
import styles from './customerBasicInfo.less';
import logable from '../../decorators/logable';

// 客户等级
import iconDiamond from '../taskList/performerView/img/iconDiamond.png';
import iconWhiteGold from '../taskList/performerView/img/iconWhiteGold.png';
import iconGold from '../taskList/performerView/img/iconGold.png';
import iconSliver from '../taskList/performerView/img/iconSliver.png';
import iconMoney from '../taskList/performerView/img/iconMoney.png';
import iconNull from '../taskList/performerView/img/iconNull.png';

// 财富通会员等级
import iconU1 from '../taskList/performerView/img/iconU1.png';
import iconU2 from '../taskList/performerView/img/iconU2.png';
import iconU3 from '../taskList/performerView/img/iconU3.png';

// 个人对应的code码
export const PER_CODE = 'per';
// 一般机构对应的code码
export const ORG_CODE = 'org';

const EMPTY_OBJECT = {};

// 客户等级的图片源
const rankImgSrcConfig = {
  // 钻石
  805010: {
    src: iconDiamond,
    title: '钻石卡',
  },
  // 白金
  805015: {
    src: iconWhiteGold,
    title: '白金卡',
  },
  // 金卡
  805020: {
    src: iconGold,
    title: '金卡',
  },
  // 银卡
  805025: {
    src: iconSliver,
    title: '银卡',
  },
  // 理财
  805030: {
    src: iconMoney,
    title: '理财卡',
  },
  // 空
  805040: {
    src: iconNull,
    title: '空',
  },
};

// 风险等级配置
const riskLevelConfig = {
  704010: {
    name: '激',
    title: '激进型',
  },
  704040: {
    name: '低',
    title: '保守型（最低类别）',
  },
  704030: {
    name: '保',
    title: '保守型',
  },
  704020: {
    name: '稳',
    title: '稳健型',
  },
  704025: {
    name: '谨',
    title: '谨慎型',
  },
  704015: {
    name: '积',
    title: '积极型',
  },
};

// 财富通会员等级配置
const vipImgSrcConfig = {
  1: {
    src: iconU1,
    title: 'U1',
  },
  2: {
    src: iconU2,
    title: 'U2',
  },
  3: {
    src: iconU3,
    title: 'U3',
  },
};

export default class CustomerBasicInfo extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    customerBasicInfo: PropTypes.object,
    addServeRecord: PropTypes.func.isRequired,
    motSelfBuiltFeedbackList: PropTypes.array,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    // 添加打电话记录
    addCallRecord: PropTypes.func.isRequired,
    currentCommonServiceRecord: PropTypes.object.isRequired,
  }

   static defaultProps = {
    customerBasicInfo: {},
    motSelfBuiltFeedbackList: [],
  }

  getAccountOpenDate() {
    const { customerBasicInfo } = this.props;
    if(customerBasicInfo && customerBasicInfo.accountOpenDate) {
      if(customerBasicInfo.accountOpenDateYear <= 0) {
        return '一年内新开户';
      } else {
        return `开户${customerBasicInfo.accountOpenDateYear}年`;
      }
    } else {
      return null;
    }
  }

  // 添加标签
  @autobind
  @logable({ type: 'Click', payload: { name: '添加标签' } })
  handleAddTagClick() {
    const { customerBasicInfo } = this.props;
    dva.dispatch({
      type: 'customerLabel/addSignLabelCust',
      payload: {
        currentPytMng: { ptyMngId: emp.getId() }, // 服务经理id
        currentSignLabelCustId: customerBasicInfo.custId, // 当前客户id
        mainPosition: true, // 是否为主服务经理
			},
    });
  }

  // 添加服务记录
  @autobind
  @logable({ type: 'Click', payload: { name: '添加服务记录' } })
  handleAddServiceClick() {
    const { toggleServiceRecordModal, customerBasicInfo } = this.props;
    toggleServiceRecordModal({
      custId: customerBasicInfo.custId, // 客户id
      custName: customerBasicInfo.name, // 客户名称
      flag: true,
    });
  }

  // 待处理任务跳转到任务管理页面 //没有任务时是否还要跳转
  @autobind
  @logable({ type: 'Click', payload: { name: '跳转到任务列表' } })
  hanldeNavToTaskListClick() {
    const { push, customerBasicInfo } = this.props;
    if (customerBasicInfo.motCount <= 0) {
      return;
    }
    const pathname = '/taskCenter/taskList';
    const query = {
      custId: customerBasicInfo.custId,
      custName: customerBasicInfo.name,
      missionViewType: 'executor',
      from: 'cust360',
    };
    const url = `${pathname}?${urlHelper.stringify(query)}`;
    const param = {
      id: 'FSP_MOT_SELFBUILT_TASK',
      title: '任务管理',
      forceRefresh: true,
      closable: true,
      isSpecialTab: true
    };
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname,
      query,
    });
  }

  transformData(basicInfo) {
    if (basicInfo) {
      const result = {
        ...basicInfo,
        riskLevel: riskLevelConfig[basicInfo.riskLvlCode],
        rankImg: rankImgSrcConfig[basicInfo.levelCode],
        isSign: basicInfo.contactFlag,
        signMode: basicInfo.tgFeeMode,
        isPrivate: basicInfo.isPrivateCustomer,
        taskNum: basicInfo.motCount,
        vipImg: vipImgSrcConfig[basicInfo.memberRanking],
      };
      return result;
    }
    return EMPTY_OBJECT;
  }

  render() {
    const {
      customerBasicInfo,
      addServeRecord,
      motSelfBuiltFeedbackList,
      toggleServiceRecordModal,
      addCallRecord,
      currentCommonServiceRecord,
    } = this.props;

    const renderCustomerBasicInfo = this.transformData(customerBasicInfo);

    const connectCustomerProps = {
      targetCustDetail: customerBasicInfo,
      addServeRecord,
      motSelfBuiltFeedbackList,
      toggleServiceRecordModal,
      addCallRecord,
      currentCommonServiceRecord,
    };

    return (
      <div className={styles.container}>
        <Affix offsetTop={0}>
          <div className={styles.content}>
            <div className={styles.frontInfo}>
              <span className={styles.name}>{renderCustomerBasicInfo.name}</span>
              <div className={styles.iconGroup}>
                {
                  renderCustomerBasicInfo.isHighWorth &&
                  <span className={styles.highWorth} title="客户类型：高净值">高</span>
                }
                {
                  renderCustomerBasicInfo.riskLevel &&
                  <span className={styles.riskLevel} title={`风险等级：${renderCustomerBasicInfo.riskLevel.title}`}>
                    {renderCustomerBasicInfo.riskLevel.name}
                  </span>
                }
                {
                  renderCustomerBasicInfo.isSign &&
                  <span
                    className={styles.sign}
                    title={`投顾签约：${renderCustomerBasicInfo.signMode}`}>签</span>
                }
                {
                  renderCustomerBasicInfo.isPrivate &&
                  <span className={styles.private} title="私密客户">私</span>
                }
                {
                  renderCustomerBasicInfo.rankImg &&
                  <img
                    className={styles.rank}
                    title={`客户等级：${renderCustomerBasicInfo.rankImg.title}`}
                    src={renderCustomerBasicInfo.rankImg.src} alt="" />
                }
                {
                  renderCustomerBasicInfo.vipImg &&
                  <img
                    className={styles.vip}
                    title={`财富通会员等级：${renderCustomerBasicInfo.vipImg.title}`}
                    src={renderCustomerBasicInfo.vipImg.src} alt="" />
                }
              </div>
            </div>
            <div className={styles.endInfo}>
              <div className={styles.basicInfo}>
                <span>{renderCustomerBasicInfo.custId && `${renderCustomerBasicInfo.custId} | `}</span>
                {
                  renderCustomerBasicInfo.custNature === 'per' ? (
                    <span>
                      <span>{renderCustomerBasicInfo.genderValue && `${renderCustomerBasicInfo.genderValue} | `}</span>
                      <span>{renderCustomerBasicInfo.age && `${renderCustomerBasicInfo.age}岁 | `}</span>
                    </span>
                  ) : null

                }
                <span>
                  <Tooltip title={`激活日期：${renderCustomerBasicInfo.accountOpenDate}`}>
                    {this.getAccountOpenDate()}
                  </Tooltip>
                </span>
              </div>
              {
                renderCustomerBasicInfo.isMainEmp ?
                  <div className={styles.actionGroup}>
                    <span className={styles.connectCust}>
                      <ConnectCustomer {...connectCustomerProps}>
                        <i className="iconfont icon-dianhua1" /><span className={styles.text}>联系客户</span>
                      </ConnectCustomer>
                    </span>
                    <span className={styles.addTag} onClick={this.handleAddTagClick}>
                      <i className="iconfont icon-kehubiaoqian" /><span className={styles.text}>添加标签</span>
                    </span>
                    <span className={styles.addServiceLog} onClick={this.handleAddServiceClick}>
                      <i className="iconfont icon-daichuli1" /><span className={styles.text}>添加服务记录</span>
                    </span>
                    <span className={styles.navToTask} onClick={this.hanldeNavToTaskListClick}>
                      <i className="iconfont icon-daichuli1" />
                      <span className={styles.text}>{`待处理任务（${renderCustomerBasicInfo.taskNum}）`}</span>
                    </span>
                  </div> : null
              }
            </div>
          </div>
        </Affix>
      </div>
    );
  }
}
