/*
 * @Author: LiuJianShu
 * @Date: 2017-06-23 13:30:03
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-06-27 10:06:17
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Tree, Checkbox } from 'antd';
// import { Tree, Col, Row } from 'antd';
// import _ from 'lodash';

// import BoardSelect from '../../components/pageCommon/BoardSelect';
// import BoardItem from '../../components/pageCommon/BoardItem';
import styles from './Home.less';


const TreeNode = Tree.TreeNode;
const checkTreeArr = [
  {
    id: '1',
    name: '客户明细数',
    key: 'khmxs',
    children: [
      {
        id: '1-1',
        name: '有效客户数',
        key: 'yxkhs',
      }, {
        id: '1-2',
        name: '高净值客户数',
        key: 'gjzkhs',
      }, {
        id: '1-3',
        name: '新开客户数',
        key: 'xkkhs',
      }, {
        id: '1-4',
        name: '高净值客户流失率',
        key: 'gjzkhlsl',
      },
    ],
  }, {
    id: '2',
    name: '交易量明细',
    key: 'jylmx',
    children: [
      {
        id: '2-1',
        name: '资产配置报告完成数',
        key: 'zcpzbgwcs',
        children: [
          {
            id: '2-1-1',
            name: '合计',
            key: 'cssj',
          }, {
            id: '2-1-2',
            name: '测试数据一',
            key: 'cssje',
          }, {
            id: '2-1-3',
            name: '测试数据二',
            key: 'cssje',
          },
        ],
      },
      {
        id: '2-2',
        name: '配置两种风险属性客户',
        key: 'zcpzbgwcs',
      },
    ],
  },
];
// 根据数组组成 treeNode
function getTreeNode(arr) {
  const html = arr.map(item => (
    <TreeNode title={item.name} key={item.id}>
      {
        item.children && getTreeNode(item.children)
      }
    </TreeNode>
  ));
  return html;
}
let selectNode = {};
function walk(orgArr, func) {
  func(orgArr);
  if (Array.isArray(orgArr)) {
    const childrenLen = orgArr.length;
    let i = 0;
    while (i < childrenLen) {
      const children = orgArr[i].children;
      walk(children, func);
      i++;
    }
  }
}

function findChildren(key) {
  return (orgArr) => {
    if (Array.isArray(orgArr)) {
      orgArr.forEach((item) => {
        if (item.id === key) {
          selectNode = item;
        }
      });
    }
  };
}

const treeNodeHtml = getTreeNode(checkTreeArr);
export default class BoardManageHome extends PureComponent {
  static propTypes = {
    boardManage: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['1', '2', '2-1'],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      thirdChildren: [],
    };
  }
  @autobind
  onExpand(expandedKeys) {
    console.warn('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  @autobind
  onCheck(checkedKeys, e) {
    // e:{checked: bool, checkedNodes, node, event}
    console.warn('onCheck', checkedKeys);
    console.warn('onCheck', e);
    console.warn('onCheck', e.node.props.eventKey);
    const eventKey = e.node.props.eventKey;
    if (eventKey.indexOf('-') > 0) {
      walk(checkTreeArr, findChildren(eventKey));
      if (selectNode.children) {
        console.warn(selectNode.children);
        this.setState({
          thirdChildren: selectNode.children,
        });
      } else {
        this.setState({
          thirdChildren: [],
        });
      }
    }
    this.setState({
      checkedKeys,
    });
  }
  @autobind
  onSelect(selectedKeys) {
    this.setState({ selectedKeys });
    if (selectedKeys.length) {
      if (selectedKeys[0].indexOf('-') > 0) {
        walk(checkTreeArr, findChildren(selectedKeys[0]));
        if (selectNode.children) {
          console.warn(selectNode.children);
          this.setState({
            thirdChildren: selectNode.children,
          });
        } else {
          this.setState({
            thirdChildren: [],
          });
        }
      }
    } else {
      this.setState({
        thirdChildren: [],
      });
    }
  }
  @autobind
  onChange(e) {
    // this.setState({
    //   ...this.state,
    //   checkedKeys: this.state.checkedKeys.concat(e),
    // });
    console.warn(e);
    console.warn(this.state.checkedKeys);
  }
  // 新建看板事件
  @autobind
  createBoardHandle() {
    console.warn('新建看板事件');
  }
  render() {
    return (
      <div className="page-invest content-inner">
        <div className={styles.treeDiv}>
          <Tree
            checkable
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
          <div style={{ width: '500px', height: '400px', position: 'absolute', left: '400px', top: '10px', border: '1px solid red' }}>
            {
              this.state.thirdChildren.map(item => (
                <div>
                  <Checkbox.Group onChange={this.onChange}>
                    <Checkbox value={item.id}>{item.name}</Checkbox>
                  </Checkbox.Group>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

