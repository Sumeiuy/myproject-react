/**
 * @Author: hongguangqing
 * @Description 业务手机申请页面添加服务经理
 * @Date: 2018-04-23 21:37:55
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-05-03 15:01:04
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Button, Table, message } from 'antd';
import Icon from '../common/Icon';
import SimilarAutoComplete from '../common/similarAutoComplete';
import BatchAddEmpList from './BatchAddEmpList';
import config from './config';
import styles from './addEmpList.less';
import logable, { logPV } from '../../decorators/logable';

// 最大可以选择的服务经理的数量200
const { MAXSELECTNUM } = config;
export default class AddEmpList extends PureComponent {
  static propTypes = {
    pageType: PropTypes.string,
    queryAdvisorList: PropTypes.func.isRequired,
    advisorList: PropTypes.array,
    // 添加服务经理之后的回调
    onAddEmpList: PropTypes.func.isRequired,
    // 获取批量投顾
    batchAdvisorListData: PropTypes.object.isRequired,
    queryBatchAdvisorList: PropTypes.func.isRequired,
    // 修改页面初始表格数据
    advisorBindList: PropTypes.array,
    // 删除绑定的服务经理
    deleteBindingAdvisor: PropTypes.func,
  }

  static defaultProps = {
    advisorList: [],
    pageType: '',
    advisorBindList: [],
    deleteBindingAdvisor: _.noop,
  }

  constructor(props) {
    super(props);
    const { pageType, advisorBindList } = this.props;
    this.state = {
      selectList: [],
      // 点击选择的服务经理
      selectedEmp: {},
      // 所有单个选择添加的服务经理列表，若pageType为edit代表是修改页面
      empList: pageType === 'edit' ? advisorBindList : [],
      // 批量添加弹框是否显示，默认false为不显示
      isShowBatchAddModal: false,
    };
  }

  // 点击选择服务经理
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择服务经理',
      value: '$args[0].empName',
    },
  })
  handleSelectEmplist(cust) {
    this.setState({ selectedEmp: cust });
  }

  // 根据用户输入的关键字查询服务经理
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '关键字搜索',
      value: '$args[0]',
    },
  })
  handleSearchEmpList(keyword) {
    this.props.queryAdvisorList({
      keyword,
      pageNum: 1,
      pageSize: 10,
    });
  }

  // 添加用户
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '添加' } })
  handleAddBtnClick() {
    const { empList, selectedEmp } = this.state;
    const { onAddEmpList } = this.props;
    // 选中客户才能添加，不选不能添加
    if (!_.isEmpty(selectedEmp)) {
      // 判断是否已经存在用该户
      const exist = _.findIndex(empList, o => o.empId === selectedEmp.empId) > -1;
      if (exist) {
        message.error('此服务经理已经添加过');
        return;
      }
      // 将单客户添加的数据合并到newList中
      const newList = [selectedEmp, ...empList];
      // 对合并后的数据进行去重
      const finalEmplist = _.uniqBy(newList, 'empId');
      // 添加的服务经理数量最多不能多于200条
      if (_.size(finalEmplist) > MAXSELECTNUM) {
        message.error(`服务经理最多只能添加${MAXSELECTNUM}条`);
        return;
      }
      this.setState({
        empList: finalEmplist,
      });
      onAddEmpList(finalEmplist);
    } else {
      message.error('请先选择服务经理');
    }
  }

  // 删除选择的用户
  @autobind
  @logable({ type: 'Click', payload: { name: '删除$args[0].empName' } })
  handleDeleteEmp(record) {
    const { deleteBindingAdvisor, onAddEmpList } = this.props;
    const { empList } = this.state;
    let newList;
    // 若存在id，说明该条已经存在数据库，应该调接口删除该条数据
    // 保证删除后，说明该服务经理已经不在流程处理中，就可以搜到该服务经理，可以添加该服务经理
    if (record.id) {
      deleteBindingAdvisor({
        id: record.id,
        appId: record.appId,
      }).then(() => {
        newList = _.filter(empList, item => item.empId !== record.empId);
        this.setState({
          empList: newList,
        });
        onAddEmpList(newList);
      });
    } else {
      newList = _.filter(empList, item => item.empId !== record.empId);
      this.setState({
        empList: newList,
      });
      onAddEmpList(newList);
    }
  }

  // 用户批量选择添加的服务经理列表
  @autobind
  saveSelectedBatchEmpList(batchList) {
    const { empList } = this.state;
    const { onAddEmpList } = this.props;
    // 批量客户添加与单客户添加进行合并
    const newList = [...batchList, ...empList];
    // 对合并后的数据进行去重
    const finalEmplist = _.uniqBy(newList, 'empId');
    // 去重后的数据不能多于200条
    if (_.size(finalEmplist) > MAXSELECTNUM) {
      message.error(`服务经理最多只能添加${MAXSELECTNUM}条`);
      return;
    }
    this.setState({
      empList: finalEmplist,
      isShowBatchAddModal: false,
    });
    onAddEmpList(finalEmplist);
  }

  // 分页显示总条数和选中总条数
  @autobind
  showTotal(total) {
    return `共${total} 条`;
  }

  // 点击批量添加按钮，批量添加弹框出现
  @autobind
  @logPV({ pathname: '/modal/addEmpList', title: '批量添加弹框' })
  handleBatchAddBtnClick() {
    // 批量展示所有可以做业务手机申请的投顾，由前端分页，且最多业务要求显示200条
    this.props.queryBatchAdvisorList({
      pageNum: 1,
      pageSize: 200,
    }).then(() => {
      this.setState({
        isShowBatchAddModal: true,
      });
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
      width: '25%',
    },
    {
      dataIndex: 'empId',
      title: '工号',
      width: '25%',
    },
    {
      dataIndex: 'orgName',
      title: '所属营业部',
      width: '30%',
    },
    {
      dataIndex: 'action',
      title: '操作',
      width: '20%',
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
    const { empList, isShowBatchAddModal } = this.state;
    // 处理选中的服务经理数组，给每个数组中对象加一个key
    const empListWithKey = empList.map(item => ({ ...item, key: item.empId }));
    // 去重，数组对象中empId相同去掉重复的那个
    const finalEmplist = _.uniqBy(empListWithKey, 'empId');
    // 添加服务经理的总条数
    const empListSize = _.size(finalEmplist);
    // 渲染标题
    const columnTitle = this.renderColumnTitle();
    return (
      <div className={styles.addEmpListBox}>
        <div className={styles.selectSearchBox}>
          <SimilarAutoComplete
            placeholder="姓名工号搜索"
            optionList={_.isEmpty(advisorList) ? [] : advisorList}
            showIdKey="empId"
            showNameKey="empName"
            onSelect={this.handleSelectEmplist}
            onSearch={this.handleSearchEmpList}
            style={{ width: '180px' }}
          />
          <Button className={styles.addButton} onClick={this.handleAddBtnClick} icon="plus">添加</Button>
          <Button
            className={styles.batchAddButton}
            onClick={this.handleBatchAddBtnClick}
            icon="plus"
          >
            批量添加
          </Button>
        </div>
        <div className={styles.empListTableList}>
          <Table
            columns={columnTitle}
            dataSource={finalEmplist}
            pagination={{
              total: empListSize,
              showTotal: this.showTotal,
              pageSize: 5,
            }}
            columnWidth={['25%', '25%', '30%', '20%']}
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
