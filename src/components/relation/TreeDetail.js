/**
 * @description 树形展开
 * @author zhangjunli
 * Usage:
 * <Tree
 * />
 * treeData: 不必须，数据源
 * onSelect：不必须，选中事件
 */
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Modal } from 'antd';
import _ from 'lodash';

import Icon from '../common/Icon';
import DetailTable from './DetailTable';
import styles from './treeDetail.less';

const confirm = Modal.confirm;
export default class TreeDetail extends Component {
  static propTypes = {
    tableData: PropTypes.array,
    title: PropTypes.string,
    category: PropTypes.string,
    manager: PropTypes.object,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
  }

  static defaultProps = {
    title: '',
    manager: {},
    category: '',
    tableData: {},
    onDelete: () => {},
    onUpdate: () => {},
    onAdd: () => {},
    onEdit: () => {},
  }

  @autobind
  handleDelete(param) {
    const that = this;
    confirm({
      title: '确认要删除吗?',
      content: '确认后，操作将不可取消。',
      onOk() { that.props.onDelete(param); },
    });
  }

  @autobind
  renderHeader() {
    const { title, manager, onEdit } = this.props;
    return (
      <div className={styles.header}>
        <div className={styles.title}>{title || '--'}</div>
        <div className={styles.managerRow}>
          <div className={styles.info}>{'负责人：'}</div>
          {
            _.isEmpty(manager) ? null : (
              <div className={classnames(styles.info, styles.value)}>{`${manager.name}（${manager.code}）`}</div>
            )
          }
          <Icon type={'beizhu'} onClick={() => { onEdit(); }} className={styles.editIcon} />
        </div>
      </div>
    );
  }

  render() {
    const { tableData, category, onDelete, onUpdate, onAdd } = this.props;
    const screenHeight = document.documentElement.clientHeight;
    const style = { height: `${(screenHeight - 109)}px` };
    return (
      <div className={styles.detailContainer} style={style}>
        {this.renderHeader()}
        <DetailTable
          rowKey={'id'}
          category={category}
          tableData={tableData}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onAdd={onAdd}
        />
      </div>
    );
  }
}
