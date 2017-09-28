/**
 * @description 类穿梭框组件，统一样式
 * @author zhangjunli
 * Usage:
 * <Transfer
    subscribeData={array}
    unsubscribeData={array}
    subscribeColumns={array}
    unsubscribeColumns={array}
    rowKey={string}
  />
 * subscribeTitle: 不必要，有默认值（‘当前订阅服务’），第一个表的title
 * unsubscribeTitle： 不必要，有默认值（‘退订服务’），第二个表的title
 * subscribeData：不必要，有默认值（空数据），第一个标的数据源
 * unsubscribeData：不必要，有默认值（空数据），第二个标的数据源
 * subscribeColumns：必要，第一表的表头定义，需要指定 column 的 width 属性，否则列头和内容可能不对齐。
 * unsubscribeColumns：必要，第二个表的表头定义，需要指定 column 的 width 属性，否则列头和内容可能不对齐。
 * onSearch: 必要，搜索框触发的发放
 * rowKey： 必要，唯一的标识
 * checkChange： 不必要，向组件外传递信息，返回当前child，此父元素下选中所有child，所有选中的child
 * transferChange： 不必要，向组件外传递信息，返回第二个table的数据源
 */
import React, { PropTypes, Component } from 'react';
import { Table, Input, Checkbox } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';

import Icon from '../../common/Icon';
import styles from './tableTransfer.less';

const Search = Input.Search;
const actionColumns = (type, handleAction) => {
  function handleClick(flag, item, event) {
    if (_.isFunction(handleAction)) {
      handleAction(flag, item, event);
    }
  }
  return {
    title: '操作',
    key: 'action',
    render: (item) => {
      if (_.isEmpty(item.parentKey)) {
        return (
          <Icon
            type={type === 'first' ? 'new' : 'shanchu'}
            className={styles.actionIcon}
            onClick={() => { handleClick(type, item); }}
          />
        );
      }
      // return (<div className={styles.description}>标记可选产品</div>);
      return (
        <Checkbox
          onChange={event => handleClick(item, event)}
          defaultChecked={item.defaultChecked || false}
        />
      );
    },
  };
};

const checkColumns = (handleAction) => {
  function handleClick(item, event) {
    if (_.isFunction(handleAction)) {
      handleAction(item, event);
    }
  }
  return {
    render: (item) => {
      console.log('^^^^^^^item^^^^^^^^', item);
      if (!_.isEmpty(item.parentKey)) {
        return (
          <Checkbox
            onChange={event => handleClick(item, event)}
            defaultChecked={item.defaultChecked || false}
          >
            {item}
          </Checkbox>
        );
      }
      return <span>{item}</span>;
    },
  };
};

export default class TableTransfer extends Component {
  static propTypes = {
    firstTitle: PropTypes.string,
    secondTitle: PropTypes.string,
    firstData: PropTypes.array,
    secondData: PropTypes.array,
    transferChange: PropTypes.func,
    checkChange: PropTypes.func,
    placeholder: PropTypes.string,
    finishTips: PropTypes.array,
    warningTips: PropTypes.array,
    onSearch: PropTypes.func,
    showSearch: PropTypes.bool,
    pagination: React.PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    firstColumns: PropTypes.array.isRequired,
    secondColumns: PropTypes.array.isRequired,
    rowKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    firstData: [],
    secondData: [],
    firstTitle: '可选佣金调整',
    secondTitle: '已选产品',
    transferChange: () => {},
    checkChange: () => {},
    placeholder: '',
    finishTips: [],
    warningTips: [],
    onSearch: () => {},
    showSearch: true,
  }

  constructor(props) {
    super(props);
    const {
      firstData,
      secondData,
      firstColumns,
      secondColumns,
      rowKey,
    } = this.props;

    const initFirstArray = this.initTableData(firstData, rowKey);
    const initSecondArray = this.initTableData(secondData, rowKey);
    const initSecondColumns = this.initTableColumn(secondColumns);
    this.state = {
      checked: this.getAllDefaultCheck(initSecondArray, rowKey),
      firstArray: this.hiddenChildren(initFirstArray),
      secondArray: initSecondArray,
      firstColumns: [
        ...firstColumns,
        actionColumns('first', this.handleClick),
      ],
      secondColumns: [
        ...initSecondColumns,
        actionColumns('second', this.handleClick),
      ],
    };
  }

