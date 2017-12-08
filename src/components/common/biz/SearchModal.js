/**
 * @description 带table的弹框，统一样式
 * @author zhangjunli
 * Usage:
 * <SearchModal
 *  columns={array}
 *  title={string}
 *  onSearch={func}
 * />
 * columns: 必须的，用于table的列标题的定义
 * title：必须的，弹框的title
 * onSearch：必须的，搜索框的回调
 * renderSelected: 必须，用户自定义render选中值得显示
 * onOk：有默认值（空函数），按钮的回调事件
 * onCancel：有默认值（空函数），按钮的回调事件
 * dataSource： 有默认值（空数组），table的内容
 * placeholder：有默认值（空字符串），用于搜索框无内容时的提示文字
 * okText：有默认值（确定），按钮的title
 * cancelText：有默认值（取消），按钮的title
 * rowKey: 有默认值（空字符串，无选中），数据源中对象唯一的标识符，table设置选中用
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import TableDialog from './TableDialog';

const Search = Input.Search;

export default class SearchModal extends Component {
  static propTypes = {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    dataSource: PropTypes.array,
    placeholder: PropTypes.string,
    rowKey: PropTypes.string,
    columns: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    renderSelected: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onOk: () => {},
    onCancel: () => {},
    dataSource: [],
    placeholder: '',
    okText: '确定',
    cancelText: '取消',
    rowKey: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selected: {},
    };
  }

  @autobind
  closeModal(modalKey) {
    const { onCancel } = this.props;
    this.setState({
      [modalKey]: false,
    }, onCancel());
  }

  @autobind
  handleOk(selected) {
    const { onOk } = this.props;
    this.setState({
      visible: false,
      selected,
    }, onOk(selected));
  }

  @autobind
  handleFocus() {
    this.setState({
      visible: true,
    }, this.searchElem.input.refs.input.blur());
  }

  @autobind
  handleRemove() {
    this.setState({
      selected: {},
    });
  }

  @autobind
  renderSelectedElem() {
    const { renderSelected } = this.props;
    const { selected } = this.state;
    return renderSelected(selected, this.handleRemove);
  }

  render() {
    const {
      visible,
      selected,
    } = this.state;
    const flag = _.isEmpty(selected);
    const {
      columns,
      title,
      placeholder,
      dataSource,
      onSearch,
      rowKey,
    } = this.props;

    return (
      <div>
        {
          flag ? (
            <Search
              ref={(ref) => { this.searchElem = ref; }}
              placeholder={placeholder}
              onFocus={this.handleFocus}
            />
          ) : (
            this.renderSelectedElem()
          )
        }
        <TableDialog
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.closeModal}
          onSearch={onSearch}
          dataSource={dataSource}
          columns={columns}
          title={title}
          placeholder={placeholder}
          modalKey={'visible'}
          rowKey={rowKey}
        />
      </div>
    );
  }
}
