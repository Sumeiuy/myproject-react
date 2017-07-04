/*
 * @Author: LiuJianShu
 * @Date: 2017-07-01 16:06:50
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-07-04 09:38:32
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
// import { Tree } from 'antd';
import { Tree, Icon, Tooltip } from 'antd';
import _ from 'lodash';

import styles from './BoardSelectTree.less';

const boardKeyName = {
  summury: {
    key: 'summury',
    name: '总量指标',
  },
  detail: {
    key: 'detail',
    name: '分类指标',
  },
};
const TreeNode = Tree.TreeNode;
function getChildTree(key, name, arr) {
  let html;
  if (Array.isArray(arr)) {
    html = arr.map(item => (
      <TreeNode
        title={item.name}
        key={item.key}
        parentKey={key}
        parentName={name}
      />
    ));
  }
  return html;
}
// 根据数组组成 treeNode
function getTreeNode(arr) {
  const html = arr.map(item => (
    <TreeNode
      title={item.indicatorCategoryDto.categoryName}
      key={item.indicatorCategoryDto.categoryKey}
    >
      {
        item.detailIndicators.map(child => (
          <TreeNode
            title={child.name}
            key={child.key}
            className={child.hasChildren ? styles.arrow : ''}
            parentKey={item.indicatorCategoryDto.categoryKey}
          >
            {
              child.hasChildren && getChildTree(child.key, child.name, child.children)
            }
          </TreeNode>
        ))
      }
    </TreeNode>
  ));
  return html;
}
function findNode(arr, key) {
  let node;
  if (Array.isArray(arr)) {
    arr.forEach((item) => {
      if (item.key === key) {
        node = item;
      }
    });
  } else {
    node = null;
  }
  return node;
}
function findSelectNodeChild(arr, key) {
  let selectNodeChildren = null;
  if (Array.isArray(arr)) {
    arr.forEach((item) => {
      item.detailIndicators.forEach((child) => {
        if (child.key === key) {
          selectNodeChildren = {
            node: child,
            belong: {
              key: item.indicatorCategoryDto.categoryKey,
              name: item.indicatorCategoryDto.categoryName,
            },
          };
          return false;
        }
        if (!selectNodeChildren && child.children) {
          selectNodeChildren = {
            node: findNode(child.children, key),
          };
        }
        return selectNodeChildren;
      });
    });
  } else {
    selectNodeChildren = null;
  }
  return selectNodeChildren;
}
let treeNodeHtml;
export default class BoardSelectTree extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    saveIndcator: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    const data = props.data;
    const type = data.type;
    // 是否是总量指标
    const isSummury = type === boardKeyName.summury.key;
    // 取出分类明细下的所有标题
    const allParentNodes = data.checkTreeArr.map((item) => {
      const obj = {
        key: item.indicatorCategoryDto.categoryKey,
        name: item.indicatorCategoryDto.categoryName,
        children: [],
      };
      return obj;
    });
    const checkedKeys = data.checkedKeys;
    const checkTreeArr = data.checkTreeArr;
    // treeNodeHtml = getTreeNode(checkTreeArr);
    let selfCheckedNodes;
    console.warn('-----data-----', data);
    console.warn('isSummury', isSummury);
    if (!isSummury) {
      selfCheckedNodes = checkedKeys.map((item) => {
        const obj = {
          ...findSelectNodeChild(checkTreeArr, item).node,
          belongKey: findSelectNodeChild(checkTreeArr, item).belong.key,
        };
        return obj;
      });
      allParentNodes.map((item) => {
        const newItem = item;
        selfCheckedNodes.forEach((child) => {
          if (newItem.key === child.belongKey) {
            newItem.children.push(child);
          }
        });
        return newItem;
      });
    } else {
      selfCheckedNodes = checkedKeys.map(item =>
      findSelectNodeChild(checkTreeArr, item).node);
    }
    this.state = {
      checkTreeArr,
      expandedKeys: [checkTreeArr[0].indicatorCategoryDto.categoryKey],
      autoExpandParent: true,
      selectedKeys: [],
      selfCheckedNodes,
      expandedChildren: [],
      checkedKeys,
      type,
      isSummury,
      allParentNodes,
    };
  }
  @autobind
  onExpand(expandedKeys) {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  @autobind
  onCheck(checkedKeys, { node: { props: { eventKey, checked } } }) {
    // 当前选中的 key
    const obj = {
      keyArr: checkedKeys,
      key: eventKey,
      checked,
      type: 'onCheck',
    };
    this.checkOrSelect(obj);
  }
  @autobind
  onSelect(selectedKeys, { node: { props: { eventKey, selected } } }) {
    const obj = {
      keyArr: selectedKeys,
      key: eventKey,
      selected,
      type: 'onSelect',
    };
    this.checkOrSelect(obj);
  }
  @autobind
  onRemove(item) {
    const checkTreeArr = this.state.checkTreeArr;
    const nowSelectNodeBelong = findSelectNodeChild(checkTreeArr, item.key).belong;
    const oldCheckedKeys = this.state.checkedKeys;
    const oldSelfCheckedNodes = this.state.selfCheckedNodes;
    const allParentNodes = this.state.allParentNodes;
    const newCheckedKeys = _.remove(oldCheckedKeys, n => (n !== item.key));
    const newSelfCheckedNodes = _.remove(oldSelfCheckedNodes, n => (n.key !== item.key));
    allParentNodes.map((child) => {
      let newItem = child;
      if (nowSelectNodeBelong.key === newItem.key) {
        newItem = _.remove(newItem.children, n => (n.key === item.key));
      }
      return newItem;
    });
    this.setState({
      allParentNodes,
      checkedKeys: newCheckedKeys,
      selfCheckedNodes: newSelfCheckedNodes,
    }, () => {
      // 返回数据
      this.getStateTree();
    });
  }
  @autobind
  getStateTree() {
    const selfCheckedNodes = this.state.selfCheckedNodes;
    const checkTreeArr = this.state.checkTreeArr;

    const isSummury = this.state.isSummury;
    if (isSummury) {
      const summuryArr = selfCheckedNodes.map(item => item.key);
      // 输出总量指标
      console.warn('summuryArr', summuryArr);
      this.props.saveIndcator('summury', summuryArr);
    } else {
      // 取出所有选中节点的归属点 key
      const tempBelongKeyArr = selfCheckedNodes.map((item) => {
        const itemBelong = findSelectNodeChild(checkTreeArr, item.key).belong;
        return itemBelong.key;
      });
      // 去重
      const belongKeyArr = _.uniq(tempBelongKeyArr);
      // 将选中的数组项循环，每一项赋值一个 归属 key ，生成新数组
      const newSelfeCheckedNodes = selfCheckedNodes.map((item) => {
        const newItem = item;
        const itemBelongKey = findSelectNodeChild(checkTreeArr, item.key).belong.key;
        newItem.belongKey = itemBelongKey;
        return newItem;
      });
      // 循环父节点 key
      const detailArr = belongKeyArr.map((item) => {
        // 取出所有 parentKey 与父节点 key 相等的选中项
        const categoryKeyChildren = _.filter(newSelfeCheckedNodes, o => (o.belongKey === item));
        // 从上一步取出的数组中取出所有的 key
        const categoryKeyChildrenKey = _.uniq(categoryKeyChildren.map(child => child.key));
        const temp = {
          categoryKey: item,
          detailIndicatorIds: categoryKeyChildrenKey,
        };
        return temp;
      });
      // 输出明细指标
      console.warn('detailArr', detailArr);
      this.props.saveIndcator('detail', detailArr);
    }
  }
  // 点击或者选择的相同操作
  @autobind
  checkOrSelect(obj) {
    // 找出当前点击或者选择的节点信息，并存到 state 中
    const oldSelectNode = this.state.nowSelectNode;
    const checkTreeArr = this.state.checkTreeArr;
    const nowSelectNode = findSelectNodeChild(checkTreeArr, obj.key).node;
    const nowSelectNodeBelong = findSelectNodeChild(checkTreeArr, obj.key).belong;
    if (_.isEqual(oldSelectNode, nowSelectNode)) {
      this.setState({
        nowSelectNode: {},
      });
    } else {
      this.setState({
        nowSelectNode,
      });
    }
    // 如果找到当前节点，并且当前节点有 子元素，展开子元素并且更新 已展开子元素 的 state
    const oldExpandedKeys = this.props.data.expandedKeys;
    if (nowSelectNode && nowSelectNode.hasChildren) {
      this.onExpand(_.uniq(_.concat(oldExpandedKeys, obj.key)));
        // 更新已展开的子元素 state
      this.setState({
        expandedChildren: nowSelectNode.children,
      });
    }
    const oldExpandedChildren = this.state.expandedChildren;
    // 如果 已经展开的子元素 state 有值，并且当前点击的节点没有子元素
    if (oldExpandedChildren && !nowSelectNode.hasChildren) {
      let flag = false;
      // 循环展开的子元素数组，判断出是否包含当前点击的节点
      oldExpandedChildren.forEach((item) => {
        if (item.key === obj.key) {
          flag = true;
        }
      });
      // 如果不包含，则将展开节点设置为默认值
      if (!flag) {
        this.onExpand(oldExpandedKeys);
        // 将已展开的子元素设为空
        this.setState({
          expandedChildren: [],
        });
      }
    }

    const isSummury = this.state.isSummury;
    // 触发选中事件时，将所有选中的节点取出来生成生的数组，放到最终传值的数组中
    let selfCheckedNodes = this.state.selfCheckedNodes;
    const allParentNodes = this.state.allParentNodes;
    // 如果是选中事件
    if (obj.type === 'onCheck') {
      // 如果是明细指标，则将选中的节点信息存放到 相应的 父节点下
      if (!isSummury) {
        allParentNodes.map((item) => {
          let newItem = item;
          if (newItem.key === nowSelectNodeBelong.key) {
            if (!obj.checked) {
              newItem.children.push(nowSelectNode);
            } else {
              newItem = _.remove(newItem.children, n => (n.key === obj.key));
            }
          }
          return newItem;
        });
      }
      // 如果是选中状态，添加进去
      if (!obj.checked) {
        selfCheckedNodes.push(nowSelectNode);
      } else {
      // 否则删除
        selfCheckedNodes = _.remove(selfCheckedNodes, n => (n.key !== obj.key));
      }
      this.setState({
        allParentNodes,
        selfCheckedNodes,
        selectedKeys: [],
        checkedKeys: obj.keyArr,
      }, () => {
        // 返回数据
        this.getStateTree();
      });
    } else {
      this.setState({
        selectedKeys: obj.keyArr,
      }, () => {
        // 返回数据
        this.getStateTree();
      });
    }
  }
  render() {
    const {
      checkTreeArr,
      type,
      isSummury,
      selectedKeys,
      selfCheckedNodes,
      allParentNodes,
      checkedKeys,
      autoExpandParent,
      expandedKeys,
      nowSelectNode,
    } = this.state;
    treeNodeHtml = getTreeNode(checkTreeArr);
    return (
      // 树结构整体
      <div className={styles.treeBody}>
        {/* 树结构总标题 */}
        <div className={styles.treeTitle}>
          <h2 className={styles[`treeTitle${type}`]}>
            {boardKeyName[type].name}
            <Tooltip placement="topLeft" title={'23232323233232323'}>
              <span className={styles.treeTitleSpan} />
            </Tooltip>
          </h2>
        </div>
        {/* 树结构主干布局 */}
        <div className={styles.treeMain}>
          {/* 树结构左边部分 */}
          <div className={styles.treeMainLeft}>
            <h3 className={styles.treeDivNodeTitle}>请选择指标</h3>
            {/* 树结构左边部分子元素 */}
            <div className={styles.treeMainLeftContent}>
              <div className={styles.treeMainLeftChild}>
                <Tree
                  checkable
                  checkStrictly
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  checkedKeys={checkedKeys}
                  selectedKeys={selectedKeys}
                  onSelect={this.onSelect}
                  onCheck={this.onCheck}
                  onExpand={this.onExpand}
                >
                  {treeNodeHtml}
                </Tree>
              </div>
              {
                isSummury ?
                  <div className={styles.treeMainLeftChild}>
                    <div />
                  </div>
                :
                  ''
              }
            </div>
          </div>
          {/* 树结构右边部分 */}
          <div className={styles.treeMainRight}>
            <h3 className={styles.treeDivNodeTitle}>
              已选择指标
              <span>(对已选择指标拖动可以改变指标的前后顺序)</span>
            </h3>
            <div className={styles.treeMainRightChild}>
              {
                isSummury ?
                  selfCheckedNodes.map(item => (
                    <span className={styles.selectItem} key={`${item.key}Key`}>
                      {
                        (item.parentName && isSummury) ?
                          `${item.parentName} -`
                        :
                          ''
                      }
                      {item.name}
                      <Icon type="close" onClick={() => this.onRemove(item)} />
                    </span>
                  ))
                :
                  allParentNodes.map(item => (
                    item.children.length ?
                      <div key={item.key} className={styles.treeMainRigthChildTitle}>
                        <h3>{item.name}</h3>
                        {
                          item.children.map(child => (
                            <span className={styles.selectItem} key={child.key}>
                              {
                                (item.parentName && isSummury) ?
                                  `${item.parentName} -`
                                :
                                  ''
                              }
                              {child.name}
                              <Icon type="close" onClick={() => this.onRemove(child)} />
                            </span>
                          ))
                        }
                      </div>
                    :
                      ''
                  ))
              }
            </div>
          </div>
        </div>
        <div className={styles.treeNodeInfo}>
          {
            (nowSelectNode && nowSelectNode.key) ?
              <div>
                <h4>
                  <span>{nowSelectNode.name}：</span>
                  {nowSelectNode.description}
                </h4>
                {
                  !isSummury ?
                    <h4>{nowSelectNode.description}</h4>
                  :
                    ''
                }
              </div>
            :
              ''
          }
        </div>
      </div>
    );
  }
}

