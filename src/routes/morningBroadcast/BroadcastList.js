/**
 * Created By K0170179 on 2018/1/15
 * 播放列表详情
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import React, { PureComponent } from 'react';
import { Select, DatePicker, Input, Button, Table, Icon } from 'antd';
import moment from 'moment';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import styles from './boradcastList.less';
import AddMorningBoradcast from '../../components/modals/AddMorningBoradcast';

const { RangePicker } = DatePicker;
const Option = Select.Option;
const Search = Input.Search;

const columns = [{
  title: '标题',
  dataIndex: 'title',
  key: 'title',
  className: 'tableTitle',
  width: '35%',
  render: text => <span className={styles.textOverflow}>{text}</span>,
}, {
  title: '类型',
  dataIndex: 'type',
  width: '15%',
  key: 'type',
}, {
  title: '创建日期',
  dataIndex: 'date',
  width: '15%',
  key: 'date',
}, {
  title: '作者',
  dataIndex: 'author',
  width: '15%',
  className: 'tableAuthor',
  key: 'author',
}, {
  title: '操作',
  key: 'action',
  width: '15%',
  className: 'tableAction',
  render: () => (
    <span>
      <Icon className="edit" type="edit" />
      <i className="icon iconfont icon-shanchu remove" />
    </span>
  ),
}];
const data = [{
  key: '1',
  title: '金牛实盘模拟投资组合20170918：大盘蓄势待发金牛实盘模拟投资组合20170918：大170918：大',
  type: '产品销售晨报',
  date: '2017-09-08',
  author: '陈慧琴',
}, {
  key: '2',
  title: '金牛实盘模拟投资组合20170918：大盘蓄势待发金牛实盘',
  type: '财经V2晨报',
  date: '2017-09-08',
  author: '陈慧琴',
}, {
  key: '3',
  title: '金牛实盘模拟投资组合20170918：大盘蓄势待发金牛实盘',
  type: '产品销售晨报',
  date: '2017-09-08',
  author: '陈慧琴',
}];

export default class BroadcastList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  static propTypes = {
    handleOk: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
  };

  onHandleDataChange(date, dateString) {
    console.log(date, dateString);
  }

  @autobind()
  showModal() {
    this.setState({
      visible: true,
    });
  }

  @autobind()
  handleOk(e) {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  @autobind()
  handleCancel(e) {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render() {
    const { handleOk, handleCancel } = this;
    const { visible } = this.state;
    return (
      <div className={styles.broadcastListWrap} >
        <div className={styles.header}>
          <div>
            <Select style={{ width: 60 }} placeholder="作者">
              <Option value="lucy">lucy</Option>
            </Select>
            <div className={styles.timeRange}>
              <span>创建时间：</span>
              <RangePicker
                allowClear={false}
                onchange={this.onHandleDataChange}
                defaultValue={[moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')]}
                format={'YYYY/MM/DD'}
              />
            </div>
          </div>
          <div>
            <Search
              placeholder="标题关键词"
              style={{ width: 200 }}
              onSearch={value => console.log(value)}
            />
            <span className={styles.division}>|</span>
            <Button type="primary" icon="plus" size="large" onClick={this.showModal}>新建</Button>
            <AddMorningBoradcast
              visible={visible}
              handleOk={handleOk}
              handleCancel={handleCancel}
            />
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.broadcastList}>
            <Table columns={columns} dataSource={data} />
          </div>
        </div>
      </div>
    );
  }
}
