/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 19:35:23
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-22 15:41:11
 * 客户明细数据
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Icon, message, Select } from 'antd';
import classnames from 'classnames';
import GroupTable from '../../customerPool/groupManage/GroupTable';
import { openFspTab } from '../../../utils';
import { emp } from '../../../helper';
import styles from './custDetail.less';
import tableStyles from '../../customerPool/groupManage/groupTable.less';
import iconMoney from './img/icon-money.png';
import iconDiamond from './img/icon-diamond-card.png';
import iconGold from './img/icon-gold-card.png';
import iconSliver from './img/icon-sliver-card.png';
import iconWhiteGold from './img/icon-white-gold.png';
import iconEmpty from './img/icon-empty.png';
import logable from '../../../decorators/logable';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const Option = Select.Option;

// 客户等级的图片源
const rankImgSrcConfig = {
  // 钻石
  805010: iconDiamond,
  // 白金
  805015: iconWhiteGold,
  // 金卡
  805020: iconGold,
  // 银卡
  805025: iconSliver,
  // 理财
  805030: iconMoney,
  // 无
  805040: iconEmpty,
  // 其他
  805999: '',
};

// 个人对应的code码
const PER_CODE = 'per';
// 一般机构对应的code码
const ORG_CODE = 'org';

const INITIAL_PAGE_SIZE = 10;
const INITIAL_TOTAL_COUNT = 10;
const INITIAL_PAGE_NUM = 1;

const NOOP = _.noop;
export default class CustDetail extends PureComponent {

  static propTypes = {
    // 表格数据
    data: PropTypes.object,
    // 获取下一页数据
    getCustDetailData: PropTypes.func,
    // 当前对应的客户类型
    title: PropTypes.string,
    // 关闭弹框
    onClose: PropTypes.func,
    push: PropTypes.func.isRequired,
    hideCustDetailModal: PropTypes.func.isRequired,
    isCustServedByPostn: PropTypes.func.isRequired,
    custServedByPostnResult: PropTypes.bool.isRequired,
    isEntryFromProgressDetail: PropTypes.bool,
    isEntryFromPie: PropTypes.bool,
    scrollModalBodyToTop: PropTypes.func.isRequired,
    // 当前筛选框数据
    currentFilter: PropTypes.array,
    // 当前选中的一级反馈条件
    currentSelectFeedback: PropTypes.string,
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
    getCustDetailData: NOOP,
    title: '',
    onClose: NOOP,
    isEntryFromProgressDetail: false,
    isEntryFromPie: false,
    currentFilter: EMPTY_LIST,
    currentSelectFeedback: '',
  }

  constructor(props) {
    super(props);
    const {
      data: { list = EMPTY_LIST },
      currentSelectFeedback,
    } = props;

    this.state = {
      dataSource: this.addIdToDataSource(list) || EMPTY_LIST,
      currentSelectRecord: EMPTY_OBJECT,
      currentSelectRowKeys: [],
      isSelectAll: false,
      currentSelectFeedBackIdL1: currentSelectFeedback || '',
    };
    // 代表当前feedback详情是否是多选形式
    this.isFeedbackDetailMore = false;
  }

  componentWillReceiveProps(nextProps) {
    const { data: { list: nextData = EMPTY_LIST },
      currentSelectFeedback: nextSelectFeedback,
    } = nextProps;
    const { data: { list = EMPTY_LIST }, currentSelectFeedback } = this.props;
    const { currentSelectRowKeys, isSelectAll } = this.state;

    if (list !== nextData) {
      let newSelectRowKeys = currentSelectRowKeys;
      if (isSelectAll) {
        newSelectRowKeys = _.map(nextData, item => item.custId);
      }
      this.setState({
        dataSource: this.addIdToDataSource(nextData),
        currentSelectRowKeys: newSelectRowKeys,
      });
    }

    if (nextSelectFeedback !== currentSelectFeedback) {
      this.setState({
        currentSelectFeedBackIdL1: nextSelectFeedback,
      });
    }
  }

  /**
 * select发生改变
 * @param {*string} value feedBackIdL1
 */
  @autobind
  onChange(value) {
    if (!_.isEmpty(value)) {
      const {
        getCustDetailData,
        isEntryFromProgressDetail,
        isEntryFromPie,
        currentFilter,
      } = this.props;
      const filterObject = _.find(currentFilter, item =>
        item.feedBackIdL1 === value) || EMPTY_OBJECT;
      // 获取
      getCustDetailData({
        isEntryFromProgressDetail,
        isEntryFromPie,
        // 分页重置
        pageNum: INITIAL_PAGE_NUM,
        pageSize: INITIAL_PAGE_SIZE,
        // 当前选择的一级反馈
        currentSelectFeedback: filterObject,
        currentFeedback: currentFilter,
      });
      this.setState({
        currentSelectFeedBackIdL1: value,
      });
    }
  }

