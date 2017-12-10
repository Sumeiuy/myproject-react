/**
 * @description 树形展开
 * @author zhangjunli
 * Usage:
 * <DetailTable
 *  treeData={object}
 *  onSelect={func}
 * />
 * treeData: 不必须，数据源
 * onSelect：不必须，选中事件
 */
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import { Table, Modal } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';

import Icon from '../common/Icon';
import Button from '../common/Button';
import styles from './detailTable.less';

const confirm = Modal.confirm;
// detailTable 组件的表格类型
const CENTER_TABLE = 'center';
const TEAM_TABLE = 'team';

const columnsOne = [{
  title: '名称',
  key: 'title',
  dataIndex: 'title',
  width: '25%',
  render: item => (
    <div className={classnames(styles.column, styles.title)} title={item}>
      {item}
    </div>
  ),
}, {
  title: '负责人',
  dataIndex: 'name',
  key: 'name',
  width: '25%',
  render: item => (
    <div className={classnames(styles.column, styles.manager)} title={item}>
      {item}
    </div>
  ),
}];
const columnsTwo = [{
  title: '团队数量',
  key: 'teamNum',
  dataIndex: 'teamNum',
  width: '25%',
  render: item => (
    <div className={classnames(styles.column, styles.teamNum)} title={item}>
      {item}
    </div>
  ),
}, {
  title: '投顾人数',
  dataIndex: 'adviserNum',
  key: 'adviserNum',
  width: '25%',
  render: item => (
    <div className={classnames(styles.column, styles.adviserNum)} title={item}>
      {item}
    </div>
  ),
}];
const columnsTree = [{
  title: '工号',
  key: 'code',
  dataIndex: 'code',
  width: '33%',
  render: item => (
    <div className={classnames(styles.column, styles.code)} title={item}>
      {item}
    </div>
  ),
}, {
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
  width: '33%',
  render: item => (
    <div className={classnames(styles.column, styles.name)} title={item}>
      {item}
    </div>
  ),
}];
const extra = {
  company: { title: '下属财富中心' },
  center: { title: '下属团队', buttonTitle: '添加团队' },
  team: { buttonTitle: '添加成员' },
};

const actionColumns = (category, action) => {
  const { deleteFunc, updateFunc } = action;
  function deleteClick(type, item) {
    if (_.isFunction(deleteFunc)) {
      deleteFunc(type, item);
    }
  }
  function updateClick(type, item) {
    if (_.isFunction(updateFunc)) {
      updateFunc(type, item);
    }
  }
  return {
    title: '操作',
    key: 'action',
    render: (item) => {
      const isCenter = category === CENTER_TABLE;
      return (
        <div className={styles.action}>
          <div className={styles.delete}>
            <Icon
              type={'shanchu'}
              className={styles.deleteIcon}
              onClick={() => { deleteClick(category, item); }}
            />
          </div>
          {
            isCenter ? (
              <div className={styles.update}>
                <Icon
                  type={'beizhu'}
                  className={styles.updateIcon}
                  onClick={() => { updateClick(category, item); }}
                />
              </div>
            ) : null
          }
        </div>
      );
    },
  };
};

export default class DetailTable extends Component {
  static propTypes = {
    tableData: PropTypes.array,
    category: PropTypes.string,
    rowKey: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
  }

  static defaultProps = {
    tableData: [],
    category: '',
    rowKey: '',
  }

  @autobind
  getColumns(category) {
    if (category === CENTER_TABLE) {
      return [
        ...columnsOne,
        _.last(columnsTwo),
        actionColumns(
          category,
          { deleteFunc: this.handleDeleteClick, updateFunc: this.handleUpdateClick },
        ),
      ];
    } else if (category === TEAM_TABLE) {
      return [...columnsTree, actionColumns(category, { deleteFunc: this.handleDeleteClick })];
    }
    return [...columnsOne, ...columnsTwo];
  }

  @autobind
  handleDeleteClick(category, item) {
    const { onDelete } = this.props;
    confirm({
      title: '确认要删除吗?',
      content: '确认后，操作将不可取消。',
      onOk() {
        onDelete(category, item);
      },
    });
  }

  @autobind
  handleUpdateClick(category, item) {
    this.props.onUpdate(category, item, false);
  }

  @autobind
  handleAddClick(category) {
    this.props.onAdd(category);
  }

  @autobind
  renderExtra() {
    const { category } = this.props;
    if (_.isEmpty(category)) {
      return null;
    }
    const { title, buttonTitle } = extra[category];
    const hasTitle = !_.isEmpty(title);
    const hasBtnTitle = !_.isEmpty(buttonTitle);
    return (
      <div
        className={classnames(
          styles.extra,
          { [styles.memberExtra]: (!hasTitle && hasBtnTitle) },
        )}
      >
        {
          hasTitle ? (
            <div className={styles.title}>{title}</div>
          ) : null
        }
        {
          hasBtnTitle ? (
            <Button
              type="default"
              size="large"
              onClick={() => { this.handleAddClick(category); }}
              className={classnames(styles.btn, { [styles.memberBtn]: (category === TEAM_TABLE) })}
            >
              {buttonTitle}
            </Button>
          ) : null
        }
      </div>
    );
  }

  render() {
    const { category, rowKey, tableData } = this.props;
    const screenHeight = document.documentElement.clientHeight;
    const y = screenHeight - 281;
    return (
      <div className={styles.tableContainer}>
        {this.renderExtra()}
        <div className={styles.table}>
          <Table
            rowKey={record => record[rowKey]}
            columns={this.getColumns(category)}
            dataSource={tableData}
            pagination={false}
            scroll={{ y }}
          />
        </div>
      </div>
    );
  }
}
