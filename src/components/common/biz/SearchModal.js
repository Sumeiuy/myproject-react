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
 * onOk：有默认值（空函数），按钮的回调事件
 * onCancel：有默认值（空函数），按钮的回调事件
 * dataSource： 有默认值（空数组），table的内容
 * placeholder：有默认值（空字符串），用于搜索框无内容时的提示文字
 * okText：有默认值（确定），按钮的title
 * cancelText：有默认值（取消），按钮的title
 */
import React, { PropTypes, Component } from 'react';
import { Input } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../Icon';
import TableDialog from './TableDialog';
import styles from './searchModal.less';

const Search = Input.Search;

export default class SearchModal extends Component {
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
    this.state = {
      visible: false,
      selected: {},
    };
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
    } = this.props;
    return (
      <div className={styles.container}>
        {
          flag ? (
            <Search
              ref={(ref) => { this.searchElem = ref; }}
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
        <TableDialog
          visible={visible}
          onOk={this.handleOk}
          onSearch={onSearch}
          dataSource={dataSource}
          columns={columns}
          title={title}
          placeholder={placeholder}
        />
      </div>
    );
  }
}
