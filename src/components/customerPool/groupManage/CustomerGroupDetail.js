/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 14:15:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-04 17:03:02
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, message } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import confirm from '../../common/Confirm';
import GroupTable from './GroupTable';
import Search from '../../common/Search';

import tableStyles from './groupTable.less';
import styles from './customerGroupDetail.less';
import logable from '../../../decorators/logable';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const FormItem = Form.Item;

@Form.create()
export default class CustomerGroupDetail extends PureComponent {
  static propTypes = {
    detailData: PropTypes.object,
    form: PropTypes.object.isRequired,
    customerList: PropTypes.object.isRequired,
    customerHotPossibleWordsList: PropTypes.array.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    canEditDetail: PropTypes.bool,
    // 获取分组下的客户列表
    getGroupCustomerList: PropTypes.func.isRequired,
    // 操作分组信息成功与否
    operateGroupResult: PropTypes.string.isRequired,
    // 操作分组信息
    operateGroup: PropTypes.func.isRequired,
    // 风险等级字典
    custRiskBearing: PropTypes.array,
    // 从指定分组下删除某个客户
    deleteCustomerFromGroup: PropTypes.func.isRequired,
    // 删除分组下指定客户结果
    deleteCustomerFromGroupResult: PropTypes.object.isRequired,
    // 编辑情况下，添加客户到分组下的列表
    onAddCustomerToGroup: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  static defaultProps = {
    detailData: EMPTY_OBJECT,
    canEditDetail: true,
    custRiskBearing: [],
  };

  constructor(props) {
    super(props);
    const { name = '', description = '', groupId = '' } = props.detailData;
    this.state = {
      name,
      description,
      curPageNum: 1,
      curPageSize: 5,
      groupId,
      record: {},
      totalRecordNum: 0,
      originRecordNum: 0,
      includeCustList: EMPTY_LIST,
      includeCustListSize: 0,
      dataSource: EMPTY_LIST,
      includeCustIdList: [],
      needDeleteCustId: '',
      curPageCustList: EMPTY_LIST,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { customerList = EMPTY_OBJECT,
      deleteCustomerFromGroupResult: deleteResult = EMPTY_OBJECT,
      getGroupCustomerList,
       } = this.props;
    const { resultData: prevData = EMPTY_LIST } = customerList;
    const { customerList: nextList = EMPTY_OBJECT,
      deleteCustomerFromGroupResult: nextDeleteResult = EMPTY_OBJECT } = nextProps;
    const { resultData: nextData = EMPTY_LIST, page = EMPTY_OBJECT } = nextList;
    const { totalRecordNum } = page;
    const {
      dataSource,
      groupId,
      needDeleteCustId,
      totalRecordNum: newRecordNum,
    } = this.state;

    const prevResult = deleteResult[`${groupId}_${needDeleteCustId}`];
    const nextResult = nextDeleteResult[`${groupId}_${needDeleteCustId}`];

    if (prevData !== nextData) {
      this.setState({
        dataSource: nextData,
        // 总条目与当前新增cust条目相加
        totalRecordNum,
      });
    }

    // 判断删除是否成功
    if (prevResult !== nextResult) {
      const newDataSource = _.filter(dataSource, item => item.custId !== needDeleteCustId);
      // 数据从表格删除
      this.setState({
        dataSource: newDataSource,
        // 总记录数减1
        totalRecordNum: newRecordNum - 1,
      }, () => {
        if (_.isEmpty(newDataSource) && groupId) {
          // 判断数据是否不存在了，
          // 并且不是新增
          // 不存在请求数据
          getGroupCustomerList({
            groupId,
            pageNum: 1,
            pageSize: 5,
          });
        }
      });
    }
  }

  @autobind
  getData() {
    const { groupId, includeCustIdList } = this.state;
    return {
      groupId,
      includeCustIdList,
    };
  }

  @autobind
  getForm() {
    return this.props.form;
  }

  /**
   * 获取本页数据，从服务器获取或者本地分页
   * @param {*} curPage 当前页
   * @param {*} curPageSize 当前分页条目
   */
  @autobind
  getCurPageData(curPage, curPageSize) {
    const { getGroupCustomerList } = this.props;
    const { groupId = '', includeCustList } = this.state;
    if (_.isEmpty(groupId)) {
      // 如果groupId是空，则直接取includeCustList中的数据
      const data = _.slice(includeCustList, (curPage - 1) * curPageSize,
        curPage * curPageSize);
      this.setState({
        curPageCustList: data,
      });
    } else {
      getGroupCustomerList({
        groupId,
        pageNum: curPage,
        pageSize: curPageSize,
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
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });
    this.getCurPageData(nextPage, currentPageSize);
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log(currentPageNum, changedPageSize);
    this.setState({
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
    });
    this.getCurPageData(currentPageNum, changedPageSize);
  }

  @autobind
  deleteCustomerFromGroup(record) {
    console.log('delete customer from group');
    const {
      includeCustIdList,
      totalRecordNum,
      includeCustList,
      groupId,
      curPageSize,
      includeCustListSize,
    } = this.state;
    const { custId } = record;
    // 新增下删除客户从includeCustIdList删除
    const newIncludeCustList = _.filter(includeCustList, item => item.custId !== custId);
    const newIncludeCustIdList = _.filter(includeCustIdList, item => item !== custId);

    if (_.includes(includeCustIdList, custId)) {
      this.setState({
        includeCustIdList: newIncludeCustIdList,
        includeCustList: newIncludeCustList,
        includeCustListSize: includeCustListSize - 1,
      });
    }

    if (_.isEmpty(groupId)) {
      const {
        curPageCustList,
        includeCustListSize: newCustListSize,
        curPage,
      } = this.generateLocalPageAndDataSource(newIncludeCustList, curPageSize);

      this.setState({
        // 总记录数减1
        totalRecordNum: totalRecordNum - 1,
        curPageCustList,
        includeCustListSize: newCustListSize,
        curPageNum: curPage,
      });
    } else {
      // 直接提示删除确认框，然后删除
      confirm({
        onOk: this.handleConfirmOk,
        onCancel: this.handleConfirmCancel,
      });
    }

    this.setState({
      needDeleteCustId: custId,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0].value关键字搜索客户' } })
  handleSearchClick({ value, selectedItem }) {
    const { getHotPossibleWds } = this.props;
    getHotPossibleWds({
      keyword: value,
    });
    console.log('search click', value, JSON.stringify(selectedItem));
  }

  @autobind
  handleAddCustomerFromSearch(selectedItem) {
    // {
    // "id": "1-A5VIZI",
    // "labelNameVal": "1-A5VIZI",
    // "labelDesc": "孙**",
    // "cusId": "1-A5VIZI",
    // "custName": "孙**",
    // "brokerNumber": "02003362",
    // "custLevelCode": "805020",
    // "custLevelName": "金",
    // "custTotalAsset": 0.36,
    // "custType": "per",
    // "custOpenDate": "2009-12-22 00:00:00",
    // "riskLevel": "704020",
    // "openOrgName": "南京长江路证券营业部",
    // "openOrgId": "ZZ001041051"
    // }
    if (_.isEmpty(selectedItem)) {
      return;
    }
    console.log('receive value, add customer to table', selectedItem);
    const { custName, cusId, custLevelName, riskLevel, brokerNumber } = selectedItem;
    console.log(custName, cusId, custLevelName, riskLevel);
    const {
      includeCustIdList,
      totalRecordNum,
      includeCustList,
      groupId,
      // curPageNum,
      curPageSize,
      name,
      description,
    } = this.state;
    const { custRiskBearing, onAddCustomerToGroup } = this.props;
    const riskLevelObject = _.find(custRiskBearing, item => item.key === riskLevel) || EMPTY_OBJECT;

    // 判断includeCustIdList是否存在custId
    if (_.includes(includeCustIdList, brokerNumber)) {
      message.error('此客户已经添加过');
      return;
    }

    const newCustIdList = _.concat(includeCustIdList, brokerNumber);

    // 如果groupId不为空，则添加直接调用接口，添加
    if (_.isEmpty(groupId)) {
      // 数据添加进表格
      // 新添加的数据放在表格的前面
      const newIncludeCustList = _.concat([{
        custName,
        custId: brokerNumber,
        levelName: custLevelName,
        riskLevelName: riskLevelObject.value,
        id: brokerNumber,
        brokerNumber,
      }], includeCustList);

      const {
        curPageCustList,
        includeCustListSize,
        curPage,
      } = this.generateLocalPageAndDataSource(newIncludeCustList, curPageSize);

      this.setState({
        // 手动新增的所有数据集合
        includeCustList: newIncludeCustList,
        includeCustListSize,
        totalRecordNum: totalRecordNum + 1,
        curPageCustList,
        curPageNum: curPage,
      });
    } else {
      // groupId不为空，直接调用add接口
      onAddCustomerToGroup({
        includeCustIdList: newCustIdList,
        name,
        description,
      });
    }

    // 将数据添加进includeCustIdList
    this.setState({
      includeCustIdList: newCustIdList,
    });
  }

  @autobind
  generateLocalPageAndDataSource(newIncludeCustList, curPageSize) {
    const includeCustListSize = _.size(newIncludeCustList);
    let curPageCustList = EMPTY_LIST;
    const curPage = Math.ceil(includeCustListSize / curPageSize);

    if (curPage <= 1) {
      // 第一页
      curPageCustList = _.slice(newIncludeCustList, 0, includeCustListSize);
    } else {
      // 大于一页
      curPageCustList = _.slice(newIncludeCustList,
        (curPage - 1) * curPageSize, includeCustListSize);
    }

    return {
      curPageCustList,
      includeCustListSize,
      curPage,
    };
  }

  @autobind
  handleConfirmOk() {
    this.deleteCustomerFromGroupForever();
  }

  @autobind
  handleConfirmCancel() {
    console.log('cancel');
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '分组管理客户详情删除',
    },
  })
  handleDeleteBtnClick(record) {
    this.setState({
      // 当前删除行记录数据
      record,
    });
    this.deleteCustomerFromGroup(record);
  }

  @autobind
  deleteCustomerFromGroupForever() {
    const { deleteCustomerFromGroup } = this.props;
    const { groupId, needDeleteCustId } = this.state;
    deleteCustomerFromGroup({
      groupId,
      custId: needDeleteCustId,
    });
  }

  /**
  * 为数据源的每一项添加一个id属性
  * @param {*} listData 数据源
  */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, item => _.merge(item, { id: item.custId }));
    }

    return [];
  }

