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
 * subscribeColumns：必要，第一表的表头定义，需要指定 column 的 width 属性，否则列头和内容可能不对齐。
 * unsubscribeColumns：必要，第二个表的表头定义，需要指定 column 的 width 属性，否则列头和内容可能不对齐。
 * rowKey： 必要，唯一的标识
 * subscribeTitle: 不必要，有默认值（‘当前订阅服务’），第一个表的title
 * unsubscribeTitle： 不必要，有默认值（‘退订服务’），第二个表的title
 * subscribeData：不必要，有默认值（空数据），第一个标的数据源
 * unsubscribeData：不必要，有默认值（空数据），第二个标的数据源
 * checkChange： 不必要，向组件外传递信息，返回当前child，此父元素下选中所有child，所有选中的child
 * transferChange： 不必要，向组件外传递信息，返回第二个table的数据源
 * defaultCheckKey: 不必要，标识子项的默认选中key
 * placeholder： 不必要，搜索框的提示文字
 * finishTips： 不必要，成功的提示，类型数组
 * warningTips：不必要，警告的提示文字，类型数组
 * showSearch： 不必要，是否显示search框
 * pagination： 不必要，页码
 * onSearch: 不必要，搜索框触发的发放
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
  function handleClick(flag, item) {
    if (_.isFunction(handleAction)) {
      handleAction(flag, item);
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
      return (<div className={styles.actionTip}>{item.tip}</div>);
    },
  };
};

