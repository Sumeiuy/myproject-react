/**
 * @file list/CreateContactModal.js
 *  电话联系组件
 * @author xuxiaoqin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import { Modal, Button } from 'antd';
import Icon from '../../common/Icon';
import Collapse from './CreateCollapse';
import { date } from '../../../helper';
import logable from '../../../decorators/logable';
import ContactInfoPopover from '../../common/contactInfoPopover/ContactInfoPopover';
import Phone from '../../common/phone';

import styles from './createContactModal.less';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const PHONE = 'phone';

/**
 * 将数组对象中的id和name转成对应的key和value
 * @param {*} arr 原数组
 * eg: [{ id: 1, name: '11', childList: [] }] 转成 [{ key: 1, value: '11', children: [] }]
 */
function transformCustFeecbackData(arr = []) {
  return arr.map((item) => {
    const obj = {
      key: String(item.id),
      value: item.name || item.parentClassName,
    };
    if (item.feedbackList && item.feedbackList.length) {
      obj.children = transformCustFeecbackData(item.feedbackList);
    }
    if (item.childList && item.childList.length) {
      obj.children = transformCustFeecbackData(item.childList);
    }
    return obj;
  });
}

export default class CreateContactModal extends PureComponent {
  static propTypes = {
    custContactData: PropTypes.object.isRequired,
    serviceRecordData: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    custType: PropTypes.string,
    createServiceRecord: PropTypes.func.isRequired,
    currentCustId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    executeTypes: PropTypes.array.isRequired, // 执行方式字典
    serveWay: PropTypes.array.isRequired, // 服务渠道字典
    handleCloseClick: PropTypes.func.isRequired,
    handleAddServiceRecord: PropTypes.func.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    currentCustName: PropTypes.string.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
    // 打电话结束弹出创建任务窗口
    toggleServiceRecordModal: PropTypes.func,
    addServeRecord: PropTypes.func.isRequired,
    motSelfBuiltFeedbackList: PropTypes.array.isRequired,
  };

