/*
 * @Author: LiuJianShu
 * @Date: 2017-07-01 16:06:50
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-07-03 09:42:48
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
    const type = props.data.type;
    // 是否是总量指标
    const isSummury = type === boardKeyName.summury.key;
    this.state = {
      expandedKeys: props.data.expandedKeys,
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      selfCheckedKeys: [],
      expandedChildren: [],
      type,
      isSummury,
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
    const isSummury = this.state.isSummury;
    if (isSummury) {
      const summuryArr = selfCheckedKeys.map(item => item.key);
      // 输出总量指标
      console.warn('summuryArr', summuryArr);
    } else {
      // 取出点击节点的父节点 key
      const parentKeyArr = _.uniq(selfCheckedKeys.map(item => item.parentKey));
      // 循环父节点 key
      const detailArr = parentKeyArr.map((item) => {
        // 取出所有 parentKey 与父节点 key 相等的选中项
        const categoryKeyChildren = _.filter(selfCheckedKeys, o => (o.parentKey === item));
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
    }
  }
  // 点击或者选择的相同操作
  @autobind
  checkOrSelect(obj) {
    // 找出当前点击或者选择的节点信息，并存到 state 中
    const oldSelectNode = this.state.nowSelectNode;
    const checkTreeArr = this.props.data.checkTreeArr;
    const nowSelectNode = findSelectNodeChild(checkTreeArr, obj.key);
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

    // 触发选中事件时，将所有选中的节点取出来生成生的数组，放到最终传值的数组中
    let selfCheckedKeys = this.state.selfCheckedKeys;
    if (obj.type === 'onCheck') {
      // 如果是选中状态，添加进去
      if (!obj.checked) {
        selfCheckedKeys.push(nowSelectNode);
      } else {
      // 否则删除
        selfCheckedKeys = _.remove(selfCheckedKeys, n => (n.key !== obj.key));
      }
      this.setState({
        selfCheckedKeys,
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
    const checkTreeArr = this.props.data.checkTreeArr;
    const type = this.state.type;
    const isSummury = this.state.isSummury;
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
                this.state.selfCheckedKeys.map(item => (
                  <span className={styles.selectItem} key={`${item.key}Key`}>
                    {
                      item.parentName ?
                        `${item.parentName} -`
                      :
                        ''
                    }
                    {item.name}
                    <Icon type="close" onClick={() => this.onRemove(item)} />
                  </span>
                ))
              }
            </div>
          </div>
        </div>
        <div className={styles.treeNodeInfo}>
          {
            (this.state.nowSelectNode && this.state.nowSelectNode.key) ?
              <div>
                <h4>
                  <span>{this.state.nowSelectNode.name}：</span>
                  {this.state.nowSelectNode.description}
                </h4>
                {
                  !isSummury ?
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