  // 获取所有默认选中
  getAllDefaultCheck(dataArray, rowKey) {
    let defaultCheck = {};
    dataArray.forEach(
      (item) => {
        if (!_.isEmpty(item.children)) {
          const defaultChildCheck = _.filter(
            item.children,
            child => child.defaultChecked,
          );
          defaultCheck = { ...defaultCheck, [item[rowKey]]: defaultChildCheck };
        }
      },
    );
    return defaultCheck;
  }

  // 添加属性，方便操作.初始操作为show children状态
  // parentKey:辨识子元素挂在哪个父元素上
  initTableData(dataArray, rowKey) {
    const newData = dataArray.map(
      (item) => {
        if (!_.isEmpty(item.children)) {
          const newChildren = item.children.map(
            child => ({ ...child, parentKey: item[rowKey] }),
          );
          return { ...item, children: newChildren };
        }
        return item;
      },
    );
    return newData;
  }

  // 为child行，第一列增加check框
  @autobind
  initTableColumn(columnArray) {
    return columnArray.map(
      (item, index) => {
        if (index === 0) {
          return { ...item, ...(checkColumns(this.handleCheck)) };
        }
        return item;
      },
    );
  }

  replaceKeyOfObject(item, oldKey, newKey) {
    let newItem = {};
    const keys = Object.keys(item);
    keys.forEach(
      (key) => {
        if (key === oldKey) {
          // newKey 存在，为替换key操作
          // newKey 不存在，为移除key操作
          if (!_.isEmpty(newKey)) {
            newItem = { ...newItem, [newKey]: item[key] };
          }
        } else {
          newItem = { ...newItem, [key]: item[key] };
        }
      },
    );
    return newItem;
  }

  // hidden:table不显示树形数据结构
  @autobind
  hiddenChildren(dataArray) {
    const newDataArray = dataArray.map(
      (item) => {
        if (!_.isEmpty(item.children)) {
          return this.replaceKeyOfObject(item, 'children', 'hidden');
        }
        return item;
      },
    );
    return newDataArray;
  }

  // children:table显示树形数据结构
  @autobind
  showChildren(dataArray) {
    const newDataArray = dataArray.map(
      (item) => {
        if (!_.isEmpty(item.hidden)) {
          return this.replaceKeyOfObject(item, 'hidden', 'children');
        }
        return item;
      },
    );
    return newDataArray;
  }

  // 更新数据源，触发render
  @autobind
  updateAllData(seleted, modifyRemoveArray, modifyAddArray, currentTableType) {
    const { transferChange, rowKey } = this.props;
    const { checked } = this.state;
    const isOperateFirstTable = currentTableType === 'first';
    const updateFirstArray = isOperateFirstTable ? modifyRemoveArray : modifyAddArray;
    const updateSecondArray = isOperateFirstTable ? modifyAddArray : modifyRemoveArray;
    // 清空对应的children选中
    const clearChildren = { [seleted[rowKey]]: [] };
    this.setState({
      checked: [...checked, ...clearChildren],
      firstArray: updateFirstArray,
      secondArray: updateSecondArray,
    }, transferChange(updateSecondArray));
  }

  // 更新带有children属性的元素，取消child的默认选中
  updateItem(selected) {
    if (!_.isEmpty(selected.children)) {
      const newChildren = selected.children.map(
        item => this.replaceKeyOfObject(item, 'defaultChecked'),
      );
      return { ...selected, children: newChildren };
    }
    return selected;
  }

