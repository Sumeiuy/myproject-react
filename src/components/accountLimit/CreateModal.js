/**
 * @Description: 账户限制管理-新建弹窗
 * @Author: Liujianshu
 * @Date: 2018-07-31 16:15:52
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-08-03 15:36:23
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message, DatePicker, Input, Select as AntdSelect, Radio, Modal, Upload, Popconfirm } from 'antd';
import moment from 'moment';
import _ from 'lodash';

import Select from '../common/Select';
import InfoTitle from '../common/InfoTitle';
import InfoForm from '../common/infoForm';
import CommonModal from '../common/biz/CommonModal';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
import MultiUploader from '../common/biz/MultiUploader';
import Icon from '../../components/common/Icon';
import TableDialog from '../../components/common/biz/TableDialog';
import BottonGroup from '../../components/permission/BottonGroup';
import AutoComplete from '../../components/common/similarAutoComplete';
import logable, { logPV } from '../../decorators/logable';
import { request } from '../../config';
import { emp } from '../../helper';
import config from './config';
import CustAllotXLS from './accountLimit.xls';
import styles from './createModal.less';

const RadioGroup = Radio.Group;
const Option = AntdSelect.Option;

// 用于找到select类组件渲染option时父级容器的方法,以解决在弹窗里页面滚动，option随页面滚动的问题
const getPopupContainerFunction = () => document.querySelector(`.${styles.modalContent}`);
// 表头
const {
  tableTitle: { custList: custTitleList, approvalList },
  operateTypeArray,
  attachmentMap,
  bankConfirmArray,
} = config;
// 登陆人的组织 ID
const empOrgId = emp.getOrgId();
// const empOrgId = 'ZZ001041051';
// 客户
const KEY_CUSTNAME = 'custName';

// 审批人弹窗
const approverModalKey = 'approverModal';
// 取消按钮的值
const BTN_CANCLE_VALUE = 'cancel';

export default class CreateModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    queryAppList: PropTypes.func.isRequired,
    // 获取按钮数据和下一步审批人
    buttonData: PropTypes.object.isRequired,
    queryButtonList: PropTypes.func.isRequired,
    // 获取客户数据
    searchCustData: PropTypes.array.isRequired,
    addedCustData: PropTypes.array.isRequired,
    queryCustList: PropTypes.func.isRequired,
    // 限制类型
    limitList: PropTypes.array.isRequired,
    queryLimtList: PropTypes.func.isRequired,
    // 提交保存
    saveChange: PropTypes.func.isRequired,
    // 弹窗的key
    modalKey: PropTypes.string.isRequired,
    // 打开弹窗
    showModal: PropTypes.func.isRequired,
    // 关闭弹窗
    closeModal: PropTypes.func.isRequired,
    // 弹窗状态
    visible: PropTypes.bool.isRequired,
    clearData: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const operateType = operateTypeArray[0].value;
    this.state = {
      // 上传后的返回值
      attachment: '',
      // 导入的弹窗
      importVisible: false,
      // 审批人弹窗
      [approverModalKey]: false,
      // 审批人
      flowAuditors: [],
      // 单个客户
      client: {},
      // 搜索的客户数据
      searchCustList: [],
      // 是否银行确认
      isBankConfirm: '',
      // 限制信息
      limitList: [],
      limitType: [],
      fetching: false,
      // 操作类型
      operateType,
      // 操作类型是否是 限制设置
      isLimit: operateType === operateTypeArray[0].value,
      // 公司简称
      companyName: '',
      // 证券代码
      stockCode: '',
      // 已添加的客户列表
      addedCustData: props.addedCustData || [],
      // 当前页数
      pageNum: 1,
      // 限制类型搜索输入框搜索值
      selectValue: '',
      // 限制设置日期
      limitStartTime: '',
      // 限制解除日期
      limitEndTime: '',
      // 解除日期的禁用状态
      endDateDisabled: operateType === operateTypeArray[0].value,
      // 附件列表
      attachmentList: attachmentMap,
    };
  }

  componentDidMount() {
    this.queryNextStepButton();
  }


  // 提交成功之后的回调处理
  // @autobind
  // handleSuccessCallback() {
  //   const {
  //     location: {
  //       query,
  //       query: {
  //         pageNum,
  //         pageSize,
  //       },
  //     },
  //     closeModal,
  //     modalKey,
  //     queryAppList,
  //   } = this.props;

  //   Modal.success({
  //     title: '提示',
  //     content: '提交成功，后台正在进行数据处理！若数据校验失败，可在首页通知提醒中查看失败原因。',
  //     onOk: () => {
  //       // 关闭审批人弹窗
  //       closeModal({
  //         modalKey: approverModalKey,
  //         isNeedConfirm: false,
  //       });
  //       // 关闭新建弹窗
  //       closeModal({
  //         modalKey,
  //         isNeedConfirm: false,
  //       });
  //       queryAppList({ ...query, id: '', appId: '' }, pageNum, pageSize);
  //     },
  //   });
  // }

  // // 选完审批人后的提交
  // @autobind
  // handleApproverModalOK(auth) {
  //   const { saveChange } = this.props;
  //   const { flowAuditors } = this.state;
  //   const payload = {
  //     TGConfirm: true,
  //     positionId: empPstnId,
  //     orgId: empOrgId,
  //     auditors: auth.login,
  //     groupName: flowAuditors.nextGroupName,
  //     approverIdea: '',
  //   };
  //   saveChange(payload).then(this.handleSuccessCallback());
  // }

  // 生成客户表格标题列表
  @autobind
  getColumnsCustTitle() {
    const titleList = [...custTitleList];
    // 客户
    const custNameColumn = _.find(titleList, o => o.key === KEY_CUSTNAME);
    custNameColumn.render = (text, record) => (
      <div>{text} ({record.custId})</div>
    );
    // 添加操作列
    titleList.push({
      dataIndex: 'operate',
      key: 'operate',
      title: '操作',
      render: (text, record) => this.renderPopconfirm(record),
    });
    return titleList;
  }

  // 获取下一步按钮和审批人
  @autobind
  queryNextStepButton() {
    // 获取下一步骤按钮列表
    const { isLimit, operateType, isBankConfirm } = this.state;
    const { queryButtonList } = this.props;
    const payload = {
      flowId: '',
      operateType,
    };
    // 如果是解除限制
    if (!isLimit) {
      if (isBankConfirm === bankConfirmArray[0].value) {
        payload.extraParam = true;
      } else {
        payload.extraParam = false;
      }
    }
    queryButtonList(payload);
  }

  // 是否银行确认更改事件
  @autobind
  handleBankConfirmChange(e) {
    const value = e.target.value;
    const { attachmentList } = this.state;
    // 如果是银行确认
    const newAttachementList = [...attachmentList];
    if (value === bankConfirmArray[0].value) {
      // 隐藏银行确认解除材料
      newAttachementList[1].show = true;
    }
    this.setState({
      isBankConfirm: e.target.value,
      attachmentList: newAttachementList,
    }, this.queryNextStepButton);
  }

  // 操作类型改变事件
  @autobind
  handleOperateTypeChange(key, value) {
    // 等于 限制解除 的时候
    let isLimit = false;
    if (value === operateTypeArray[0].value) {
      isLimit = true;
      this.queryNextStepButton();
    }
    this.setState({
      [key]: value,
      isLimit,
      endDateDisabled: isLimit,
      // 是否银行确认默认值：是
      isBankConfirm: bankConfirmArray[0].value,
      addedCustData: [],
      attachment: '',
      limitType: [],
      limitStartTime: '',
      limitEndTime: '',
      attachmentList: attachmentMap,
    });
  }

  // 公司简称改变
  @autobind
  handleCompanyNameChange(e) {
    this.setState({
      companyName: e.target.value,
    });
  }

  // 证券代码变化
  @autobind
  handleStockCodeChange(e) {
    this.setState({
      stockCode: e.target.value,
    });
  }

  // 设置限制时间切换事件
  @autobind
  handleStartDatePickerChange(date, dateString) {
    this.setState({
      limitStartTime: dateString,
      endDateDisabled: false,
    });
  }

  // 解除限制时间切换事件
  @autobind
  handleEndDatePickerChange(date, dateString) {
    this.setState({
      limitEndTime: dateString,
    });
  }

  // 设置限制开始禁用时间
  @autobind
  disabledStartDate(current) {
    return current < moment().startOf('day');
  }

  // 设置解除限制禁用时间
  @autobind
  disabledEndDate(current) {
    const { limitStartTime } = this.state;
    return current < moment(limitStartTime).endOf('day');
  }

  // 限制类型焦点进入
  @autobind
  handleSelectFocus() {
    const { queryLimtList } = this.props;
    const { limitList } = this.state;
    if (!_.isEmpty(limitList)) {
      return;
    }
    queryLimtList().then(() => {
      const { limitList: propsLimitList } = this.props;
      this.setState({
        limitList: propsLimitList,
        fetching: false,
      });
    });
  }

  // 搜索焦点类型
  @autobind
  handleSelectSearch(value) {
    this.setState({
      selectValue: value,
    });
  }

  // 选择限制类型
  @autobind
  handleSelectChange(value) {
    console.warn('value', value);
    this.setState({
      limitType: value,
      selectValue: '',
    });
  }

  // 导入数据
  @autobind
  @logPV({ pathname: '/modal/importData', title: '导入数据' })
  handleImportData() {
    this.setState({
      importVisible: true,
    });
  }

  // 上传事件
  @autobind
  @logable({ type: 'Click', payload: { name: '导入' } })
  handleFileChange(info) {
    this.setState({
      importVisible: false,
    }, () => {
      const uploadFile = info.file;
      if (uploadFile.response && uploadFile.response.code) {
        if (uploadFile.response.code === '0') {
          // 上传成功
          const attachment = uploadFile.response.resultData;
          this.setState({
            attachment,
          }, () => {
            const payload = {
              orgId: empOrgId,
              attachment,
            };
            this.querySearchOrAddedCustList(payload);
          });
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

  // 添加单客户的搜索事件
  @autobind
  handleSearchClient(v) {
    if (!v) {
      return;
    }
    const payload = {
      orgId: empOrgId,
      keyword: v,
      pageSize: 10,
      pageNum: 1,
    };
    this.querySearchOrAddedCustList(payload);
  }

  // 搜索客户
  @autobind
  querySearchOrAddedCustList(payload) {
    const { queryCustList } = this.props;
    const { operateType } = this.state;
    queryCustList({ ...payload, operateType }).then(() => {
      const { searchCustData, addedCustData } = this.props;
      if (payload.keyword) {
        this.setState({
          searchCustData,
        });
      }
      if (payload.attachment) {
        this.setState({
          addedCustData,
        });
      }
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

  // 添加客户
  @autobind
  @logable({ type: 'Click', payload: { name: '添加客户' } })
  handleAddBtnClick() {
    const { addedCustData, client } = this.state;
    if (_.isEmpty(client)) {
      message.error('请选择客户');
      return;
    }
    if (_.filter(addedCustData, o => o.custId === client.custId).length) {
      message.error('不允许添加重复客户');
      return;
    }
    this.setState({
      addedCustData: [...addedCustData, client],
      client: {},
    });
  }

  // 删除客户
  @autobind
  @logable({ type: 'Click', payload: { name: '删除客户' } })
  handleDeleteTableData(record) {
    const { addedCustData } = this.state;
    const newAddedCustData = _.filter(addedCustData, o => o.custId !== record.custId);
    this.setState({
      addedCustData: newAddedCustData,
    });
  }

  // 客户列表翻页事件
  @autobind
  @logable({ type: 'Click', payload: { name: '客户列表翻页' } })
  handleCustPageChange(pageNum) {
    this.setState({
      pageNum,
    });
  }

  // select 联动筛选
  @autobind
  filterOption(value, option) {
    const { limitList } = this.props;
    const { key } = option;
    const { name = '' } = _.find(limitList, item => item.code === key) || {};
    return name.indexOf(value) > -1;
  }

  // select 多选失去焦点
  @autobind
  handleSelectBlur() {
    this.setState({ selectValue: '' });
  }

  // 替换关键字颜色
  @autobind
  replaceKeyWord(text, word = '') {
    if (!word) {
      return text;
    }
    const keyWordRegex = new RegExp(_.escapeRegExp(word), 'g');
    const keyWordText = _.replace(text, keyWordRegex, match => (
      `<span class=${styles.keyWord}>${match}</span>`
    ));
    console.warn('keyWordText', keyWordText);
    return <div dangerouslySetInnerHTML={{ __html: keyWordText }} />;
  }

  // 文件上传成功
  @autobind
  handleUploadCallback(attachmentType, attachment) {
    const { attachmentList } = this.state;
    const newAttachementList = attachmentList.map((item) => {
      if (item.type === attachmentType) {
        return {
          ...item,
          attachment,
          length: item.length + 1,
        };
      }
      return item;
    });
    this.setState({
      attachmentList: newAttachementList,
    });
  }

  // 文件删除成功
  @autobind
  handleDeleteCallback(attachmentType) {
    const { attachmentList } = this.state;
    const newAttachmentList = attachmentList.map((item) => {
      const { type, length } = item;
      if (type === attachmentType && length > 0) {
        return {
          ...item,
          length: length - 1,
        };
      }
      return item;
    });
    this.setState({
      attachmentList: newAttachmentList,
    });
  }

  // 提交请求
  @autobind
  sendRequest() {
    const { saveChange } = this.props;
    const {
      isLimit,
      operateType,
      companyName,
      stockCode,
      isBankConfirm,
      addedCustData,
      limitType,
      limitStartTime,
      limitEndTime,
      attachmentList,
    } = this.state;
    const custList = addedCustData.map(item => ({
      custId: item.custId,
      label: item.label,
    }));

    if (_.isEmpty(companyName)) {
      message.error('请填写公司简称');
      return;
    }
    if (_.isEmpty(stockCode)) {
      message.error('请填写证券代码');
      return;
    }
    if (_.isEmpty(addedCustData)) {
      message.error('请添加客户');
      return;
    }
    if (_.isEmpty(limitType)) {
      message.error('请选择限制类型');
      return;
    }
    if (isLimit) {
      if (_.isEmpty(limitStartTime)) {
        message.error('请选择账户限制设置日期');
        return;
      }
    }
    if (_.isEmpty(limitEndTime)) {
      message.error('请选择账户限制解除日期');
      return;
    }

    const newAttachementList = [];
    for (let i = 0; i < attachmentList.length; i++) {
      const item = attachmentList[i];
      if (item.show && item.length <= 0 && item.required) {
        message.error(`${item.title}附件为必传项`);
        return;
      }
      newAttachementList.push({
        title: item.type,
        attachment: item.attachment,
      });
    }

    if (!isLimit && isBankConfirm === bankConfirmArray[0].value) {
      const payload = {
        orgId: empOrgId,
        operateType,
        companyName,
        stockCode,
        custList,
        limitType,
        limitEndTime,
        attachment: newAttachementList,
        auditors: '',
        groupName: '',
        approverIdea: '',
      };
      // 如果是限制类型
      if (isLimit) {
        payload.limitStartTime = limitStartTime;
      } else {
        payload.isBankConfirm = isBankConfirm === bankConfirmArray[0].value;
      }
      saveChange(payload);
    } else {
      this.setState({
        [approverModalKey]: true,
      });
    }
  }


  // 提交，点击后选择审批人
  @autobind
  handleSubmit(btnItem) {
    const { modalKey } = this.props;
    if (btnItem.operate === BTN_CANCLE_VALUE) {
      this.closeModal({
        modalKey,
        isNeedConfirm: true,
      });
      return;
    }
    this.sendRequest();
  }

  // 渲染点击删除按钮后的确认框
  @autobind
  renderPopconfirm(record) {
    return (<Popconfirm
      placement="top"
      onConfirm={() => this.handleDeleteTableData(record)}
      okText="是"
      cancelText="否"
      title={'是否删除此条数据？'}
    >
      <Icon type="shanchu" />
    </Popconfirm>);
  }

  render() {
    const {
      buttonData,
      visible,
      modalKey,
      closeModal,
    } = this.props;
    const {
      importVisible,
      attachment,
      searchCustData,
      isBankConfirm,
      limitList,
      limitType,
      operateType,
      companyName,
      stockCode,
      isLimit,
      addedCustData,
      pageNum,
      selectValue,
      endDateDisabled,
      attachmentList,
      approverModal,
      flowAuditors,
    } = this.state;


    const newButtonData = { ...buttonData };
    if (!_.isEmpty(newButtonData.flowButtons)) {
      const operateArray = _.map(newButtonData.flowButtons, 'operate');
      if (!_.includes(operateArray, BTN_CANCLE_VALUE)) {
        newButtonData.flowButtons.push({
          ...newButtonData.flowButtons[0],
          btnName: '取消',
          operate: 'cancel',
          flowBtnId: -1,
        });
      }
    }

    // 新建弹窗按钮
    const selfBtnGroup = (<BottonGroup
      list={newButtonData}
      onEmitEvent={this.handleSubmit}
    />);

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
      current: pageNum,
      total: addedCustData.length,
      pageSize: 5,
      onChange: this.handleCustPageChange,
    };

    const showCustList = _.chunk(addedCustData, 5);

    // 是否上传过
    const isUploaded = !_.isEmpty(attachment);
    // 上传过，或者未上传但有数据
    const uploadElement = (isUploaded || (!isUploaded && addedCustData.length > 0)) ?
      (<span><a onClick={this.handleImportData}>批量导入数据</a></span>)
    :
      (<Upload {...uploadProps}>
        <a>批量导入数据</a>
      </Upload>);
    // 客户标题列表
    const custTitle = this.getColumnsCustTitle();

    // 关闭弹窗
    const closePayload = {
      modalKey,
      isNeedConfirm: true,
    };

    // 审批人弹窗
    const approvalProps = {
      visible: approverModal,
      onOk: this.handleApproverModalOK,
      onCancel: () => { this.setState({ [approverModalKey]: false }); },
      dataSource: flowAuditors,
      columns: approvalList,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: approverModalKey,
      rowKey: 'login',
      searchShow: false,
    };

    return (
      <CommonModal
        title="账户限制管理"
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
            <InfoTitle head="基本信息" />
            <InfoForm label="操作类型" style={{ width: '120px' }} required>
              <Select
                name="operateType"
                data={operateTypeArray}
                value={operateType}
                onChange={this.handleOperateTypeChange}
                getPopupContainer={getPopupContainerFunction}
              />
            </InfoForm>
            <InfoForm label="公司简称" className={styles.inlineInfoForm} required>
              <Input
                value={companyName}
                placeholder="请输入公司简称"
                onChange={this.handleCompanyNameChange}
              />
            </InfoForm>
            <InfoForm label="证券代码" className={styles.inlineInfoForm} required>
              <Input
                value={stockCode}
                placeholder="请输入证券代码"
                onChange={this.handleStockCodeChange}
              />
            </InfoForm>
            {
              isLimit
              ? null
              : <InfoForm label="是否银行确认" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
                <RadioGroup onChange={this.handleBankConfirmChange} value={isBankConfirm}>
                  {
                    bankConfirmArray.map(item => (
                      <Radio value={item.value} key={item.value}>{item.label}</Radio>
                    ))
                  }
                </RadioGroup>
              </InfoForm>
            }
          </div>
          <div className={styles.contentItem}>
            <InfoTitle head="客户列表" />
            {/* 操作按钮容器 */}
            <div className={`${styles.operateDiv} clearfix`}>
              <AutoComplete
                placeholder="客户号/客户名称"
                showNameKey="custName"
                showIdKey="custId"
                optionList={searchCustData}
                onSelect={this.handleSelectClient}
                onSearch={this.handleSearchClient}
                ref={ref => this.queryCustComponent = ref}
                dropdownMatchSelectWidth={false}
              />
              <Button ghost type="primary" onClick={this.handleAddBtnClick}>
                添加
              </Button>
              <span className={styles.linkSpan}>
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
                data={showCustList[pageNum - 1]}
                titleList={custTitle}
              />
              <Pagination {...custListPaginationOption} />
            </div>
          </div>
          <div className={styles.contentItem}>
            <InfoTitle head="限制信息" />
            <InfoForm label="解除限制类型" className={styles.infoFormSelect} required>
              <AntdSelect
                mode="multiple"
                labelInValue
                value={limitType}
                placeholder="请选择限制类型"
                onChange={this.handleSelectChange}
                onBlur={this.handleSelectBlur}
                onFocus={this.handleSelectFocus}
                onSearch={this.handleSelectSearch}
                style={{ width: '560px' }}
                filterOption={this.filterOption}
                optionFilterProp="children"
                getPopupContainer={getPopupContainerFunction}
              >
                {limitList.map(item =>
                  <Option key={item.key}>{this.replaceKeyWord(item.label, selectValue)}</Option>,
                )}
              </AntdSelect>
            </InfoForm>
            {
              isLimit
              ? <InfoForm label="账户限制设置日期" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  onChange={this.handleStartDatePickerChange}
                />
              </InfoForm>
              : null
            }
            <InfoForm label="账户限制解除日期" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
              <DatePicker
                disabled={endDateDisabled}
                disabledDate={this.disabledEndDate}
                onChange={this.handleEndDatePickerChange}
                onOpenChange={this.handleOpenEndDate}
              />
            </InfoForm>
          </div>
          <div className={styles.contentItem}>
            <InfoTitle head="附件信息" />
            {
              attachmentList.map((item) => {
                const uploaderElement = item.show ? (
                  <div className={styles.mt10}>
                    <MultiUploader
                      key={item.type}
                      edit
                      type={item.type}
                      title={item.title}
                      required={item.required}
                      attachment={item.attachment || ''}
                      attachmentList={item.attachmentList || []}
                      uploadCallback={this.handleUploadCallback}
                      deleteCallback={this.handleDeleteCallback}
                      ref={(ref) => { this[`uploader${item.type}`] = ref; }}
                      showDelete
                      isLimit={item.isLimit}
                      limitCount={item.limitCount}
                    />
                  </div>
                ) : null;
                return (
                  <div key={item.type}>
                    {uploaderElement}
                  </div>
                );
              })
            }
          </div>
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
        {
          approverModal ? <TableDialog {...approvalProps} /> : null
        }
      </CommonModal>
    );
  }
}
