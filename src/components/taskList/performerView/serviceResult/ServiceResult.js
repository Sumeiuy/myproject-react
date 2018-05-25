/**
 * @Descripter: 服务结果模块
 * @Author: K0170179
 * @Date: 2018/5/22
 */

import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './serviceResult.less';
import antdStyles from '../../../../css/antd.less';
import ServiceResultLayout from '../../common/ServiceResultLayout';
import Table from '../../../common/commonTable';
import missionProgressMap from './config';

const DEFAULT_DETIAL_TITLE = '客户明细';

export default class ServiceResult extends PureComponent {

  static propTypes = {
    isFold: PropTypes.bool,
    serviceProgress: PropTypes.object.isRequired,
    custFeedBack: PropTypes.array.isRequired,
    custDetail: PropTypes.object.isRequired,
    queryExecutorFeedBack: PropTypes.func.isRequired,
    queryExecutorFlowStatus: PropTypes.func.isRequired,
    queryExecutorDetail: PropTypes.func.isRequired,
    currentId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    isFold: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      detailTitle: DEFAULT_DETIAL_TITLE,
    };
  }

  componentDidMount() {
    this.updateServiceResult();
  }

  componentDidUpdate(prevProps) {
    const { currentId } = prevProps;
    if (this.props.currentId !== currentId) {
      this.updateServiceResult();
    }
  }

  @autobind
  handleMissionClick(item) {
    const { missionProgressStatus = '',
      progressFlag = '',
      feedbackIdL1 = '',
      currentFeedback } = item;

    if (missionProgressStatus) {
      const currentMapItem = _.filter(missionProgressMap, mapItem =>
        mapItem.value === item.missionProgressStatus && mapItem.type === item.progressFlag,
      )[0];
      this.setCustDetailTitle(currentMapItem.name);
    }
    if (feedbackIdL1) {
      const currentFeedbackItem = _.filter(currentFeedback, feedbackItem =>
        feedbackIdL1 === feedbackItem.feedbackIdL1)[0];
      this.setCustDetailTitle(currentFeedbackItem.feedbackName);
    }
    this.getExecutorDetail({
      missionProgressStatus,
      progressFlag,
      feedbackIdL1,
    });
  }

  @autobind
  updateServiceResult() {
    const { currentId,
      queryExecutorFeedBack,
      queryExecutorFlowStatus } = this.props;
    const param = {
      missionId: currentId,
    };
    queryExecutorFeedBack(param);
    queryExecutorFlowStatus(param);
    this.getExecutorDetail();
  }

  getExecutorDetail(option) {
    const { queryExecutorDetail, currentId } = this.props;
    const params = {
      missionId: currentId,
      missionProgressStatus: '',
      progressFlag: '',
      feedBackIdL1: '',
      pageNum: 1,
      pageSize: 5,
      ...option,
    };
    queryExecutorDetail(params);
  }

  /**
   * 渲染每一列的宽度
   */
  @autobind
  renderColumnWidth() {
    const { isFold } = this.props;
    let columnWidth = [];
    let columnWidthTotal = 0;

    if (isFold) {
      columnWidthTotal = 790;
      // 列的总宽度870px
      // 处于折叠状态，每一列的宽度需要增加
      columnWidth = ['130px', '100px', '180px', '180px', '100px', '100px'];
    } else {
      columnWidthTotal = 720;
      // 处于展开状态,
      // 列的总宽度630px
      columnWidth = ['130px', '100px', '140px', '140px', '100px', '110px'];
    }

    return {
      columnWidth,
      columnWidthTotal,
    };
  }

  @autobind
  renderCustDetailHeader() {
    const { detailTitle } = this.state;
    return (
      <div className={styles.custDetailHeader}>
        { detailTitle }
      </div>
    );
  }

  getTableColumns() {
    return [{
      value: '客户名称',
      dataIndex: 'cust',
      key: 'cust',
      render: item => `${item.cust}(${item.brokerNum})`,
    }, {
      value: '总资产',
      dataIndex: 'assets',
      key: 'assets',
    }, {
      value: '一级反馈',
      dataIndex: 'firstFeedback',
      key: 'firstFeedback',
    }, {
      value: '二级反馈',
      dataIndex: 'secondFeedback',
      key: 'secondFeedback',
    }, {
      value: '结果达标值',
      dataIndex: 'standardValue',
      key: 'standardValue',
    }, {
      value: '结果达标日期',
      dataIndex: 'standardDate',
      key: 'standardDate',
    }];
  }

  @autobind
  getCustDetail() {
    const { custDetail } = this.props;
    const { list = [], page = {} } = custDetail;
    const {
      pageNum: curPageNum = 0,
      pageSize: curPageSize = 5,
      totalCount: totalRecordNum = 0,
    } = page;
    const finalPage = { curPageNum, curPageSize, totalRecordNum };
    return { list, finalPage };
  }

  @autobind
  setCustDetailTitle(title) {
    this.setState({
      detailTitle: `${title}${DEFAULT_DETIAL_TITLE}`,
    });
  }

  render() {
    const { isFold, serviceProgress, custFeedBack } = this.props;
    const { list, finalPage } = this.getCustDetail();
    const {
      columnWidth,
      columnWidthTotal,
    } = this.renderColumnWidth();
    return (
      <div className={styles.serviceResultWrap}>
        <ServiceResultLayout
          missionImplementationProgress={serviceProgress}
          onPreviewCustDetail={this.handleMissionClick}
          custFeedback={custFeedBack}
        />
        <Table
          listData={list}
          titleColumn={this.getTableColumns()}
          paginationInTable
          title={this.renderCustDetailHeader}
          tableClass={
            classnames({
              [styles.custManagerScopeTable]: true,
              // 展开的样式
              [styles.notFoldedScope]: !isFold,
              // 折叠的样式
              [styles.foldedScope]: isFold,
              [antdStyles.tableHasBetweenSpace]: true,
            })
          }
          pageData={finalPage}
          columnWidth={columnWidth}
          // 分页器样式
          paginationClass="selfPagination"
          isFixedColumn
          // 横向滚动，固定服务经理列
          fixedColumn={[0]}
          // 列的总宽度加上固定列的宽度
          scrollX={columnWidthTotal}
          emptyListDataNeedEmptyRow
         // onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}
