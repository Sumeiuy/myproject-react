/*
 * @Description: 客户的基本信息
 * @Author: WangJunjun
 * @Date: 2018-05-27 15:30:44
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-16 10:06:02
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import moment from 'moment';
import cx from 'classnames';

import Icon from '../../../common/Icon';
import { openFspTab } from '../../../../utils';
import ContactInfoPopover from '../../../common/contactInfoPopover/ContactInfoPopover';
import Mask from '../../../common/mask';
import { date } from '../../../../helper';
import { UPDATE } from '../../../../config/serviceRecord';
import logable from '../../../../decorators/logable';
import styles from './customerProfile.less';

import { riskLevelConfig, PER_CODE, ORG_CODE, CALLABLE_LIST, PHONE } from './config';
import { MOT_RETURN_VISIT_TASK_EVENT_ID } from '../../../../config/taskList/performView';

import iconDiamond from '../img/iconDiamond.png';
import iconWhiteGold from '../img/iconWhiteGold.png';
import iconGold from '../img/iconGold.png';
import iconSliver from '../img/iconSliver.png';
import iconMoney from '../img/iconMoney.png';
import iconNull from '../img/iconNull.png';

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

export default class CustomerProfile extends React.PureComponent {

  static propTypes = {
    targetCustDetail: PropTypes.object.isRequired,
    addServeRecord: PropTypes.func,
    motCustfeedBackDict: PropTypes.array,
    currentId: PropTypes.string.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    taskTypeCode: PropTypes.string,
    eventId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    addServeRecord: _.noop,
    motCustfeedBackDict: [],
    taskTypeCode: '',
  }

  static contextTypes = {
    push: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.endTime = '';
    this.startTime = '';
    this.state = { showMask: false };
  }

  // 判断当前的任务是否是 MOT 回访类型任务
  // TODO 目前开发状态下暂时默认为true
  @autobind
  isMOTReturnVistTask(eventId) {
    return MOT_RETURN_VISIT_TASK_EVENT_ID === eventId;
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '点击客户打开客户360视图',
    },
  })
  openFsp360TabAction(param) {
    const { targetCustDetail = {} } = this.props;
    const { custNature, custId, rowId, ptyId } = targetCustDetail;
    const type = (!custNature || custNature === PER_CODE) ? PER_CODE : ORG_CODE;
    const url = `/customerCenter/360/${type}/main?id=${custId}&rowId=${rowId}&ptyId=${ptyId}`;
    const pathname = '/customerCenter/fspcustomerDetail';
    openFspTab({
      routerAction: this.context.push,
      url,
      pathname,
      param,
      state: {
        url,
      },
    });
  }

  // 点击客户名称进入360视图
  @autobind
  handleCustNameClick() {
    const param = {
      id: 'FSP_360VIEW_M_TAB',
      title: '客户360视图-客户信息',
      forceRefresh: true,
      activeSubTab: [],
      // 服务记录搜索
      serviceRecordKeyword: '',
      // 服务渠道
      serviceRecordChannel: '',
    };
    this.openFsp360TabAction(param);
  }

  /**
   * 通话结束后要创建一条服务记录，并弹出服务记录框
   */
  @autobind
  handlePhoneEnd(data = {}) {
    // 点击挂电话隐藏蒙层
    this.setState({ showMask: false });
    // 没有成功发起通话
    if (!moment.isMoment(this.startTime)) {
      return;
    }
    this.endTime = moment();
    const {
      addServeRecord,
      motCustfeedBackDict,
      toggleServiceRecordModal,
      taskTypeCode,
    } = this.props;
    const [firstServiceType = {}] = motCustfeedBackDict;
    const { key: firstServiceTypeKey, children = [] } = firstServiceType;
    const [firstFeedback = {}] = children;
    const phoneDuration = date.calculateDuration(
      this.startTime.valueOf(),
      this.endTime.valueOf(),
    );
    const serviceContentDesc = `${this.startTime.format('HH:mm:ss')}给客户发起语音通话，时长${phoneDuration}。`;
    const { missionFlowId, custId, missionId, custName } = data.userData || {};
    let payload = {
      // 任务流水id
      missionFlowId,
      // 任务id
      missionId,
      // 经济客户号
      custId,
      // 服务方式
      serveWay: 'HTSC Phone',
      // 任务类型，1：MOT  2：自建
      taskType: `${parseInt(taskTypeCode, 10) + 1}`,
      // 服务状态
      flowStatus: '30',
      // 同serveType
      type: firstServiceTypeKey,
      // 服务类型，即任务类型
      serveType: firstServiceTypeKey,
      // 客户反馈一级
      serveCustFeedBack: firstFeedback.key,
      // 服务记录内容
      serveContentDesc: serviceContentDesc,
      // 服务时间
      serveTime: this.endTime.format('YYYY-MM-DD HH:mm'),
      // 反馈时间
      feedBackTime: moment().format('YYYY-MM-DD'),
    };
    // 客户反馈的二级
    if (firstFeedback.children) {
      payload = {
        ...payload,
        serveCustFeedBack2: firstFeedback.children[0].key,
      };
    }
    // 添加服务记录表单共用，把打电话自动生成的默认数据保存到prevRecordInfo
    const saveRecordData = () => {
      toggleServiceRecordModal({
        id: missionFlowId,
        name: custName,
        flag: false,
        caller: PHONE,
        autoGenerateRecordInfo: payload,
        todo: UPDATE,
      });
    };
    addServeRecord({
      postBody: payload,
      phoneCallback: saveRecordData,
      isSilentAdd: true,
      callId: this.callId,
    });
  }

  // 通话开始
  @autobind
  handlePhoneConnected(data) {
    this.startTime = moment();
    this.callId = data.uuid;
  }

  // 点击号码打电话时显示蒙层
  @autobind
  handlePhoneClick() {
    this.setState({ showMask: true });
  }

  // 点击号码打电话时显示蒙层时关闭蒙层
  @autobind
  handleMaskClick() {
    this.setState({ showMask: false });
  }

  /**
   * 联系方式渲染
   */
  @autobind
  renderContactInfo() {
    const { targetCustDetail = {}, currentId } = this.props;
    const {
      custNature, perCustomerContactInfo, orgCustomerContactInfoList,
      custName, missionStatusCode = '10', missionFlowId, custId,
    } = targetCustDetail;
    // 任务状态为未处理、处理中、已驳回时可打电话
    const canCall = _.includes(CALLABLE_LIST, missionStatusCode);
    // 联系方式为空判断
    const isEmpty = (
      custNature === PER_CODE &&
      (
        _.isEmpty(perCustomerContactInfo) ||
        (_.isEmpty(perCustomerContactInfo.homeTels)
          && _.isEmpty(perCustomerContactInfo.cellPhones)
          && _.isEmpty(perCustomerContactInfo.workTels)
          && _.isEmpty(perCustomerContactInfo.otherTels))
      )
    ) ||
      (custNature === ORG_CODE && _.isEmpty(orgCustomerContactInfoList));
    if (isEmpty) {
      return null;
    }
    const perContactInfo = _.pick(perCustomerContactInfo, ['cellPhones', 'homeTels', 'workTels', 'otherTels']);
    const userData = { missionFlowId, custId, missionId: currentId, custName };
    return (
      <ContactInfoPopover
        custType={custNature || ''}
        name={encodeURIComponent(custName)}
        personalContactInfo={perContactInfo}
        orgCustomerContactInfoList={orgCustomerContactInfoList}
        handlePhoneEnd={this.handlePhoneEnd}
        handlePhoneConnected={this.handlePhoneConnected}
        handlePhoneClick={this.handlePhoneClick}
        disablePhone={!canCall}
        userData={userData}
        placement="topRight"
      >
        <span className={styles.contact}>
          <Icon type="dianhua" className={styles.icon} />联系方式
        </span>
      </ContactInfoPopover>
    );
  }

  render() {
    const { showMask } = this.state;
    const { targetCustDetail = {}, eventId } = this.props;
    const {
      custName, isAllocate, isHighWorth, custId, genderValue, age,
        riskLevelCode, isSign, levelCode, custNature,
    } = targetCustDetail;
    // 风险等级
    const riskLevel = riskLevelConfig[riskLevelCode];
    // 客户等级
    const rankImg = rankImgSrcConfig[levelCode];

    // 当选择的任务类型为 MOT 任务回访的时候，客户的名字显示为黑色，并且不可点击
    const isMotReturnVisit = this.isMOTReturnVistTask(eventId);
    const custNameClickCls = cx({
      [styles.name]: true,
      [styles.clickable]: true,
    });
    const custNameUnClickCls = cx({
      [styles.name]: true,
      [styles.unclickable]: isMotReturnVisit,
    });

    return (
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.col}>
            <p className={styles.item}>
              {
                isMotReturnVisit ?
                (<span className={custNameUnClickCls}>{custName}</span>)
                :
                (
                  <span
                    className={custNameClickCls}
                    onClick={this.handleCustNameClick}
                  >
                    {custName}
                  </span>
                )
              }
              {isAllocate === '0' && '(未分配)'}
            </p>
            <p className={styles.item}>
              {isHighWorth && <span className={styles.highWorth} title="高净值">高</span>}
              {
                riskLevel
                && <span className={styles.riskLevel} title={riskLevel.title}>
                  {riskLevel.name}
                </span>
              }
              {isSign && <span className={styles.sign} title="签约客户">签</span>}
              {rankImg && <img className={styles.rank} title={rankImg.title} src={rankImg.src} alt="" />}
            </p>
          </div>
          <div className={styles.col}>
            <p className={`${styles.item} ${styles.textRight}`}>
              {
                custNature === 'per' ?
                  <span className={styles.basicInfo}>
                    {custId}&nbsp;|&nbsp;{age}岁&nbsp;|&nbsp;{genderValue}
                  </span>
                  : <span className={styles.basicInfo}>{custId}</span>
              }
            </p>
            <p className={`${styles.item} ${styles.textRight}`}>
              {this.renderContactInfo()}
            </p>
          </div>
        </div>
        <Mask visible={showMask} onClick={this.handleMaskClick} />
      </div>
    );
  }
}
