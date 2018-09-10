/**
 * @Description: 账户限制管理详情页
 * @Author: Liujianshu
 * @Date: 2018-07-31 16:30:31
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-08-03 14:07:59
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonTable from '../common/biz/CommonTable';
import MultiUploader from '../common/biz/MultiUploader';
import ApproveList from '../common/approveList';
import Pagination from '../common/Pagination';
import { time } from '../../helper';
import config from './config';
import styles from './detail.less';
import logable from '../../decorators/logable';

// 表头
const {
  tableTitle: { custList: custTitleList, moreList },  // 客户表格列表
  operateTypeArray,  // 操作类型枚举
  RELIEVE_CODE,  // 限制解除的 value
  attachmentMap,  // 附件类型枚举
} = config;
// 客户姓名
const KEY_CUSTNAME = 'custName';
// 服务经理
const KEY_EMPNAME = 'empName';
// 限制类型
const KEY_LIMIT = 'limit';
// 业务对接人
const KEY_MANAGERID = 'managerId';
// 禁止转出金额
const KEY_LIMIT_AMOUNT = 'limitAmount';
// 每页条数
const PAGE_SIZE = 7;
export default class Detail extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 当前页数
      pageNum: 1,
    };
  }

  // 生成表格标题
  @autobind
  getColumnsCustTitleList(list) {
    const { data: { operateType } } = this.props;
    const tempTitleList = [...list];
    // 客户
    const custColumn = _.find(tempTitleList, o => o.key === KEY_CUSTNAME);
    custColumn.render = (text, record) => {
      const value = record.custId ? `${text || ''} (${record.custId})` : '';
      return <div title={value}>{value}</div>;
    };
    // 服务经理
    const empNameColumn = _.find(tempTitleList, o => o.key === KEY_EMPNAME);
    empNameColumn.render = (text, record) => {
      const value = record.empId ? `${text || ''} (${record.empId})` : '';
      return <div title={value}>{value}</div>;
    };
    // 限制类型
    const limitColumn = _.find(tempTitleList, o => o.key === KEY_LIMIT);
    limitColumn.render = text => (<div title={text || ''}>{text || ''}</div>);
    // 如果是限制设置，则增加两列数据
    if (operateType !== RELIEVE_CODE) {
      tempTitleList.push(...moreList);

      // 对接人
      const managerIdColumn = _.find(tempTitleList, o => o.key === KEY_MANAGERID) || {};
      managerIdColumn.render = (text, record) => {
        const { managerId, managerName } = record;
        const showName = managerId ? `${managerName} (${managerId || ''})` : '';
        return <div title={showName}>{showName}</div>;
      };

      const limitAmountColumn = _.find(tempTitleList, o => o.key === KEY_LIMIT_AMOUNT) || {};
      limitAmountColumn.render = text => <div>{text}</div>;
    }
    return tempTitleList;
  }

  // 获取附件列表的标题
  @autobind
  getAttachmentTitle(type) {
    const filterTitle = _.filter(attachmentMap, o => o.type === type) || [];
    return _.get(filterTitle[0], 'title', type);
  }

  // 客户列表翻页事件
  @autobind
  @logable({ type: 'Click', payload: { name: '客户列表翻页' } })
  handleCustPageChange(pageNum) {
    this.setState({
      pageNum,
    });
  }

  // 空方法，用于日志上报
  @logable({ type: 'Click', payload: { name: '下载报错信息' } })
  handleDownloadClick() {}

  render() {
    const { pageNum } = this.state;
    const {
      data: {
        operateType,
        companyName,
        stockCode,
        bankConfirm,
        limitType,
        limitStartTime,
        limitEndTime,
        attachList,
        empId,
        empName,
        orgName,
        createTime,
        status,
        currentApproval = {},
        currentNodeName,
        workflowHistoryBeans,
        id,
        custList,
      },
    } = this.props;
    const {
      location: {
        query: {
          appId = '',
        },
      },
    } = this.props;
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    // 分页
    const custListPaginationOption = {
      current: pageNum,
      total: custList.length,
      pageSize: PAGE_SIZE,
      onChange: this.handleCustPageChange,
    };

    const showCustList = _.chunk(custList, PAGE_SIZE);

    const approverName = !_.isEmpty(currentApproval) ? `${currentApproval.empName} (${currentApproval.empNum})` : '暂无';
    const nowStep = {
      // 当前步骤
      stepName: currentNodeName || '暂无',
      // 当前审批人
      handleName: approverName,
    };
    // 新的客户列表渲染标题
    const newTitleList = this.getColumnsCustTitleList(custTitleList);
    // 表格需要滚动的宽度
    const scrollWidth = _.sum(_.map(newTitleList, 'width'));
    // 匹配的操作类型
    const filterOperate = _.filter(operateTypeArray, o => o.value === operateType);
    // 操作类型是否是限制解除
    const isRelieve = operateType === RELIEVE_CODE;
    return (
      <div className={styles.detailBox}>
        <h2 className={styles.title}>编号{id}</h2>
        <div className={styles.module}>
          <InfoTitle head="基本信息" />
          <InfoItem label="操作类型" width="120px" value={filterOperate[0].label} />
          <InfoItem label="公司简称" className={styles.inlineInfoItem} width="120px" value={companyName} />
          <InfoItem label="证券代码" className={styles.inlineInfoItem} width="120px" value={stockCode} />
          {/* 操作类型为限制解除时显示银行确认 */}
          {
            isRelieve
            ? <InfoItem label="是否银行确认" className={styles.inlineInfoItem} width="120px" value={bankConfirm ? '是' : '否'} />
            : null
          }
        </div>
        <div className={styles.module}>
          <InfoTitle head="客户列表" />
          <CommonTable
            titleList={newTitleList}
            data={showCustList[pageNum - 1]}
            align="left"
            rowKey="custId"
            scroll={{ x: scrollWidth }}
          />
          <Pagination
            {...custListPaginationOption}
          />
        </div>
        <div className={styles.module}>
          <InfoTitle head="限制信息" />
          <InfoItem label="限制类型" value={(_.map(limitType, 'label').join('、'))} />
          {
            isRelieve
            ? null
            : <InfoItem label="账户限制设置日期" className={styles.inlineInfoItem} value={time.format(limitStartTime)} />
          }
          <InfoItem label="账户限制解除日期" className={styles.inlineInfoItem} value={time.format(limitEndTime)} />
        </div>
        <div className={styles.module}>
          <InfoTitle head="拟稿信息" />
          <InfoItem label="拟稿人" value={drafter} />
          <InfoItem label="申请时间" value={time.format(createTime)} />
          <InfoItem label="状态" value={status} />
        </div>
        <div className={styles.module}>
          <InfoTitle head="附件信息" />
          {
            !_.isEmpty(attachList) ?
              attachList.map(item => (<MultiUploader
                attachmentList={item.attachmentList}
                attachment={''}
                title={this.getAttachmentTitle(item.title)}
                key={`${appId}-${item.attachment}`}
              />))
              :
              <div className={styles.fileList}>
                <div className={styles.noFile}>暂无附件</div>
              </div>
          }
        </div>
        <div className={styles.module}>
          <InfoTitle head="审批记录" />
          <ApproveList data={workflowHistoryBeans} nowStep={nowStep} />
        </div>
      </div>
    );
  }
}
