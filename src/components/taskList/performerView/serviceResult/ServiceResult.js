/**
 * @Descripter: 服务结果模块
 * @Author: K0170179
 * @Date: 2018/5/22
 */

import React, { PureComponent } from 'react';
import { Spin, Icon, message, Table, Checkbox, Tooltip } from 'antd';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ServiceResultLayout from '../../common/ServiceResultLayout';
import Button from '../../../common/Button';
import { MISSION_PROGRESS_MAP, OPEN_IN_TAB_PARAM } from './config';
import { SOURCE_SERVICE_RESULT_CUST } from '../../../../config/createTaskEntry';
import { url as urlHelper, emp, permission, number } from '../../../../helper';
import { openInTab } from '../../../../utils';
import logable from '../../../../decorators/logable';

import styles from './serviceResult.less';

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
    // 查询导入的执行者视图，服务结果下的客户是否超过了1000个或者是否是我名下的客户
    isSendCustsServedByPostn: PropTypes.func.isRequired,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    // 清除创建任务的数据
    clearCreateTaskData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isFold: false,
  }

  static contextTypes = {
    push: PropTypes.func,
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
      // 是否全选
      isSelectAll: false,
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
    const {
      missionProgressStatus = '',
      progressFlag = '',
      feedbackIdL1 = '',
      currentFeedback,
    } = item;
    if (missionProgressStatus) {
      const currentMapItem = _.filter(MISSION_PROGRESS_MAP, mapItem =>
        mapItem.value === item.missionProgressStatus && mapItem.type === item.progressFlag,
      )[0];
      this.setCustDetailTitle(currentMapItem.name);
    }
    if (feedbackIdL1) {
      const currentFeedbackItem = _.filter(currentFeedback, feedbackItem =>
        feedbackIdL1 === feedbackItem.feedbackIdL1,
      )[0];
      this.setCustDetailTitle(currentFeedbackItem.feedbackName);
    }
    this.getExecutorDetail({
      missionProgressStatus,
      progressFlag,
      feedbackIdL1,
    });
  }

  // 服务结果页面的接口（总体进度，已服务客户反馈，客户明细）
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
    // 将state清空
    this.setState({
      selectedRowKeys: [],
      pageNum: 1,
      isSelectAll: false,
    });
  }

  // 获取客户明细接口
  @autobind
  getExecutorDetail(option) {
    const { queryExecutorDetail, currentId } = this.props;
    const params = {
      feedbackIdL1: '',
      missionId: currentId,
      missionProgressStatus: '',
      progressFlag: '',
      pageNum: 1,
      pageSize: PAGE_SIZE,
      ...option,
    };
    this.setState({
      currentParam: params,
    });
    queryExecutorDetail(params).then(() => {
      const { isSelectAll } = this.state;
      const { custDetail: { list = [] } } = this.props;
      // 如果是全选,新加载出来的数据,默认应该也被选中
      if (isSelectAll) {
        const newSelectedRowKeys = _.map(list, 'brokerNum');
        this.setState({ selectedRowKeys: newSelectedRowKeys });
      }
    });
  }

  // 客户明细表格的头部渲染(会根据点击了总体进度，已服务客户反馈不同而不同)
  @autobind
  renderCustDetailHeader() {
    const { detailTitle, isSelectAll } = this.state;
    return (
      <div className={styles.custDetailHeader}>
        <div className={styles.custDetailTitle}>{detailTitle}</div>
        <Tooltip
          overlayClassName={styles.checkboxTooltip}
          placement="topLeft"
          title="勾选全部客户"
        >
          <Checkbox
            className={styles.checkbox}
            onChange={this.handleSelectAllChange}
            checked={isSelectAll}
          />
        </Tooltip>
        <Button onClick={this.handleCreateTaskClick}>发起任务</Button>
      </div>
    );
  }

  // 验证通过后跳转到创建任务
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '发起任务' } })
  handleCreateTaskClick() {
    const { isSendCustsServedByPostn } = this.props;
    const { isSelectAll, currentParam, selectedRowKeys } = this.state;
    // 获取empId
    const empId = emp.getId();
    // isSendCustsServedByPost接口的参数
    const payload = {};
    const queryMissionCustsReq = {
      ...currentParam,
      ptyMngId: empId,
    };
    // 如果没有选择客户,则提示先选择客户在发起任务
    if (_.isEmpty(selectedRowKeys)) {
      message.warn('请先选择需要发起任务的客户');
      return;
    }
    // 如果是全选,参数payload中需要增加queryMissionCustsReq对象,为调取客户详情接口数据的参数
    // 如不是全选,则传一个由brokerNum组成的custIdList数组
    // 不管全选非全选queryMissionCustsReq都要传，后端用来获取客户来源和客户总数
    if (isSelectAll) {
      payload.queryMissionCustsReq = queryMissionCustsReq;
    } else {
      payload.queryMissionCustsReq = queryMissionCustsReq;
      payload.custIdList = selectedRowKeys;
    }
    // 是否有HTSC 任务管理岗职责,有的话,直接跳转创建任务页面,没有的话需要判断是否是本人名下的
    if (permission.hasTkMampPermission()) {
      this.toCreateTaskPage(payload);
    } else {
      // 发请求判断是否超过1000条数据和是否包含非本人名下客户
      isSendCustsServedByPostn(payload).then(() => {
        const { sendCustsServedByPostnResult = {} } = this.props;
        const {
          custNumsIsExceedUpperLimit = false,
          sendCustsServedByPostn = false,
        } = sendCustsServedByPostnResult;
        // 选择超过1000条数据 或者 没有超过1000条但包含非本人名下客户
        if (custNumsIsExceedUpperLimit || !sendCustsServedByPostn) {
          message.warn('您没有“HTSC任务管理”职责，不能对非本人名下客户发起任务');
          return;
        }
        this.toCreateTaskPage(payload);
      });
    }
  }

  // 跳转到创建任务页面
  @autobind
  toCreateTaskPage(payload) {
    const { isSelectAll } = this.state;
    const { custDetail: { page = {} }, clearCreateTaskData } = this.props;
    const { push } = this.context;
    // config中定义的一些url，id，title等常量
    const { URL, ID, TITLE } = OPEN_IN_TAB_PARAM;
    const { queryMissionCustsReq = {}, custIdList = [] } = payload;
    const param = { source: SOURCE_SERVICE_RESULT_CUST };
    // 我非全选的时候使用ids，不管全选非全选condition都要传，后端用来获取客户来源和客户总数
    const stringifyCondition = encodeURIComponent(JSON.stringify(queryMissionCustsReq));
    if (isSelectAll) {
      param.condition = stringifyCondition;
      param.count = page.totalCount;
    } else {
      param.ids = custIdList;
      param.condition = stringifyCondition;
      param.count = _.size(custIdList);
    }
    const newurl = `${URL}?${urlHelper.stringify(param)}`;
    // 发起新的任务之前，先清除数据
    // serviceResultCust代表所有从执行者视图服务结果页面发起任务的入口
    clearCreateTaskData(SOURCE_SERVICE_RESULT_CUST);
    // FSP打开一个新的tab的参数
    const openInTabParam = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: ID,
      title: TITLE,
    };
    openInTab({
      routerAction: push,
      url: newurl,
      param: openInTabParam,
      pathname: URL,
      query: param,
    });
  }

  // 全选change
  @autobind
  handleSelectAllChange(e) {
    const { custDetail: { list = [] } } = this.props;
    const newSelectedRowKeys = _.map(list, 'brokerNum');
    const isChecked = e.target.checked;
    // 若全选选中，此时的selectedRowKeys应为加载出来的list的brokerNum组成的数组
    // 以便用来控制单个的CheckBox为选中状态，若取消全选，selectedRowKeys为[]
    this.setState({
      isSelectAll: isChecked,
      selectedRowKeys: isChecked ? newSelectedRowKeys : [],
    });
  }

  // 设置表格头部渲染文字
  @autobind
  setCustDetailTitle(title) {
    this.setState({
      detailTitle: `${title}${DEFAULT_DETIAL_TITLE}`,
    });
  }

  // 加载而更多
  // TODO 日志查看：打开页面无数据 未验证
  @autobind
  @logable({ type: 'Click', payload: { name: '加载更多' } })
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

  // 单个checkbox的change
  @autobind
  toggleItemChecked(e, record) {
    const { selectedRowKeys } = this.state;
    const checked = e.target.checked;
    // 若被选中，则向selectedRowKeys数组中增加该条的brokerNum
    if (checked) {
      this.setState({
        selectedRowKeys: [...selectedRowKeys, record.brokerNum],
      }, this.handleAllItemChecked);
    } else {
      // 若是取消选中，则从selectedRowKeys数组中过滤去除该条的brokerNum
      this.setState({
        selectedRowKeys: _.filter(selectedRowKeys, item => item !== record.brokerNum),
      });
    }
  }

  // 当单个勾选CheckBox决定全选是否被选中的方法
  // 当选中的个数等于list的totalCount(总条数)时，此时全选应该选中
  @autobind
  handleAllItemChecked() {
    const { custDetail: { page = {} } } = this.props;
    const { selectedRowKeys } = this.state;
    if (_.size(selectedRowKeys) === page.totalCount) {
      this.setState({
        isSelectAll: true,
      });
    }
  }

  // 获取每列Columns render的通用方法,增加title
  @autobind
  getColumnsTitleRender(text) {
    return <div title={`${text}`}> {text || '--'} </div>;
  }

  // 渲染客户明细表格的columns
  @autobind()
  getColumnsCustTitleList() {
    const { selectedRowKeys, isSelectAll } = this.state;
    return [
      {
        dataIndex: 'checkbox',
        key: 'checkbox',
        title: '',
        fixed: 'left',
        width: 40,
        render: (text, record) => {
          const checked = _.includes(selectedRowKeys, record.brokerNum);
          return (
            <Checkbox
              onChange={e => this.toggleItemChecked(e, record)}
              disabled={isSelectAll}
              checked={checked}
            />
          );
        },
      },
      {
        title: '客户名称',
        dataIndex: 'cust',
        key: 'cust',
        width: 130,
        fixed: 'left',
        render: this.renderCustNameCell,
      },
      {
        title: '总资产',
        dataIndex: 'assets',
        key: 'assets',
        width: 100,
        render: (text) => {
          // 小数点后保留两位，例如123456.00
          const fixedAssets = number.toFixed(_.toNumber(text), 2);
          // 以千分位的格式展示，例如123,456.00
          const thousandFormatAssets = number.thousandFormat(fixedAssets, false, ',', false);
          return this.getColumnsTitleRender(thousandFormatAssets);
        },
      },
      {
        title: '一级反馈',
        dataIndex: 'firstFeedback',
        key: 'firstFeedback',
        width: 140,
        render: text => this.getColumnsTitleRender(text),
      },
      {
        title: '二级反馈',
        dataIndex: 'secondFeedback',
        key: 'secondFeedback',
        width: 140,
        render: text => this.getColumnsTitleRender(text),
      },
      {
        title: '结果达标值',
        dataIndex: 'standardValue',
        key: 'standardValue',
        width: 100,
        render: text => this.getColumnsTitleRender(text),
      },
      {
        title: '结果达标日期',
        dataIndex: 'standardDate',
        key: 'standardDate',
        width: 110,
        render: text => this.getColumnsTitleRender(text),
      },
    ];
  }

  // 渲染客户明细表格中如果是委托服务经理的客户则带委字小图标
  // isDepute如果为true，则表示为委托服务经理的客户
  @autobind
  renderCustNameCell(text, record) {
    const { cust, brokerNum, isDepute = true } = record;
    return (
      <div title={`${cust}(${brokerNum})`} className={styles.custNameCell}>
        <div className={styles.custName}>{`${cust || '--'}(${brokerNum || '--'})`}</div>
        {
          isDepute ? (<div className={styles.isDepute}>委</div>) : null
        }
      </div>
    );
  }


  render() {
    const { serviceProgress, custFeedBack, isShowExecutorDetailLoading, custDetail } = this.props;
    const { pageNum } = this.state;
    const { list = [], page = {} } = custDetail;
    // 自定义旋转图标
    const customIcon = <Icon type="reload" spin />;
    const newColumns = this.getColumnsCustTitleList();
    return (
      <div className={styles.serviceResultWrap}>
        <ServiceResultLayout
          missionImplementationProgress={serviceProgress}
          onPreviewCustDetail={this.handleMissionClick}
          custFeedback={custFeedBack}
        />
        <div className={styles.custDetailWrap}>
          <Table
            dataSource={list}
            columns={newColumns}
            rowKey="brokerNum"
            title={this.renderCustDetailHeader}
            scroll={{ x: 720 }}
            pagination={false}
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
      </div>
    );
  }
}
