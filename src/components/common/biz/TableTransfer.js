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
 * rowKey： 必要，唯一的标识,用于生成row时内部做唯一的key使用
 * subscribeTitle: 不必要，有默认值（‘当前订阅服务’），第一个表的title
 * unsubscribeTitle： 不必要，有默认值（‘退订服务’），第二个表的title
 * subscribeData：不必要，有默认值（空数据），第一个表的数据源
 * unsubscribeData：不必要，有默认值（空数据），第二个表的数据源
 * checkChange： 不必要，向组件外传递信息，返回此父元素下选中所有child，所有选中的child
 * transferChange： 不必要，向组件外传递信息，返回第二个table的数据源
 * defaultCheckKey: 不必要，标识子项的默认选中key
 * placeholder： 不必要，搜索框的提示文字
 * showSearch： 不必要，是否显示search框,内部根据传入的属性supportSearchKey值，在现有的数据（除右边表中的）进行搜索
 * pagination： 不必要，页码（不需要页码时，值为false，要页码时，值为对象）
 * supportSearchKey: 不必要,支持通过搜索的key（筛选用），时一个二维数组。
 *                  二维数组（匹配分：模糊和精准），数据顺序固定，第一个是精准匹配数组，第二个是模糊匹配数组
 * aboutRate: 不必要, 长度，内容顺序 固定,第一个是目标佣金率（string类型），第二个是拿到表中对象佣金率的key（string类型）
 * totalData: 不必要, 总数据源（搜索用的）
 */
import React, { PropTypes, Component } from 'react';
import { Table, Input, Checkbox, Tooltip } from 'antd';
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

const tooltipColumns = column => (
  {
    ...column,
    render: (item) => {
      const { key } = column;
      return (
        <Tooltip title={`${item[key]}`}>
          <span>{item[key]}</span>
        </Tooltip>
      );
    },
  }
);

export default class TableTransfer extends Component {
  static propTypes = {
    firstTitle: PropTypes.string,
    secondTitle: PropTypes.string,
    firstData: PropTypes.array,
    secondData: PropTypes.array,
    transferChange: PropTypes.func,
    checkChange: PropTypes.func,
    placeholder: PropTypes.string,
    showSearch: PropTypes.bool,
    pagination: React.PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    firstColumns: PropTypes.array.isRequired,
    secondColumns: PropTypes.array.isRequired,
    rowKey: PropTypes.string.isRequired,
    defaultCheckKey: PropTypes.string,
    supportSearchKey: PropTypes.array,
    aboutRate: PropTypes.array,
    totalData: PropTypes.array,
  }

  static defaultProps = {
    firstData: [],
    secondData: [],
    firstTitle: '可选佣金调整',
    secondTitle: '已选产品',
    transferChange: () => {},
    checkChange: () => {},
    placeholder: '',
    showSearch: true,
    defaultCheckKey: '',
    supportSearchKey: [],
    aboutRate: ['', ''],
    totalData: [],
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
    const initFirstColumns = this.initTableColumn(firstColumns);
    const initSecondColumns = this.initTableColumn(secondColumns);
    this.state = {
      checked: this.getAllDefaultCheck(initSecondArray, rowKey),
      firstArray: this.hiddenChildren(initFirstArray),
      secondArray: initSecondArray,
      firstColumns: [
        ...initFirstColumns,
        actionColumns('first', this.handleClick),
      ],
      secondColumns: [
        ...initSecondColumns,
        actionColumns('second', this.handleClick),
      ],
      tip: { type: '', content: '' },
    };
    /*
     tip 有且只出现一条
         有三种情况（等于，高于，低于)
         两种类型（finish(等于时出现)，warning(高于，低于时出现)）
    */
  }

  componentWillReceiveProps(nextProps) {
    this.resetDataSource(nextProps);
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
  resetDataSource(nextProps) {
    const {
      firstData,
      secondData,
      firstColumns,
      secondColumns,
      rowKey,
      defaultCheckKey,
    } = nextProps || this.props;
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
    const newDatatArray = _.cloneDeep(dataArray);
    const newData = newDatatArray.map(
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
        } else if (index === 1) {
          return tooltipColumns(_.omit(item, 'dataIndex'));
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
    }, transferChange(seleted, updateSecondArray));
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

  // 更新提示
  @autobind
  updateTips(selected) {
    const { aboutRate } = this.props;
    if (!_.isEmpty(aboutRate)) {
      const targetRate = aboutRate[0] || '0';
      const rateKey = aboutRate[1] || '';
      const selectRate = selected[rateKey] || '0';
      const result = _.toNumber(selectRate) - _.toNumber(targetRate);
      if (result === 0) {
        this.setState({ tip: { type: 'finish', content: '产品组合等于目标佣金率' } });
      } else if (result > 0) {
        this.setState({
          tip: { type: 'warning', content: `产品组合比目标佣金率高${(Math.abs(result)).toFixed(2)}‰` } },
        );
      } else {
        this.setState({
          tip: { type: 'warning', content: `产品组合离目标佣金率还差${(Math.abs(result)).toFixed(2)}‰` } },
        );
      }
    }
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
      // 展示提示
      this.updateTips(selected);
    } else {
      // 移除当前child的默认选中，否则，从左侧表穿梭到右侧表时，还是默认选中状态
      const newSelected = this.updateItem(selected);
      modifySelected = this.hiddenChildren([newSelected]);
      // 移除提示
      this.setState({ tip: { type: '', content: '' } });
    }

    // 更新数据源，添加要移动的元素
    const modifyAddArray = [...modifySelected, ...needAddArray];
    // 更新数据源
    this.updateAllData(selected, modifyRemoveArray, modifyAddArray, currentTableType);
  }

  @autobind
  handleSearch(keyword) {
    const { supportSearchKey, totalData, rowKey, defaultCheckKey } = this.props;
    const { secondArray } = this.state;
    // 左边表中数据，不能展开
    const initFistData = this.hiddenChildren(
      this.initTableData(totalData, rowKey, defaultCheckKey),
    );
    // 搜索的数据源为未被选的数据 = 原始数据源 - 被选中的数据源
    const searchDataSource = _.differenceBy(initFistData, secondArray, `${rowKey}`);
    // 无筛选key时，筛选功能不能使用
    if (_.isEmpty(supportSearchKey)) {
      return;
    }
    // 关键字为 空字符串时，展示全部未被选中数据
    if (keyword === '') {
      this.setState({ firstArray: searchDataSource });
    }
    // 根据key，执行筛选功能
    const newFirstArray = _.filter(
      searchDataSource,
      (item) => {
        const resultArray = _.filter(
          supportSearchKey,
          (keys, index) => {
            // 精准匹配
            if (index === 0) {
              return !_.isEmpty(_.filter(keys, key => (item[key] === keyword)));
            }
            // 模糊匹配
            return !_.isEmpty(_.filter(keys, key => (item[key].indexOf(keyword) !== -1)));
          },
        );
        return !_.isEmpty(resultArray);
      },
    );
    // 更新数据源
    this.setState({ firstArray: newFirstArray });
  }

  @autobind
  renderTips() {
    const { tip } = this.state;
    if (_.isEmpty(tip.type)) {
      return null;
    }
    const isWarning = tip.type === 'warning';
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
          {tip.content}
        </div>
      </div>
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
