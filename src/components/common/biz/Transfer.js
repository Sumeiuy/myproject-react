/**
 * @description 类穿梭框组件，统一样式
 * @author zhangjunli
 * Usage:
 * <Transfer
    subscribeData={array}
    unsubscribeData={array}
    subscribeColumns={array}
    unsubscribeColumns={array}
    onSearch={func}
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
import { Table, Input, Checkbox } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';

import Icon from '../../common/Icon';
import styles from './transfer.less';

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
      if (_.isEmpty(item.category) || _.endsWith(item.category, 'aloneChild')) {
        return (
          <Icon
            type={type === 'first' ? 'new' : 'shanchu'}
            className={styles.actionIcon}
            onClick={() => { handleClick(type, item); }}
          />
        );
      }
      return (<Checkbox onChange={() => handleClick(type, item)} />);
    },
  };
};

export default class Transfer extends Component {
  static propTypes = {
    firstTitle: PropTypes.string,
    secondTitle: PropTypes.string,
    firstData: PropTypes.array,
    secondData: PropTypes.array,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    renderSecondIntro: PropTypes.func,
    firstColumns: PropTypes.array.isRequired,
    secondColumns: PropTypes.array.isRequired,
    onSearch: PropTypes.func.isRequired,
    rowKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    firstData: [],
    secondData: [],
    firstTitle: '可选佣金调整',
    secondTitle: '已选产品',
    onChange: () => {},
    placeholder: '',
    renderSecondIntro: () => {},
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
      checked: [],
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
            (child, index) => {
              const category = `${item[rowKey]}|${index}|child`;
              return { ...child, category };
            },
          );
          return { ...item, children: newChildren };
        }
        return item;
      },
    );
    return newData;
  }

  @autobind
  handleClick(type, selected) {
    const { onChange } = this.props;
    const { checked, secondArray, firstArray } = this.state;
    const flag = type === 'first';
    // 选中check框时，不移动
    if (!_.isEmpty(selected.category) && !_.endsWith(selected.category, 'aloneChild')) {
      const flagArray = selected.category.split('|');
      const keyArray = checked[flagArray[0]] || [];
      this.setState({
        checked: {
          ...checked,
          [flagArray[0]]: [...keyArray, selected],
        },
      });
      return;
    }
    // 选中的是子元素，1.从父元素移除，2.更改子元素的category：child -> aloneChild
    let updateData = selected;
    const seletedChildren = checked[selected.key];
    const updateSelectedChildren = [];
    if (!_.isEmpty(updateData.children)) {
      if (!_.isEmpty(seletedChildren)) {
        seletedChildren.forEach(
          (child) => {
            const filterData = _.filter(
              updateData.children,
              item => item.category !== child.category,
            );
            updateData = { ...updateData, children: filterData };
            const flagArray = child.category.split('|');
            const updateChild = {
              ...child,
              category: `${flagArray[0]}|${flagArray[1]}|aloneChild`,
            };
            updateSelectedChildren.push(updateChild);
          },
        );
      }
    }
    // 更新操作表格的数据源。remove要移动的元素
    const modifyOneArray = [];
    (flag ? firstArray : secondArray).forEach(
      (item) => {
        if (item.key === updateData.key) {
          if (!_.isEmpty(updateSelectedChildren)) {
            modifyOneArray.push(updateData);
          }
        } else {
          modifyOneArray.push(item);
        }
      },
    );
    // 更新另一个表的数据源，添加要移动的元素
    let modifyOtherArray = [];
    // 为要添加某个元素的子元素，寻找父元素:
    // 若有，则添加到父元素中，若无，则直接添加到数据源中
    if (!_.isEmpty(updateSelectedChildren)) {
      const flagArray = updateSelectedChildren[0].category.split('|');
      let existParent = {};
      const mergeArray = [];

      (flag ? secondArray : firstArray).forEach(
        (item) => {
          if (item.key === flagArray[0]) {
            const { children } = item;
            existParent = { ...item, children: [...seletedChildren, ...children] };
            mergeArray.push(existParent);
          } else {
            mergeArray.push(item);
          }
        },
      );

      if (_.isEmpty(existParent)) {
        modifyOtherArray = [...updateSelectedChildren, ...mergeArray];
      } else {
        modifyOtherArray = [...mergeArray];
      }
    // 要添加为aloneChild的子元素，寻找父元素：
    // 若有，修改子元素的category为child,添加到父元素中，若无，则直接添加到数据源中
    } else if (!_.isEmpty(updateData.category)) {
      const flagArray = updateData.category.split('|');
      let existParent = {};
      const mergeArray = [];
      (flag ? secondArray : firstArray).forEach(
        (item) => {
          if (item.key === flagArray[0]) {
            const { children } = item;
            const newData = {
              ...updateData,
              category: `${flagArray[0]}|${flagArray[1]}|child`,
            };
            existParent = { ...item, children: [newData, ...children] };
            mergeArray.push(existParent);
          } else {
            mergeArray.push(item);
          }
        },
      );

      if (_.isEmpty(existParent)) {
        modifyOtherArray = [updateData, ...mergeArray];
      } else {
        modifyOtherArray = [...mergeArray];
      }
    // 要添加的是父元素，寻找属于他的子元素
    // 若有，修改子元素的category：aloneChild -> child,合并子元素到父元素内。若无，则直接更新数据源
    } else {
      const existChildren = [];
      const mergeArray = [];
      (flag ? secondArray : firstArray).forEach(
        (item) => {
          if (!_.isEmpty(item.category)) {
            const flagArray = item.category.split('|');
            if (updateData.key === flagArray[0]) {
              const category = `${flagArray[0]}|${flagArray[1]}|child`;
              const newItem = { ...item, category };
              existChildren.push(newItem);
            } else {
              mergeArray.push(item);
            }
          } else {
            mergeArray.push(item);
          }
        },
      );
      const { children } = updateData;
      if (!_.isEmpty(children)) {
        updateData = { ...updateData, children: [...children, ...existChildren] };
      }

      modifyOtherArray = [
        updateData,
        ...mergeArray,
      ];
    }
    // 更新数据源，清空checked，触发render
    this.setState({
      firstArray: flag ? modifyOneArray : modifyOtherArray,
      secondArray: flag ? modifyOtherArray : modifyOneArray,
      checked: {
        ...checked,
        [updateData.key]: [],
      },
    }, onChange(
      (flag ? modifyOneArray : modifyOtherArray),
      (flag ? modifyOtherArray : modifyOneArray),
      (!_.isEmpty(updateSelectedChildren) ? updateSelectedChildren : updateData),
    ));
  }

  @autobind
  handleSearch(keyword) {
    const { onSearch } = this.props;
    onSearch(keyword);
  }

  render() {
    const {
      firstTitle,
      secondTitle,
      placeholder,
      renderSecondIntro,
    } = this.props;
    const {
      firstArray,
      secondArray,
      firstColumns,
      secondColumns,
    } = this.state;
    const paginationProps = {
      defaultPageSize: 5,
      size: 'small',
    };

    return (
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={classnames(styles.header, styles.leftHeader)}>
            <div className={styles.titleLabel}>{firstTitle}</div>
            <div>
              <Search
                placeholder={placeholder}
                onSearch={(value) => { this.handleSearch(value); }}
              />
            </div>
          </div>
          <Table
            rowKey="key"
            columns={firstColumns}
            dataSource={firstArray}
            pagination={paginationProps}
            scroll={{ y: 260 }}
          />
        </div>
        <div className={styles.rightContent}>
          <div className={classnames(styles.header)}>
            <div className={styles.titleLabel}>{secondTitle}</div>
            {renderSecondIntro}
          </div>
          <Table
            rowKey="key"
            columns={secondColumns}
            dataSource={secondArray}
            pagination={paginationProps}
            scroll={{ y: 260 }}
          />
        </div>
      </div>
    );
  }
}
