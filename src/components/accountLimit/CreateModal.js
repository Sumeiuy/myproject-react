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
  tableTitle: { custList: custTitleList },
  operateTypeArray,
  attachmentMap,
} = config;
// 登陆人的组织 ID
const empOrgId = emp.getOrgId();
// const empOrgId = 'ZZ001041051';
// 登陆人的职位 ID
// const empPstnId = emp.getPstnId();
// 客户
const KEY_CUSTNAME = 'custName';

export default class CreateModal extends PureComponent {
  static propTypes = {
    queryAppList: PropTypes.func.isRequired,
    // 获取按钮数据和下一步审批人
    selfBtnGroup: PropTypes.object.isRequired,
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
      // 搜索的客户数据
      searchCustList: [],
      isBankConfirm: '',
      // 限制信息
      limitList: [],
      limitValue: [],
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

      selectValue: '',
    };
  }

  componentDidMount() {
    // 获取下一步骤按钮列表
    this.props.queryButtonList({
      flowId: '',
      operate: 2,
    });
  }

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

  // 是否银行确认更改事件
  @autobind
  handleBankConfirmChange(e) {
    this.setState({
      isBankConfirm: e.target.value,
    });
  }

  // 操作类型改变事件
  // TODO: 清空数据
  @autobind
  handleOperateTypeChange(key, value) {
    // 等于 限制解除 的时候
    let isLimit = true;
    if (value !== operateTypeArray[0].value) {
      isLimit = false;
    }
    this.setState({
      [key]: value,
      isLimit,
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

  // 设置限制事件切换事件
  @autobind
  handleDatePickerChange(date, dateString) {
    console.warn('date', date);
    console.warn('dateString', dateString);
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
  handleSelectChange(value, options) {
    console.warn('options', options);
    console.warn('value', value);
    this.setState({
      limitValue: value,
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
    const { attachment } = this.state;
    this.setState({
      importVisible: false,
    }, () => {
      const uploadFile = info.file;
      if (uploadFile.response && uploadFile.response.code) {
        if (uploadFile.response.code === '0') {
          // 上传成功
          const attachmentData = uploadFile.response.resultData;
          const payload = {
            custtomer: [],
            manage: [],
            attachment,
          };
          // 如果上传过，则先调用清空接口，调用成功后，调用添加接口
          // 添加接口调用成功后，调用查询接口
          // 是否上传过
          this.handleUpdateDataAndQueryList(payload, attachmentData);
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
    const { queryCustList } = this.props;
    queryCustList({
      orgId: empOrgId,
      custKeyword: v,
      pageSize: 10,
      pageNum: 1,
    }).then(() => {
      const { searchCustData } = this.props;
      this.setState({
        searchCustData,
      });
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
    this.setState({
      addedCustData: [...addedCustData, client],
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
    console.warn('text', text);
    console.warn('word', word);
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
      selfBtnGroup,
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
      limitValue,

      operateType,
      companyName,
      stockCode,
      isLimit,
      addedCustData,
      pageNum,
      selectValue,
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
                  <Radio value={0}>是</Radio>
                  <Radio value={1}>否</Radio>
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
            <InfoForm label="接触限制类型" className={styles.infoFormSelect} required>
              <AntdSelect
                mode="multiple"
                labelInValue
                value={limitValue}
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
                  <Option key={item.code}>{this.replaceKeyWord(item.name, selectValue)}</Option>,
                )}
              </AntdSelect>
            </InfoForm>
            {
              isLimit
              ? <InfoForm label="账户限制设置日期" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
                <DatePicker onChange={this.handleDatePickerChange} />
              </InfoForm>
              : null
            }
            <InfoForm label="账户限制解除日期" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
              <DatePicker onChange={this.handleDatePickerChange} />
            </InfoForm>
          </div>
          <div className={styles.contentItem}>
            <InfoTitle head="附件信息" />
            {
              attachmentMap.map((item) => {
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
      </CommonModal>
    );
  }
}
