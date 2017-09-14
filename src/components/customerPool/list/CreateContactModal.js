/**
 * @file list/CreateContactModal.js
 *  电话联系组件
 * @author xuxiaoqin
 */

import React, { PropTypes, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import _ from 'lodash';
// import classnames from 'classnames';
import { Modal, Button, Table } from 'antd';
import Icon from '../../common/Icon';
import Collapse from './ModalCollapse';

import styles from './createContactModal.less';
import Phone from '../../../../static/images/phone.png';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const CONTACT_MAP = {
  cellPhones: '手机',
  workTels: '单位电话',
  homeTels: '家庭电话',
  otherTels: '其他电话',
};

export default class CreateContactModal extends PureComponent {
  static propTypes = {
    custContactData: PropTypes.object.isRequired,
    serviceRecordData: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    custType: PropTypes.string,
    createServiceRecord: PropTypes.func.isRequired,
    currentCustId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    isFirstLoad: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    data: {},
    custType: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      isOpen: true,
      anchorAction: EMPTY_LIST,
      isPanel1Open: true,
      isPanel2Open: false,
      isPanel3Open: false,
      isPanel4Open: false,
      isPanel5Open: false,
      isFirstLoad: props.isFirstLoad,
    };
  }

  /**
   * 获取dom
   * @param {*} id id
   */
  getDOM(id) {
    return ReactDOM.findDOMNode(document.getElementById(id)); // eslint-disable-line
  }

  @autobind
  resetLeftGuide({ isCollapseAll }) {
    // 收起来之后，panel高度一样
    const panelDOM1 = ReactDOM.findDOMNode(document.getElementById('panelHeader1')); // eslint-disable-line
    const panelDOM2 = ReactDOM.findDOMNode(document.getElementById('panelHeader2')); // eslint-disable-line
    const margin = 10;
    let panel1Height;
    let panel2Height;
    if (panelDOM1) {
      panel1Height = panelDOM1.clientHeight;
    }
    if (panelDOM2) {
      panel2Height = panelDOM2.clientHeight;
    }
    const { originPanelHeight } = this.state;
    // setTimeout(() => {
    if (isCollapseAll) {
      // 全部收起
      this.setState({
        // 1代表激活，0代表收起
        anchorAction: [
          {
            top: 15,
            status: 0,
          },
          {
            top: (originPanelHeight * 1) + (margin * 1) + (originPanelHeight / 2),
            status: 0,
          },
          {
            top: (originPanelHeight * 2) + (margin * 2) + (originPanelHeight / 2),
            status: 0,
          },
          {
            top: (originPanelHeight * 3) + (margin * 3) + (originPanelHeight / 2),
            status: 0,
          },
          {
            top: (originPanelHeight * 4) + (margin * 4) + (originPanelHeight / 2),
            status: 0,
          },
        ],
        // 重置panel打开状态
        isPanel1Open: false,
        isPanel2Open: false,
        isPanel3Open: false,
        isPanel4Open: false,
        isPanel5Open: false,
      });
    } else {
      // 收起其余的，保留第一个展开
      this.setState({
        // 1代表激活，0代表收起
        anchorAction: [
          {
            top: 15,
            status: 1,
          },
          {
            top: (panel1Height * 1) + (margin * 1) + (panel2Height / 2),
            status: 0,
          },
          {
            top: panel2Height + panel1Height + (margin * 2) + (panel2Height / 2),
            status: 0,
          },
          {
            top: (panel2Height * 2) + panel1Height + (margin * 3) + (panel2Height / 2),
            status: 0,
          },
          {
            top: (panel2Height * 3) + panel1Height + (margin * 4) + (panel2Height / 2),
            status: 0,
          },
        ],
        originPanelHeight: panel2Height,
        firstPanelHeight: panel1Height,
        isFirstLoad: false,
      });
    }
    // }, 250);
  }

  /**
 * 阻止事件冒泡
 * @param {*} e 事件
 */
  preventEventBubble(e = window.event) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }

  /**
   * 处理collapse change事件
   * @param {*} currentKey 当前key
   */
  @autobind
  handleCollapseChange(currentKey) {
    // 只得到当前激活的panel key
    const { originPanelHeight } = this.state;
    const margin = 10;
    let panel1Height;
    let panel2Height;
    let panel3Height;
    let panel4Height;

    let isPanel1Open = false;
    let isPanel2Open = false;
    let isPanel3Open = false;
    let isPanel4Open = false;
    let isPanel5Open = false;

    if (_.isEmpty(currentKey)) {
      // 当前所有panel全部收起
      this.resetLeftGuide({ isCollapseAll: true });
    } else {
      // 当前激活的包含一个panel,
      // 设置其余四个panel
      setTimeout(() => {
        isPanel1Open = _.includes(currentKey, '1');
        isPanel2Open = _.includes(currentKey, '2');
        isPanel3Open = _.includes(currentKey, '3');
        isPanel4Open = _.includes(currentKey, '4');
        isPanel5Open = _.includes(currentKey, '5');

        panel1Height = isPanel1Open ? this.getDOM('panelHeader1').clientHeight : originPanelHeight;
        panel2Height = isPanel2Open ? this.getDOM('panelHeader2').clientHeight : originPanelHeight;
        panel3Height = isPanel3Open ? this.getDOM('panelHeader3').clientHeight : originPanelHeight;
        panel4Height = isPanel4Open ? this.getDOM('panelHeader4').clientHeight : originPanelHeight;

        this.setState({
          anchorAction: [
            {
              top: 15,
              status: isPanel1Open ? 1 : 0,
            },
            {
              top: panel1Height +
              (margin * 1) +
              (originPanelHeight / 2),
              status: isPanel2Open ? 1 : 0,
            },
            {
              top: panel2Height +
              panel1Height +
              (margin * 2) +
              (originPanelHeight / 2),
              status: isPanel3Open ? 1 : 0,
            },
            {
              top: panel3Height +
              panel2Height +
              panel1Height +
              (margin * 3) +
              (originPanelHeight / 2),
              status: isPanel4Open ? 1 : 0,
            },
            {
              top: panel4Height +
              panel3Height +
              panel2Height +
              panel1Height +
              (margin * 4) +
              (originPanelHeight / 2),
              status: isPanel5Open ? 1 : 0,
            },
          ],
          isPanel1Open,
          isPanel2Open,
          isPanel3Open,
          isPanel4Open,
          isPanel5Open,
        });
      }, 250);
    }
  }

  @autobind
  handleCancel() {
    const { onClose } = this.props;
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
        <div className="contactSection">
          {record}
        </div>,
    },
    {
      dataIndex: 'phone',
      title: '电话',
      width: '20%',
      render: record =>
        // 当前行记录
        <div className="phoneSection">
          {record}
        </div>,
    },
    {
      dataIndex: 'work',
      title: '单位',
      width: '20%',
      render: record =>
        // 当前行记录
        <div className="workSection">
          {record}
        </div>,
    },
    {
      dataIndex: 'home',
      title: '住宅',
      width: '20%',
      render: record =>
        <div className="homeSection">
          {record}
        </div>,
    },
    {
      dataIndex: 'personType',
      title: '人员类型',
      width: '20%',
      render: record =>
        <div className="personTypeSection">
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
  formatPhoneNumber(phone, type) {
    let count = 0;
    let newPhone = '';
    const temp = phone.toString();
    const len = temp.length;
    const flag = type === 'phone' ? 4 : 8;

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
  handleServiceRecordClick() {
    const { onClose, createServiceRecord, currentCustId } = this.props;
    // 先关闭联系方式对话框
    this.setState({
      visible: false,
    });
    // 打开创建服务记录对话框
    createServiceRecord(currentCustId);
    // 回调，关闭父组件state状态
    onClose();
  }

  render() {
    const {
      visible,
      anchorAction,
      isPanel1Open,
      isPanel2Open,
      isPanel3Open,
      isPanel4Open,
      isPanel5Open,
      isFirstLoad,
    } = this.state;

    const {
      custContactData = EMPTY_OBJECT,
      serviceRecordData = EMPTY_LIST,
      custType,
      currentCustId,
    } = this.props;

    if (!currentCustId || !visible) {
      return null;
    }

    const {
      perCustomerContactInfo = EMPTY_OBJECT,
      orgCustomerContactInfoList = EMPTY_LIST,
    } = custContactData;

    let otherContactInfo = EMPTY_LIST;
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
              this.formatPhoneNumber(mainContactAllInfo.cellPhones[0].contactValue, 'phone'),
            telInfo: _.omitBy(_.pick(mainContactAllInfo, ['workTels', 'homeTels', 'otherTels']), _.isEmpty),
          };
          if (!_.isEmpty(_.pick(mainContactAllInfo, ['workTels', 'homeTels', 'otherTels', 'cellPhones']))) {
            isOrgMainContactHasTel = true;
          }
        }
        // 其他联系人信息
        const otherContact = _.filter(orgCustomerContactInfoList,
          (item, index) => index !== mainContactIndex) || EMPTY_LIST;
        otherContactInfo = !_.isEmpty(otherContact) && _.map(otherContact, item => ({
          contact: item.name || '--',
          phone: _.isEmpty(item.cellPhones) ? '--' :
            this.formatPhoneNumber(item.cellPhones[0].contactValue, 'phone'),
          work: _.isEmpty(item.workTels) ? '--' :
            this.formatPhoneNumber(item.workTels[0].contactValue, 'work'),
          home: _.isEmpty(item.homeTels) ? '--' :
            this.formatPhoneNumber(item.homeTels[0].contactValue, 'home'),
          personType: item.custRela || '--',
        }));
      } else if (!_.isEmpty(perCustomerContactInfo)) {
        const allTelInfo = _.pick(perCustomerContactInfo, ['cellPhones', 'workTels', 'homeTels', 'otherTels']);
        isPersonHasContact = !_.isEmpty(_.omitBy(allTelInfo, _.isEmpty));
        if (isPersonHasContact) {
          const cellPhones = allTelInfo.cellPhones || EMPTY_LIST;
          let mainTelInfo = {
            type: 'none',
            value: '',
          };
          if (_.findIndex(cellPhones, item => item.mainFlag) > -1) {
            // 存在主要电话
            mainTelInfo = {
              type: 'cellPhones',
              value: this.formatPhoneNumber(cellPhones && cellPhones[0].contactValue, 'phone'),
            };
          }
          // 个人联系方式中，不存在主要电话
          // 过滤联系方式为空的情况
          const otherTelInfo = _.omitBy(_.omit(allTelInfo, ['cellPhones']), _.isEmpty);

          // 筛选contactValue存在的其他电话
          personalContactInfo = {
            mainTelInfo,
            otherTelInfo,
          };
        }
      }
    }

    const columns = this.constructTableColumns();
    const newDataSource = this.constructTableDatas(otherContactInfo);

    return (
      <Modal
        wrapClassName={styles.contactModal}
        visible={visible}
        title={'联系客户'}
        onOk={this.handleOk}
        maskClosable={false}
        width={700}
        onCancel={this.handleCancel}
        closable={false}
        footer={[
          <Button key="close" size="large" onClick={this.handleCancel}>关闭</Button>,
        ]}
      >
        {
          custType === 'org' ?
            <div className={styles.title}>
              主要联系人：{mainContactInfo.nameInfo.name || '--'}（{mainContactInfo.nameInfo.custRela || '--'}）
            </div>
            : null
        }
        {
          (custType === 'per' && isPersonHasContact) ?
            <div className={styles.title}>
              主要联系电话（{personalContactInfo.mainTelInfo.type === 'none' ? '--' :
                  CONTACT_MAP[personalContactInfo.mainTelInfo.type]}）：
            </div> : null
        }
        <div className={styles.number}>
          {
            (isOrgMainContactHasTel || isPersonHasContact) ?
              <div className={styles.mainContact}>
                <img src={Phone} alt={'电话联系'} />
                <span>{custType === 'per' ?
                  personalContactInfo.mainTelInfo.value :
                  mainContactInfo.cellInfo}
                </span>
              </div> :
              <div className={styles.noneInfo}>
               暂无客户联系电话，请与客户沟通尽快完善信息
              </div>
          }
          <div className={styles.rightSection}>
            <Button key="addServiceRecord" onClick={this.handleServiceRecordClick}>添加服务记录</Button>
          </div>
        </div>
        {
          /* 个人其他联系方式和主联系人其他联系方式 */
          custType === 'per' ? this.constructOtherContact(personalContactInfo.otherTelInfo)
          : this.constructOtherContact(mainContactInfo.telInfo)
        }
        { /* 机构客户其他联系人与联系方式 */}
        {
          custType === 'org' ?
            <div className={styles.orgCustOtherTelsSection}>
              <Table
                className={styles.telTable}
                columns={columns}
                dataSource={newDataSource}
                pagination={false}
              />
            </div> : null
        }
        { /* 提示信息 */}
        <div className={styles.tipSection}>
          <Icon className={styles.tipIcon} type="dengpao" />
          <span>温馨提醒：联系过客户后请及时创建服务记录</span>
        </div>
        <div className={styles.split} />
        <div className={styles.serviceTitle}>最近服务记录：</div>
        {/* 折叠面板 */}
        <Collapse
          data={serviceRecordData}
          anchorAction={anchorAction}
          onCollapseChange={this.handleCollapseChange}
          isPanel1Open={isPanel1Open}
          isPanel2Open={isPanel2Open}
          isPanel3Open={isPanel3Open}
          isPanel4Open={isPanel4Open}
          isPanel5Open={isPanel5Open}
          setDefaultLeftGuide={this.resetLeftGuide}
          isFirstLoad={isFirstLoad}
        />
      </Modal>
    );
  }
}
