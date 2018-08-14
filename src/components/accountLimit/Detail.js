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
  tableTitle: { custList: custTitleList },  // 客户表格列表
  operateTypeArray,  // 操作类型枚举
  relieveCode,  // 限制解除的 value
  attachmentMap,  // 附件类型枚举
} = config;
// 客户姓名
const KEY_CUSTNAME = 'custName';
const KEY_LIMIT = 'limit';
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
    const tempTitleList = [...list];
    // 客户
    const custColumn = _.find(tempTitleList, o => o.key === KEY_CUSTNAME);
    custColumn.render = (text, record) => {
      const custId = record.custId ? ` (${record.custId})` : '';
      return (<div title={`${text}${custId}`}>
        {text}{custId}
      </div>);
    };
    const limitColumn = _.find(tempTitleList, o => o.key === KEY_LIMIT);
    limitColumn.render = text => (<div title={text}>{text}</div>);
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


    const newTitleList = this.getColumnsCustTitleList(custTitleList);

    const filterOperate = _.filter(operateTypeArray, o => o.value === operateType);
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
            operateType === relieveCode
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
          />
          <Pagination
            {...custListPaginationOption}
          />
        </div>
        <div className={styles.module}>
          <InfoTitle head="限制信息" />
          <InfoItem label="限制类型" value={(_.map(limitType, 'label').join('、'))} />
          <InfoItem label="账户限制设置日期" className={styles.inlineInfoItem} value={time.format(limitStartTime)} />
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
