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
import { check, date } from '../../../helper';
import logable from '../../../decorators/logable';
import ContactInfoPopover from './ContactInfoPopover';
import Phone from '../../common/phone';

import styles from './createContactModal.less';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const CONTACT_MAP = {
  cellPhones: '手机',
  workTels: '单位电话',
  homeTels: '家庭电话',
  otherTels: '其他电话',
};

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

  /**
  * 构造表格的列数据
  */
  @autobind
  constructTableColumns() {
    const columns = [{
      dataIndex: 'contact',
      title: '其他联系人',
      width: '20%',
      render: record =>
        // 当前行记录
        <div className="recordSection" title={record}>
          {record}
        </div>,
    },
    {
      dataIndex: 'phone',
      title: '手机',
      width: '20%',
      render: record =>
        // 当前行记录
        <div className="recordSection" title={record}>
          {record}
        </div>,
    },
    {
      dataIndex: 'work',
      title: '单位电话',
      width: '20%',
      render: record =>
        // 当前行记录
        <div className="recordSection" title={record}>
          {record}
        </div>,
    },
    {
      dataIndex: 'home',
      title: '住宅电话',
      width: '20%',
      render: record =>
        <div className="recordSection" title={record}>
          {record}
        </div>,
    },
    {
      dataIndex: 'personType',
      title: '人员类型',
      width: '20%',
      render: record =>
        <div className="recordSection" title={record}>
          {record}
        </div>,
    }];

    return columns;
  }

  /**
  * 构造数据源
  */
  constructTableDatas(dataSource) {
    const newDataSource = [];
    if (dataSource.length > 0) {
      dataSource.forEach((currentValue, index) =>
        newDataSource.push(_.merge(currentValue, { key: index })),
      );
    }

    return newDataSource;
  }

  @autobind
  constructOtherContact(contact) {
    return _.map(contact, (item, index) =>
      <div className={styles.otherTelsSection} key={index}>
        <div className={styles.leftSection}>
          <span className={styles.telName}>{CONTACT_MAP[index]}：</span>
        </div>
        <div className={styles.rightSection}>
          {
            _.map(item, (unit, flag) =>
              <div className={styles.telSection} key={flag}>
                <span>{this.formatPhoneNumber(unit.contactValue)}</span>
              </div>,
            )
          }
        </div>
      </div>,
    );
  }

  /**
   * 格式化手机号 15667567889 变成 156-6756-7889形式
   * 格式化座机号 02588888888 变成 025-88888888形式
   * @param {*} phone 手机号
   */
  formatPhoneNumber(phone) {
    let count = 0;
    let newPhone = '';
    const temp = phone.toString();
    const len = temp.length;
    let flag = 4;
    const isCellPhone = check.isCellPhone(phone);
    if (!isCellPhone) {
      // 不是手机号
      if (phone.indexOf('-') === -1) {
        // 但是后台没有处理成025-213413421形式
        flag = 8;
      }
    }

    for (let i = len - 1; i >= 0; i--) {
      if (count % flag === 0 && count !== 0) {
        newPhone = `${temp.charAt(i)}-${newPhone}`;
      } else {
        newPhone = `${temp.charAt(i)}${newPhone}`;
      }
      count++;
    }

    return newPhone;
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
    if (_.isEmpty(this.phoneStartTime)) {
      return;
    }
    this.phoneEndTime = moment();
    const {
      currentCustId,
      currentCustName,
      toggleServiceRecordModal,
      addServeRecord,
      motSelfBuiltFeedbackList,
    } = this.props;
    const list = transformCustFeecbackData(motSelfBuiltFeedbackList);
    const [firstServiceType = {}] = list;
    const { key: firstServiceTypeKey, children = [] } = firstServiceType;
    const [firstFeedback = {}] = children;
    const {
      key: firstFeedbackKey,
      children: [secondFeedback],
    } = firstFeedback;
    const { key: secondFeedbackKey } = secondFeedback;
    const phoneDuration = date.calculateDuration(
      this.phoneStartTime.valueOf(),
      this.phoneEndTime.valueOf(),
    );
    const serviceContentDesc = `${date.generateDate(this.phoneStartTime)}给客户发起语音通话，时长${phoneDuration}`;
    const payload = {
      custId: currentCustId,
      serveWay: 'HTSC Phone',
      taskType: '2',
      type: firstServiceTypeKey,
      serveType: firstServiceTypeKey,
      serveCustFeedBack: firstFeedbackKey,
      serveCustFeedBack2: secondFeedbackKey,
      serveContentDesc: serviceContentDesc,
      serveTime: this.phoneEndTime.format('YYYY-MM-DD HH:mm'),
      feedBackTime: moment().format('YYYY-MM-DD'),
      noHints: true,
    };
    addServeRecord(payload).then(() => {
      toggleServiceRecordModal({
        custId: currentCustId,
        custName: currentCustName,
        flag: true,
        caller: PHONE,
        prevRecordInfo: payload,
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
            && personalContactInfo.mainTelInfo.type !== 'none') &&
          '主要联系电话：'
        }
        {
          (!_.isEmpty(mainContactInfo.cellInfo) || personalContactInfo.mainTelInfo.type !== 'none') &&
          <Phone
            onConnected={this.handlePhoneConnected}
            onEnd={this.handlePhoneEnd}
            number={custType === 'per' ?
              personalContactInfo.mainTelInfo.value :
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
              this.formatPhoneNumber(mainContactAllInfo.cellPhones[0].contactValue),
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
        const allTelInfo = _.pick(perCustomerContactInfo, ['cellPhones', 'workTels', 'homeTels', 'otherTels']);
        isPersonHasContact = !_.isEmpty(_.omitBy(allTelInfo, _.isEmpty));
        if (isPersonHasContact) {
          const cellPhones = allTelInfo.cellPhones || EMPTY_LIST;
          let mainTelInfo = {
            type: 'none',
            value: '',
          };
          if (_.find(cellPhones, item => item.mainFlag)) {
            // 存在主要电话
            mainTelInfo = {
              type: 'cellPhones',
              value: this.formatPhoneNumber(cellPhones && cellPhones[0].contactValue),
            };
          }

          // 过滤个人其他联系方式为空的情况
          let otherTelInfo = _.omitBy(allTelInfo, _.isEmpty);

          const otherCellInfo = _.filter(cellPhones, item => !item.mainFlag) || EMPTY_LIST;
          if (!_.isEmpty(otherCellInfo)) {
            // 手机号不止一个
            otherTelInfo = _.merge({
              cellPhones: otherCellInfo,
            }, otherTelInfo);
          }

          // 筛选contactValue存在的其他电话
          personalContactInfo = {
            mainTelInfo,
            otherTelInfo,
          };
        }
      }
    }

    // const columns = this.constructTableColumns();
    // const newDataSource = this.constructTableDatas(otherContactInfo);
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
              />
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
