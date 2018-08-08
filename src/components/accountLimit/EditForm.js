/**
 * @Author: XuWenKang
 * @Description: 账户限制管理-驳回后修改表单
 * @Date: 2018-08-08 09:21:07
 * @Last Modified by:   XuWenKang
 * @Last Modified time: 2018-08-08 09:21:07
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message, DatePicker, Input, Select as AntdSelect, Spin, Popconfirm } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import InfoTitle from '../common/InfoTitle';
import InfoForm from '../common/infoForm';
// import Button from '../../components/common/Button';
import InfoItem from '../common/infoItem';
import ApproveList from '../common/approveList';
import CommonTable from '../../components/common/biz/CommonTable';
import MultiUploader from '../common/biz/MultiUploader';
import Icon from '../../components/common/Icon';
import logable from '../../decorators/logable';
// import { request } from '../../config';
import { time } from '../../helper';
import config from './config';
import styles from './editForm.less';

const TextArea = Input.TextArea;
const Option = AntdSelect.Option;

// 用于找到select类组件渲染option时父级容器的方法,以解决在弹窗里页面滚动，option随页面滚动的问题
// const getPopupContainerFunction = () => document.querySelector(`.${styles.modalContent}`);
// const EMPTY_PARAM = '暂无';
// const EMPTY_OBJECT = {};
// const EMPTY_ARRAY = [];
// 表头
const {
  tableTitle: { custList: custTitleList },
  operateTypeArray,
  attachmentMap,
} = config;
// 登陆人的组织 ID
// const empOrgId = emp.getOrgId();
const DEFAULTPAGESIZE = 5;
// 客户
const KEY_CUSTNAME = 'custName';
export default class EditForm extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 详情数据
    detailInfo: PropTypes.object.isRequired,
    // 用于编辑的数据
    editFormData: PropTypes.object.isRequired,
    // 获取按钮数据和下一步审批人
    // selfBtnGroup: PropTypes.object.isRequired,
    queryButtonList: PropTypes.func.isRequired,
    // 限制类型
    limitList: PropTypes.array.isRequired,
    queryLimtList: PropTypes.func.isRequired,
    // 提交保存
    saveChange: PropTypes.func.isRequired,
    // 关闭弹窗
    // closeModal: PropTypes.func.isRequired,
    // 弹窗状态
    // visible: PropTypes.bool.isRequired,
    // clearData: PropTypes.func.isRequired,
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

  @autobind
  handleEditFormChange(value, type) {
    console.log(value, type);
  }

  @autobind
  handleInputChange(e, type) {
    this.handleEditFormChange(e.target.value, type);
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
      detailInfo,
      editFormData,
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
    const editPageAttachmentList = [attachmentMap[0]];
    // 如果操作类型是解除限制，并且 是否和银行确认字段为 true时才显示银行确认解除材料
    if (detailInfo.operateType === config.relieveCode && detailInfo.isBankConfirm) {
      editPageAttachmentList.push(attachmentMap[1]);
    }

    // 客户标题列表
    const custTitle = this.getColumnsCustTitle();

    const paginationProps = {
      defaultPageSize: DEFAULTPAGESIZE,
      hideOnSinglePage: true,
      showTotal: total => `共 ${total} 条`,
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
          <h2 className={styles.numberTitle}>编号{detailInfo.appId}</h2>
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
              onChange={e => this.handleEditFormChange(e.target.value, 'stockCode')}
            />
          </InfoForm>
          {
            // 操作类型是限制解除时才显示
            detailInfo.operateType === config.relieveCode ?
              (<InfoForm label="是否银行确认" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
                {detailInfo.isBankConfirm ? '是' : '否'}
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
              align="left"
              data={editFormData.custList}
              titleList={custTitle}
              pagination={paginationProps}
            />
          </div>
        </div>
        <div className={`${styles.cutline} ${styles.mt48}`} />
        <div className={styles.contentItem}>
          <InfoTitle head="限制信息" />
          <InfoForm label="解除限制类型" required>
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
          {
            detailInfo.operateType === config.setCode ?
              (<InfoForm label="账户限制设置日期" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
                <DatePicker
                  value={moment(detailInfo.limitStartTime || '', config.timeFormatStr)}
                  onChange={(date, dateStr) => this.handleEditFormChange(dateStr, 'limitStartTime')}
                />
              </InfoForm>)
            :
              null
          }
          <InfoForm label="账户限制解除日期" style={{ width: '160px' }} className={styles.inlineInfoForm} required>
            <DatePicker
              value={moment(detailInfo.limitEndTime || '', config.timeFormatStr)}
              onChange={(date, dateStr) => this.handleEditFormChange(dateStr, 'limitEndTime')}
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
            editPageAttachmentList.map((item) => {
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
        <div className={`${styles.cutline} ${styles.mt14}`} />
        <div className={styles.contentItem}>
          <InfoTitle head="审批" />
          <InfoForm label="审批意见" style={{ width: '68px', verticalAlign: 'top' }} className={styles.inlineInfoForm}>
            <TextArea />
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
