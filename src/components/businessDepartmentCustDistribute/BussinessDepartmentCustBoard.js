/**
 * @Author: sunweibin
 * @Date: 2018-05-10 10:46:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-11 14:27:38
 * @description 营业部非投顾签约客户分配弹出层Form
 */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table, Radio, Upload, message } from 'antd';
// import _ from 'lodash';

import Icon from '../common/Icon';
import InfoTitle from '../common/InfoTitle';
import Button from '../common/Button';
import AddCustListLayer from './AddCustListLayer';
import { request } from '../../config';
import { emp, file as fileHelper } from '../../helper';
import {
  custTableColumns,
  managerTableColumns,
  tableCommonPagination,
} from './config';

import custTempleteFile from './custTemplete.xlsx';
import styles from './bussinessDepartmentCustBoard.less';

const RadioGroup = Radio.Group;
// 批量导入数据上传数据的Upload的上传地址
// const UPLOAD_URL = `${request.prefix}/file/uploadTemp`;
const UPLOAD_URL = `${request.prefix}/groovynoauth/fsp/cust/manager/batchUploadCustByExcel`;

export default class BussinessDepartmentCustBoard extends Component {
  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props);

    this.state = {
      // 客户列表
      custList: [],
      // 服务经理列表
      managerList: [],
      // 客户分配规则
      rule: '',
      // 用户已经批量上传过一次客户Excel了
      hasUploaded: false,
      // 弹出用户选择客户进行添加的弹出层
      addCustModal: false,
    };
  }

  @autobind
  deleteCust(record) {
    console.warn('deleteCust: ', record);
  }

  @autobind
  deleteEmp(record) {
    console.warn('deleteEmp: ', record);
  }

  @autobind
  handleBatchImportCustChange(info) {
    // 批量导入客户列表Excel
    console.warn('handleBatchImportCustChange: ', info);
  }

  @autobind
  handleBatchImportClick() {
    console.warn('已经上传过一次批量导入了');
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
    this.setState({
      addCustModal: true,
    });
  }

  @autobind
  handleManagerAddBtnClick() {
    console.warn('点击添加服务经理列表');
  }

  @autobind
  handleDelete(tableName, record) {
    if (tableName === 'cust') {
      this.deleteCust(record);
    } else {
      this.deleteEmpt(record);
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
  handleAddCustLayerSubmit(custList) {
    console.warn('添加选择的客户到客户Table中： ', custList);
  }

  @autobind
  updateCustTableColumns(columns, tableName) {
    // 给最后一个Column的操作，添加操作action
    return [
      ...columns,
      {
        dataIndex: 'action',
        key: 'action',
        title: '操作',
        render(text, record) {
          return (
            <a onClick={() => this.handleDeleteEmp(tableName, record)}>
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
    const { hasUploaded } = this.state;
    if (hasUploaded) {
      return (<a onClick={this.handleBatchImportClick} className={styles.downloadLink}>批量导入数据</a>);
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
    const { custList, managerList, addCustModal } = this.state;
    const newCustTableColumns = this.updateCustTableColumns(custTableColumns, 'cust');
    const newEmpTableColumns = this.updateCustTableColumns(managerTableColumns, 'emp');
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
            dataSource={custList}
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
        <InfoTitle head="客户分配规则" />
        <div className={styles.blocker}>
          <div className={styles.distributeRuleText}>
            <span className={styles.required}>*</span>规则:
          </div>
          <RadioGroup onChange={this.handleCustDistributeRuleRadioChange}>
            <Radio value="a">平均客户数</Radio>
            <Radio value="b">平均客户净资产</Radio>
          </RadioGroup>
        </div>
        <AddCustListLayer
          visible={addCustModal}
          onOK={this.handleAddCustLayerSubmit}
          onClose={this.handleAddCustLyerClose}
          onFilterCust={() => {}}
        />
      </div>
    );
  }
}
