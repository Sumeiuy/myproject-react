/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 19:35:23
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-05 20:45:20
 * 客户明细数据
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import GroupTable from '../../customerPool/groupManage/GroupTable';
import styles from './custDetail.less';
import tableStyles from '../../customerPool/groupManage/groupTable.less';
import iconMoney from '../../../../static/images/icon-money.png';
import iconDiamond from '../../../../static/images/icon-diamond-card.png';
import iconGold from '../../../../static/images/icon-gold-card.png';
import iconSliver from '../../../../static/images/icon-sliver-card.png';
import iconWhiteGold from '../../../../static/images/icon-white-gold.png';
import iconEmpty from '../../../../static/images/icon-empty.png';

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

export default class CustDetail extends PureComponent {

  static propTypes = {
    // 表格数据
    data: PropTypes.array,
    // 获取下一页数据
    getCustDetailData: PropTypes.func,
  }

  static defaultProps = {
    data: EMPTY_LIST,
    getCustDetailData: () => { },
  }

  constructor(props) {
    super(props);
    const {
      data: { page = EMPTY_OBJECT, listData = EMPTY_LIST },
    } = props;
    const { totalRecordNum, curPageNum, curPageSize } = page;
    this.state = {
      curPageNum: curPageNum || INITIAL_PAGE_NUM,
      curPageSize: curPageSize || INITIAL_PAGE_SIZE,
      totalRecordNum: totalRecordNum || INITIAL_PAGE_NUM,
      dataSource: this.addIdToDataSource(listData) || EMPTY_LIST,
      currentSelectRecord: {},
      currentSelectRowKeys: [],
      isSelectAll: false,
    };
    // 代表当前feedback详情是否是多选形式
    this.isFeedbackDetailMore = false;
  }

  componentWillReceiveProps(nextProps) {
    const { data: { page: nextPage = EMPTY_OBJECT,
      listData: nextData = EMPTY_LIST } } = nextProps;
    const { data: { page = EMPTY_OBJECT, listData = EMPTY_LIST } } = this.props;
    const { currentSelectRowKeys, isSelectAll } = this.state;
    if (page !== nextPage) {
      const { curPageNum, curPageSize, totalRecordNum } = nextPage || EMPTY_OBJECT;
      this.setState({
        curPageNum,
        curPageSize,
        totalRecordNum,
      });
    }

    if (listData !== nextData) {
      this.setState({
        dataSource: this.addIdToDataSource(nextData),
      });
      if (isSelectAll) {
        this.setState({
          currentSelectRowKeys: _.concat(currentSelectRowKeys,
            _.map(nextData, item => item.custId)),
        });
      } else {
        this.setState({
          currentSelectRowKeys: [],
        });
      }
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
      curPageNum: nextPage,
      curPageSize: currentPageSize,
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
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
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
        if (_.isArray(item.feedbackDetail)) {
          if (!this.isFeedbackDetailMore) {
            this.isFeedbackDetailMore = true;
          }
          return {
            ...item,
            id: item.custId,
            custType: this.renderCustTypeIcon(item.custType),
            feedbackDetail: <div className={styles.detailColumn}>
              {_.map(item.feedbackDetail, itemData =>
                <div key={itemData}><span>{itemData}</span></div>)}
            </div>,
          };
        }

        if (this.isFeedbackDetailMore) {
          this.isFeedbackDetailMore = false;
        }

        return {
          ...item,
          id: item.custId,
          custType: this.renderCustTypeIcon(item.custType),
        };
      });
    }

    return newDataSource;
  }

  @autobind
  handleRowSelectionChange(selectedRowKeys, selectedRows) {
    console.log(selectedRowKeys, selectedRows);
    const { currentSelectRowKeys } = this.state;
    this.setState({
      currentSelectRowKeys: [...selectedRowKeys, ...currentSelectRowKeys],
    });
  }

  @autobind
  handleSingleRowSelectionChange(record, selected, selectedRows) {
    console.log(record, selected, selectedRows);
    const { custId } = record;
    const { currentSelectRowKeys } = this.state;
    if (selected) {
      this.setState({
        currentSelectRowKeys: [...currentSelectRowKeys, custId],
      });
    } else {
      this.setState({
        currentSelectRowKeys: [],
      });
    }
    this.setState({
      currentSelectRecord: record,
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

  @autobind
  renderCustTypeIcon(custType) {
    return rankImgSrcConfig[custType] ?
      <img className={styles.iconMoneyImage} src={rankImgSrcConfig[custType]} alt="" />
      : null;
  }

  renderColumnTitle() {
    return [{
      key: 'custName',
      value: '客户名称',
    },
    {
      key: 'custType',
      value: '客户类型',
    },
    {
      key: 'department',
      value: '所在营业部',
    },
    {
      key: 'serveManager',
      value: '服务经理',
    },
    {
      key: 'serveStatus',
      value: '服务状态',
    },
    {
      key: 'custFeedback',
      value: '客户反馈',
    },
    {
      key: 'feedbackDetail',
      value: '反馈详情',
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

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    return (
      <div className={styles.custDetailWrapper}>
        <div className={styles.title}>已反馈客户共{totalRecordNum || 0}人</div>
        <div className={styles.custDetailTableSection}>
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
                [tableStyles.groupTable]: true,
                [styles.custDetailTable]: true,
              })
            }
            columnWidth={[100, 100, 130, 100, 100, 110, this.isFeedbackDetailMore ? 300 : 200]}
            titleColumn={titleColumn}
            // 固定标题，内容滚动
            scrollY={330}
            isFixedTitle
            selectionType={'checkbox'}
            isNeedRowSelection
            onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
            onRowSelectionChange={this.handleRowSelectionChange}
            currentSelectRowKeys={currentSelectRowKeys}
            onSelectAllChange={this.handleSelectAllChange}
          />
        </div>
      </div>
    );
  }
}
