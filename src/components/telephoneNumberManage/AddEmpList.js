/**
 * @Author: hongguangqing
 * @Description 业务手机申请页面添加服务经理
 * @Date: 2018-04-23 21:37:55
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-25 12:35:30
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Button, Table, message } from 'antd';
import Icon from '../common/Icon';
import SimilarAutoComplete from '../common/similarAutoComplete';
import BatchAddEmpList from './BatchAddEmpList';
import styles from './addEmpList.less';

export default class AddEmpList extends PureComponent {
  static propTypes = {
    queryAdvisorList: PropTypes.func.isRequired,
    advisorList: PropTypes.array,
    saveSelectedEmpList: PropTypes.func.isRequired,
    // 获取批量投顾
    batchAdvisorListData: PropTypes.object.isRequired,
    queryBatchAdvisorList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    advisorList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      selectList: [],
      // 点击选择的服务经理
      chooseEmp: {},
      // 所有单个选择添加的服务经理列表
      empLists: [],
      // 批量添加弹框是否显示，默认false为不显示
      isShowBatchAddModal: false,
    };
  }

  componentWillMount() {
    this.props.queryBatchAdvisorList({
      pageNum: 1,
      pageSize: 200,
    });
  }

  @autobind
  clearCustList() {
    this.setState({
      empLists: [],
    });
    this.passData2Create([]);
  }

  // 从添加服务经理页面传递数据给新建页面
  @autobind
  passData2Create(list) {
    this.props.saveSelectedEmpList(list);
  }

  // 点击选择服务经理
  @autobind
  handleSelectEmplist(cust) {
    this.setState({ chooseEmp: cust });
  }

  // 根据用户输入的关键字查询服务经理
  @autobind
  handleSearchEmpList(keyword) {
    this.props.queryAdvisorList({
      keyword,
      pageNum: 1,
      pageSize: 10,
    });
  }

  // 添加用户
  @autobind
  handleAddBtnClick() {
    const { empLists, chooseEmp } = this.state;
    // 判断是否已经存在改用户
    const exist = _.findIndex(empLists, o => o.empId === chooseEmp.empId) > -1;
    if (exist) {
      message.error('此用户已经添加过');
      return;
    }
    const newList = _.concat([chooseEmp], empLists);
    this.setState({
      empLists: newList,
    });
    this.passData2Create(newList);
  }

  // 删除选择的用户
  @autobind
  handleDeleteEmp(record) {
    const { empLists } = this.state;
    const newList = _.filter(empLists, item => item.empId !== record.empId);
    this.setState({
      empLists: newList,
    });
    this.passData2Create(newList);
  }

  // 用户批量选择添加的服务经理列表
  @autobind
  saveSelectedBatchEmpList(batchList) {
    const { empLists } = this.state;
    const newList = _.concat(empLists, batchList);
    this.setState({
      empLists: newList,
      isShowBatchAddModal: false,
    });
    this.passData2Create(newList);
  }

  // 分页显示总条数和选中总条数
  @autobind
  showTotal(total) {
    return `共${total} 条`;
  }

  // 点击批量添加按钮，批量添加弹框出现
  @autobind
  handleBatchAddBtnClick() {
    this.setState({
      isShowBatchAddModal: true,
    });
  }

  // 关闭批量添加弹框
  @autobind
  closeBatchAddModal() {
    this.setState({
      isShowBatchAddModal: false,
    });
  }

  // 头部标题
  @autobind
  renderColumnTitle() {
    return [{
      dataIndex: 'empName',
      title: '姓名',
    },
    {
      dataIndex: 'empId',
      title: '工号',
    },
    {
      dataIndex: 'orgName',
      title: '所属营业部',
    },
    {
      dataIndex: 'action',
      title: '操作',
      render: (text, record) => (
        <a onClick={() => this.handleDeleteEmp(record)}>
          <Icon type="shanchu" className={styles.deleteBtn} />
        </a>
      ),
    }];
  }

  render() {
    const {
      advisorList,
      batchAdvisorListData,
    } = this.props;
    const { empLists, isShowBatchAddModal } = this.state;
    // 处理选中的服务经理数组，给每个数组中对象加一个key
    const empListWithKey = empLists.map(item => ({ ...item, key: item.empId }));
    // 去重，数组对象中empId相同去掉重复的那个
    const finalEmplist = _.uniqBy(empListWithKey, 'empId');
    // 添加服务经理的总条数
    const empListsSize = _.size(finalEmplist);
    // 渲染标题
    const columnTitle = this.renderColumnTitle();
    return (
      <div className={styles.addEmpListBox}>
        <div className={styles.selectSearchBox}>
          <SimilarAutoComplete
            placeholder="经纪客户号/客户名称"
            optionList={_.isEmpty(advisorList) ? [] : advisorList}
            style={{ width: 160 }}
            showIdKey="empId"
            showNameKey="empName"
            onSelect={this.handleSelectEmplist}
            onSearch={this.handleSearchEmpList}
          />
          <Button className={styles.addButton} onClick={this.handleAddBtnClick}>添加</Button>
          <Button
            className={styles.batchAddButton}
            onClick={this.handleBatchAddBtnClick}
          >
            批量添加
          </Button>
        </div>
        <div className={styles.empListTableList}>
          <Table
            columns={columnTitle}
            dataSource={finalEmplist}
            pagination={{
              total: empListsSize,
              showTotal: this.showTotal,
              pageSize: 5,
            }}
          />
        </div>
        {
          isShowBatchAddModal ?
            <BatchAddEmpList
              visible={isShowBatchAddModal}
              closeBatchAddModal={this.closeBatchAddModal}
              batchAdvisorListData={batchAdvisorListData}
              saveSelectedBatchEmpList={this.saveSelectedBatchEmpList}
            />
            :
            null
        }
      </div>
    );
  }
}
