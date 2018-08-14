/**
 * @Descripter: 服务结果模块
 * @Author: K0170179
 * @Date: 2018/5/22
 */

import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { Spin, Icon } from 'antd';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './serviceResult.less';
import antdStyles from '../../../../css/antd.less';
import ServiceResultLayout from '../../common/ServiceResultLayout';
// import Icon from '../../../common/Icon';
import Table from '../../../common/commonTable';
import missionProgressMap from './config';

const DEFAULT_DETIAL_TITLE = '客户明细';
// 获取客户详情接口默认的pagesize
const PAGE_SIZE = 5;

export default class ServiceResult extends PureComponent {

  static getDerivedStateFromProps(props, state) {
    const { prevProps } = state;
    const { currentId } = prevProps;
    if (props.currentId !== currentId) {
      return {
        detailTitle: DEFAULT_DETIAL_TITLE,
        currentParam: {},
        prevProps: props,
      };
    }
    return null;
  }

  static propTypes = {
    isFold: PropTypes.bool,
    serviceProgress: PropTypes.object.isRequired,
    custFeedBack: PropTypes.array.isRequired,
    custDetail: PropTypes.object.isRequired,
    queryExecutorFeedBack: PropTypes.func.isRequired,
    queryExecutorFlowStatus: PropTypes.func.isRequired,
    queryExecutorDetail: PropTypes.func.isRequired,
    isShowExecutorDetailLoading: PropTypes.bool.isRequired,
    currentId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    isFold: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      detailTitle: DEFAULT_DETIAL_TITLE,
      currentParam: {},
      prevProps: props,
      // table选中的项
      selectedRowKeys: [],
      // table的pageNum
      pageNum: 1,
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
    const {
      currentId,
      queryExecutorFeedBack,
      queryExecutorFlowStatus,
    } = this.props;
    const param = {
      missionId: currentId,
    };
    queryExecutorFeedBack(param);
    queryExecutorFlowStatus(param);
    this.getExecutorDetail();
  }

  @autobind
  getExecutorDetail(option) {
    const { queryExecutorDetail, currentId } = this.props;
    const params = {
      missionId: currentId,
      missionProgressStatus: '',
      progressFlag: '',
      feedbackIdL1: '',
      pageNum: 1,
      pageSize: PAGE_SIZE,
      ...option,
    };
    this.setState({
      currentParam: params,
    });
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
        {detailTitle}
      </div>
    );
  }

  getTableColumns() {
    return [{
      value: '客户名称',
      dataIndex: 'cust',
      key: 'cust',
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
    const finalList = _.map(list, item => ({
      ...item,
      cust: `${item.cust}(${item.brokerNum})`,
    }));
    return { list: finalList, page };
  }

  @autobind
  setCustDetailTitle(title) {
    this.setState({
      detailTitle: `${title}${DEFAULT_DETIAL_TITLE}`,
    });
  }

  /**
   * 加载更多
   * @param {*number} pageNum 当前分页
   */
  @autobind
  handlePageChange() {
    const { currentParam } = this.state;
    this.setState({
      pageNum: this.state.pageNum + 1,
    }, () => {
      this.getExecutorDetail({
        ...currentParam,
        pageNum: this.state.pageNum,
        pageSize: PAGE_SIZE,
      });
    });
  }

  @autobind
  handleSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  render() {
    const { serviceProgress, custFeedBack, isShowExecutorDetailLoading } = this.props;
    const { list = [], page = {} } = this.getCustDetail();
    const {
      columnWidth,
      columnWidthTotal,
    } = this.renderColumnWidth();
    const { selectedRowKeys, pageNum } = this.state;
    // 自定义旋转图标
    const customIcon = <Icon type="reload" spin />;
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
          title={this.renderCustDetailHeader}
          tableClass={
            classnames({
              [styles.custManagerScopeTable]: true,
              [antdStyles.tableHasBetweenSpace]: true,
            })
          }
          columnWidth={columnWidth}
          // 列的总宽度加上固定列的宽度
          scrollX={columnWidthTotal}
          emptyListDataNeedEmptyRow
          isNeedRowSelection
          onRowSelectionChange={this.handleSelectChange}
          currentSelectRowKeys={selectedRowKeys}
          selectionType="checkbox"
        />
        {
          pageNum < page.totalPage || page.totalPage === 0
          ? <div className={styles.shuaxinWrap}>
            {
              isShowExecutorDetailLoading
              ? <Spin indicator={customIcon} />
              : <Icon type="reload" />
            }
            <a onClick={this.handlePageChange}>加载更多</a>
          </div>
          : null
        }
      </div>
    );
  }
}
