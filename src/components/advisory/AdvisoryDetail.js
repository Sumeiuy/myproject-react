/**
 * @file components/advisory/AdvisoryDetail.js
 *  咨询订阅详情
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonUpload from '../common/biz/CommonUpload';
import ApproveList from '../common/approveList';
import CommonTable from '../common/biz/CommonTable';
import styles from './advisoryDetail.less';

// 客户信息表表头
const custTitleList = [
  {
    dataIndex: 'custId',
    key: 'custId',
    title: '经济客户号',
  },
  {
    dataIndex: 'custName',
    key: 'custName',
    title: '客户名称',
  },
  {
    dataIndex: 'custLevel',
    key: 'custLevel',
    title: '客户等级',
  },
  {
    dataIndex: 'openAccDept',
    key: 'openAccDept',
    title: '开户营业部',
  },
  {
    dataIndex: 'serviceManager',
    key: 'serviceManager',
    title: '服务经理',
  },
];

// 产品选择表表头
const proTitleList = [
  {
    dataIndex: 'proId',
    key: 'proId',
    title: '产品代码',
  },
  {
    dataIndex: 'proName',
    key: 'proName',
    title: '产品名称',
  },
  {
    dataIndex: 'riskMatchOrNot',
    key: 'riskMatchOrNot',
    title: '风险是否匹配',
  },
  {
    dataIndex: 'termMatchOrNot',
    key: 'termMatchOrNot',
    title: '期限是否匹配',
  },
  {
    dataIndex: 'investmentVarieties',
    key: 'investmentVarieties',
    title: '投资品种是否匹配',
  },
  {
    dataIndex: 'confirmationType',
    key: 'confirmationType',
    title: '签署确认书类型',
  },
];

// 附件测试数据模板
const attachmentList = [
  {
    creator: '002332',
    attachId: '{6795CB98-B0CD-4CEC-8677-3B0B9298B209}',
    name: '新建文本文档 (3).txt',
    size: '0',
    createTime: '2017/09/12 13:37:45',
    downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={6795CB98-B0CD-4CEC-8677-3B0B9298B209}',
    realDownloadURL: '/attach/download?filename=%E6%96%B0%E5%BB%BA%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3+%283%29.txt&attachId={6795CB98-B0CD-4CEC-8677-3B0B9298B209',
  },
  {
    creator: '002332',
    attachId: '{2EF837DE-508C-4FCA-93B8-99CEA68DCB0D}',
    name: '测试.docx',
    size: '11',
    createTime: '2017/09/12 11:53:36',
    downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={2EF837DE-508C-4FCA-93B8-99CEA68DCB0D}',
    realDownloadURL: '/attach/download?filename=%E6%B5%8B%E8%AF%95.docx&attachId={2EF837DE-508C-4FCA-93B8-99CEA68DCB0D',
  },
  {
    creator: '002332',
    attachId: '{24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F}',
    name: '生产sql和修改后sql.txt',
    size: '2',
    createTime: '2017/09/12 11:55:32',
    downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F}',
    realDownloadURL: '/attach/download?filename=%E7%94%9F%E4%BA%A7sql%E5%92%8C%E4%BF%AE%E6%94%B9%E5%90%8Esql.txt&attachId={24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F',
  },
];

// 产品选择表单测试数据模板
const proList = [
  {
    key: 1,
    proId: 'SP001',
    proName: '成交回报（短信）',
    riskMatchOrNot: '是',
    termMatchOrNot: '是',
    investmentVarieties: '是',
    confirmationType: '未知',
    children: [
      {
        key: '001',
        proId: '111',
        proName: '成交',
        riskMatchOrNot: '是',
        termMatchOrNot: '是',
        investmentVarieties: '是',
        confirmationType: '未知',
      },
      {
        key: '002',
        proId: '112',
        proName: '成交',
        riskMatchOrNot: '是',
        termMatchOrNot: '是',
        investmentVarieties: '是',
        confirmationType: '未知',
      },
    ],
  },
  {
    key: 2,
    proId: 'SP002',
    proName: '量价异动警告（短信）',
    riskMatchOrNot: '是',
    termMatchOrNot: '是',
    investmentVarieties: '是',
    confirmationType: '未知',
  },
  {
    key: 3,
    proId: 'SP003',
    proName: '成交回报（短信）',
    riskMatchOrNot: '是',
    termMatchOrNot: '是',
    investmentVarieties: '是',
    confirmationType: '未知',
  },
];

export default class Singlecommissiondetail extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    checkApproval: PropTypes.func.isRequired,
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  render() {
    const { data, location: { query: { currentId = '' } } } = this.props;
    const {
      custList = [],
      businessType,
      comments,
      divisionName,
      createdByName,
      createdByLogin,
      created,
      status,
    } = data;

    const bugTitle = `编号${currentId}`;
    const drafter = `${divisionName} - ${createdByName} (${createdByLogin})`;
    return (
      <div className={styles.detailBox}>
        <div className={styles.inner}>
          <h1 className={styles.bugTitle}>{bugTitle}</h1>
          <div id="detailModule" className={styles.module}>
            <InfoTitle head="基本信息" />
            <div className={styles.modContent}>
              <ul className={styles.propertyList}>
                <li className={styles.item}>
                  <InfoItem label="子类型" value={businessType} />
                </li>
                <li className={styles.item}>
                  <InfoItem label="备注" value={comments} />
                </li>
              </ul>
            </div>
          </div>
          <div id="nginformation_module" className={styles.module}>
            <InfoTitle head="拟稿信息" />
            <div className={styles.modContent}>
              <ul className={styles.propertyList}>
                <li className={styles.item}>
                  <InfoItem label="拟稿人" value={drafter} />
                </li>
                <li className={styles.item}>
                  <InfoItem label="提请时间" value={created} />
                </li>
                <li className={styles.item}>
                  <InfoItem label="状态" value={status} />
                </li>
              </ul>
            </div>
          </div>
          <div id="customer_module" className={styles.module}>
            <InfoTitle head="客户信息" />
            <div className={styles.modContent}>
              <CommonTable
                data={custList}
                titleList={custTitleList}
                pagination={{
                  pageSize: 5,
                }}
              />
            </div>
          </div>
          <div id="productSelectionmodal" className={styles.module}>
            <InfoTitle head="产品选择" />
            <div className={styles.modContent}>
              <CommonTable
                data={proList}
                titleList={proTitleList}
                pagination={{
                  pageSize: 5,
                }}
              />
            </div>
          </div>
          <div id="enclosure" className={styles.module}>
            <InfoTitle head="附件" />
            <CommonUpload
              attachmentList={attachmentList}
            />
          </div>
          <div id="approvalRecord" className={styles.module}>
            <InfoTitle head="审批记录" />
            <ApproveList />
          </div>
        </div>
      </div>
    );
  }
}