  /**
   * 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位
   */
  @autobind
  getPopupContainer() {
    return this.filterElem;
  }

  /**
 * 改变每一页的条目
 * @param {*} currentPageNum 当前页码
 * @param {*} changedPageSize 当前每页条目
 */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const {
      getCustDetailData,
      isEntryFromProgressDetail,
      isEntryFromPie,
      currentFilter,
    } = this.props;
    getCustDetailData({
      pageNum: currentPageNum,
      pageSize: changedPageSize,
      isEntryFromProgressDetail,
      isEntryFromPie,
      currentFeedback: currentFilter,
    });
  }

  /**
  * 页码改变事件，翻页事件
  * @param {*} nextPage 下一页码
  * @param {*} curPageSize 当前页条目
  */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const {
        getCustDetailData,
      isEntryFromProgressDetail,
      isEntryFromPie,
      scrollModalBodyToTop,
      currentFilter,
      } = this.props;
    getCustDetailData({
      pageNum: nextPage,
      pageSize: currentPageSize,
      isEntryFromProgressDetail,
      isEntryFromPie,
      currentFeedback: currentFilter,
    });
    scrollModalBodyToTop();
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  @autobind
  addIdToDataSource(listData = []) {
    let newDataSource = listData;
    if (!_.isEmpty(listData)) {
      newDataSource = _.map(listData, (item) => {
        if (_.isArray(item.custFeedBack2)) {
          if (!this.isFeedbackDetailMore) {
            this.isFeedbackDetailMore = true;
          }
        }

        if (this.isFeedbackDetailMore) {
          this.isFeedbackDetailMore = false;
        }

        return {
          ...item,
          // 用流水id，流水id不可能一样
          id: item.missionFlowId,
        };
      });
    }

    return newDataSource;
  }

  @autobind
  handleRowSelectionChange(selectedRowKeys, selectedRows) {
    console.log(selectedRowKeys, selectedRows);
    this.setState({
      currentSelectRowKeys: selectedRowKeys,
    });
  }

  @autobind
  handleSingleRowSelectionChange(record, selected, selectedRows) {
    console.log(record, selected, selectedRows);
    const { custId } = record;
    const { currentSelectRowKeys } = this.state;
    let newSelectRowKeys = currentSelectRowKeys;
    if (selected) {
      newSelectRowKeys = _.uniq([...newSelectRowKeys, custId]);
    } else {
      newSelectRowKeys = _.filter(newSelectRowKeys, item => item !== custId);
    }
    this.setState({
      currentSelectRecord: record,
      currentSelectRowKeys: newSelectRowKeys,
    });
  }

  @autobind
  handleSelectAllChange(selected, selectedRows, changeRows) {
    console.log(selected, selectedRows, changeRows);
    this.setState({
      isSelectAll: selected,
      currentSelectRowKeys: selected ? _.map(selectedRows, item => item.key) : [],
    });
  }

  /**
   * 跳转到fsp的360信息界面
   */
  @autobind
  toDetail(custNature, custId, rowId, ptyId) {
    const type = (!custNature || custNature === PER_CODE) ? PER_CODE : ORG_CODE;
    const { push, isCustServedByPostn, hideCustDetailModal } = this.props;
    const postnId = emp.getPstnId();
    // 跳转之前查看一下是否都是本人名下的客户
    isCustServedByPostn({
      postnId,
      custId,
    }).then(() => {
      if (this.props.custServedByPostnResult) {
        // 跳转前关闭模态框
        hideCustDetailModal();
        const param = {
          id: 'FSP_360VIEW_M_TAB',
          title: '客户360视图-客户信息',
          forceRefresh: true,
        };
        const url = `/customerCenter/360/${type}/main?id=${custId}&rowId=${rowId}&ptyId=${ptyId}`;
        openFspTab({
          routerAction: push,
          url,
          pathname: '/customerCenter/fspcustomerDetail',
          param,
          state: {
            url,
          },
        });
      } else {
        message.error('客户非本人名下客户，不能查看客户360视图');
      }
    });
  }

  /**
   * 处理客户名称点击事件
   * @param {*object} record 当前行记录
   * 第二个参数用于logable 的name
   */
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '客户名称',
      type: '管理者视图客户反馈',
    },
  })
  handleCustNameClick(record, columnTitle) {
    console.log(columnTitle);
    const { custNature, custId, rowId, ptyId } = record;
    this.toDetail(custNature, custId, rowId, ptyId);
  }

  @autobind
  renderCustTypeIcon(custType) {
    return rankImgSrcConfig[custType] ?
      <img className={styles.iconMoneyImage} src={rankImgSrcConfig[custType]} alt="" />
      : null;
  }

  @autobind
  renderFeedbackDetail(feedbackDetail) {
    if (this.isFeedbackDetailMore) {
      return (
        <div className={styles.detailColumn}>
          {_.map(feedbackDetail, itemData =>
            <div key={itemData}><span>{itemData}</span></div>)
          }
        </div>
      );
    }
    return feedbackDetail;
  }

  @autobind
  renderColumnTitle() {
    const { isEntryFromPie, isEntryFromProgressDetail } = this.props;
    const columns = [{
      key: 'custName',
      value: '客户名称',
    },
    {
      key: 'levelCode',
      value: '客户等级',
      render: this.renderCustTypeIcon,
    },
    {
      key: 'orgName',
      value: '所在营业部',
    },
    {
      key: 'empName',
      value: '服务经理',
    },
    {
      key: 'missionStatusValue',
      value: '服务状态',
    },
    {
      key: 'custFeedBack1',
      value: '客户反馈',
    },
    {
      key: 'custFeedBack2',
      value: '反馈详情',
      render: this.renderFeedbackDetail,
    }];

    if (isEntryFromPie) {
      // 从饼图点击过来，不展示服务状态字段
      columns.splice(4, 1);
    } else if (isEntryFromProgressDetail) {
      // 从进度条点击过来，不展示客户反馈和客户反馈详情字段
      columns.splice(5, 2);
    }

    return columns;
  }

  @autobind
  renderFilterOption() {
    const { currentFilter } = this.props;
    return _.map(currentFilter, item =>
      <Option key={item.feedBackIdL1} value={item.feedBackIdL1}>
        {item.feedbackName}
      </Option>,
    );
  }

  render() {
    const {
      dataSource,
      currentSelectFeedBackIdL1,
    } = this.state;

    const {
      title,
      data: { page = EMPTY_OBJECT },
      isEntryFromPie,
    } = this.props;
    const { totalCount, pageNum } = page;
    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    const columnSize = _.size(titleColumn);

    let columnWidth;
    if (columnSize === 7) {
      // 列全部保留
      // columnWidth = [150, 100, 250, 100, 100, 150, 150];
      columnWidth = ['15%', '10%', '25%', '10%', '10%', '15%', '15%'];
    } else if (columnSize === 6) {
      // 去除服务状态列
      // columnWidth = [150, 100, 300, 100, 175, 175];
      columnWidth = ['15%', '10%', '30%', '10%', '17%', '18%'];
    } else if (columnSize === 5) {
      // 去除客户反馈和反馈详情列
      // columnWidth = [200, 150, 350, 150, 150];
      columnWidth = ['20%', '15%', '35%', '15%', '15%'];
    }

    return (
      <div className={styles.custDetailWrapper}>
        <div className={styles.header}>
          <div className={styles.title}>{title}共{totalCount || 0}人</div>
          {isEntryFromPie ? <div
            className={styles.filter}
            ref={(ref) => {
              if (ref && !this.filterElem) {
                this.filterElem = ref;
              }
            }}
          >
            <span className={styles.title}>客户反馈：</span>
            <Select
              onChange={this.onChange}
              value={currentSelectFeedBackIdL1}
              getPopupContainer={this.getPopupContainer}
              dropdownClassName={styles.filterDropdownList}
              dropdownMatchSelectWidth={false}
            >
              {this.renderFilterOption()}
            </Select>
          </div> : null
          }
        </div>
        <div className={styles.custDetailTableSection}>
          {!_.isEmpty(dataSource) ?
            <GroupTable
              pageData={{
                curPageNum: pageNum,
                curPageSize: INITIAL_PAGE_SIZE,
                totalRecordNum: totalCount,
              }}
              listData={dataSource}
              onSizeChange={this.handleShowSizeChange}
              onPageChange={this.handlePageChange}
              tableClass={
                classnames({
                  [styles.custDetailTable]: true,
                  [tableStyles.groupTable]: true,
                })
              }
              columnWidth={columnWidth}
              titleColumn={titleColumn}
              isFirstColumnLink
              firstColumnHandler={this.handleCustNameClick}
              operationColumnClass={
                classnames({
                  [styles.custNameLink]: true,
                })
              }
              // 分页器样式
              paginationClass={'selfPagination'}
              needPagination={totalCount > INITIAL_TOTAL_COUNT}
              // 分页器是否在表格内部
              paginationInTable={false}
            /> :
            <div className={styles.emptyContent}>
              <span>
                <Icon className={styles.emptyIcon} type="frown-o" />
                暂无数据
              </span>
            </div>}
        </div>
      </div>
    );
  }
}
