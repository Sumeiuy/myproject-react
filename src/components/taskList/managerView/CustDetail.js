/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 19:35:23
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-22 13:55:46
 * 客户明细数据
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Icon, message } from 'antd';
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

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_SIZE = 5;

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
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
    getCustDetailData: () => { },
    title: '',
    onClose: () => { },
  }

  constructor(props) {
    super(props);
    const {
      data: { page = EMPTY_OBJECT, list = EMPTY_LIST },
    } = props;
    const { totalCount, pageNum, pageSize } = page;
    this.state = {
      curPageNum: pageNum || INITIAL_PAGE_NUM,
      curPageSize: pageSize || INITIAL_PAGE_SIZE,
      totalRecordNum: totalCount || 0,
      dataSource: this.addIdToDataSource(list) || EMPTY_LIST,
      currentSelectRecord: {},
      currentSelectRowKeys: [],
      isSelectAll: false,
    };
    // 代表当前feedback详情是否是多选形式
    this.isFeedbackDetailMore = false;
  }

  componentWillReceiveProps(nextProps) {
    const { data: { page: nextPage = EMPTY_OBJECT,
      list: nextData = EMPTY_LIST } } = nextProps;
    const { data: { page = EMPTY_OBJECT, list = EMPTY_LIST } } = this.props;
    const { currentSelectRowKeys, isSelectAll } = this.state;
    if (page !== nextPage) {
      const { pageNum, pageSize, totalCount } = nextPage || EMPTY_OBJECT;
      this.setState({
        curPageNum: pageNum,
        curPageSize: pageSize,
        totalRecordNum: totalCount,
      });
    }

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
  }

  /**
    * 页码改变事件，翻页事件
    * @param {*} nextPage 下一页码
    * @param {*} curPageSize 当前页条目
    */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log(nextPage, currentPageSize);
    const { getCustDetailData } = this.props;
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });
    getCustDetailData({
      pageNum: nextPage,
      pageSize: currentPageSize,
    });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log(currentPageNum, changedPageSize);
    const { getCustDetailData } = this.props;
    this.setState({
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
    });
    getCustDetailData({
      pageNum: currentPageNum,
      pageSize: changedPageSize,
    });
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
          id: item.custId,
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
    const { push, hideCustDetailModal, isCustServedByPostn } = this.props;
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
        message.error('客户包含非本人名下客户，不能查看客户360视图');
      }
    });
  }

  /**
   * 处理客户名称点击事件
   * @param {*object} record 当前行记录
   */
  @autobind
  handleCustNameClick(record) {
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

  renderColumnTitle() {
    return [{
      key: 'custName',
      value: '客户名称',
    },
    {
      key: 'levelCode',
      value: '客户类型',
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
  }

  render() {
    const {
      curPageNum,
      curPageSize,
      totalRecordNum,
      currentSelectRowKeys,
      dataSource,
    } = this.state;

    const { title } = this.props;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    return (
      <div className={styles.custDetailWrapper}>
        <div className={styles.title}>{title}共{totalRecordNum || 0}人</div>
        <div className={styles.custDetailTableSection}>
          {!_.isEmpty(dataSource) ?
            <GroupTable
              pageData={{
                curPageNum,
                curPageSize,
                totalRecordNum,
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
              columnWidth={[100, 100, 130, 100, 100, 110, this.isFeedbackDetailMore ? 300 : 120]}
              titleColumn={titleColumn}
              // 固定标题，内容滚动
              scrollY={330}
              isFixedTitle
              selectionType={'checkbox'}
              isNeedRowSelection={false}
              onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
              onRowSelectionChange={this.handleRowSelectionChange}
              currentSelectRowKeys={currentSelectRowKeys}
              onSelectAllChange={this.handleSelectAllChange}
              isFirstColumnLink
              firstColumnHandler={this.handleCustNameClick}
              operationColumnClass={
                classnames({
                  [styles.custNameLink]: true,
                })
              }
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
