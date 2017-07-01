/*
 * @Author: LiuJianShu
 * @Date: 2017-07-01 16:06:50
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-07-01 21:39:02
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
// import { Tree } from 'antd';
import { Tree, Icon, Tooltip } from 'antd';
import _ from 'lodash';

import styles from './BoardSelectTree.less';

const TreeNode = Tree.TreeNode;
function getChildTree(arr) {
  const html = arr.map(item => (
    <TreeNode
      title={item.name}
      key={item.key}
    />
  ));
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
          >
            {
              child.hasChildren && getChildTree(child.children)
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
  let selectNodeChildren;
  if (Array.isArray(arr)) {
    arr.forEach((item) => {
      item.detailIndicators.forEach((child) => {
        if (child.key === key) {
          selectNodeChildren = child;
          return false;
        }
        if (!selectNodeChildren) {
          selectNodeChildren = findNode(child.children, key);
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
  }
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: props.data.expandedKeys,
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      selfCheckedKeys: [],
      expandedChildren: [],
      type: props.data.type,
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
  onCheck(checkedKeys, { checkedNodes, node: { props } }) {
    // 触发选中事件时，将所有选中的节点取出来生成生的数组，放到最终传值的数组中
    const newArr = checkedNodes.map((item) => {
      const temp = {
        key: item.key,
        title: item.props.title,
      };
      return temp;
    });
    // 当前选中的 key
    const eventKey = props.eventKey;
    this.checkOrSelect(eventKey);
    this.setState({
      selfCheckedKeys: newArr,
      selectedKeys: [],
      checkedKeys,
    }, () => {
      // 返回数据
      this.getStateTree();
    });
  }
  @autobind
  onSelect(selectedKeys) {
    if (selectedKeys.length) {
      this.checkOrSelect(selectedKeys[0]);
    }
    this.setState({ selectedKeys });
  }
  @autobind
  onRemove(item) {
    const oldCheckedKeys = this.state.checkedKeys;
    const newCheckedKeys = _.remove(oldCheckedKeys, n => (n !== String(item.key)));
    const oldSelfCheckedKeys = this.state.selfCheckedKeys;
    const newSelfCheckedKeys = _.remove(oldSelfCheckedKeys, n => (n.key !== item.key));
    this.setState({
      checkedKeys: newCheckedKeys,
      selfCheckedKeys: newSelfCheckedKeys,
    }, () => {
      // 返回数据
      this.getStateTree();
    });
  }
  @autobind
  getStateTree() {
    const selfCheckedKeys = this.state.selfCheckedKeys;
    const type = this.props.data.type;
    console.warn(selfCheckedKeys);
    console.warn(type);
  }
  // 点击或者选择的相同操作
  @autobind
  checkOrSelect(key) {
    // 找出当前点击或者选择的节点信息，并存到 state 中
    const oldSelectNode = this.state.nowSelectNode;
    const checkTreeArr = this.props.data.checkTreeArr;
    const nowSelectNode = findSelectNodeChild(checkTreeArr, key);
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
      this.onExpand(_.union([], _.concat(oldExpandedKeys, key)));
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
        if (item.key === key) {
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
  }
  render() {
    const checkTreeArr = this.props.data.checkTreeArr;
    const type = this.state.type;
    treeNodeHtml = getTreeNode(checkTreeArr);
    return (
      <div className={styles.treeBody}>
        <div className={styles.treeTitle}>
          <h2 className={styles[`treeTitle${type}`]}>
            总量指标
            <Tooltip placement="topLeft" title={'23232323233232323'}>
              <span className={styles.treeTitleSpan} />
            </Tooltip>
          </h2>
        </div>
        <div className={styles.treeDiv}>
          <div className={styles.treeDivNode}>
            <div className={styles.firstColumn}>
              <h3 className={styles.treeDivNodeTitle}>请选择指标</h3>
              <div className={styles.firstColumnChildren}>
                <Tree
                  checkable
                  checkStrictly
                  onExpand={this.onExpand}
                  expandedKeys={this.state.expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  onCheck={this.onCheck}
                  checkedKeys={this.state.checkedKeys}
                  onSelect={this.onSelect}
                  selectedKeys={this.state.selectedKeys}
                >
                  {treeNodeHtml}
                </Tree>
              </div>
              {
                this.state.type === 'summury' ?
                  <div className={styles.firstColumnChildren}>
                    <div />
                  </div>
                :
                  ''
              }
            </div>
          </div>
          <div className={styles.treeDivNode}>
            <div className={styles.secondColumn}>
              <h3 className={styles.treeDivNodeTitle}>
                已选择指标
                <span>(对已选择指标拖动可以改变指标的前后顺序)</span>
              </h3>
              <div className={styles.secondColumnChildren}>
                {
                  this.state.selfCheckedKeys.map(item => (
                    <span className={styles.selectItem} key={`${item.key}Key`}>
                      {item.title}
                      <Icon type="close" onClick={() => this.onRemove(item)} />
                    </span>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        <div className={styles.treeNodeInfo}>
          {
            (this.state.nowSelectNode && this.state.nowSelectNode.key) ?
              <div>
                <h4>
                  <span>{this.state.nowSelectNode.name}:</span>
                  {this.state.nowSelectNode.description}
                </h4>
                {
                  this.state.type === 'detail' ?
                    <h4>{this.state.nowSelectNode.description}</h4>
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

