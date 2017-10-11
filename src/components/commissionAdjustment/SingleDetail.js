/**
 * @file components/commissionAdjustment/SingleDetail.js
 *  单佣金详情
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import OtherCommission from './OtherCommission';
import CommonUpload from '../common/biz/CommonUpload';
import ApproveList from '../common/approveList';
import CommonTable from '../common/biz/CommonTable';
import styles from './singleDetail.less';

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
    dataIndex: 'commisionValue',
    key: 'commisionValue',
    title: '佣金率',
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
];

// 附件测试数据模板
const testAttachmentList = [
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
const testProList = [
  {
    key: 1,
    proId: 'SP001',
    proName: '成交回报（短信）',
    commisionValue: '0.21‰',
    riskMatchOrNot: '是',
    termMatchOrNot: '是',
    children: [
      {
        key: '001',
        proId: '111',
        proName: '成交',
        commisionValue: '0.11‰',
        riskMatchOrNot: '是',
        termMatchOrNot: '是',
      },
      {
        key: '002',
        proId: '112',
        proName: '成交',
        commisionValue: '0.11‰',
        riskMatchOrNot: '是',
        termMatchOrNot: '是',
      },
    ],
  },
  {
    key: 2,
    proId: 'SP002',
    proName: '量价异动警告（短信）',
    commisionValue: '0.21‰',
    riskMatchOrNot: '是',
    termMatchOrNot: '是',
  },
  {
    key: 3,
    proId: 'SP003',
    proName: '成交回报（短信）',
    commisionValue: '0.21‰',
    riskMatchOrNot: '是',
    termMatchOrNot: '是',
  },
];

// 审批记录测试模板
const testApproveList = [
  {
    id: '1',
    approver: '002332',
    time: '2017-09-21 13:39:21',
    stepName: '流程发起',
    status: '同意',
    statusDescription: '这里是审批意见，有很多的意见，说不完的意见',
  },
  {
    id: '2',
    approver: '002332',
    time: '2017-09-21 13:39:21',
    stepName: '流程发起',
    status: '同意',
    statusDescription: '这里是审批意见，有很多的意见，说不完的意见',
  },
  {
    id: '3',
    approver: '002332',
    time: '2017-09-21 13:39:21',
    stepName: '流程发起',
    status: '同意',
    statusDescription: '这里是审批意见，有很多的意见，说不完的意见',
  },
  {
    id: '4',
    approver: '002332',
    time: '2017-09-21 13:39:21',
    stepName: '流程发起',
    status: '同意',
    statusDescription: '这里是审批意见，有很多的意见，说不完的意见',
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
      proList = testProList, // 产品选择表数据
      newCommission, // 目标股基佣金率
      bgCommission, // B股
      zqCommission, // 债券
      hCommission, // 回购
      oCommission, // 场内基金
      qCommission, // 权证
      stkCommission, // 担保股基
      dzCommission, // 担保债券
      doCommission, // 担保场内基金
      dqCommission, // 担保权证
      creditCommission, // 信用股基
      coCommission, // 信用场内基金
      hkCommission, // 港股通（净佣金）
      opCommission, // 个股期权
      ddCommission, // 担保品大宗
      stbCommission, // 股转
      dCommission, // 大宗交易
      attachmentList = testAttachmentList, // 附件
      approveList = testApproveList, // 审批记录
    } = data;

    const bugTitle = `编号${currentId}`;
    const drafter = `${divisionName} - ${createdByName} (${createdByLogin})`;
    const targetCom = `${newCommission}‰`;
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
          <div id="choosecommission" className={styles.module}>
            <InfoTitle head="佣金" />
            <div className={styles.modContent}>
              <ul className={styles.propertyList}>
                <li className={styles.item}>
                  <InfoItem label="目标股基佣金率" value={targetCom} />
                </li>
              </ul>
            </div>
          </div>
          <div id="processing" className={styles.module}>
            <InfoTitle head="其他佣金费率" />
            <div className={styles.modContent}>
              <div className={styles.leftCommission}>
                <OtherCommission name="B股：" value={bgCommission} />
                <OtherCommission name="债券：" value={zqCommission} />
                <OtherCommission name="回购：" value={hCommission} />
                <OtherCommission name="场内基金：" value={oCommission} />
                <OtherCommission name="权证：" value={qCommission} />
                <OtherCommission name="担保股基：" value={stkCommission} />
                <OtherCommission name="担保债券：" value={dzCommission} />
                <OtherCommission name="担保场内基金：" value={doCommission} />
              </div>
              <div className={styles.rightCommission}>
                <OtherCommission name="担保权证：" value={dqCommission} />
                <OtherCommission name="信用股基：" value={creditCommission} />
                <OtherCommission name="信用场内基金：" value={coCommission} />
                <OtherCommission name="港股通（净佣金）：" value={hkCommission} />
                <OtherCommission name="个股期权：" value={opCommission} />
                <OtherCommission name="担保品大宗：" value={ddCommission} />
                <OtherCommission name="股转：" value={stbCommission} />
                <OtherCommission name="大宗交易：" value={dCommission} />
              </div>
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
            <ApproveList
              data={approveList}
            />
          </div>
        </div>
      </div>
    );
  }
}

