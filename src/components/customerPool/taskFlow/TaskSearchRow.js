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
const tabData = [
  { custName: '张三', serviceManager: '李四', business: '点点滴滴', custGrade: '点点滴滴', custType: '发发发' },
  { custName: '李四', serviceManager: '李四', business: '点点滴滴', custGrade: '点点滴滴', custType: '发发发' },
  { custName: '张三', serviceManager: '李四', business: '点点滴滴', custGrade: '点点滴滴', custType: '发发发' },
  { custName: '李四', serviceManager: '李四', business: '点点滴滴', custGrade: '点点滴滴', custType: '发发发' },
  { custName: '张三', serviceManager: '李四', business: '点点滴滴', custGrade: '点点滴滴', custType: '发发发' },
  { custName: '李四', serviceManager: '李四', business: '点点滴滴', custGrade: '点点滴滴', custType: '发发发' },
  { custName: '张三', serviceManager: '李四', business: '点点滴滴', custGrade: '点点滴滴', custType: '发发发' },
];
const EMPTY_LIST = [];

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
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      curPageNum: 1,
      curPageSize: 5,
      totalRecordNum: 0,
      originRecordNum: 0,
      dataSource: EMPTY_LIST,
    };
  }
  componentWillMount() {
    this.setState({
      dataSource: tabData,
    });
  }
  // componentWillReceiveProps(nextProps) {
  // }
  componentDidUpdate() {
  }
  @autobind
  change(e) {
    console.log(1111111111);
    console.log('e.target.value', e.target.value);
    const { onChange } = this.props;
    onChange(e.target.value);
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

  // 表格信息
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log('currentPageNum--', currentPageNum, 'changedPageSize--', changedPageSize);
    // const { location: { query, pathname }, replace } = this.props;
    // const { getCustomerGroupList } = this.props;
    // // 替换当前页码和分页条目
    // replace({
    //   pathname,
    //   query: {
    //     ...query,
    //     curPageNum: 1,
    //     curPageSize: changedPageSize,
    //   },
    // });
    // getCustomerGroupList({
    //   pageNum: currentPageNum,
    //   pageSize: changedPageSize,
    // });
  }
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log('nextPage---', nextPage, 'currentPageSize---', currentPageSize);
    // const { location: { query, pathname }, replace } = this.props;
    // const { getCustomerGroupList } = this.props;
    // // 替换当前页码和分页条目
    // replace({
    //   pathname,
    //   query: {
    //     ...query,
    //     curPageNum: nextPage,
    //     curPageSize: currentPageSize,
    //   },
    // });
    // getCustomerGroupList({
    //   pageNum: nextPage,
    //   pageSize: currentPageSize,
    // });
  }
  renderColumnTitle() {
    return [{
      key: 'custName',
      value: '客户名称',
    },
    {
      key: 'serviceManager',
      value: '服务经理',
    },
    {
      key: 'business',
      value: '所在营业部',
    },
    {
      key: 'custGrade',
      value: '客户等级',
    },
    {
      key: 'custType',
      value: '客户类型',
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
    const {
      curPageNum,
      curPageSize,
      dataSource = EMPTY_LIST,
      totalRecordNum,
      visible,
    } = this.state;
    const titleColumn = this.renderColumnTitle();
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
            <GroupTable
              pageData={{
                curPageNum,
                curPageSize,
                totalRecordNum,
              }}
              onSizeChange={this.handleShowSizeChange}
              onPageChange={this.handlePageChange}
              listData={dataSource}
              titleColumn={titleColumn}
              isFirstColumnLink={false}
            />
          </Modal>
        </div>
      </div>

    );
  }
}
