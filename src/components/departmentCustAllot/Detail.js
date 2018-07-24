/**
 * @Description: 分公司客户分配详情
 * @Author: Liujianshu
 * @Date: 2018-05-23 15:19:51
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-06-11 13:17:39
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonTable from '../common/biz/CommonTable';
import ApproveList from '../common/approveList';
import Pagination from '../common/Pagination';
import Icon from '../common/Icon';
import { request } from '../../config';
import { emp, time } from '../../helper';
import config from './config';
import styles from './detail.less';
import logable from '../../decorators/logable';


const empOrgId = emp.getPstnId();
// 登陆人的职位 ID
const empPstnId = emp.getPstnId();
// 表头
const { titleList, ruleTypeArray, allotType } = config;
// 客户姓名
const KEY_CUSTNAME = 'custName';
const KEY_STATUS = 'status';
// 原服务经理姓名
const KEY_OLDEMPNAME = 'oldEmpName';
const KEY_DMNAME = 'dmName';
const KEY_NEWEMPNAME = 'newEmpName';
// 详情页面
const DETAIL_PAGE = 'detail';
export default class Detail extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    queryAddedCustList: PropTypes.func.isRequired,
    addedCustData: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const { assignmentList, page } = props.data;
    this.state = {
      assignmentListData: assignmentList,
      pageData: page,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    if (data !== this.props.data) {
      this.setState({
        assignmentListData: data.assignmentList,
        pageData: data.page,
      });
    }
  }

  // 生成表格标题
  @autobind
  getColumnsCustTitleList(list) {
    const { dict: { accountStatusList = [] } } = this.props;
    const tempTitleList = [...list];
    // 客户
    const custColumn = _.find(tempTitleList, o => o.key === KEY_CUSTNAME);
    custColumn.render = (text, record) => {
      const custId = record.custId ? ` (${record.custId})` : '';
      return (<div title={`${text}${custId}`}>
        {text}{custId}
      </div>);
    };
    // 状态
    const statusColumn = _.find(tempTitleList, o => o.key === KEY_STATUS);
    statusColumn.render = (text) => {
      const statusItem = _.filter(accountStatusList, o => o.key === text);
      const statusText = statusItem.length ? statusItem[0].value : '';
      return (<div title={statusText}>{statusText}</div>);
    };
    // 原服务经理
    const empColumn = _.find(tempTitleList, o => o.key === KEY_OLDEMPNAME);
    empColumn.render = (text, record) => {
      const touGuElement = record.touGu ? <span className={styles.tougu}>投顾</span> : '';
      return (
        <div>
          {
            text
            ?
              <div className={styles.oldEmp} title={`${text} (${record.oldEmpId})`}>
                {text} ({record.oldEmpId})
                {touGuElement}
              </div>
            :
              null
          }
        </div>
      );
    };
    // 开发经理
    const dmColumn = _.find(tempTitleList, o => o.key === KEY_DMNAME);
    dmColumn.render = (text, record) => {
      const dmNameAndId = text ? `${text} (${record.dmId})` : '';
      return (<div title={dmNameAndId}>{dmNameAndId}</div>);
    };
    // 新服务经理
    const newEmpColumn = _.find(tempTitleList, o => o.key === KEY_NEWEMPNAME);
    newEmpColumn.render = (text, record) => {
      const touGuElement = !record.newEmpTouGu ? <span className={styles.tougu}>投顾</span> : '';
      return (
        <div>
          <div className={styles.oldEmp} title={`${text} (${record.newEmpId})`}>
            {text} ({record.newEmpId})
            {touGuElement}
          </div>
        </div>
      );
    };
    return tempTitleList;
  }

  // 翻页
  @autobind
  handlePageNumberChange(pageNum) {
    const { queryAddedCustList, data: { appId } } = this.props;
    const payload = {
      id: appId,
      positionId: empPstnId,
      orgId: empOrgId,
      pageNum,
      pageSize: 7,
      isDetail: DETAIL_PAGE,
      type: allotType,
    };
    queryAddedCustList(payload).then(() => {
      const { addedCustData: { list, page } } = this.props;
      this.setState({
        assignmentListData: list,
        pageData: page,
      });
    });
  }

  // 空方法，用于日志上报
  @logable({ type: 'Click', payload: { name: '下载报错信息' } })
  handleDownloadClick() {}

  render() {
    const {
      data: {
        id,
        empId,
        empName,
        orgName,
        createTime,
        status,
        currentApproval = {},
        currentNodeName,
        workflowHistoryBeans,
        errorDesc,
        appId: dataId,
        ruleType,
      },
    } = this.props;
    const {
      location: {
        query: {
          appId = '',
        },
      },
    } = this.props;

    const { pageData, assignmentListData } = this.state;
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    // 分页
    const paginationOption = {
      current: pageData.curPageNum,
      total: pageData.totalRecordNum,
      pageSize: pageData.pageSize,
      onChange: this.handlePageNumberChange,
    };

    const approverName = !_.isEmpty(currentApproval) ? `${currentApproval.empName} (${currentApproval.empNum})` : '暂无';
    const nowStep = {
      // 当前步骤
      stepName: currentNodeName || '暂无',
      // 当前审批人
      handleName: approverName,
    };

    const { detailCust } = titleList;

    const newTitleList = this.getColumnsCustTitleList(detailCust);
    const allWidth = _.sumBy(detailCust, 'width');

    return (
      <div className={styles.detailBox}>
        <h2 className={styles.title}>编号{id}</h2>
        <div className={styles.module}>
          <div className={styles.error}>
            {
              errorDesc
              ?
                <p>
                  <Icon type="tishi" />
                  {config.tips[errorDesc]}
                </p>
              :
                null
            }
            {
              errorDesc === config.errorArray[0]
              ?
                <p>
                  <a
                    onClick={this.handleDownloadClick}
                    href={`${request.prefix}/excel/custTransfer/exportAssigumentExcel?appId=${appId || dataId}&empId=${emp.getId()}&orgId=${empOrgId}&type=department`}
                    download
                  >
                    下载报错信息
                  </a>
                </p>
              :
                null
            }
          </div>
          <InfoTitle head="客户列表" />
          <CommonTable
            titleList={newTitleList}
            data={assignmentListData}
            align="left"
            rowKey="custId"
            scroll={{ x: allWidth }}
          />
          <Pagination
            {...paginationOption}
          />
        </div>
        <div className={styles.module}>
          <InfoTitle head="客户分配规则" />
          <InfoItem label="规则" value={ruleType ? ruleTypeArray[ruleType].label : ''} />
        </div>
        <div className={styles.module}>
          <InfoTitle head="拟稿信息" />
          <InfoItem label="拟稿人" value={drafter} />
          <InfoItem label="申请时间" value={time.format(createTime)} />
          <InfoItem label="状态" value={status} />
        </div>
        <div className={styles.module}>
          <InfoTitle head="审批记录" />
          <ApproveList data={workflowHistoryBeans} nowStep={nowStep} />
        </div>
      </div>
    );
  }
}
