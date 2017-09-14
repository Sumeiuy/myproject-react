/**
 * @description 带table的弹框，统一样式
 * @author zhangjunli
 * Usage:
 * <TableDialog
 *  visible={bool}
 *  columns={array}
 *  title={string}
 *  onSearch={func}
 *  onOk={func}
 *  onCancel={func}
 *  modalKey={string}
 * />
 * visible: 必须的，控制是否出现弹框
 * columns: 必须的，用于table的列标题的定义
 * title：必须的，弹框的title
 * onSearch：必须的，搜索框的回调
 * onOk：必须，按钮的回调事件
 * onCancel：必须，按钮的回调事件
 * modalKey: 必须，容器组件中，控制modal是否出现的key
 * idKey: 必须，用于table设置选中的idkey
 * dataSource： 有默认值（空数组），table的内容
 * placeholder：有默认值（空字符串），用于搜索框无内容时的提示文字
 * okText：有默认值（确定），按钮的title
 * cancelText：有默认值（取消），按钮的title
 */
import React, { PropTypes, Component } from 'react';
import { Table, Modal, Input } from 'antd';
import { autobind } from 'core-decorators';

import styles from './tableDialog.less';

const Search = Input.Search;

export default class TableDialog extends Component {
  static propTypes = {
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    dataSource: PropTypes.array,
    placeholder: PropTypes.string,
    columns: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    modalKey: PropTypes.string.isRequired,
    idKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    dataSource: [],
    placeholder: '',
    okText: '确定',
    cancelText: '取消',
  }

  constructor(props) {
    super(props);
    const { dataSource, idKey } = this.props;
    const defaultConfig = this.defaultSelected(dataSource, idKey);
    this.state = {
      ...defaultConfig,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { dataSource, idKey } = nextProps;
    const defaultConfig = this.defaultSelected(dataSource, idKey);
    this.setState({
      ...defaultConfig,
    });
  }

  @autobind
  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }

  defaultSelected(dataSource, idKey) {
    const defaultSelected = [];
    const defaultSelectedRow = [];
    if (dataSource.length > 0) {
      const firstItem = dataSource[0];
      defaultSelectedRow.push(firstItem);
      defaultSelected.push(firstItem[idKey]);
    }
    return {
      selectedRowKeys: defaultSelected,
      selectedRows: defaultSelectedRow,
    };
  }

  @autobind
  handleOk() {
    const { selectedRows } = this.state;
    const selected = selectedRows.length > 0 ? selectedRows[0] : {};
    // 重置默认值
    const { dataSource, onOk } = this.props;
    const defaultConfig = this.defaultSelected(dataSource);
    this.setState({
      ...defaultConfig,
    }, onOk(selected));
  }

  @autobind
  handleCancel() {
    const { onCancel, dataSource, modalKey } = this.props;
    // 重置默认值
    const defaultConfig = this.defaultSelected(dataSource);
    this.setState({
      ...defaultConfig,
    }, onCancel(modalKey));
  }

  @autobind
  handleSearch(value) {
    const { onSearch } = this.props;
    onSearch(value);
  }

  render() {
    const {
      selectedRowKeys,
    } = this.state;
    const {
      columns,
      title,
      placeholder,
      okText,
      cancelText,
      dataSource,
      visible,
    } = this.props;

    if (!visible) {
      return null;
    }

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
