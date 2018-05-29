/**
 * @Description: 分公司客户分配详情
 * @Author: Liujianshu
 * @Date: 2018-05-23 15:19:51
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-23 21:29:52
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
const { titleList, ruleTypeArray } = config;
// 客户姓名
const KEY_CUSTNAME = 'custName';
const KEY_STATUS = 'status';
// 原服务经理姓名
const KEY_OLDEMPNAME = 'oldEmpName';
const KEY_DMNAME = 'dmName';
const KEY_NEWEMPNAME = 'newEmpName';
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
    const custIndex = _.findIndex(tempTitleList, o => o.key === KEY_CUSTNAME);
    // 状态
    const statusIndex = _.findIndex(tempTitleList, o => o.key === KEY_STATUS);
    // 原服务经理
    const empIndex = _.findIndex(tempTitleList, o => o.key === KEY_OLDEMPNAME);
    // 开发经理
    const dmIndex = _.findIndex(tempTitleList, o => o.key === KEY_DMNAME);
    // 新服务经理
    const newEmpIndex = _.findIndex(tempTitleList, o => o.key === KEY_NEWEMPNAME);

    tempTitleList[custIndex].render = (text, record) => (<div>{text}({record.custId})</div>);
    tempTitleList[statusIndex].render = (text) => {
      const statusItem = _.filter(accountStatusList, o => o.key === text);
      return (<div>{statusItem.length ? statusItem[0].value : ''}</div>);
    };
    tempTitleList[empIndex].render = (text, record) => (<div>
      {
        text
        ?
          <div>
            {text}({record.oldEmpId})
            <span className={styles.tougu}>{record.isTouGu ? '投顾' : ''}</span>
          </div>
        :
          null
      }
    </div>);
    tempTitleList[dmIndex].render = (text, record) => (<div>{text ? `${text} (${record.dmId})` : null}</div>);
    tempTitleList[newEmpIndex].render = (text, record) => (<div>{text}({record.newEmpId})</div>);
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
      stepName: !_.isEmpty(currentApproval) ? currentApproval.occupation : '暂无',
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
                    href={`${request.prefix}/excel/custTransfer/exportAssigumentExcel?appId=${appId || dataId}&empId=${emp.getId()}&orgId=${empOrgId}`}
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
            align={'left'}
            scroll={{ x: allWidth }}
          />
          <Pagination
            {...paginationOption}
          />
        </div>
        <div className={styles.module}>
          <InfoTitle head="客户分配规则" />
          <InfoItem label="规则" value={ruleTypeArray[ruleType].label} />
        </div>
        <div className={styles.module}>
          <InfoTitle head="拟稿信息" />
          <InfoItem label="拟稿人" value={drafter} />
          <InfoItem label="提请时间" value={time.format(createTime)} />
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
