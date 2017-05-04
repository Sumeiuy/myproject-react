import React, { PropTypes, PureComponent } from 'react';
import { Table } from 'antd';

export default class ChartTable extends PureComponent {
  static propTypes = {
    sourceData: PropTypes.array,
    data: PropTypes.object,
  }

  static defaultProps = {
    sourceData: [],
    data: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      bordered: true,
      loading: false,
      pagination: true,
      size: 'default',
    };
  }

  render() {
    const { sourceData } = this.props;
    console.log(sourceData);
    const columns = [];
    const data = [];

    columns[0] = {};
    columns[0].key = 'key';
    columns[0].title = '城市';
    columns[0].dataIndex = 'city';
    sourceData.forEach((item, index) => {
      columns[index + 1] = {};

      columns[index + 1].key = index + 1;
      columns[index + 1].title = item.title;
      columns[index + 1].dataIndex = item.title;

      item.data.forEach((child, idx) => {
        data[idx] = {};
        data[idx].city = child.name;
        data[idx][item.title] = child.value;
      });
    });
    console.log(111111);
    console.log(columns);
    console.log(222222);
    console.log(data);
    // const columns = [{
    //   title: 'Name',
    //   dataIndex: 'name',
    //   render: text => <a href="#">{text}</a>,
    // }, {
    //   title: 'Age',
    //   dataIndex: 'age',
    // }, {
    //   title: 'Address',
    //   dataIndex: 'address',
    // }];
    // const data = [{
    //   key: '1',
    //   name: 'John Brown',
    //   age: 32,
    //   address: 'New York No. 1 Lake Park',
    // }, {
    //   key: '2',
    //   name: 'Jim Green',
    //   age: 42,
    //   address: 'London No. 1 Lake Park',
    // }, {
    //   key: '3',
    //   name: 'Joe Black',
    //   age: 32,
    //   address: 'Sidney No. 1 Lake Park',
    // }, {
    //   key: '4',
    //   name: 'Disabled User',
    //   age: 99,
    //   address: 'Sidney No. 1 Lake Park',
    // }];
    return (
      <div>
        <Table {...this.state} columns={columns} dataSource={data} />
      </div>
    );
  }
}
