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
 */
import React, { PropTypes, Component } from 'react';
import { Table, Input } from 'antd';
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
    render: item => (
      <Icon
        type={type === 'first' ? 'new' : 'shanchu'}
        className={styles.actionIcon}
        onClick={() => { handleClick(type, item); }}
      />
    ),
  };
};

export default class TableTransfer extends Component {
  static propTypes = {
    firstTitle: PropTypes.string,
    secondTitle: PropTypes.string,
    firstData: PropTypes.array,
    secondData: PropTypes.array,
    onChange: PropTypes.func,
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
    onChange: () => {},
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

    this.state = {
      firstArray: this.initTableData(firstData, rowKey),
      secondArray: this.initTableData(secondData, rowKey),
      firstColumns: [
        ...firstColumns,
        actionColumns('first', this.handleClick),
      ],
      secondColumns: [
        ...secondColumns,
        actionColumns('second', this.handleClick),
      ],
    };
  }

  // 为父元素的children添加，用于操作的category属性
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

  // 更新数据源，触发render
  @autobind
  updateData(modifyRemoveArray, modifyAddArray, currentTableType) {
    const { onChange } = this.props;
    const isOperateFirstTable = currentTableType === 'first';
    const updateFirstArray = isOperateFirstTable ? modifyRemoveArray : modifyAddArray;
    const updateSecondArray = isOperateFirstTable ? modifyAddArray : modifyRemoveArray;
    this.setState({
      firstArray: updateFirstArray,
      secondArray: updateSecondArray,
    }, onChange(updateSecondArray));
  }

  // 移除选中项
  @autobind
  removeSelected(needRemoveArray, selected) {
    const modifyRemoveArray = [];
    needRemoveArray.forEach(
      (item) => {
        if (_.isEmpty(selected.parentKey)) {
          if (item.key !== selected.key) {
            modifyRemoveArray.push(item);
          }
        } else if (item.key === selected.parentKey) {
          const { children } = item;
          const newChildren = _.filter(
            children,
            child => child.key !== selected.key,
          );
          modifyRemoveArray.push({ ...item, children: newChildren });
        } else if (item.key !== selected.key) {
          modifyRemoveArray.push(item);
        }
      },
    );
    return modifyRemoveArray;
  }

  // 添加选中项
  @autobind
  addSelected(needAddArray, selected) {
    let modifyAddArray = [];
    // 无父元素
    if (_.isEmpty(selected.parentKey)) {
      // 无子元素
      if (_.isEmpty(selected.children)) {
        modifyAddArray = [selected, ...needAddArray];
      // 有子元素
      } else {
        const { children } = selected;
        // 挑出数据源中的子元素
        const aloneChildren = _.filter(
          needAddArray,
          item => (!_.isEmpty(item.parentKey) && item.parentKey === selected.key),
        ) || [];
        // 移除数据源中的子元素
        const newAddArray = _.difference(needAddArray, aloneChildren);
        // 合并子元素，更新数据源
        modifyAddArray = [
          {
            ...selected,
            children: [
              ...children,
              ...aloneChildren,
            ],
          },
          ...newAddArray,
        ];
      }
    // 有父元素
    } else {
      const selectParent = _.find(
        needAddArray,
        item => item.key === selected.parentKey,
      );
      // 数据源中，无父元素存在
      if (_.isEmpty(selectParent)) {
        modifyAddArray = [selected, ...needAddArray];
      // 数据源中，有父元素存在
      } else {
        const { children } = selectParent;
        const newChildren = [selected, ...children];
        const newSelected = { ...selectParent, children: newChildren };
        const newAddArray = _.filter(
          needAddArray,
          item => item.key !== selected.parentKey,
        );
        modifyAddArray = [newSelected, ...newAddArray];
      }
    }
    return modifyAddArray;
  }

  @autobind
  handleClick(currentTableType, selected) {
    const { secondArray, firstArray } = this.state;
    const isOperateFirstTable = currentTableType === 'first';
    const needAddArray = isOperateFirstTable ? secondArray : firstArray;
    const needRemoveArray = isOperateFirstTable ? firstArray : secondArray;

    // 更新操作表格的数据源。remove要移动的元素
    const modifyRemoveArray = this.removeSelected(needRemoveArray, selected);
    // 更新另一个表的数据源，添加要移动的元素
    const modifyAddArray = this.addSelected(needAddArray, selected);
    // 更新数据源
    this.updateData(modifyRemoveArray, modifyAddArray, currentTableType);
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
            rowKey="key"
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
            rowKey="key"
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