  renderActionSource() {
    return [{
      type: '删除',
      handler: this.handleDeleteBtnClick,
    }];
  }

  renderColumnTitle() {
    // "custName":"1-5TTJ-3900",
    // "custId":"118000119822",
    // "levelName":"钻石",
    // "riskLevelName":"稳定"
    return [{
      key: 'custName',
      value: '姓名',
    },
    {
      key: 'custId',
      value: '经济客户号',
    },
    {
      key: 'levelName',
      value: '客户等级',
    },
    {
      key: 'riskLevelName',
      value: '风险等级',
    },
    {
      key: 'action',
      value: '操作',
    }];
  }

  render() {
    const {
      name = '',
      description = '',
      curPageNum,
      curPageSize,
      dataSource = EMPTY_LIST,
      totalRecordNum,
      curPageCustList,
      groupId,
    } = this.state;
    const {
      form: { getFieldDecorator },
      customerHotPossibleWordsList = EMPTY_LIST,
      getHotPossibleWds,
      canEditDetail,
    } = this.props;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();
    // 构造operation
    const actionSource = this.renderActionSource();

    let newDataSource = EMPTY_LIST;

    if (_.isEmpty(groupId)) {
      // 如果存在groupId，则用dataSource
      // 不然用includeCustList
      newDataSource = curPageCustList;
    } else {
      newDataSource = dataSource;
    }

    // 添加id到dataSource
    newDataSource = this.addIdToDataSource(newDataSource);

    return (
      <Form className={styles.groupDetail}>
        <div className={styles.nameSection}>
          <div className={styles.name}>
            分组名称
          </div>
          <div className={styles.nameContent}>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [
                  {
                    max: 50, message: '最大输入50个字符',
                  }, {
                    required: canEditDetail, message: '分组名称必填',
                  },
                ],
                initialValue: name || '',
              })(
                <Input
                  id={'nameInput'}
                  placeholder={canEditDetail ? '请输入分组名称' : ''}
                  size={'default'}
                  ref={ref => (this.nameInput = ref)}
                  disabled={!canEditDetail}
                />,
              )}
            </FormItem>
          </div>
        </div>
        <div className={styles.descriptionSection}>
          <div className={styles.description}>
            分组描述
          </div>
          <div className={styles.descriptionContent}>
            <FormItem>
              {getFieldDecorator('description', {
                rules: [
                  {
                    max: 500, message: '最大输入500个字符',
                  },
                ],
                initialValue: description || '',
              })(
                <Input.TextArea
                  id={'descriptionInput'}
                  placeholder={canEditDetail ? '请输入分组描述' : ''}
                  size={'default'}
                  autosize={false}
                  disabled={!canEditDetail}
                  ref={ref => (this.descriptionInput = ref)}
                />,
              )}
            </FormItem>
          </div>
        </div>
        <div className={styles.searchSection}>
          <div className={styles.searchTitle}>
            客户
          </div>
          <Search
            // 请求联想关键词
            queryPossibleWords={getHotPossibleWds}
            // 联想出来的数据
            possibleWordsData={customerHotPossibleWordsList}
            // 搜索className
            searchWrapperClass={styles.groupCustomerSearch}
            // 搜索按钮功能
            onSearchClick={this.handleSearchClick}
            // placeholder
            placeholder={'客户号/姓名'}
            // 搜索框style
            searchStyle={{
              height: '30px',
              width: '190px',
            }}
            // 是否需要搜索图标
            isNeedSearchIcon={false}
            // 是否需要添加按钮
            isNeedAddBtn
            // 添加按钮事件
            addBtnCallback={this.handleAddCustomerFromSearch}
          />
        </div>
        {
          !_.isEmpty(newDataSource) ?
            <div className={styles.customerListTable}>
              <GroupTable
                pageData={{
                  curPageNum,
                  curPageSize,
                  totalRecordNum,
                }}
                listData={newDataSource}
                onSizeChange={this.handleShowSizeChange}
                onPageChange={this.handlePageChange}
                tableClass={
                  classnames({
                    [tableStyles.groupTable]: true,
                    [styles.custListTable]: true,
                  })
                }
                titleColumn={titleColumn}
                actionSource={actionSource}
                isFirstColumnLink={false}
                // 固定标题，内容滚动
                scrollY={175}
                isFixedTitle
              />
            </div> : <div className={styles.emptyTable} />
        }
      </Form>
    );
  }
}
