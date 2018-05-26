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
// import { autobind } from 'core-decorators';

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

// 表头
const { titleList } = config;
// 客户姓名
const KEY_CUSTNAME = 'custName';
// 原服务经理姓名
const KEY_OLDEMPNAME = 'oldEmpName';
const KEY_DMNAME = 'dmName';
const KEY_NEWEMPNAME = 'newEmpName';
export default class Detail extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  }

  static defaultProps = {
    pageAssignment: {},
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

  // 空方法，用于日志上报
  @logable({ type: 'Click', payload: { name: '下载报错信息' } })
  handleDownloadClick() {}

  render() {
    const {
      id,
      empId,
      empName,
      empPosition,
      createTime,
      status,
      currentApproval,
      workflowHistoryBeans,
      // currentNodeName,  不清楚是否使用
      errorDesc,
      appId: dataId,
    } = this.props.data;
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
    const drafter = `${empPosition} - ${empName} (${empId})`;
    // 分页
    const paginationOption = {
      current: pageData.curPageNum,
      total: pageData.totalRecordNum,
      pageSize: pageData.pageSize,
      onChange: this.handlePageNumberChange,
    };

    const approverName = currentApproval ? `${currentApproval.empName} (${currentApproval.empNum})` : '';
    const nowStep = {
      // 当前步骤
      stepName: currentApproval.occupation || '',
      // 当前审批人
      handleName: approverName,
    };

    const { detailCust } = titleList;

    const custIndex = _.findIndex(detailCust, o => o.key === KEY_CUSTNAME);
    const empIndex = _.findIndex(detailCust, o => o.key === KEY_OLDEMPNAME);
    const dmIndex = _.findIndex(detailCust, o => o.key === KEY_DMNAME);
    const newEmpIndex = _.findIndex(detailCust, o => o.key === KEY_NEWEMPNAME);

    detailCust[custIndex].render = (text, record) => (<div>{text}({record.custId})</div>);
    detailCust[empIndex].render = (text, record) => (<div>
      {text}({record.oldEmpId}){record.isTouGu ? '是' : '否'}
    </div>);
    detailCust[dmIndex].render = (text, record) => (<div>{text}({record.dmId})</div>);
    detailCust[newEmpIndex].render = (text, record) => (<div>{text}({record.newEmpId})</div>);

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
                    href={`${request.prefix}/excel/custTransfer/exportAssigumentExcel?appId=${appId || dataId}&empId=${emp.getId()}`}
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
            titleList={titleList.detailCust}
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
          <InfoItem label="规则" value={'平均客户数'} />
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
