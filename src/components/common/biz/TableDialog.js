/**
 * @description 带table的弹框，统一样式
 * @author zhangjunli
 * Usage:
 * <TableDialog
 *  visible={bool}
 *  columns={array}
 *  title={string}
 *  onSearch={func}
 * />
 * columns: 必须的，用于table的列标题的定义
 * title：必须的，弹框的title
 * onSearch：必须的，搜索框的回调
 * onOk：有默认值（空函数），按钮的回调事件
 * onCancel：有默认值（空函数），按钮的回调事件
 * dataSource： 有默认值（空数组），table的内容
 * placeholder：有默认值（空字符串），用于搜索框无内容时的提示文字
 * okText：有默认值（确定），按钮的title
 * cancelText：有默认值（取消），按钮的title
 */
import React, { PropTypes, Component } from 'react';
import { Table, Modal, Input } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../Icon';
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
    const { dataSource } = this.props;
    const defaultConfig = this.defaultSelected(dataSource);
    this.state = {
      visible: false,
      selected: {},
      ...defaultConfig,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { dataSource } = nextProps;
    const defaultConfig = this.defaultSelected(dataSource);
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
    const { selectedRows } = this.state;
    const selected = selectedRows.length > 0 ? selectedRows[0] : {};
    this.setState({
      visible: false,
      selected,
    });
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

  @autobind
  handleFocus() {
    this.setState({
      visible: true,
    });
  }

  @autobind
  handleRemove() {
    this.setState({
      selected: {},
    });
  }

  render() {
    const {
      visible,
      selectedRowKeys,
      selected,
    } = this.state;
    const flag = _.isEmpty(selected);
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
      <div className={styles.container}>
        {
          flag ? (
            <Search
              className={styles.search}
              placeholder={placeholder}
              onFocus={this.handleFocus}
            />
          ) : (
            <div className={styles.result}>
              <div className={styles.nameLabel}>{selected.name}</div>
              <div className={styles.custIdLabel}>{selected.id}</div>
              <div className={styles.iconDiv}>
                <Icon
                  type="close"
                  className={styles.closeIcon}
                  onClick={this.handleRemove}
                />
              </div>
            </div>
          )
        }
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
      </div>
    );
  }
}
