/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 14:15:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-09-27 17:43:54
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, message } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import Button from '../../common/Button';
import Confirm from '../../common/Confirm';
import GroupTable from './GroupTable';
import Search from '../../common/Search';

import tableStyles from './groupTable.less';
import styles from './customerGroupDetail.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const FormItem = Form.Item;

@Form.create()
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
      totalRecordNum: 1,
      dataSource: EMPTY_LIST,
      includeCustIdList: [],
      excludeCustIdList: [],
      isShowDeleteConfirm: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { customerList = EMPTY_OBJECT } = this.props;
    const { resultData: prevData = EMPTY_LIST } = customerList;
    const { customerList: nextList = EMPTY_OBJECT } = nextProps;
    const { resultData: nextData = EMPTY_LIST, page = EMPTY_OBJECT } = nextList;
    const { totalRecordNum } = page;
    if (prevData !== nextData) {
      this.setState({
        dataSource: nextData,
        totalRecordNum,
      });
    }
  }

  // @autobind
  // handleDescriptionInputChange(e) {
  //   this.setState({
  //     description: e.target.value,
  //   });
  // }

  // @autobind
  // handleNameInputChange(e) {
  //   this.setState({
  //     name: e.target.value,
  //   });
  // }

  /**
  * 页码改变事件，翻页事件
  * @param {*} nextPage 下一页码
  * @param {*} curPageSize 当前页条目
  */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log(nextPage, currentPageSize);
    const { getGroupCustomerList } = this.props;
    const { groupId = '' } = this.state;
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });
    // 获取分组下的客户列表
    getGroupCustomerList({
      groupId,
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
    const { getGroupCustomerList } = this.props;
    const { groupId = '' } = this.state;
    this.setState({
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
    });
    // 获取分组下的客户列表
    getGroupCustomerList({
      groupId,
      pageNum: currentPageNum,
      pageSize: changedPageSize,
    });
  }

  @autobind
  handleSubmit(e) {
    // this.props.form.resetFields(); 清除value
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { name, description } = values;
        const { groupId, includeCustIdList, excludeCustIdList } = this.state;
        const { operateGroup, onCloseModal } = this.props;
        if (groupId) {
          // 编辑分组
          operateGroup({
            groupId,
            groupName: name,
            groupDesc: description,
            includeCustIdList: _.isEmpty(includeCustIdList) ? null : includeCustIdList,
            excludeCustIdList: _.isEmpty(excludeCustIdList) ? null : excludeCustIdList,
          });
        } else {
          // 新增分组
          operateGroup({
            groupName: name,
            groupDesc: description,
            includeCustIdList: _.isEmpty(includeCustIdList) ? null : includeCustIdList,
            excludeCustIdList: _.isEmpty(excludeCustIdList) ? null : excludeCustIdList,
          });
        }
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
    const { includeCustIdList, excludeCustIdList, dataSource, totalRecordNum } = this.state;
    const { custId } = record;
    // 判断删除的custId在includeCustIdList中有没有
    if (_.includes(includeCustIdList, custId)) {
      // 存在则删除
      this.setState({
        includeCustIdList: _.filter(includeCustIdList, item => item !== custId),
      });
    } else {
      // 不存在，直接添加进excludeCustIdList
      this.setState({
        excludeCustIdList: _.concat(excludeCustIdList, custId),
      });
    }

    // 数据从表格删除
    this.setState({
      dataSource: _.filter(dataSource, item => item.custId !== custId),
      // 总记录数减1
      totalRecordNum: totalRecordNum - 1,
    });
  }

  @autobind
  handleSearchClick({ value, selectedItem }) {
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
    console.log('receive value, add customer to table', selectedItem);
    const { custName, cusId, custLevelName, riskLevel } = selectedItem;
    console.log(custName, cusId, custLevelName, riskLevel);
    const { includeCustIdList, dataSource, totalRecordNum } = this.state;
    const { custRiskBearing } = this.props;
    const riskLevelObject = _.find(custRiskBearing, item => item.key === riskLevel) || EMPTY_OBJECT;
    // 将数据添加进includeCustIdList
    this.setState({
      includeCustIdList: _.concat(includeCustIdList, cusId),
    });
    // 数据添加进表格
    this.setState({
      dataSource: _.concat(dataSource, [{
        custName,
        custId: cusId,
        levelName: custLevelName,
        riskLevelName: riskLevelObject.value,
        id: cusId,
      }]),
      totalRecordNum: totalRecordNum + 1,
    });
  }

  @autobind
  handleConfirmOk() {
    const { record } = this.state;
    this.setState({
      isShowDeleteConfirm: false,
    });
    this.deleteCustomerFromGroup(record);
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
      isShowDeleteConfirm: true,
      // 当前删除行记录数据
      record,
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
      dataSource,
      isShowDeleteConfirm,
      totalRecordNum,
      record,
    } = this.state;
    const {
      form: { getFieldDecorator },
      customerHotPossibleWordsList = EMPTY_LIST,
      getHotPossibleWds,
      onCloseModal,
      canEditDetail,
  } = this.props;
    const { custName } = record;
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
              />
            </div> : null
        }
        <FormItem>
          <div className={styles.operationBtnSection}>
            <Button
              className={styles.cancel}
              onClick={onCloseModal}
            >
              取消
          </Button>
            <Button
              htmlType="submit"
              className={styles.submit}
              type="primary"
            >
              提交
          </Button>
          </div>
        </FormItem>
        {
          isShowDeleteConfirm ?
            <Confirm
              title={`确认删除客户：${custName}吗？`}
              content={`真的确认删除客户：${custName}吗？`}
              type={'delete'}
              onCancelHandler={this.handleConfirmCancel}
              onOkHandler={this.handleConfirmOk}
            /> : null
        }
      </Form>
    );
  }
}
