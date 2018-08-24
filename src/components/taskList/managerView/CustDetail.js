/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 19:35:23
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-22 16:55:52
 * 客户明细数据
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Icon, message } from 'antd';
import Table from '../../common/commonTable';
import { openFspTab } from '../../../utils';
import { permission, number } from '../../../helper';
import SingleFilter from '../../customerPool/common/NewSingleFilter';
import styles from './custDetail.less';
import tableStyles from '../../common/commonTable/index.less';
import iconMoney from '../performerView/img/iconMoney.png';
import iconDiamond from '../performerView/img/iconDiamond.png';
import iconGold from '../performerView/img/iconGold.png';
import iconSliver from '../performerView/img/iconSliver.png';
import iconWhiteGold from '../performerView/img/iconWhiteGold.png';
import iconEmpty from '../performerView/img/iconNull.png';
import logable from '../../../decorators/logable';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

// const Option = Select.Option;

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
// const INITIAL_PAGE_NUM = 1;

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
    custServedByPostnResult: PropTypes.bool.isRequired,
    isEntryFromProgressDetail: PropTypes.bool,
    isEntryFromPie: PropTypes.bool,
    isEntryFromCustTotal: PropTypes.bool,
    scrollModalBodyToTop: PropTypes.func.isRequired,
    // 当前筛选框数据
    currentFeedback: PropTypes.array,
    // 当前选中的一级反馈条件
    feedbackIdL1: PropTypes.string,
    feedbackIdL2: PropTypes.string,
    canLaunchTask: PropTypes.bool,
    isShowFeedbackFilter: PropTypes.bool,
    isEntryFromResultStatisfy: PropTypes.bool,
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
    getCustDetailData: NOOP,
    title: '',
    onClose: NOOP,
    isEntryFromProgressDetail: false,
    isEntryFromPie: false,
    isEntryFromCustTotal: false,
    currentFeedback: EMPTY_LIST,
    feedbackIdL1: '',
    canLaunchTask: false,
    feedbackIdL2: '',
    isShowFeedbackFilter: false,
    isEntryFromResultStatisfy: false,
  }

  static contextTypes = {
    empInfo: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const {
      data: { list = EMPTY_LIST },
      feedbackIdL1,
      feedbackIdL2,
    } = props;

    this.state = {
      dataSource: this.addIdToDataSource(list) || EMPTY_LIST,
      currentSelectFeedbackIdL1: feedbackIdL1 || '',
      currentSelectFeedbackIdL2: feedbackIdL2 || '',
      feedbackL1List: this.renderFeedbackL1Option(),
      feedbackL2List: this.renderFeedbackL2Option(feedbackIdL1, feedbackIdL2),
    };

    // 是否拥有查看非本人名下客户360权限
    this.hasViewCust360Permission = permission.hasViewCust360PermissionForManagerView();
  }

  componentWillReceiveProps(nextProps) {
    const { data: { list: nextData = EMPTY_LIST },
      feedbackIdL1: nextFeedbackIdL1,
      feedbackIdL2: nextFeedbackIdL2,
    } = nextProps;
    const { data: { list = EMPTY_LIST }, feedbackIdL1, feedbackIdL2 } = this.props;

    if (list !== nextData) {
      this.setState({
        dataSource: this.addIdToDataSource(nextData),
      });
    }

    if (nextFeedbackIdL1 !== feedbackIdL1) {
      this.setState({
        currentSelectFeedbackIdL1: nextFeedbackIdL1,
      });
    }

    if (nextFeedbackIdL2 !== feedbackIdL2) {
      this.setState({
        currentSelectFeedbackIdL2: nextFeedbackIdL2,
      });
    }
  }

  /**
   * 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位
   */
  @autobind
  getFeedbackL1PopupContainer() {
    return this.feedbackL1Elem;
  }

  @autobind
  getFeedbackL2PopupContainer() {
    return this.feedbackL2Elem;
  }

  /**
 * select发生改变
 * @param {*string} value feedbackIdL1
 */
  @autobind
  handleFeedbackL1Change({ key }) {
    const { getCustDetailData, isEntryFromCustTotal, ...remainingProps } = this.props;

    this.setState({
      currentSelectFeedbackIdL1: key,
    }, () => {
      this.setState({
        feedbackL2List: this.renderFeedbackL2Option(
          key,
          this.state.currentSelectFeedbackIdL2,
        ),
      }, () => {
        // 如果当前的二级反馈没有，那么将默认选中的二级反馈改成空
        if (_.isEmpty(this.state.feedbackL2List)) {
          this.setState({
            currentSelectFeedbackIdL2: '',
          });
        }
      });
    });
    // 查看客户明细
    getCustDetailData({
      ...remainingProps,
      isEntryFromCustTotal,
      feedbackIdL1: key,
      // 一级反馈一旦发生变化，二级反馈就传默认的所有反馈
      feedbackIdL2: '',
    });
  }

  @autobind
  handleFeedbackL2Change({ key }) {
    const { getCustDetailData, ...remainingProps } = this.props;

    // 获取
    getCustDetailData({
      ...remainingProps,
      feedbackIdL1: this.state.currentSelectFeedbackIdL1,
      feedbackIdL2: key,
    });
    this.setState({
      currentSelectFeedbackIdL2: key,
    });
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
      ...remainingProps
    } = this.props;
    getCustDetailData({
      ...remainingProps,
      pageNum: currentPageNum,
      pageSize: changedPageSize,
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
      scrollModalBodyToTop,
      ...remainingProps
    } = this.props;
    getCustDetailData({
      ...remainingProps,
      pageNum: nextPage,
      pageSize: currentPageSize,
    });
    scrollModalBodyToTop();
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  @autobind
  addIdToDataSource(listData = []) {
    return _.map(listData, item => ({
      ...item,
      // 用流水id，流水id不可能一样
      id: item.missionFlowId,
    }));
  }

  /**
   * 跳转到fsp的360信息界面
   * empId 为客户的主服务经理的id
   * 增加职责控制，
   *  - HTSC 客户资料-分中心管理岗
      - HTSC 客户资料-总部管理岗
      - HTSC 客户资料（无隐私）-分中心管理岗
      - HTSC 客户资料(无隐私）-总部管理岗
      - HTSC 客户资料管理岗（无隐私）
   */
  @autobind
  toDetail({ custNature, custId, rowId, ptyId, empId }) {
    const type = (!custNature || custNature === PER_CODE) ? PER_CODE : ORG_CODE;
    const { push, hideCustDetailModal } = this.props;
    const { empInfo: { empInfo = {} } } = this.context;
    // 主服务经理判断
    // 职责判断
    if (empInfo.rowId === empId || this.hasViewCust360Permission) {
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
      message.error('您没有权限查看此客户详细信息');
    }
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
      name: '管理者视图客户反馈',
    },
  })
  handleCustNameClick(record) {
    this.toDetail(record);
  }

  @autobind
  renderCustTypeIcon({ levelCode }) {
    return rankImgSrcConfig[levelCode] ?
      <img className={styles.iconMoneyImage} src={rankImgSrcConfig[levelCode]} alt="" />
      : null;
  }

  @autobind
  renderColumnTitle() {
    const {
      isEntryFromPie,
      isEntryFromProgressDetail,
      isEntryFromCustTotal,
      isEntryFromResultStatisfy,
    } = this.props;
    let columns = [{
      key: 'custName',
      value: '客户名称',
    },
    {
      key: 'custNumber',
      value: '经纪客户号',
    },
    {
      key: 'levelCode',
      value: '客户等级',
      render: this.renderCustTypeIcon,
    },
    {
      key: 'totAsset',
      value: '总资产',
      render: this.renderAsset,
    },
    {
      key: 'orgName',
      value: '所在营业部',
    },
    {
      key: 'empName',
      value: '服务经理',
      render: this.renderEmpName,
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
    }];

    if (isEntryFromPie || isEntryFromCustTotal) {
      // 从饼图点击过来，不展示服务状态字段
      columns = _.filter(columns, item => item.key !== 'missionStatusValue');
    } else if (isEntryFromResultStatisfy) {
      // 从进度条的结果达标过来的，不展示客户反馈和反馈详情，不展示服务状态，增加 结果达标值 结果达标日期 字段显示
      const tempList = ['missionStatusValue', 'custFeedBack1', 'custFeedBack2'];
      columns = _.filter(columns, item => !_.includes(tempList, item.key));
      columns = _.concat(columns, [{
        key: 'realityValue',
        value: '结果达标值',
      }, {
        key: 'finishDt',
        value: '结果达标日期',
      }]);
    } else if (isEntryFromProgressDetail) {
      // 从进度条点击过来，不展示客户反馈和客户反馈详情字段
      const tempList = ['custFeedBack1', 'custFeedBack2'];
      columns = _.filter(columns, item => !_.includes(tempList, item.key));
    }

    return columns;
  }

  @autobind
  renderFeedbackL1Option() {
    const { currentFeedback = EMPTY_LIST } = this.props;
    // 构造一级客户反馈
    return _.map(currentFeedback, item => ({
      key: item.feedbackIdL1,
      value: item.feedbackName,
    }));
  }

  @autobind
  renderFeedbackL2Option(
    currentSelectFeedbackIdL1,
    currentSelectFeedbackIdL2,
  ) {
    const { currentFeedback = EMPTY_LIST } = this.props;
    // 如果当前的一级反馈是所有反馈，那么不展示二级反馈筛选
    if (_.isEmpty(currentSelectFeedbackIdL1)) {
      return EMPTY_LIST;
    }
    // 构造二级客户反馈
    const currentFeedbackL1Object = _.find(currentFeedback, item =>
      item.feedbackIdL1 === currentSelectFeedbackIdL1);

    if (!_.isEmpty(currentFeedbackL1Object) && !_.isEmpty(currentFeedbackL1Object.childList)) {
      const feedbackL2List = _.map(currentFeedbackL1Object.childList, item => ({
        key: item.feedbackIdL2,
        value: item.feedbackName,
      }));

      // 如果当前选中的二级反馈和一级反馈一模一样，也不展示二级反馈
      // 如果都是所有，需要显示二级，默认进来，两个都是所有反馈
      if (_.size(feedbackL2List) === 1 &&
        currentFeedbackL1Object.feedbackName === feedbackL2List[0].value
        && !_.isEmpty(currentSelectFeedbackIdL1)) {
        return EMPTY_LIST;
      }

      // 如果当前选中的二级反馈没有，则默认显示所有反馈
      if (_.isEmpty(currentSelectFeedbackIdL2)) {
        return _.concat([{
          key: '',
          value: '所有反馈',
        }], feedbackL2List);
      }
    }
    return EMPTY_LIST;
  }

  // 总资产格式化渲染 保留两位小数，整数部分千分位显示: 9,999,999.62
  renderAsset(item) {
    // 接口返回的类型为数字和null，返回为null时显示 ‘--’
    if (!_.isNumber(item.totAsset)) {
      return '--';
    }
    const value = item.totAsset.toFixed(2);
    const asset = number.thousandFormat(value, false, ',', false);
    return <p className={styles.tableCellParagraph} title={asset}>{asset}</p>;
  }

  // 服务经理字段渲染：名称(工号)
  renderEmpName(item) {
    const value = `${item.empName}(${item.empNum})`;
    return <p className={styles.tableCellParagraph} title={value}>{value}</p>;
  }

  render() {
    const {
      dataSource,
      currentSelectFeedbackIdL1,
      currentSelectFeedbackIdL2,
      feedbackL1List,
      feedbackL2List,
    } = this.state;

    const {
      data: { page = EMPTY_OBJECT },
      isEntryFromPie,
      isEntryFromCustTotal,
      isShowFeedbackFilter,
      isEntryFromResultStatisfy,
      isEntryFromProgressDetail,
    } = this.props;
    const { totalCount, pageNum } = page;
    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    // 默认全部显示
    let columnWidth = [152, 120, 110, 130, 208, 160, 150, 120, 170];
    if (isEntryFromPie || isEntryFromCustTotal || isEntryFromResultStatisfy) {
      // 从饼图、客户总数、结果跟踪点击过来，展示8个字段
      columnWidth = [152, 120, 110, 130, 208, 160, 120, 170];
    } else if (isEntryFromProgressDetail) {
      // 从进度条点击过来，显示7个字段
      columnWidth = [152, 120, 110, 130, 208, 160, 150];
    }

    return (
      <div className={styles.custDetailWrapper}>
        {
          isShowFeedbackFilter ?
            <div className={styles.header}>
              {/**
              * 饼图或者客户总数下钻，展示筛选客户反馈
              */}
              {isEntryFromPie || isEntryFromCustTotal ?
                <div className={styles.filterSection}>
                  {
                    !_.isEmpty(feedbackL1List) ?
                      <div
                        className={styles.filter}
                      >
                        <SingleFilter
                          value={currentSelectFeedbackIdL1 || ''}
                          filterLabel="客户反馈"
                          filter="custFeedbackL1"
                          filterField={feedbackL1List}
                          onChange={this.handleFeedbackL1Change}
                        />
                      </div> : null
                  }
                  {
                    !_.isEmpty(feedbackL2List) ?
                      <div className={styles.filter}>
                        <SingleFilter
                          value={currentSelectFeedbackIdL2 || ''}
                          filterLabel=""
                          filter="custFeedbackL2"
                          filterField={feedbackL2List}
                          onChange={this.handleFeedbackL2Change}
                        />
                      </div> : null
                  }
                </div>
                : null
              }
            </div> : <div className={styles.emptyHeader} />
        }
        <div className={styles.custDetailTableSection}>
          {!_.isEmpty(dataSource) ?
            <Table
              pageData={{
                curPageNum: pageNum,
                curPageSize: INITIAL_PAGE_SIZE,
                totalRecordNum: totalCount,
              }}
              listData={dataSource}
              onSizeChange={this.handleShowSizeChange}
              onPageChange={this.handlePageChange}
              tableClass={`${styles.custDetailTable} ${tableStyles.groupTable}`}
              columnWidth={columnWidth}
              titleColumn={titleColumn}
              isFirstColumnLink
              firstColumnHandler={this.handleCustNameClick}
              operationColumnClass={styles.custNameLink}
              // 分页器样式
              paginationClass="selfPagination"
              needPagination={totalCount > INITIAL_TOTAL_COUNT}
              scrollX={1030}
              isFixedColumn
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
