/**
 * @Author: XuWenKang
 * @Description: 账户限制管理-驳回后修改表单
 * @Date: 2018-08-08 09:21:07
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-18 21:14:21
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { DatePicker, Input, Select as AntdSelect, Popconfirm, message, Modal } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import Pagination from '../common/Pagination';
import InfoTitle from '../common/InfoTitle';
import InfoForm from '../common/infoForm';
import InfoItem from '../common/infoItem';
import ApproveList from '../common/approveList';
import CommonTable from '../../components/common/biz/CommonTable';
import MultiUploader from '../common/biz/MultiUploader';
import AutoComplete from '../common/similarAutoComplete';
import Icon from '../../components/common/Icon';
import logable from '../../decorators/logable';
import { time, regxp } from '../../helper';
import config from './config';
import styles from './editForm.less';

const TextArea = Input.TextArea;
const Option = AntdSelect.Option;

// 用于找到select类组件渲染option时父级容器的方法,以解决在弹窗里页面滚动，option随页面滚动的问题
const getPopupContainerFunction = () => document.querySelector(`.${styles.formContent}`);
const EMPTY_ARRAY = [];
const SET_LIMITTYPE_LABEL_NAME = '限制类型'; // 限制类型时显示的label名称
const RELIEVE_LIMITTYPE_LABEL_NAME = '解除限制类型'; // 解除限制类型时显示的label名称
// 表头
const {
  tableTitle: { custList: custTitleList, moreList },
  operateTypeArray,
  SET_CODE,
  RELIEVE_CODE,
  TIME_FORMAT_STRING,
  EDIT_MESSAGE,
} = config;
const autoCompleteStyle = {
  width: '180px',
  height: '30px',
};
const DEFAULT_PAGE_SIZE = 5;
// 客户
const KEY_CUSTNAME = 'custName';
// 服务经理
const KEY_EMPNAME = 'empName';
// 限制类型
const KEY_LIMIT = 'limit';
// 业务对接人
const KEY_DOCKINGID = 'dockingId';
// 禁止转出金额
const KEY_LIMIT_NUMBER = 'limitNumber';
// 限制类型--禁止账户留存指定金额流通资产转出 -5
const KEY_LIMIT_TRANSFER_NUMBER = '5';
export default class EditForm extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 服务经理数据
    empData: PropTypes.object.isRequired,
    queryEmpData: PropTypes.func.isRequired,
    // 详情数据
    detailInfo: PropTypes.object.isRequired,
    // 用于编辑的数据
    editFormData: PropTypes.object.isRequired,
    onEditFormChange: PropTypes.func.isRequired,
    // 限制类型
    limitList: PropTypes.array.isRequired,
    queryLimtList: PropTypes.func.isRequired,
    // 修改审批意见
    onChangeRemark: PropTypes.func.isRequired,
    remark: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 限制信息
      limitList: [],
      selectValue: '',
      pageNum: 1,
    };
  }

  // 生成客户表格标题列表
  @autobind
  getColumnsCustTitle() {
    const titleList = [...custTitleList];
    // 客户
    const custNameColumn = _.find(titleList, o => o.key === KEY_CUSTNAME);
    custNameColumn.render = (text, record) => {
      const value = record.custId ? `${text || ''} (${record.custId})` : '';
      return <div title={value}>{value}</div>;
    };
    // 服务经理
    const empNameColumn = _.find(titleList, o => o.key === KEY_EMPNAME);
    empNameColumn.render = (text, record) => {
      const value = record.empId ? `${text || ''} (${record.empId})` : '';
      return <div title={value}>{value}</div>;
    };
    // 限制类型
    const limitColumn = _.find(titleList, o => o.key === KEY_LIMIT);
    limitColumn.render = text => (<div title={text}>{text}</div>);
    // 如果是限制设置，则增加两列数据
    if (this.isSetLimitType()) {
      titleList.push(...moreList);
      // 对接人
      const dockingColumn = _.find(titleList, o => o.key === KEY_DOCKINGID) || {};
      dockingColumn.render = (text, record) => {
        const { edit = false, custId, dockingList = [], dockingId, dockingName } = record;
        const showName = dockingId ? `${dockingName} (${dockingId || ''})` : '';
        return edit
          ? <span><AutoComplete
            key={custId}
            placeholder="客户号/客户名称"
            showNameKey="ptyMngName"
            showIdKey="ptyMngId"
            optionList={dockingList}
            defaultValue={showName}
            onSelect={v => this.handleSelectEmp(v, record)}
            onSearch={v => this.handleSearchEmp(v, record)}
            dropdownMatchSelectWidth={false}
            style={autoCompleteStyle}
          /></span>
          : <div title={showName}>{showName}</div>;
      };
      // 禁止转出金额
      const limitNumberColumn = _.find(titleList, o => o.key === KEY_LIMIT_NUMBER) || {};
      limitNumberColumn.render = (text, record) => {
        const { edit = false, newLimitNumber = '' } = record;
        return (<div>{
        edit
        ? <Input
          value={newLimitNumber}
          placeholder="请输入禁止转出金额"
          style={{ maxWidth: '180px' }}
          onChange={e => this.handleLimitNumberChange(e, record)}
        />
        : newLimitNumber}</div>);
      };
    }
    // 添加操作列
    titleList.push({
      dataIndex: 'operate',
      key: 'operate',
      title: '操作',
      render: (text, record) => {
        const { edit } = record;
        const editElement = this.isSetLimitType()
        ? <Icon type="beizhu" onClick={() => this.editCustomerInfo(record)} />
        : null;
        return edit
        ? <div className={styles.operateColumn}>
          <a onClick={() => this.cancelOperateClick(record)}>取消</a>
          <a onClick={() => this.submitOperateClick(record)}>确定</a>
        </div>
        : <div className={styles.operateColumn}>
          {editElement}
          {this.renderPopconfirm(record)}
        </div>;
      },
      width: 100,
    });
    return titleList;
  }

  @autobind
  getLimitTypeLabel() {
    if (this.isSetLimitType()) {
      return SET_LIMITTYPE_LABEL_NAME;
    }
    return RELIEVE_LIMITTYPE_LABEL_NAME;
  }

  // 设置限制日期不可选范围
  @autobind
  setDisabledDate(current) {
    return current < moment().startOf('day');
  }

  // 更新编辑行的数据
  @autobind
  updateRecordData(record, newData) {
    const { editFormData: { custList = EMPTY_ARRAY } } = this.props;
    const newAddedCustData = [...custList];
    const findIndex = _.findIndex(newAddedCustData, o => o.custId === record.custId);
    if (findIndex > -1) {
      newAddedCustData[findIndex] = {
        ...newAddedCustData[findIndex],
        ...newData,
      };
    }
    this.handleEditFormChange(newAddedCustData, 'custList');
  }

  // 限制转出金额输入
  @autobind
  handleLimitNumberChange(e, record) {
    const value = e.target.value;
    const newData = {
      newLimitNumber: value,
    };
    this.updateRecordData(record, newData);
  }

  // 操作列编辑按钮事件
  @autobind
  editCustomerInfo(record) {
    const newData = {
      edit: true,
    };
    this.updateRecordData(record, newData);
  }

  // 选择服务经理
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择客户',
      value: '$args[0].custName',
    },
  })
  handleSelectEmp(v, record) {
    const newData = {
      newDockingId: v.ptyMngId,
      newDockingName: v.ptyMngName,
    };
    this.updateRecordData(record, newData);
  }

  // 业务对接人的搜索事件
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '搜索服务经理列表',
    },
  })
  handleSearchEmp(v, record) {
    if (!v) {
      return;
    }
    const payload = {
      keyword: v,
    };
    this.props.queryEmpData(payload).then(() => {
      const { empData } = this.props;
      const { list = [] } = empData;
      const newData = {
        dockingList: list,
      };
      this.updateRecordData(record, newData);
    });
  }

  // 操作列取消点击事件
  @autobind
  cancelOperateClick(record) {
    const newData = {
      edit: false,
      newLimitNumber: record.limitNumber,
      dockingList: [],
      newDockingId: record.dockingId,
      newDockingName: record.dockingName,
    };
    this.updateRecordData(record, newData);
  }

  // 操作列确定点击事件
  @autobind
  submitOperateClick(record) {
    const { editFormData: { limitType } } = this.props;
    const { newLimitNumber, newDockingId, newDockingName } = record;
    const newData = {
      edit: false,
      limitNumber: newLimitNumber,
      dockingList: [],
      dockingId: newDockingId,
      dockingName: newDockingName,
    };
    // 禁止转出金额输入数据并且数据错误时
    if (!_.isEmpty(newLimitNumber) && !regxp.positiveNumber.test(newLimitNumber)) {
      message.error('请填写有效禁止转出金额');
      return;
    }
    // 限制设置，并且限制类型中有 key 为 5 的类型时
    const filterLimitType = _.filter(limitType, o => o.key === KEY_LIMIT_TRANSFER_NUMBER);
    if (!_.isEmpty(filterLimitType)) {
      if (_.isEmpty(newLimitNumber)) {
        message.error('请填写禁止转出金额');
        return;
      }
    }
    this.updateRecordData(record, newData);
  }

  // 客户列表翻页事件
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '客户列表翻页' } })
  handleCustPageChange(pageNum) {
    const { editFormData: { custList = EMPTY_ARRAY } } = this.props;
    const filterResult = _.filter(custList, o => o.edit);
    if (!_.isEmpty(filterResult)) {
      Modal.error({
        title: EDIT_MESSAGE,
      });
      return 'cancel';
    }
    this.setState({
      pageNum,
    });
    return 'submit';
  }

  // 解除限制日期不可选范围
  @autobind
  relieveDisabledDate(current) {
    const { editFormData } = this.props;
    return this.isSetLimitType() ?
      // 如果操作类型是设置限制的时候，解除日期不能小于设置日期
      current <= moment(editFormData.limitStartTime, TIME_FORMAT_STRING)
      :
      // 如果操作类型是解除限制的时候，解除日期不能小于今天
      current < moment().startOf('day');
  }

  // 证券代码修改，只能输入整数
  @autobind
  handleStockCodeChange(value, type) {
    this.handleEditFormChange(value.replace(/\D/g, ''), type);
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
    this.handleEditFormChange(value, 'limitType');
  }

  // select 多选失去焦点
  @autobind
  handleSelectBlur() {
    this.setState({ selectValue: '' });
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
      });
    });
  }

  // select 联动筛选
  @autobind
  filterOption(value, option) {
    const { limitList } = this.props;
    const { key } = option;
    const { label = '' } = _.find(limitList, item => item.key === key) || {};
    return label.indexOf(value) > -1;
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
    return <div dangerouslySetInnerHTML={{ __html: keyWordText }} />;
  }

  // 判断是否是限制设置类型
  @autobind
  isSetLimitType() {
    const { detailInfo } = this.props;
    return detailInfo.operateType === SET_CODE;
  }

  // 判断是否是解除限制设置类型
  @autobind
  isRelieveLimitType() {
    const { detailInfo } = this.props;
    return detailInfo.operateType === RELIEVE_CODE;
  }

  // 判断是否需要银行确认解除材料
  @autobind
  isNeedBankConfirmFile() {
    const { detailInfo } = this.props;
    return this.isRelieveLimitType() && detailInfo.bankConfirm;
  }

  // 删除客户
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '删除客户' } })
  handleDeleteTableData(record) {
    const { editFormData: { custList = EMPTY_ARRAY } } = this.props;
    const newCustData = _.filter(custList, o => o.custId !== record.custId);
    if (_.isEmpty(newCustData)) {
      message.error('请至少保留一个客户!');
      return;
    }
    this.handleEditFormChange(newCustData, 'custList');
  }

  // form表单数据修改
  @autobind
  handleEditFormChange(value, type) {
    const { onEditFormChange } = this.props;
    onEditFormChange({ value, type });
  }

  // 文件上传成功
  @autobind
  handleUploadCallback(attachmentType, attachment) {
    const {
      editFormData: {
        attachList = EMPTY_ARRAY,
        attachmentList = EMPTY_ARRAY,
      },
    } = this.props;
    const newAttachList = attachList.map((item) => {
      if (item.type === attachmentType) {
        return {
          ...item,
          attachment,
          length: item.length + 1,
        };
      }
      return item;
    });
    // 这里是做个防止意外的处理，在驳回后修改时如果没有附件id的时候，将新的附件id传给后端
    const newAttachmentList = [...attachmentList];
    let flag = false;
    // 如果本来的attachmentList里面已经有现有的附件id就跳过，如果没有的话就将新的附件id push进去
    newAttachmentList.forEach((item) => {
      if (item.title === attachmentType) {
        flag = true;
      }
    });
    if (!flag) {
      newAttachmentList.push({
        title: attachmentType,
        attachment,
      });
    }
    // editFormData.attachList用来做校验和渲染上传相关组件
    this.handleEditFormChange(newAttachList, 'attachList');
    // editFormData.attachmentList用来传给后端
    this.handleEditFormChange(newAttachmentList, 'attachmentList');
  }

  // 文件删除成功
  @autobind
  handleDeleteCallback(attachmentType) {
    const { editFormData: { attachList = EMPTY_ARRAY } } = this.props;
    const newAttachmentList = attachList.map((item) => {
      const { type, length } = item;
      if (type === attachmentType && length > 0) {
        return {
          ...item,
          length: length - 1,
        };
      }
      return item;
    });
    this.handleEditFormChange(newAttachmentList, 'attachList');
  }

  // 设置限制时间切换事件
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '选择限制时间' } })
  handleStartDateChange(date, dateStr) {
    this.handleEditFormChange(dateStr, 'limitStartTime');
  }

  // 解除限制时间切换事件
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '选择限制解除时间' } })
  handleEndDateChange(date, dateStr) {
    this.handleEditFormChange(dateStr, 'limitEndTime');
  }

  // 渲染点击删除按钮后的确认框
  @autobind
  renderPopconfirm(type, record) {
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
      detailInfo,
      editFormData,
      onChangeRemark,
      remark,
    } = this.props;
    const {
      limitList,
      selectValue,
      pageNum,
    } = this.state;

    if (_.isEmpty(editFormData)) {
      return null;
    }
    // 客户标题列表
    const custTitle = this.getColumnsCustTitle();

    const showCustList = _.chunk(editFormData.custList, 5);
    const paginationProps = {
      current: pageNum,
      pageSize: DEFAULT_PAGE_SIZE,
      total: editFormData.custList.length,
      hideOnSinglePage: true,
      showTotal: total => `共 ${total} 条`,
      onChange: this.handleCustPageChange,
    };

    const approverName = !_.isEmpty(detailInfo.currentApproval) ?
      `${detailInfo.currentApproval.empName} (${detailInfo.currentApproval.empNum})` : '暂无';
    const nowStep = {
      // 当前步骤
      stepName: detailInfo.currentNodeName || '暂无',
      // 当前审批人
      handleName: approverName,
    };

    // 拟稿人信息
    const drafter = `${detailInfo.orgName} - ${detailInfo.empName} (${detailInfo.empId})`;
    return (
      <div className={styles.formContent}>
        <div className={styles.contentItem}>
          <h2 className={styles.numberTitle}>编号{detailInfo.id}</h2>
        </div>
        <div className={`${styles.cutline} ${styles.mt20}`} />
        <div className={styles.contentItem}>
          <InfoTitle head="基本信息" />
          <InfoForm label="操作类型" style={{ width: '122px' }}>
            {(_.filter(operateTypeArray, item =>
                item.value === detailInfo.operateType)[0] || {}).label}
          </InfoForm>
          <InfoForm label="公司简称" className={styles.inlineInfoForm} required>
            <Input
              value={editFormData.companyName}
              onChange={e => this.handleEditFormChange(e.target.value, 'companyName')}
            />
          </InfoForm>
          <InfoForm label="证券代码" className={styles.inlineInfoForm} required>
            <Input
              value={editFormData.stockCode}
              onChange={e => this.handleStockCodeChange(e.target.value, 'stockCode')}
            />
          </InfoForm>
          {
            // 操作类型是限制解除时才显示
            this.isRelieveLimitType() ?
              (<InfoForm label="是否银行确认" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
                {detailInfo.bankConfirm ? '是' : '否'}
              </InfoForm>)
              :
              null
          }
        </div>
        <div className={styles.cutline} />
        <div className={styles.contentItem}>
          <InfoTitle head="客户列表" />
          <div className={styles.tableDiv}>
            <CommonTable
              rowKey="custId"
              align="left"
              data={showCustList[pageNum - 1]}
              titleList={custTitle}
            />
            <Pagination {...paginationProps} />
          </div>
        </div>
        <div className={`${styles.cutline} ${styles.mt48}`} />
        <div className={styles.contentItem}>
          <InfoTitle head="限制信息" />
          <InfoForm label={this.getLimitTypeLabel()} className={styles.infoFormSelect} required>
            <AntdSelect
              mode="multiple"
              labelInValue
              value={editFormData.limitType || EMPTY_ARRAY}
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
            this.isSetLimitType() ?
              (<InfoForm label="账户限制设置日期" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
                <DatePicker
                  disabledDate={this.setDisabledDate}
                  defaultValue={moment(editFormData.limitStartTime || '', TIME_FORMAT_STRING)}
                  onChange={this.handleStartDateChange}
                />
              </InfoForm>)
            :
              null
          }
          <InfoForm label="账户限制解除日期" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
            <DatePicker
              disabledDate={this.relieveDisabledDate}
              defaultValue={moment(editFormData.limitEndTime || '', TIME_FORMAT_STRING)}
              onChange={this.handleEndDateChange}
            />
          </InfoForm>
        </div>
        <div className={styles.cutline} />
        <div className={styles.contentItem}>
          <InfoTitle head="拟稿信息" />
          <InfoItem label="拟稿人" value={drafter} />
          <InfoItem label="申请时间" value={time.format(detailInfo.createTime)} />
          <InfoItem label="状态" value={detailInfo.status} />
        </div>
        <div className={`${styles.cutline} ${styles.mt14}`} />
        <div className={styles.contentItem}>
          <InfoTitle head="附件信息" />
          {
            (editFormData.attachList || EMPTY_ARRAY).map((item) => {
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
        <div className={`${styles.cutline} ${styles.mt14}`} />
        <div className={styles.contentItem}>
          <InfoTitle head="审批" />
          <InfoForm label="审批意见" style={{ width: '68px', verticalAlign: 'top' }} className={styles.inlineInfoForm}>
            <TextArea
              value={remark}
              onChange={onChangeRemark}
            />
          </InfoForm>
        </div>
        <div className={`${styles.cutline} ${styles.mt14}`} />
        <div className={styles.contentItem}>
          <InfoTitle head="审批记录" />
          <ApproveList data={detailInfo.workflowHistoryBeans} nowStep={nowStep} />
        </div>
      </div>
    );
  }
}
