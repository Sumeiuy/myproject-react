/**
 * @file components/feedback/RemarkList.js
 *  处理记录
 * @author yangquanjian
 */
import React, { PropTypes, PureComponent } from 'react';
import { Table } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import './remarkList.less';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
export default class RemarkList extends PureComponent {
  static propTypes = {
    remarkList: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    const { resultData = EMPTY_OBJECT } = props.remarkList || EMPTY_OBJECT;
    this.state = {
      dataSource: resultData || EMPTY_OBJECT,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { remarkList: nextList = EMPTY_OBJECT } = nextProps;
    const { remarkList: prevList = EMPTY_OBJECT } = this.props;
    if (nextList !== prevList) {
      const { returnList = EMPTY_LIST } = nextList;
      this.setState({
        dataSource: returnList,
      });
    }
  }
  @autobind
  constructTableColumns() {
    const columns = [{
      dataIndex: 'type.code.description.userName.userDepartment',
      width: '100%',
      render: (text, record, index) => {
        // 当前行记录
        console.log(text, record, index);
        return (
          <div className="item">
            <div className="wrap">
              <div className="info_dv">
                <span>{record.department}-{record.empId}
                </span><span>于{record.createTime}，添加了{record.processSuggest}：</span>
              </div>
              <div className="txt">
                {record.description}
                {/* {record.contentlist.length > 0 ? record.contentlist.map((inneritem, l) => (
                  <p rel={l}>{inneritem}</p>)) : '暂无数据'
                }*/}
              </div>
            </div>
          </div>
        );
      },
    }];
    return columns;
  }
  /**
   * 构造数据源
   */
  constructTableDatas() {
    const { dataSource } = this.state;
    const newDataSource = [];
    if (dataSource.length > 0) {
      dataSource.forEach((currentValue, index) =>
        newDataSource.push(_.merge(currentValue, { key: index })),
      );
    }
    console.log('constructor dataSource', newDataSource);
    return newDataSource;
  }
  render() {
    const columns = this.constructTableColumns();
    return (
      <Table
        className="record_list"
        columns={columns}
        dataSource={this.constructTableDatas()}
        showHeader={false}
        pagination={false}
        bordered={false}
      />
    );
  }
}
