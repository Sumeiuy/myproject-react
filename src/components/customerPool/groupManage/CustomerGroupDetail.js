/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 14:15:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-09-26 16:45:22
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import Button from '../../common/Button';
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
  };

  static defaultProps = {
    detailData: EMPTY_OBJECT,
    onCloseModal: () => { },
    canEditDetail: true,
  };

  constructor(props) {
    super(props);
    const { name = '', description = '' } = props.detailData;
    this.state = {
      name,
      description,
      curPageNum: 1,
      curPageSize: 5,
      totalRecordNum: 1,
    };
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

  componentWillReceiveProps(nextProps) {
    const { customerList } = this.props;
    const {
      page: prevCustomerListPageData = EMPTY_OBJECT,
    } = customerList || EMPTY_OBJECT;

    const { customerList: nextCustomerList } = nextProps;
    const {
      page: nextCustomerListPageData = EMPTY_OBJECT,
    } = nextCustomerList || EMPTY_OBJECT;
    const {
      curPageNum: nextCurPageNum,
      pageSize: nextPageSize,
      totalRecordNum: nextTotalRecordNum,
    } = nextCustomerListPageData;
    const { curPageNum, pageSize, totalRecordNum } = prevCustomerListPageData;
    // 当前页不一样，设置state
    if (curPageNum !== nextCurPageNum
      || pageSize !== nextPageSize
      || totalRecordNum !== nextTotalRecordNum) {
      this.setState({
        curPageNum: nextCurPageNum,
        curPageSize: nextPageSize,
        totalRecordNum: nextTotalRecordNum,
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
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log(currentPageNum, changedPageSize);
  }

  @autobind
  handleSubmit(e) {
    // this.props.form.resetFields(); 清除value
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  @autobind
  deleteCustomerFromGroup() {
    console.log('delete customer from group');
  }

  @autobind
  handleSearchClick({ value, selectedItem }) {
    console.log('search click', value, JSON.stringify(selectedItem));
  }

  @autobind
  handleAddCustomerFromSearch(selectedItem) {
    console.log('receive value, add customer to table', selectedItem);
    const { custName, cusId, custLevel, riskLevel } = selectedItem;
    console.log(custName, cusId, custLevel, riskLevel);
    // 将数据添加进表格
  }

  renderActionSource() {
    return [{
      type: '删除',
      handler: this.deleteCustomerFromGroup,
    }];
  }

  renderColumnTitle() {
    return [{
      key: 'name',
      value: '姓名',
    },
    {
      key: 'custId',
      value: '经济客户号',
    },
    {
      key: 'custLevel',
      value: '客户等级',
    },
    {
      key: 'riskLevel',
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
      totalRecordNum,
    } = this.state;
    const {
      form: { getFieldDecorator },
      customerList,
      customerHotPossibleWordsList = EMPTY_LIST,
      getHotPossibleWds,
      onCloseModal,
      canEditDetail,
  } = this.props;
    const { resultData = EMPTY_LIST } = customerList;
    // 构造表格头部
    const titleColumn = this.renderColumnTitle();
    // 构造operation
    const actionSource = this.renderActionSource();

    return (
      <Form onSubmit={this.handleSubmit} className={styles.groupDetail}>
        <div className={styles.nameSection}>
          <div className={styles.name}>
            分组名称
          </div>
          <div className={styles.nameContent}>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [],
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
                rules: [],
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
          !_.isEmpty(resultData) ?
            <div className={styles.customerListTable}>
              <GroupTable
                pageData={{
                  curPageNum,
                  curPageSize,
                  totalRecordNum,
                }}
                listData={resultData}
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
      </Form>
    );
  }
}