const checkColumns = (column, handleAction) => {
  function handleClick(item, event) {
    if (_.isFunction(handleAction)) {
      handleAction(item, event);
    }
  }
  return {
    ...column,
    render: (item) => {
      const { key } = column;
      if (!_.isEmpty(item.parentKey)) {
        return (
          <Checkbox
            onChange={event => handleClick(item, event)}
            defaultChecked={item.defaultChecked || false}
          >
            {item[key]}
          </Checkbox>
        );
      }
      return <span>{item[key]}</span>;
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
    tips: PropTypes.array,
    onSearch: PropTypes.func,
    showSearch: PropTypes.bool,
    pagination: React.PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    firstColumns: PropTypes.array.isRequired,
    secondColumns: PropTypes.array.isRequired,
    rowKey: PropTypes.string.isRequired,
    defaultCheckKey: PropTypes.string,
  }

  static defaultProps = {
    firstData: [],
    secondData: [],
    firstTitle: '可选佣金调整',
    secondTitle: '已选产品',
    transferChange: () => {},
    checkChange: () => {},
    placeholder: '',
    tips: [],
    onSearch: () => {},
    showSearch: true,
    defaultCheckKey: '',
  }

  constructor(props) {
    super(props);
    const {
      firstData,
      secondData,
      firstColumns,
      secondColumns,
      rowKey,
      defaultCheckKey,
    } = props || this.props;
    const initFirstArray = this.initTableData(firstData, rowKey, defaultCheckKey);
    const initSecondArray = this.initTableData(secondData, rowKey, defaultCheckKey);
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

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    const { firstData, secondData } = this.props;
    if (firstData !== nextProps.firstData || secondData !== nextProps.secondData) {
      this.resetDataSource(nextProps);
    }
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

  // 重置数据源
  @autobind
  resetDataSource(props) {
    const {
      firstData,
      secondData,
      firstColumns,
      secondColumns,
      rowKey,
      defaultCheckKey,
    } = props || this.props;
    const initFirstArray = this.initTableData(firstData, rowKey, defaultCheckKey);
    const initSecondArray = this.initTableData(secondData, rowKey, defaultCheckKey);
    const initSecondColumns = this.initTableColumn(secondColumns);
    this.setState({
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
    });
  }

  // 添加属性，方便操作.初始操作为show children状态
  // parentKey:辨识子元素挂在哪个父元素上
  // tip属性，显示子项勾选框对应的提示，（对用户是透明的）
  // 默认项defaultChecked属性，便于操作
  initTableData(dataArray, rowKey, defaultCheckedKey) {
    const newData = dataArray.map(
      (item) => {
        if (!_.isEmpty(item.children)) {
          const newChildren = item.children.map(
            (child) => {
              const newChild = {
                ...child,
                parentKey: item[rowKey],
                tip: `${child.default ? '取消可选产品' : '标记可选产品'}`,
              };
              return _.isEmpty(defaultCheckedKey) ?
                newChild : { ...newChild, defaultChecked: child[defaultCheckedKey] };
            },
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
          return checkColumns(_.omit(item, 'dataIndex'), this.handleCheck);
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

  // 子项勾选和取消勾选，为显示不同的提示，需要更新所在的数据源
  @autobind
  updateSecondData(selected) {
    const { secondArray } = this.state;
    const { rowKey } = this.props;
    return secondArray.map(
      (item) => {
        if (item[rowKey] === selected.parentKey) {
          const { children } = item;
          const newChildren = [];
          children.forEach(
            (child) => {
              if (child[rowKey] === selected[rowKey]) {
                newChildren.push(selected);
              } else {
                newChildren.push(child);
              }
            },
          );
          return { ...item, children: newChildren };
        }
        return item;
      },
    );
  }

  // 更新带有children属性的元素，取消child的默认选中
  updateItem(selected) {
    if (!_.isEmpty(selected.children)) {
      const newChildren = selected.children.map(
        item => _.omit(item, 'defaultChecked'),
      );
      return { ...selected, children: newChildren };
    }
    return selected;
  }

  // 点击check框触发事件，此父元素下选中所有child，所有选中的child
  @autobind
  handleCheck(selected, event) {
    const { checked } = this.state;
    const { checkChange, rowKey } = this.props;
    const selectChildren = checked[selected.parentKey] || [];
    // 根据check的状态，添加或移除
    let newSelectChildren = [];
    if (event.target.checked) {
      // 添加
      newSelectChildren = [...selectChildren, { ...selected, tip: '取消可选产品' }];
    } else {
      // 移除
      newSelectChildren = _.filter(
        selectChildren,
        selectedChild => selectedChild[rowKey] !== selected[rowKey],
      );
    }
    // 更新对应的数据源，更改子项勾选对应的提示
    const newSecondData = this.updateSecondData({
      ...selected,
      tip: `${event.target.checked ? '取消可选产品' : '标记可选产品'}`,
    });
    // 更新选中的项
    const selectAll = { ...checked, [selected.parentKey]: newSelectChildren };
    this.setState({
      checked: selectAll,
      secondArray: newSecondData,
    }, checkChange(newSelectChildren, selectAll));
  }

  @autobind
  handleClick(currentTableType, selected) {
    const { rowKey } = this.props;
    const { secondArray, firstArray } = this.state;
    const isOperateFirstTable = currentTableType === 'first';
    const needAddArray = isOperateFirstTable ? secondArray : firstArray;
    const needRemoveArray = isOperateFirstTable ? firstArray : secondArray;

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
  renderTips() {
    const { tips } = this.props;
    return tips.map(
      (item) => {
        const isWarning = item.type === 'warning';
        const iconType = isWarning ? 'tixing' : 'duihao';
        return (
          <div className={styles.tipRow}>
            <div className={styles.iconColumns}>
              <Icon
                type={iconType}
                className={classnames(
                  styles.icon,
                  { [styles.warningIcon]: isWarning },
                )}
              />
            </div>
            <div
              className={classnames(
                styles.tip,
                { [styles.warningTip]: isWarning },
              )}
            >
              {item.content}
            </div>
          </div>
        );
      },
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
      tips,
    } = this.props;
    const {
      firstArray,
      secondArray,
      firstColumns,
      secondColumns,
    } = this.state;
    // 调整提示信息的位置
    const count = tips.length;
    const top = count > 1 ? `${-(count - 1) * 32}px` : '0px';
    const style = { top };
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
            <div className={styles.tipContainer} style={style}>
              {this.renderTips()}
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
