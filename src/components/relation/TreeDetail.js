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

import Icon from '../common/Icon';
import DetailTable from './DetailTable';
import styles from './treeDetail.less';

const confirm = Modal.confirm;
export default class TreeDetail extends Component {
  static propTypes = {
    detail: PropTypes.object,
    category: PropTypes.string,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,
  }

  static defaultProps = {
    detail: {},
    category: '',
    onAdd: () => {},
    onDelete: () => {},
    onUpdate: () => {},
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
    const { detail, category, onUpdate } = this.props;
    const { name = '--', code = '--', title = '--' } = detail || {};
    return (
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.managerRow}>
          <div className={styles.info}>{'负责人：'}</div>
          <div className={classnames(styles.info, styles.value)}>{`${name}（${code}）`}</div>
          <Icon
            type={'beizhu'}
            onClick={() => { onUpdate(category, { name, code }, true); }}
            className={styles.editIcon}
          />
        </div>
      </div>
    );
  }

  render() {
    const { detail, category, onDelete, onUpdate, onAdd } = this.props;
    const { infoList = [] } = detail || {};
    const screenHeight = document.documentElement.clientHeight;
    const style = { height: `${(screenHeight - 109)}px` };
    return (
      <div className={styles.detailContainer} style={style}>
        {this.renderHeader()}
        <DetailTable
          category={category}
          rowKey={'id'}
          tableData={infoList}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onAdd={onAdd}
        />
      </div>
    );
  }
}
