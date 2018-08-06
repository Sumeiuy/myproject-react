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
import { message, DatePicker, Input, Select as AntdSelect, Spin, Radio, Modal, Upload, Popconfirm } from 'antd';
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
    location: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    custRangeList: PropTypes.array.isRequired,
    queryAppList: PropTypes.func.isRequired,
    // 获取按钮数据和下一步审批人
    selfBtnGroup: PropTypes.object.isRequired,
    queryButtonList: PropTypes.func.isRequired,
    // 获取客户数据
    custData: PropTypes.array.isRequired,
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
      isBankConfirm: '',

      limitList: [],
      limitValue: [],
      fetching: false,
    };
  }

  componentDidMount() {
    // 获取下一步骤按钮列表
    this.props.queryButtonList({
      flowId: '',
      operate: 2,
    });
  }

  // 是否银行确认更改事件
  @autobind
  handleRaiodChange(e) {
    this.setState({
      isBankConfirm: e.target.value,
    });
  }

  // 设置限制事件切换事件
  @autobind
  handleDatePickerChange(date, dateString) {
    console.warn('date', date);
    console.warn('dateString', dateString);
  }

  // 搜索限制类型
  @autobind
  handleSelectSearch(value) {
    const { queryLimtList } = this.props;
    const { limitList } = this.state;
    if (!_.isEmpty(limitList)) {
      return;
    }
    this.setState({
      fetching: true,
    }, () => {
      queryLimtList({ value }).then(() => {
        const { limitList: propsLimitList } = this.props;
        this.setState({
          limitList: propsLimitList,
          fetching: false,
        });
      });
    });
  }

  // 选择限制类型
  @autobind
  handleSelectChange(value, options) {
    console.warn('options', options);
    console.warn('value', value);
    this.setState({
      limitValue: value,
      fetching: false,
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
      render: (text, record) => this.renderPopconfirm('cust', record),
    });
    return titleList;
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
      const { custData: { list = [] } } = this.props;
      this.setState({
        searchCustList: list,
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

  render() {
    const {
      selfBtnGroup,
      visible,
      modalKey,
      custData: custList,
      closeModal,
    } = this.props;

    const {
      importVisible,
      attachment,
      searchCustList,
      isBankConfirm,
      fetching,
      limitList,
      limitValue,
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
      current: 1,
      total: 0,
      pageSize: 5,
      onChange: this.handleCustPageChange,
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
                value={''}
                onChange={this.handleSubTypeSelect}
                getPopupContainer={getPopupContainerFunction}
              />
            </InfoForm>
            <InfoForm label="公司简称" className={styles.inlineInfoForm} required>
              <Input />
            </InfoForm>
            <InfoForm label="证券代码" className={styles.inlineInfoForm} required>
              <Input />
            </InfoForm>
            <InfoForm label="是否银行确认" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
              <RadioGroup onChange={this.handleRaiodChange} value={isBankConfirm}>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </RadioGroup>
            </InfoForm>
          </div>
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
              <Button ghost type="primary" onClick={() => this.handleAddBtnClick('')}>
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
                data={custList}
                titleList={custTitle}
              />
              <Pagination {...custListPaginationOption} />
            </div>
          </div>
          <div className={styles.contentItem}>
            <InfoTitle head="限制信息" />
            <InfoForm label="接触限制类型" required>
              <AntdSelect
                mode="multiple"
                value={limitValue}
                placeholder="Select users"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={_.debounce(this.handleSelectSearch, 800)}
                onChange={this.handleSelectChange}
                style={{ width: '530px' }}
              >
                {limitList.map(item => <Option key={item.code}>{item.name}</Option>)}
              </AntdSelect>
            </InfoForm>
            <InfoForm label="账户限制设置日期" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
              <DatePicker onChange={this.handleDatePickerChange} />
            </InfoForm>
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
