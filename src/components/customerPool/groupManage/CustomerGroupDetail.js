/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 14:15:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-25 17:39:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, message } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
// import Button from '../../common/Button';
import Confirm from '../../common/Confirm';
import GroupTable from './GroupTable';
import Search from '../../common/Search';

import tableStyles from './groupTable.less';
import styles from './customerGroupDetail.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const FormItem = Form.Item;
// withRef 拿到被包裹的wrappedComponent
@Form.create({ withRef: true })
export default class CustomerGroupDetail extends PureComponent {
  static propTypes = {
    detailData: PropTypes.object,
    form: PropTypes.object.isRequired,
    customerList: PropTypes.object.isRequired,
    onCloseModal: PropTypes.func,
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
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  static defaultProps = {
    detailData: EMPTY_OBJECT,
    onCloseModal: () => { },
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
      isShowDeleteConfirm: false,
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
    const { includeCustListSize,
      dataSource,
      groupId,
      needDeleteCustId,
      totalRecordNum: newRecordNum,
    } = this.state;

    const prevResult = deleteResult[`${groupId}_${needDeleteCustId}`];
    const nextResult = nextDeleteResult[`${groupId}_${needDeleteCustId}`];

    if (prevData !== nextData) {
      // 将新数据与旧数据concat,合并去重
      // const newDataSource = _.uniqBy(_.concat(dataSource, nextData), 'custId');
      this.setState({
        dataSource: nextData,
        // 总条目与当前新增cust条目相加
        totalRecordNum: totalRecordNum + includeCustListSize,
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

  /**
  * 页码改变事件，翻页事件
  * @param {*} nextPage 下一页码
  * @param {*} curPageSize 当前页条目
  */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log(nextPage, currentPageSize);
    const { getGroupCustomerList } = this.props;
    const { groupId = '', includeCustListSize, includeCustList } = this.state;
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });

    if ((nextPage * currentPageSize) > includeCustListSize) {
      // 当分页条目*分页数，大于新增总条目时，去请求下一页数据，不然用本地数据
      // 获取分组下的客户列表
      getGroupCustomerList({
        groupId,
        pageNum: nextPage,
        pageSize: currentPageSize,
      });
    } else {
      const curPage = nextPage * currentPageSize;
      // 截取includeList指定序列
      const newDataSource = _.slice(includeCustList, curPage - currentPageSize, curPage);
      this.setState({
        dataSource: newDataSource,
      });
    }
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log(currentPageNum, changedPageSize);
    const { getGroupCustomerList } = this.props;
    const { groupId = '', includeCustListSize } = this.state;
    this.setState({
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
    });
    if ((currentPageNum * changedPageSize) > includeCustListSize) {
      // 当分页条目*分页数，大于新增总条目时，去请求下一页数据，不然用本地数据
      // 获取分组下的客户列表
      getGroupCustomerList({
        groupId,
        pageNum: currentPageNum,
        pageSize: changedPageSize,
      });
    }
  }

  @autobind
  handleSubmit(e) {
    const { location: { pathname, query }, replace } = this.props;
    // this.props.form.resetFields(); 清除value
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { name, description } = values;
        const { groupId, includeCustIdList } = this.state;
        const { operateGroup, onCloseModal } = this.props;
        if (groupId) {
          // 编辑分组
          operateGroup({
            groupId,
            groupName: name,
            groupDesc: description,
            includeCustIdList: _.isEmpty(includeCustIdList) ? null : includeCustIdList,
            excludeCustIdList: null,
          });
        } else {
          // 新增分组
          operateGroup({
            groupName: name,
            groupDesc: description,
            includeCustIdList: _.isEmpty(includeCustIdList) ? null : includeCustIdList,
            excludeCustIdList: null,
          });
        }
        // 重置分页
        replace({
          pathname,
          query: {
            ...query,
            curPageNum: 1,
          },
        });
        // 关闭弹窗
        onCloseModal();
      } else {
        message.error('分组描述或分组名称有误');
      }
    });
  }

  @autobind
  deleteCustomerFromGroup(record) {
    console.log('delete customer from group');
    const {
      includeCustIdList,
      dataSource,
      totalRecordNum,
      includeCustList,
      groupId,
    } = this.state;
    const { getGroupCustomerList } = this.props;
    const { custId } = record;

    // 判断删除的custId在includeCustIdList中有没有
    if (_.includes(includeCustIdList, custId)) {
      const newDataSource = _.filter(dataSource, item => item.custId !== custId);
      // 存在则只是将includeCustIdList减少一条
      this.setState({
        includeCustIdList: _.filter(includeCustIdList, item => item !== custId),
        includeCustList: _.filter(includeCustList, item => item.custId !== custId),
        includeCustListSize: _.size(includeCustIdList) - 1,
        dataSource: newDataSource,
        // 总记录数减1
        totalRecordNum: totalRecordNum - 1,
        needDeleteCustId: custId,
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
    } else {
      // 不存在，直接提示删除确认框，然后删除
      this.setState({
        isShowDeleteConfirm: true,
        needDeleteCustId: custId,
      });
    }
  }

  @autobind
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
    const { includeCustIdList, dataSource, totalRecordNum, includeCustList } = this.state;
    const { custRiskBearing } = this.props;
    const riskLevelObject = _.find(custRiskBearing, item => item.key === riskLevel) || EMPTY_OBJECT;
    // 判断includeCustIdList是否存在custId
    if (_.includes(includeCustIdList, brokerNumber)) {
      message.info('此客户已经添加过！');
      return;
    }
    // 将数据添加进includeCustIdList
    this.setState({
      includeCustIdList: _.concat(includeCustIdList, brokerNumber),
    });

    // 数据添加进表格
    // 新添加的数据放在表格的前面
    this.setState({
      dataSource: _.concat([{
        custName,
        custId: brokerNumber,
        levelName: custLevelName,
        riskLevelName: riskLevelObject.value,
        id: cusId,
        brokerNumber,
      }], dataSource),
      // 手动新增的所有数据集合
      includeCustList: _.concat([{
        custName,
        custId: brokerNumber,
        levelName: custLevelName,
        riskLevelName: riskLevelObject.value,
        id: cusId,
        brokerNumber,
      }], includeCustList),
      includeCustListSize: _.size(includeCustIdList) + 1,
      totalRecordNum: totalRecordNum + 1,
    });
  }

  @autobind
  handleConfirmOk() {
    this.setState({
      isShowDeleteConfirm: false,
    });
    this.deleteCustomerFromGroupForever();
  }

  @autobind
  handleConfirmCancel() {
    this.setState({
      isShowDeleteConfirm: false,
    });
  }

  @autobind
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
      isShowDeleteConfirm,
      totalRecordNum,
    } = this.state;
    const {
      form: { getFieldDecorator },
      customerHotPossibleWordsList = EMPTY_LIST,
      getHotPossibleWds,
      // onCloseModal,
      canEditDetail,
  } = this.props;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();
    // 构造operation
    const actionSource = this.renderActionSource();
    // 添加id到dataSource
    const newDataSource = this.addIdToDataSource(dataSource);

    return (
      <Form onSubmit={this.handleSubmit} className={styles.groupDetail}>
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
                scrollY={142}
                isFixedTitle
              />
            </div> : <div className={styles.emptyTable} />
        }
        {
          isShowDeleteConfirm ?
            <Confirm
              type={'delete'}
              onCancelHandler={this.handleConfirmCancel}
              onOkHandler={this.handleConfirmOk}
            /> : null
        }
      </Form>
    );
  }
}
