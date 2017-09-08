import React, { PropTypes, Component } from 'react';
import { Table, Modal, Input } from 'antd';
import { autobind } from 'core-decorators';

import styles from './tableDialog.less';

const Search = Input.Search;

export default class TableDialog extends Component {
  static propTypes = {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    dataSource: PropTypes.array,
    placeholder: PropTypes.string,
    columns: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onSearch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onOk: () => {},
    onCancel: () => {},
    dataSource: [],
    placeholder: '',
    okText: '确定',
    cancelText: '取消',
  }

  constructor(props) {
    super(props);
    const { dataSource, visible } = this.props;
    const defaultConfig = this.defaultSelected(dataSource);
    this.state = {
      visible,
      ...defaultConfig,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { dataSource, visible } = nextProps;
    const defaultConfig = this.defaultSelected(dataSource);
    this.setState({
      ...this.state,
      ...defaultConfig,
      visible,
    });
  }

  @autobind
  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }

  defaultSelected(dataSource) {
    const defaultSelected = [];
    const defaultSelectedRow = [];
    if (dataSource.length > 0) {
      const firstItem = dataSource[0];
      defaultSelectedRow.push(firstItem);
      defaultSelected.push(firstItem.id);
    }
    return {
      selectedRowKeys: defaultSelected,
      selectedRows: defaultSelectedRow,
    };
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
    const { onSearch } = this.props;
    onSearch(value);
  }

  render() {
    const {
      visible,
      selectedRowKeys,
    } = this.state;

    if (!visible) {
      return null;
    }

    const {
      columns,
      title,
      placeholder,
      okText,
      cancelText,
      dataSource,
    } = this.props;
    const rowSelection = {
      type: 'radio',
      onChange: this.onSelectChange,
      selectedRowKeys,
    };
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText={okText}
        cancelText={cancelText}
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
          dataSource={dataSource}
          pagination={false}
        />
      </Modal>
    );
  }
}
