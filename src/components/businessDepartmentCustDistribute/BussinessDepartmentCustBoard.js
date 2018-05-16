/**
 * @Author: sunweibin
 * @Date: 2018-05-10 10:46:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-16 19:36:04
 * @description 营业部非投顾签约客户分配弹出层Form
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table, Radio, Upload, message, Modal } from 'antd';
import _ from 'lodash';

import Icon from '../common/Icon';
import InfoTitle from '../common/InfoTitle';
import Button from '../common/Button';
import AddCustListLayer from './AddCustListLayer';
import AddEmpListLayer from './AddEmpListLayer';
import TableDialog from '../common/biz/TableDialog';
import { request } from '../../config';
import { emp, file as fileHelper } from '../../helper';
import {
  custTableColumns,
  managerTableColumns,
  tableCommonPagination,
  approvalColumns,
} from './config';
import { createAddLayerCustTableDate } from './utils';

import custTempleteFile from './custTemplete.xlsx';
import styles from './bussinessDepartmentCustBoard.less';

const RadioGroup = Radio.Group;
// 批量导入数据上传数据的Upload的上传地址
const UPLOAD_URL = `${request.prefix}/file/uploadTemp`;
// 客户列表的最大边界值,目前暂定 400
const CUST_LIST_BOUNDARY_VALUE = 400;

export default class BussinessDepartmentCustBoard extends Component {
  static propTypes = {
    // 接口回调函数集合
    callbacks: PropTypes.objectOf(PropTypes.func).isRequired,
    // 服务经理列表
    empList: PropTypes.array,
    // Excel上传的客户列表数据
    custListInExcel: PropTypes.array,
    // 筛选后的客户列表数据
    custListByFilter: PropTypes.object,
    custListByQuery: PropTypes.array,
    empListByQuery: PropTypes.array,
    devEmpListByQuery: PropTypes.array,
  }

  static defaultProps = {
    empList: [],
    custListInExcel: [],
    custListByQuery: [],
    empListByQuery: [],
    devEmpListByQuery: [],
    custListByFilter: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      // 供用户选择的下一步审批人列表
      approvalList: [],
      // 客户列表
      custList: [],
      // 判断客户列表总数有无达到最大值
      hasReachBoundary: false,
      // 服务经理列表
      managerList: [],
      // 客户分配规则
      rule: '',
      // 是否需要显示分配规则
      isShowRuleRadio: false,
      // 审批人
      approval: '',
      // 用户已经批量上传过一次客户Excel了
      hasUploaded: false,
      // 弹出用户选择客户进行添加的弹出层
      addCustModal: false,
      // 弹出用户选择服务经理进行添加的弹出层
      addEmpModal: false,
      // 是否需要添加审批人,如果需要则弹出审批人添加框
      nextApproverModal: false,
    };
  }

  componentDidMount() {
    // 初始化的时候，需要查询下所有的服务经理列表
    // 然后在服务经理选择的弹出层中进行筛选
    this.props.callbacks.getEmpList({ orgId: emp.getOrgId() });
  }

  @autobind
  deleteCust(record) {
    // 目前客户列表数据删除由前端完成
    const { custList } = this.state;
    // 数组的 splice 方式会改变原数组，所以先 cloneDeep 一把
    const tempList = [...custList];
    const index = _.findIndex(custList, cust => cust.brokerNumber === record.brokerNumber);
    tempList.splice(index, 1);
    // 删除的情况下肯定是不会达到客户列表的最大值的
    this.setState({ custList: tempList, hasReachBoundary: false });
  }

  @autobind
  deleteEmp(record) {
    // 数组的 splice 方式会改变原数组，所以先 cloneDeep 一把
    const { managerList, rule } = this.state;
    const tempList = _.cloneDeep(managerList);
    const index = _.findIndex(managerList, manager => manager.empId === record.empId);
    tempList.splice(index, 1);
    const isShowRuleRadio = _.size(tempList) > 1;
    const newRule = isShowRuleRadio ? rule : '';
    this.setState({
      managerList: tempList,
      isShowRuleRadio,
      rule: newRule,
    });
  }

  @autobind
  addCustInTable(list = []) {
    if (!_.isEmpty(list)) {
      const { custList } = this.state;
      const newList = _.uniqBy([...custList, ...list], 'brokerNumber');
      // 客户列表的总数不能超过阀值
      const hasReachBoundary = _.size(newList) >= CUST_LIST_BOUNDARY_VALUE;
      this.setState({
        custList: _.slice(newList, 0, CUST_LIST_BOUNDARY_VALUE),
        hasReachBoundary,
      });
    }
  }

  @autobind
  handleBatchImportCustChange(info) {
    // 批量导入客户列表Excel
    const { file: { response } } = info;
    if (response && response.code === '0') {
      // Excel表格上传成功，此处需要调用获取Excel表格中的客户列表信息的 api
      // 一次性全部获取
      const attachment = response.resultData;
      this.props.callbacks.getCustListInExcel({ attachment })
      .then(() => this.addCustInTable(this.props.custListInExcel));
    } else {
      message.error(response.msg);
    }
  }

  @autobind
  handleBeforeUploadFile(file) {
    const isExcel = fileHelper.isExcel(file.type);
    if (!isExcel) {
      message.error('只支持Excel文件！');
    }
    return isExcel;
  }

  @autobind
  handleCustAddBtnClick() {
    // 判断如果客户列表数据等于了总数阀值，则弹框提示不能再添加
    const { custList } = this.state;
    const isCustListReachBoundaryValue = _.size(custList) >= CUST_LIST_BOUNDARY_VALUE;
    if (isCustListReachBoundaryValue) {
      this.showWarningOfReachedBoundary();
    } else {
      this.setState({
        addCustModal: true,
      });
    }
  }

  @autobind
  showWarningOfReachedBoundary() {
    // 此方法用于在当客户列表总数达到可添加的最大值时，提醒申请人不能再添加
    Modal.warning({
      content: `添加的客户分配数量已经达到${CUST_LIST_BOUNDARY_VALUE},不能再添加更多!`,
    });
  }

  @autobind
  handleManagerAddBtnClick() {
    this.setState({
      addEmpModal: true,
    });
  }

  @autobind
  handleDelete(tableName, record) {
    if (tableName === 'cust') {
      this.deleteCust(record);
    } else {
      this.deleteEmp(record);
    }
  }

  @autobind
  handleCustDistributeRuleRadioChange(e) {
    this.setState({ rule: e.target.value });
  }

  @autobind
  handleAddCustLyerClose() {
    this.setState({
      addCustModal: false,
    });
  }

  @autobind
  handleFilterCustList(query) {
    this.props.callbacks.filterCustList(query);
  }

  // 针对添加客户列表中的弹出层的客户、服务经理、开发经理的查询接口
  @autobind
  handleDropdownSelectQuery({ api, query }) {
    if (api === 'cust') {
      this.props.callbacks.queryDistributeCust(query);
    } else if (api === 'emp') {
      this.props.callbacks.queryDistributeEmp(query);
    } else if (api === 'devEmp') {
      this.props.callbacks.queryDistributeDevEmp(query);
    }
  }

  @autobind
  handleAddEmpLyerClose() {
    this.setState({
      addEmpModal: false,
    });
  }

  @autobind
  handleApprovalModalCancel() {
    this.setState({ nextApproverModal: false });
  }

  @autobind
  handleAddCustLayerSubmit(custList) {
    this.addCustInTable(custList);
    this.handleAddCustLyerClose();
  }

  @autobind
  handleAddEmpLayerSubmit(list = []) {
    // 此处需要保留以前选中的
    const { managerList } = this.state;
    // 挑选出不同的数据，然后将不同的数据与原有的数据合并
    // 如果原有的 managerList 数据是空，则直接使用list数据
    let tempList = [...list];
    if (!_.isEmpty(managerList)) {
      tempList = _.uniqBy([...list, ...managerList], 'empId');
    }
    const newList = tempList.map(item => ({
      emp: `${item.empName}(${item.empId})`,
      ...item,
    }));
    // 如果有多个服务经理，则显示分配规则，
    // 如果只有1个服务经理，则不显示分配规则
    const isShowRuleRadio = _.size(list) > 1;
    this.setState({ managerList: newList, isShowRuleRadio });
  }

  @autobind
  updateCustTableColumns(columns, tableName) {
    // 给最后一个Column的操作，添加操作action
    const deleteRecord = record => () => this.handleDelete(tableName, record);
    return [
      ...columns,
      {
        dataIndex: 'action',
        key: 'action',
        title: '操作',
        render(text, record) {
          return (
            <a onClick={deleteRecord(record)}>
              <Icon type="shanchu" className={styles.deleteBtn} />
            </a>
          );
        },
      },
    ];
  }

  // 当批量导入客户数据成功之后，需要将批量导入的DOM替换成另一个DOM
  // 因为当已经上传成功后，再次上传需要提示用户，之前的所有数据将被覆盖
  @autobind
  renderBatchImportDataDom() {
    // 目前可以连续添加和上传客户，只需要去重就行
    // 但是客户列表数量有限，如果达到 CUST_LIST_BOUNDARY_VALUE,则不能再上传添加客户
    const { hasReachBoundary } = this.state;
    if (hasReachBoundary) {
      return (
        <a className={styles.downloadLink} onClick={this.showWarningOfReachedBoundary}>批量导入数据</a>
      );
    }
    return (
      <Upload
        beforeUpload={this.handleBeforeUploadFile}
        showUploadList={false}
        data={{
          empId: emp.getId(),
          attachment: '',
        }}
        action={UPLOAD_URL}
        onChange={this.handleBatchImportCustChange}
      >
        <a className={styles.downloadLink}>批量导入数据</a>
      </Upload>
    );
  }

  render() {
    const {
      empList,
      custListByFilter,
      devEmpListByQuery,
      custListByQuery,
      empListByQuery,
    } = this.props;
    const {
      approvalList,
      custList,
      managerList,
      addCustModal,
      addEmpModal,
      nextApproverModal,
      isShowRuleRadio,
    } = this.state;
    const newCustTableColumns = this.updateCustTableColumns(custTableColumns, 'cust');
    const newEmpTableColumns = this.updateCustTableColumns(managerTableColumns, 'emp');
    const newCustList = createAddLayerCustTableDate(custList);

    return (
      <div className={styles.boardContainer}>
        <InfoTitle head="客户列表" />
        <div className={styles.blocker}>
          <div className={styles.header}>
            <Button type="primary" ghost onClick={this.handleCustAddBtnClick}>添加</Button>
            <div className={styles.custTableHeaderRight}>
              <a href={custTempleteFile} className={styles.downloadLink}>下载导入模板</a>
              {this.renderBatchImportDataDom()}
            </div>
          </div>
          <Table
            dataSource={newCustList}
            columns={newCustTableColumns}
            pagination={tableCommonPagination}
          />
        </div>
        <InfoTitle head="服务经理列表" />
        <div className={styles.blocker}>
          <div className={styles.header}>
            <Button type="primary" ghost onClick={this.handleManagerAddBtnClick}>添加</Button>
          </div>
          <Table
            dataSource={managerList}
            columns={newEmpTableColumns}
            pagination={tableCommonPagination}
          />
        </div>
        {
          !isShowRuleRadio ? null
          : (<InfoTitle head="客户分配规则" />)
        }
        {
          !isShowRuleRadio ? null
          : (
            <div className={styles.blocker}>
              <div className={styles.distributeRuleText}>
                <span className={styles.required}>*</span>规则:
              </div>
              <RadioGroup onChange={this.handleCustDistributeRuleRadioChange}>
                <Radio value="a">平均客户数</Radio>
                <Radio value="b">平均客户净资产</Radio>
              </RadioGroup>
            </div>
          )
        }
        {
          !addCustModal ? null
          : (
            <AddCustListLayer
              devEmpListByQuery={devEmpListByQuery}
              custListByQuery={custListByQuery}
              empListByQuery={empListByQuery}
              data={custListByFilter}
              visible={addCustModal}
              onOK={this.handleAddCustLayerSubmit}
              onClose={this.handleAddCustLyerClose}
              onFilterCust={this.handleFilterCustList}
              onQuery={this.handleDropdownSelectQuery}
            />
          )
        }
        {
          !addEmpModal ? null
          : (
            <AddEmpListLayer
              data={empList}
              visible={addEmpModal}
              onOK={this.handleAddEmpLayerSubmit}
              onClose={this.handleAddEmpLyerClose}
            />
          )
        }
        {
          !nextApproverModal ? null
          : (
            <TableDialog
              visible={nextApproverModal}
              onOk={this.sendCreateRequest}
              onCancel={this.handleApprovalModalCancel}
              dataSource={approvalList}
              columns={approvalColumns}
              title="选择下一审批人员"
              modalKey="distributeApplyApprovalModal"
              rowKey="login"
              searchShow={false}
            />
          )
        }
      </div>
    );
  }
}