  // 点击check框触发时间，返回当前child，此父元素下选中所有child，所有选中的child
  @autobind
  handleCheck(selected, event) {
    const { checked } = this.state;
    const { checkChange, rowKey } = this.props;
    const selectChildren = checked[selected.parentKey] || [];
    // 根据check的状态，添加或移除
    let newSelectChildren = [];
    if (event.target.checked) {
      // 添加
      newSelectChildren = [...selectChildren, selected];
    } else {
      // 移除
      newSelectChildren = _.filter(
        selectChildren,
        selectedChild => selectedChild[rowKey] !== selected[rowKey],
      );
    }
    const selectAll = { ...checked, [selected.parentKey]: newSelectChildren };
    this.setState({
      checked: selectAll,
    }, checkChange(newSelectChildren, selectAll));
  }

  @autobind
  handleClick(currentTableType, selected, event) {
    const { rowKey } = this.props;
    const { secondArray, firstArray } = this.state;
    const isOperateFirstTable = currentTableType === 'first';
    const needAddArray = isOperateFirstTable ? secondArray : firstArray;
    const needRemoveArray = isOperateFirstTable ? firstArray : secondArray;
    // 选择子元素
    if (!_.isEmpty(selected.parentKey)) {
      this.handleCheck(selected, event);
      return;
    }
    // 更新操作表格的数据源。remove要移动的元素
    const modifyRemoveArray = _.filter(
      needRemoveArray,
      item => item[rowKey] !== selected[rowKey],
    );

    // 更新当前对象
    let modifySelected = {};
    if (isOperateFirstTable) {
      modifySelected = this.showChildren([selected]);
    } else {
      // 移除当前child的默认选中，否则，从左侧表穿梭到右侧表时，还是默认选中状态
      const newSelected = this.updateItem(selected);
      modifySelected = this.hiddenChildren([newSelected]);
    }

    // 更新数据源，添加要移动的元素
    const modifyAddArray = [...modifySelected, ...needAddArray];
    // 更新数据源
    this.updateAllData(selected, modifyRemoveArray, modifyAddArray, currentTableType);
  }

  @autobind
  handleSearch(keyword) {
    const { onSearch } = this.props;
    onSearch(keyword);
  }

  @autobind
  renderFinishTipsTips() {
    const { finishTips } = this.props;
    return finishTips.map(
      item => (
        <div className={styles.tipRow}>
          <div className={styles.iconColumns}>
            <Icon type="duihao" className={styles.finishIcon} />
          </div>
          <div className={classnames(styles.tip, styles.finishTip)}>{item}</div>
        </div>
      ),
    );
  }

  @autobind
  renderTipsTips() {
    const { warningTips } = this.props;
    return warningTips.map(
      item => (
        <div className={styles.tipRow}>
          <div className={styles.iconColumns}>
            <Icon type="duihao" className={styles.warningIcon} />
          </div>
          <div className={classnames(styles.tip, styles.warningTip)}>{item}</div>
        </div>
      ),
    );
  }

  render() {
    const {
      firstTitle,
      secondTitle,
      placeholder,
      showSearch,
      pagination,
      rowKey,
    } = this.props;
    const {
      firstArray,
      secondArray,
      firstColumns,
      secondColumns,
    } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={classnames(styles.header, styles.leftHeader)}>
            <div className={styles.titleLabel}>{firstTitle}</div>
            {
              showSearch ? (
                <div>
                  <Search
                    placeholder={placeholder}
                    onSearch={(value) => { this.handleSearch(value); }}
                  />
                </div>
              ) : (null)
            }
          </div>
          <Table
            rowKey={record => record[rowKey]}
            columns={firstColumns}
            dataSource={firstArray}
            pagination={pagination}
            scroll={{ y: 260 }}
          />
        </div>
        <div className={styles.rightContent}>
          <div className={classnames(styles.header, styles.rightHeader)}>
            <div className={styles.titleLabel}>{secondTitle}</div>
            <div className={styles.tipContainer}>
              {this.renderFinishTipsTips()}
              {this.renderTipsTips()}
            </div>
          </div>
          <Table
            rowKey={record => record[rowKey]}
            columns={secondColumns}
            dataSource={secondArray}
            pagination={pagination}
            scroll={{ y: 260 }}
          />
        </div>
      </div>
    );
  }
}