  static defaultProps = {
    data: {},
    custType: '',
    filesList: [],
    toggleServiceRecordModal: _.noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
    this.phoneStartTime = '';
    this.phoneEndTime = '';
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭' } })
  handleCancel() {
    const { onClose, handleCloseClick } = this.props;
    // 手动发送日志
    handleCloseClick();
    onClose();
    this.setState({ visible: false });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '添加服务记录' } })
  handleServiceRecordClick() {
    const {
      onClose,
      createServiceRecord,
      currentCustName,
      currentCustId,
      handleAddServiceRecord,
    } = this.props;
    // 手动上传日志
    handleAddServiceRecord();
    // 先关闭联系方式对话框
    this.setState({
      visible: false,
    });
    // 打开创建服务记录对话框
    createServiceRecord({ custName: currentCustName, custId: currentCustId, flag: true });
    // 回调，关闭父组件state状态
    onClose();
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '最近服务记录展开/折叠' } })
  handleCollapseClick() {
    this.props.handleCollapseClick();
  }

  /**
   * 通话结束后要创建一条服务记录，并弹出服务记录框
   */
  @autobind
  handlePhoneEnd() {
    // 没有成功发起通话
    if (!moment.isMoment(this.phoneStartTime)) {
      return;
    }
    this.phoneEndTime = moment();
    const {
      currentCustId,
      currentCustName,
      toggleServiceRecordModal,
      addServeRecord,
      motSelfBuiltFeedbackList,
      onClose,
    } = this.props;
    const list = transformCustFeecbackData(motSelfBuiltFeedbackList);
    const [firstServiceType = {}] = list;
    const { key: firstServiceTypeKey, children = [] } = firstServiceType;
    const [firstFeedback = {}] = children;
    const phoneDuration = date.calculateDuration(
      this.phoneStartTime.valueOf(),
      this.phoneEndTime.valueOf(),
    );
    const serviceContentDesc = `${this.phoneStartTime.format('HH时mm分ss秒')}给客户发起语音通话，时长${phoneDuration}。`;
    let payload = {
      // 经济客户号
      custId: currentCustId,
      // 服务方式
      serveWay: 'HTSC Phone',
      // 任务类型，1：MOT  2：自建
      taskType: '2',
      // 同serveType
      type: firstServiceTypeKey,
      // 服务类型
      serveType: firstServiceTypeKey,
      // 客户反馈一级
      serveCustFeedBack: firstFeedback.key,
      // 服务记录内容
      serveContentDesc: serviceContentDesc,
      // 服务时间
      serveTime: this.phoneEndTime.format('YYYY-MM-DD HH:mm'),
      // 反馈时间
      feedBackTime: moment().format('YYYY-MM-DD'),
      // 添加成功后需要显示message提示
      noHints: true,
    };
    // 客户反馈的二级
    if (firstFeedback.children) {
      payload = {
        ...payload,
        serveCustFeedBack2: firstFeedback.children[0].key,
      };
    }
    addServeRecord(payload).then(() => {
      // 回调，关闭电话联系方式弹窗
      onClose();
      // 显示添加服务记录弹窗
      toggleServiceRecordModal({
        id: currentCustId,
        name: currentCustName,
        flag: true,
        caller: PHONE,
        autoGenerateRecordInfo: payload,
      });
    });
  }

  // 通话开始
  @autobind
  handlePhoneConnected() {
    this.phoneStartTime = moment();
  }

  /**
   * 生成头像icon右侧的主联系人信息或主要联系电话
   *
   */
  createMainContact({
    isPersonHasContact,
    isOrgMainContactHasTel,
    mainContactInfo,
    personalContactInfo,
  }) {
    const { custType } = this.props;
    if (!isPersonHasContact && !isOrgMainContactHasTel) {
      return <p>客户未预留主要联系方式，请尽快完善信息</p>;
    }
    return (
      <div className={styles.mainContact}>
        {
          (custType === 'org' && !_.isEmpty(mainContactInfo.nameInfo)) &&
          `主要联系人：${mainContactInfo.nameInfo.name || '--'}（${mainContactInfo.nameInfo.custRela || '--'}）`
        }
        {
          (custType === 'per' && isPersonHasContact
            && personalContactInfo.mainTelInfo) &&
          '主要联系电话：'
        }
        {
          (!_.isEmpty(mainContactInfo.cellInfo) || !_.isEmpty(personalContactInfo.mainTelInfo)) &&
          <Phone
            onConnected={this.handlePhoneConnected}
            onEnd={this.handlePhoneEnd}
            number={custType === 'per' ?
              personalContactInfo.mainTelInfo :
              mainContactInfo.cellInfo}
            custType={custType}
            disable={false}
          />
        }
      </div>
    );
  }

  render() {
    const {
      visible,
    } = this.state;
    const {
      custContactData = EMPTY_OBJECT,
      serviceRecordData = EMPTY_LIST,
      custType,
      currentCustId,
      executeTypes,
      serveWay,
      getCeFileList,
      filesList,
    } = this.props;
    if (!currentCustId || !visible) {
      return null;
    }

    const {
      perCustomerContactInfo = EMPTY_OBJECT,
      orgCustomerContactInfoList = EMPTY_LIST,
      custBaseInfo = EMPTY_OBJECT,
    } = custContactData;

    const { custName } = custBaseInfo;
    // let otherContactInfo = EMPTY_LIST;
    let mainContactInfo = {
      nameInfo: {},
      cellInfo: '',
      telInfo: {},
    };
    let personalContactInfo = EMPTY_OBJECT;
    let isPersonHasContact = false;
    let isOrgMainContactHasTel = false;

    if (!_.isEmpty(custContactData)) {
      if (custType === 'org' && !_.isEmpty(orgCustomerContactInfoList)) {
        const mainContactIndex = _.findIndex(orgCustomerContactInfoList, item => item.mainFlag);
        let mainContactNameInfo;
        let mainContactAllInfo;
        if (mainContactIndex > -1) {
          // 机构客户中存在主要联系人
          // 找出主要联系人姓名和职位和具体电话信息
          mainContactAllInfo = _.pick(orgCustomerContactInfoList[mainContactIndex],
            ['name', 'custRela', 'cellPhones', 'workTels', 'homeTels', 'otherTels']);
          // 主联系人的姓名、职位
          mainContactNameInfo = _.pick(mainContactAllInfo, ['name', 'custRela']);
          // 主联系人的手机，住宅，单位，其他电话信息
          mainContactInfo = {
            nameInfo: mainContactNameInfo,
            cellInfo: _.isEmpty(mainContactAllInfo.cellPhones) ? '' :
              mainContactAllInfo.cellPhones[0].contactValue,
            telInfo: _.omitBy(_.pick(mainContactAllInfo, ['workTels', 'homeTels', 'otherTels']), _.isEmpty),
          };
          if (!_.isEmpty(_.pick(mainContactAllInfo, ['workTels', 'homeTels', 'otherTels', 'cellPhones']))) {
            isOrgMainContactHasTel = true;
          }
          const otherCellInfo = _.filter(mainContactAllInfo.cellPhones,
            item => !item.mainFlag) || EMPTY_LIST;
          if (!_.isEmpty(otherCellInfo)) {
            // 手机号不止一个
            mainContactInfo = _.merge({
              telInfo: {
                cellPhones: otherCellInfo,
              },
            }, mainContactInfo);
          }
        }
      } else if (!_.isEmpty(perCustomerContactInfo)) {
        // 选出4中联系方式中不为空的联系方式
        const allTelInfo = _.omit(_.pick(perCustomerContactInfo, ['cellPhones', 'workTels', 'homeTels', 'otherTels']), _.isEmpty);
        // 将所有联系方式用一个一维数组来存放
        const phones = _.flatten(Object.values(allTelInfo)) || EMPTY_LIST;
        // 筛选出联系方式对象中contactValue不为空的，判断是否有联系方式
        isPersonHasContact = !_.isEmpty(_.filter(phones, item => item.contactValue));
        if (isPersonHasContact) {
          let mainTelInfo = '';
          // 找到主要联系方式
          const mainContact = _.find(phones, item => item.mainFlag) || EMPTY_LIST;
          mainTelInfo = mainContact && mainContact.contactValue;
          // 筛选contactValue存在的其他电话
          personalContactInfo = {
            mainTelInfo,
            otherTelInfo: allTelInfo,
          };
        }
      }
    }
    console.log('personalContactInfo.otherTelInfo, orgCustomerContactInfoList', personalContactInfo.otherTelInfo, orgCustomerContactInfoList);
    return (
      <Modal
        wrapClassName={styles.contactModal}
        visible={visible}
        title={'联系客户'}
        maskClosable={false}
        width={892}
        onCancel={this.handleCancel}
        closable={false}
        footer={[
          (<Button key="close" size="large" onClick={this.handleCancel}>关闭</Button>),
        ]}
      >
        <div className={styles.headBox}>
          <div className={styles.left}>
            <Icon type="touxiang" className={styles.headshot} />
            <div className={styles.headshotRight}>
              <p className={styles.customerName}>{custName}</p>
              {this.createMainContact({
                isPersonHasContact,
                isOrgMainContactHasTel,
                mainContactInfo,
                personalContactInfo,
              })}
            </div>
          </div>
          <div className={styles.right}>
            {
              (!isPersonHasContact && !isOrgMainContactHasTel) ? null :
              <ContactInfoPopover
                custType={custType}
                personalContactInfo={personalContactInfo.otherTelInfo}
                orgCustomerContactInfoList={orgCustomerContactInfoList}
                handlePhoneEnd={this.handlePhoneEnd}
                handlePhoneConnected={this.handlePhoneConnected}
                disablePhone={false}
              >
                <div className={styles.moreLinkman}>
                  <Icon type="lianxifangshi" className={styles.phoneIcon} />
                  <span className={styles.phoneText}>更多联系人</span>
                </div>
              </ContactInfoPopover>
            }
          </div>
        </div>
        <div className={styles.serviceTitle}>最近服务记录</div>
        {/* 折叠面板 */}
        <Collapse
          data={serviceRecordData}
          executeTypes={executeTypes}
          serveWay={serveWay}
          handleCollapseClick={this.handleCollapseClick}
          getCeFileList={getCeFileList}
          filesList={filesList}
        />
      </Modal>
    );
  }
}
