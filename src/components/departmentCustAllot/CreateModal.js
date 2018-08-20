/*
 * @Description: 分公司客户划转 home 页面
 * @Author: XuWenKang
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-07-23 14:59:44
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message, Modal, Upload, Radio, Popconfirm, AutoComplete as AntdAutoComplete } from 'antd';
import _ from 'lodash';

import logable, { logPV, logCommon } from '../../decorators/logable';
import InfoTitle from '../common/InfoTitle';
import InfoForm from '../common/infoForm';
import CommonModal from '../common/biz/CommonModal';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
import Icon from '../../components/common/Icon';
import AutoComplete from '../../components/common/similarAutoComplete';
import { request } from '../../config';
import { emp } from '../../helper';
import config from './config';
import CustAllotXLS from './custAllot.xls';
import styles from './createModal.less';

const RadioGroup = Radio.Group;
const Option = AntdAutoComplete.Option;
// 表头
const {
  titleList: { cust: custTitleList, manage: manageTitleList },
  ruleTypeArray,
  allotType,
  clearDataArray,
  operateType,
  limit: { allCount: LIMIT_ALL_COUNT },
  errorMessage: { allCount: ERROR_MESSAGE_ALL_COUNT },
} = config;
// 登陆人的组织 ID
const empOrgId = emp.getOrgId();
// const empOrgId = 'ZZ001041051';
// 登陆人的职位 ID
const empPstnId = emp.getPstnId();
// 客户
const KEY_CUSTNAME = 'custName';
const KEY_STATUS = 'status';
// 原服务经理
const KEY_OLDEMPNAME = 'oldEmpName';
// 是否入岗投顾
const KEY_ISTOUGU = 'touGu';
// 开发经理
const KEY_DMNAME = 'dmName';
// 服务经理名称
const KEY_EMPNAME = 'empName';
// 服务经理-是否是投顾
const KEY_TGFLAG = 'tgFlag';
// 用以区分点击的是客户或者是服务经理
const CUST = 'cust';
const MANAGE = 'manage';

export default class CreateModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    custRangeList: PropTypes.array.isRequired,
    ruleType: PropTypes.string.isRequired,
    handleRuleTypePropsChange: PropTypes.func.isRequired,
    queryAppList: PropTypes.func.isRequired,
    // 获取按钮数据和下一步审批人
    selfBtnGroup: PropTypes.object.isRequired,
    queryButtonList: PropTypes.func.isRequired,
    // 获取客户数据
    custData: PropTypes.object.isRequired,
    queryCustList: PropTypes.func.isRequired,
    // 已添加客户
    addedCustData: PropTypes.object.isRequired,
    queryAddedCustList: PropTypes.func.isRequired,
    // 服务经理数据
    manageData: PropTypes.object.isRequired,
    queryManageList: PropTypes.func.isRequired,
    // 已添加服务经理
    addedManageData: PropTypes.object.isRequired,
    queryAddedManageList: PropTypes.func.isRequired,
    // 提交保存
    saveChange: PropTypes.func.isRequired,
    // 弹窗的key
    modalKey: PropTypes.string.isRequired,
    custModalKey: PropTypes.string.isRequired,
    manageModalKey: PropTypes.string.isRequired,
    // 打开弹窗
    showModal: PropTypes.func.isRequired,
    // 关闭弹窗
    closeModal: PropTypes.func.isRequired,
    // 弹窗状态
    visible: PropTypes.bool.isRequired,
    updateList: PropTypes.func.isRequired,
    updateData: PropTypes.object.isRequired,
    clearData: PropTypes.func.isRequired,
    sendRequest: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 已有条数
      alreadyCount: 0,
      // 是否是初始划转方式
      isDefaultType: true,
      // 上传后的返回值
      attachment: '',
      // 导入的弹窗
      importVisible: false,
      // 下一步审批人列表
      nextApproverList: [],
      // 审批人弹窗
      nextApproverModal: false,
      // 单个客户
      client: {},
      // 单个服务经理
      manager: {},
      // 搜索的客户数据
      searchCustList: [],
      // 搜索的服务经理数据
      searchManageList: [],
    };
  }

  componentDidMount() {
    // 获取下一步骤按钮列表
    this.props.queryButtonList({
      flowId: '',
      operate: 2,
      type: allotType,
    });
  }

  // 生成客户表格标题列表
  @autobind
  getColumnsCustTitle() {
    const { dict: { accountStatusList = [] } } = this.props;
    const titleList = [...custTitleList];
    // 客户
    const custNameColumn = _.find(titleList, o => o.key === KEY_CUSTNAME);
    custNameColumn.render = (text, record) => (
      <div>{text} ({record.custId})</div>
    );
    // 状态
    const statusColumn = _.find(titleList, o => o.key === KEY_STATUS);
    statusColumn.render = (text) => {
      const statusItem = _.filter(accountStatusList, o => o.key === text);
      return (<div>{statusItem.length ? statusItem[0].value : ''}</div>);
    };
    // 原服务经理
    const oldEmpNameColumn = _.find(titleList, o => o.key === KEY_OLDEMPNAME);
    oldEmpNameColumn.render = (text, record) => (
      <div>
        {
          text ? `${text} (${record.oldEmpId})` : null
        }
      </div>
    );
    // 是否是投顾
    const isTouguColumn = _.find(titleList, o => o.key === KEY_ISTOUGU);
    isTouguColumn.render = (text, record) => {
      const isTouGu = text ? '是' : '否';
      return (<div>
        {
          record.oldEmpName ?
            isTouGu
          :
            null
        }
      </div>);
    };
    // 介绍人
    const dmNameColumn = _.find(titleList, o => o.key === KEY_DMNAME);
    dmNameColumn.render = (text, record) => (
      <div>
        {
          text ?
            `${text} (${record.dmId})`
          :
            null
        }
      </div>
    );
    // 添加操作列
    titleList.push({
      dataIndex: 'operate',
      key: 'operate',
      title: '操作',
      render: (text, record) => this.renderPopconfirm(CUST, record),
    });
    return titleList;
  }

  // 生成服务经理表格标题列表
  @autobind
  getColumnsManageTitle() {
    const titleList = [...manageTitleList];
    // 服务经理
    const empNameColumn = _.find(titleList, o => o.key === KEY_EMPNAME);
    empNameColumn.render = (text, record) => (
      <div>
        {
          text ? `${text} (${record.empId})` : null
        }
      </div>
    );
    // 是否是投顾
    const isTouguColumn = _.find(titleList, o => o.key === KEY_TGFLAG);
    isTouguColumn.render = text => ((
      <div>{text ? '是' : '否'}</div>
    ));
    titleList.push({
      dataIndex: 'operate',
      key: 'operate',
      title: '操作',
      render: (text, record) => this.renderPopconfirm(MANAGE, record),
    });
    return titleList;
  }

  // 导入数据
  @autobind
  @logPV({ pathname: '/modal/departmentCustAllotImportData', title: '营业部客户分配导入数据' })
  handleImportData() {
    this.setState({
      importVisible: true,
    });
  }

  // 处理更新数据后请求最新数据
  @autobind
  handleUpdateDataAndQueryList(payload, attachment) {
    const { updateList } = this.props;
    // 执行添加方法
    updateList({
      ...payload,
      attachment,
      operateType: operateType[0],  // add
      type: allotType,
    }).then(() => {
      const { updateData: { appId }, queryAddedCustList } = this.props;
      this.setState({
        attachment,
      });
      // 添加成功后，请求最新数据
      const queryAddedCustListPayload = {
        id: appId,
        positionId: empPstnId,
        orgId: empOrgId,
        pageNum: 1,
        pageSize: 5,
        type: allotType,
      };
      // 更新总条数
      queryAddedCustList(queryAddedCustListPayload).then(this.updateTotalNum());
    });
  }

  // 更新已添加的客户条数
  @autobind
  updateTotalNum() {
    const { addedCustData: { page } } = this.props;
    this.setState({
      alreadyCount: page.totalRecordNum || 0,
    });
  }

  // 上传事件
  @autobind
  @logable({ type: 'Click', payload: { name: '导入' } })
  handleFileChange(info) {
    const { attachment } = this.state;
    this.setState({
      importVisible: false,
    }, () => {
      const uploadFile = info.file;
      if (uploadFile.response && uploadFile.response.code) {
        if (uploadFile.response.code === '0') {
          // 上传成功
          const attachmentData = uploadFile.response.resultData;
          const { updateList, updateData, addedCustData: { list = [] } } = this.props;
          const payload = {
            id: updateData.appId || '',
            custtomer: [],
            manage: [],
            operateType: operateType[2], // clear
            attachment,
            type: allotType,
          };
          // 如果上传过，则先调用清空接口，调用成功后，调用添加接口
          // 添加接口调用成功后，调用查询接口
          // 是否上传过
          const isUploaded = !_.isEmpty(attachment);
          // 如果上传过，或者未上传过但是客户有数据
          if (isUploaded || (!isUploaded && list.length > 0)) {
            updateList(payload).then(() => {
              const { clearData } = this.props;
              // clearAddedCustData
              clearData(clearDataArray[2]).then(() =>
                this.handleUpdateDataAndQueryList(payload, attachmentData));
            });
          } else {
            this.handleUpdateDataAndQueryList(payload, attachmentData);
          }
        } else {
          // 上传失败
          message.error(uploadFile.response.msg);
        }
      }
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '否' } })
  handleCancelImport() {
    this.setState({
      importVisible: false,
    });
  }

  @logable({ type: 'Click', payload: { name: '下载模板' } })
  handleDownloadClick() {}

  // 分配规则切换事件
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '分配规则切换事件',
      value: '$args[0].target.value',
    },
  })
  handleRuleTypeChange(e) {
    const { handleRuleTypePropsChange } = this.props;
    handleRuleTypePropsChange(e.target.value);
  }

  // 客户删除事件
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '删除客户',
      value: '$args[1].custName',
    },
  })
  handleDeleteTableData(type, record) {
    const { updateList, updateData, queryAddedCustList, queryAddedManageList } = this.props;
    const isCust = type === CUST;
    const payload = {
      customer: [],
      manage: [],
      operateType: operateType[1],  // delete
      id: updateData.appId,
      type: allotType,
    };
    if (isCust) {
      payload.customer = [{ brokerNumber: record.custId }];
    } else {
      payload.manage = [{ empId: record.empId, positionId: record.positionId }];
    }
    updateList(payload).then(() => {
      const queryAddedCustListPayload = {
        id: updateData.appId,
        positionId: empPstnId,
        orgId: empOrgId,
        pageNum: 1,
        pageSize: 5,
        type: allotType,
      };
      const queryFunction = isCust ? queryAddedCustList : queryAddedManageList;
      queryFunction(queryAddedCustListPayload).then(() => {
        if (!isCust) {
          const { handleRuleTypePropsChange, addedManageData: { page } } = this.props;
          // 只有一位服务经理时，隐藏分配规则
          if (page.totalRecordNum <= 1) {
            // 按照平均客户数分配
            handleRuleTypePropsChange(ruleTypeArray[0].value);
          }
        } else {
          // 更新总条数
          this.updateTotalNum();
        }
      });
    });
  }

  // 客户分页事件
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '客户列表分页' } })
  handleCustPageChange(pageNum) {
    const { queryAddedCustList, updateData } = this.props;
    const payload = {
      id: updateData.appId,
      positionId: empPstnId,
      orgId: empOrgId,
      pageNum,
      pageSize: 5,
      type: allotType,
    };
    queryAddedCustList(payload);
  }

  // 服务经理分页事件
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '服务经理列表分页' } })
  handleManagePageChange(pageNum) {
    const { queryAddedManageList, updateData } = this.props;
    const payload = {
      id: updateData.appId,
      positionId: empPstnId,
      orgId: empOrgId,
      pageNum,
      pageSize: 5,
      type: allotType,
    };
    queryAddedManageList(payload);
  }

  // 添加单客户的搜索事件
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '搜索客户',
      value: '$args[0]',
    },
  })
  handleSearchClient(v) {
    if (!v) {
      return;
    }
    const { queryCustList } = this.props;
    queryCustList({
      orgId: empOrgId,
      custKeyword: v,
      pageSize: 10,
      pageNum: 1,
      type: allotType,
    }).then(() => {
      const { custData: { list = [] } } = this.props;
      this.setState({
        searchCustList: list,
      });
    });
  }


  // 查询服务经理
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '搜索服务经理',
      value: '$args[0]',
    },
  })
  handleSearchManager(v) {
    if (!v) {
      return;
    }
    const { queryManageList } = this.props;
    queryManageList({
      smKeyword: v,
      orgId: empOrgId,
      pageNum: 1,
      pageSize: 10,
      type: allotType,
      // 个人职位
      positionType: 1,
    }).then(() => {
      const { manageData: { list = [] } } = this.props;
      this.setState({
        searchManageList: list,
      });
    });
  }


  // 选择服务经理
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择服务经理',
      value: '$args[0].empName',
    },
  })
  handleSelectManager(v) {
    this.setState({
      manager: v,
      searchManageList: [],
    });
  }

  // 选择客户
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择客户',
      value: '$args[0].custName',
    },
  })
  handleSelectClient(v) {
    this.setState({
      client: v,
      searchCustList: [],
    });
  }

  // 发送添加客户、服务经理请求
  @autobind
  handleAddBtnClick(modalKey) {
    const { clearData, sendRequest, custModalKey, manageModalKey, updateData } = this.props;
    const { client, manager, alreadyCount } = this.state;
    let customer = [];
    let manage = [];
    const isCust = modalKey === custModalKey;
    // 添加客户
    switch (modalKey) {
      case custModalKey:
        if (_.isEmpty(client)) {
          message.error('请选择客户');
          return;
        }
        customer = [{ brokerNumber: client.custId }];
        break;
      case manageModalKey:
        if (_.isEmpty(manager)) {
          message.error('请选择服务经理');
          return;
        }
        manage = [manager];
        break;
      default:
        break;
    }
    // 如果添加的是客户，并且已添加的数量 + 1 大于限制的条数
    if (isCust && (Number(alreadyCount) + 1 > LIMIT_ALL_COUNT)) {
      message.error(ERROR_MESSAGE_ALL_COUNT);
      return;
    }
    const payload = {
      customer: isCust ? customer : [],
      manage: isCust ? [] : manage,
      operateType: operateType[0],  // add
      attachment: '',
      id: updateData.appId || '',
      type: allotType,
    };
    // 是否需要确认关闭
    const isNeedConfirm = false;
    const pageData = {
      modalKey,
      isNeedConfirm,
    };
    // 发送添加请求，关闭弹窗
    sendRequest(payload, pageData);
    // clearSearchData
    clearData(clearDataArray[0]).then(() => {
      // 清空 AutoComplete 的选项和值
      this.queryCustComponent.clearValue();
      this.queryManagerComponent.clearValue();
      // 根据类型清空不同的值
      this.setState({
        [isCust ? 'client' : 'manager']: {},
      });
    });
    const title = isCust ? '添加客户提交' : '添加服务经理提交';
    logCommon({
      type: 'Submit',
      payload: {
        title,
        value: JSON.stringify(payload),
        name: title,
        type: '营业部客户分配',
        subType: '营业部客户分配',
      },
    });
  }

  // 渲染点击删除按钮后的确认框
  @autobind
  renderPopconfirm(type, record) {
    return (<Popconfirm
      placement="top"
      onConfirm={() => this.handleDeleteTableData(type, record)}
      okText="是"
      cancelText="否"
      title={'是否删除此条数据？'}
    >
      <Icon type="shanchu" />
    </Popconfirm>);
  }


  // 单个服务经理的 option 渲染
  @autobind
  renderOption(item) {
    const optionValue = `${item.empName} (${item.empId})`;
    const inputValue = `${item.empName} ${item.empId}`;
    return (
      <Option
        key={item.positionId}
        className={styles.ddsDrapMenuConItem}
        value={inputValue}
        title={optionValue}
      >
        {inputValue}
      </Option>
    );
  }


  render() {
    const {
      selfBtnGroup,
      visible,
      modalKey,
      custModalKey,
      manageModalKey,
      showModal,
      closeModal,
      addedCustData: { list: custList = [], page: custPage = {} },
      addedManageData: { list: manageList = [], page: managePage = {} },
      ruleType,
    } = this.props;

    const {
      importVisible,
      attachment,
      searchCustList,
      searchManageList,
    } = this.state;
    const uploadProps = {
      data: {
        empId: emp.getId(),
        attachment: '',
      },
      action: `${request.prefix}/file/uploadTemp`,
      headers: {
        accept: '*/*',
      },
      onChange: this.handleFileChange,
      showUploadList: false,
    };

    const custListPaginationOption = {
      current: custPage.curPageNum || 1,
      total: custPage.totalRecordNum || 0,
      pageSize: custPage.pageSize || 5,
      onChange: this.handleCustPageChange,
    };
    // 服务经理列表分页
    const manageListPaginationOption = {
      current: managePage.curPageNum || 1,
      total: managePage.totalRecordNum || 0,
      pageSize: managePage.pageSize || 5,
      onChange: this.handleManagePageChange,
    };

    // 是否上传过
    const isUploaded = !_.isEmpty(attachment);
    // 上传过，或者未上传但有数据
    const uploadElement = (isUploaded || (!isUploaded && custList.length > 0)) ?
      (<span><a onClick={this.handleImportData}>批量导入数据</a></span>)
    :
      (<Upload {...uploadProps}>
        <a>批量导入数据</a>
      </Upload>);
    // 客户标题列表
    const custTitle = this.getColumnsCustTitle();
    // 服务经理标题列表
    const manageTitle = this.getColumnsManageTitle();

    // 关闭弹窗
    const closePayload = {
      modalKey,
      isNeedConfirm: true,
      clearDataType: clearDataArray[1],
    };

    // 客户分配规则显示与否
    // 服务经理当前页且所有数据都为一条时，不显示
    const showRuleType = manageList.length === 1 && managePage.totalRecordNum === 1;
    return (
      <CommonModal
        title="新建营业部客户分配"
        visible={visible}
        closeModal={() => closeModal(closePayload)}
        size="large"
        modalKey={modalKey}
        afterClose={this.afterClose}
        selfBtnGroup={selfBtnGroup}
        wrapClassName={styles.createModal}
      >
        <div className={styles.modalContent}>
          <div className={styles.contentItem}>
            <InfoTitle head="客户列表" />
            {/* 操作按钮容器 */}
            <div className={`${styles.operateDiv} clearfix`}>
              <AutoComplete
                placeholder="客户号/客户名称"
                showNameKey="custName"
                showIdKey="custId"
                optionList={searchCustList}
                onSelect={this.handleSelectClient}
                onSearch={this.handleSearchClient}
                ref={ref => this.queryCustComponent = ref}
                dropdownMatchSelectWidth={false}
              />
              <Button ghost type="primary" onClick={() => this.handleAddBtnClick(custModalKey)}>
                添加
              </Button>
              <span className={styles.linkSpan}>
                <Button type="primary" onClick={() => showModal(custModalKey)}>
                  +批量添加
                </Button>
                <a
                  onClick={this.handleDownloadClick}
                  href={CustAllotXLS} className={styles.downloadLink}
                >
                  下载导入模板
                </a>
                { uploadElement }
              </span>
            </div>
            <div className={styles.tableDiv}>
              <CommonTable
                align="left"
                data={custList}
                titleList={custTitle}
              />
              <Pagination {...custListPaginationOption} />
            </div>
          </div>
          <div className={styles.contentItem}>
            <InfoTitle head="服务经理列表" />
            {/* 操作按钮容器 */}
            <div className={`${styles.operateDiv} clearfix`}>
              <AutoComplete
                placeholder="姓名工号搜索"
                showNameKey="positionId"
                optionKey="positionId"
                optionList={searchManageList}
                onSelect={this.handleSelectManager}
                onSearch={this.handleSearchManager}
                ref={ref => this.queryManagerComponent = ref}
                dropdownMatchSelectWidth={false}
                renderOptionNode={this.renderOption}
              />
              <Button ghost type="primary" onClick={() => this.handleAddBtnClick(manageModalKey)}>
                添加
              </Button>
            </div>
            <div className={styles.tableDiv}>
              <CommonTable
                align="left"
                data={manageList}
                titleList={manageTitle}
              />
              <Pagination {...manageListPaginationOption} />
            </div>
          </div>
          {
            showRuleType
            ?
              null
            :
              <div className={styles.contentItem}>
                <InfoTitle head="客户分配规则" />
                <InfoForm label="规则" style={{ width: '96px' }} required>
                  <RadioGroup onChange={this.handleRuleTypeChange} value={ruleType}>
                    {
                      ruleTypeArray.map(item => (
                        <Radio key={item.value} value={item.value}>{item.label}</Radio>
                      ))
                    }
                  </RadioGroup>
                </InfoForm>
              </div>
          }
          <Modal
            visible={importVisible}
            title="提示"
            onCancel={this.handleCancelImport}
            footer={[
              <Button className={styles.mr10} key="back" onClick={this.handleCancelImport}>
                取消
              </Button>,
              <Upload {...uploadProps} {...this.props} key="uploadAgain">
                <Button key="submit" type="primary">
                  确定
                </Button>
              </Upload>,
            ]}
          >
            <p>导入后将清空客户列表已有数据，请确认！</p>
          </Modal>
        </div>
      </CommonModal>
    );
  }
}
