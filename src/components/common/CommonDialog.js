import React, { PropTypes, Component } from 'react';
import { Table, Modal, Input } from 'antd';
import { autobind } from 'core-decorators';

import styles from './commonDialog.less';

const Search = Input.Search;

export default class CommonDialog extends Component {
  static propTypes = {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    dataSource: PropTypes.array,
    placeholder: PropTypes.string,
    columns: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    onOk: () => {},
    onCancel: () => {},
    dataSource: [],
    placeholder: '',
  }

  constructor(props) {
    super(props);
    const { dataSource, visible } = this.props;
    const defaultSelected = [];
    if (dataSource.length > 0) {
      const firstItem = dataSource[0];
      defaultSelected.push(firstItem.id);
    }
    this.state = {
      visible,
      data: dataSource,
      selectedRowKeys: defaultSelected,
      selectedRows: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    const { dataSource, visible } = nextProps;
    const defaultSelected = [];
    if (dataSource.length > 0) {
      const firstItem = dataSource[0];
      defaultSelected.push(firstItem.id);
    }
    this.setState({
      visible,
      selectedRowKeys: defaultSelected,
    });
  }
  @autobind
  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }

  @autobind
  handleOk() {
    const { onOk } = this.props;
    const { selectedRows } = this.state;
    const selected = selectedRows.length > 0 ? selectedRows[0] : {};
    this.setState({
      visible: false,
    }, onOk(selected));
  }

  @autobind
  handleCancel() {
    const { onCancel } = this.props;
    this.setState({
      visible: false,
    }, onCancel());
  }

  @autobind
  handleSearch(value) {
    // 关键字变化，改变数据源（发起搜索请求 或者 在结果中自行查找）
    console.log('#######value########', value);
  }

  render() {
    const {
      columns,
      title,
      placeholder,
    } = this.props;
    const {
      visible,
      data,
      selectedRowKeys,
    } = this.state;

    const rowSelection = {
      type: 'radio',
      onChange: this.onSelectChange,
      selectedRowKeys,
    };
    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrapClassName={styles.modalContainer}
        >
          <Search
            placeholder={placeholder}
            onSearch={(value) => { this.handleSearch(value); }}
          />
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </Modal>
      </div>
    );
  }
}
