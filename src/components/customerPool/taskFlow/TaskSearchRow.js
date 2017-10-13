/**
 * @file components/customerPool/list/QuickMenu.js
 *  客户列表项中的快捷菜单
 * @author wangjunjun
 */
import React, { PropTypes, PureComponent } from 'react';
// import { autobind } from 'core-decorators';
import { Radio, Modal, Button } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import GroupTable from '../groupManage/GroupTable';
import styles from './taskSearchRow.less';

const RadioGroup = Radio.Group;
const radioData = [
  {
    title: '标签标签',
    number: '1234',
    cont: `标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述,标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，`,
    tips: '匹配字符',
    date: '2017-12-3',
    people: '张三',
  },
  {
    title: '标签标签',
    number: '768689',
    cont: '标签描述标签描述，标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述,标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，',
    tips: '匹配字符',
    date: '2017-12-31',
    people: '张三',
  },
  {
    title: '标签标签',
    number: '555555',
    cont: '标签描述标签描述，标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述,标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，',
    tips: '匹配字符',
    date: '2017-12-21',
    people: '张三',
  },
];

export default class TaskSearchRow extends PureComponent {

  static propTypes = {
    value: PropTypes.string.isRequired,
    // customerGroupList: PropTypes.object,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    getCustomerGroupList: PropTypes.func.isRequired,
    getGroupCustomerList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      addressEmail: {},
      visible: false,
    };
  }

  // componentWillReceiveProps(nextProps) {
  // }
  componentDidUpdate() {
  }
  change(e) {
    console.log(1111111111);
    console.log('e.target.value', e.target.value);
  }

  @autobind
  handleSeeCust() {
    console.log(1);
    this.setState({
      visible: true,
    });
  }
  @autobind
  handleCancel() {
    this.setState({ visible: false });
  }
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    const { getCustomerGroupList } = this.props;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: 1,
        curPageSize: changedPageSize,
      },
    });
    getCustomerGroupList({
      pageNum: currentPageNum,
      pageSize: changedPageSize,
    });
  }
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    const { getCustomerGroupList } = this.props;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: nextPage,
        curPageSize: currentPageSize,
      },
    });
    getCustomerGroupList({
      pageNum: nextPage,
      pageSize: currentPageSize,
    });
  }
  @autobind
  handleShowGroupDetail(record) {
    console.log('show add group detail modal');
    const { groupId } = record;
    const { getGroupCustomerList } = this.props;
    this.showGroupDetailModal(record);
    this.setState({
      canEditDetail: false,
      modalTitle: '查看用户分组',
    });
    // 获取分组下的客户列表
    getGroupCustomerList({
      groupId,
      pageNum: 1,
      pageSize: 5,
    });
  }
  renderColumnTitle() {
    // createLogin:"1-P9LJ",
    // createdTm:"2017-09-19 00:00:00",
    // groupId:"1-432KUCI",
    // groupName:"96",
    // relatCust:1,
    // xComments:null,
    return [{
      key: 'groupName',
      value: '分组名称',
    },
      {
        key: 'xComments',
        value: '描述',
      },
      {
        key: 'relatCust',
        value: '客户数',
      },
      {
        key: 'createdTm',
        value: '创建时间',
      },
      {
        key: 'action',
        value: '操作',
      }];
  }
  renderActionSource() {
    return [{
      type: '编辑',
      handler: this.editCustomerGroup,
    },
    {
      type: '删除',
      handler: this.handleDeleteBtnClick,
    },
    {
      type: '发起任务',
      handler: this.lanuchTask,
    }];
  }


  render() {
    console.log(this.props);
    const { visible } = this.state;
    // const {
    //   customerGroupList = {},
    //   location: { query: { curPageNum = 1, curPageSize = 10 } },
    // } = this.props;
    // const {
    //   page = {},
    // } = customerGroupList || {};
    // const { totalRecordNum } = page;
    // const titleColumn = this.renderColumnTitle();
    // const actionSource = this.renderActionSource();
    return (
      <div>
        <RadioGroup name="radiogroup" onChange={this.change}>
          {_.map(radioData,
            item => <div className={styles.divRows}>
              <Radio value={item.number}><span className={styles.title}>{item.title}</span></Radio>
              <h4 className={styles.titExp}>瞄准镜标签，共有
                <span>{item.number}</span>客户。创建时间{item.date}，创建人：{item.people}
              </h4>
              <h4>标签描述标签描述，<span>{item.tips}</span>{item.cont}</h4>
              <a className={styles.seeCust} onClick={this.handleSeeCust}>查看客户</a>
            </div>)}
        </RadioGroup>
        <div className={styles.seeCust}>
          <Modal
            visible={visible}
            title="满足标签为‘客户画像’的共有‘345’位"
            onOk={this.handleOk}
            maskClosable={false}
            onCancel={this.handleCancel}
            closable={false}
            footer={[
              <Button key="back" size="large" onClick={this.handleCancel}>关闭</Button>,
            ]}
            width={700}
          >
            此处应该有表格
          </Modal>
        </div>
      </div>

    );
  }
}
