/**
 * @file Pageheader.js
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { TreeSelect, Select } from 'antd';
import CommonSelect from '../common/biz/CommonSelect';
import { permissionOptions } from '../../config';

import styles from '../../components/style/jiraLayout.less';

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
    };
  }

  onChange = (value) => {
    console.log(arguments);
    this.setState({ value });
  }

  render() {
    const typeOptions = permissionOptions.typeOptions;
    const stateOptions = permissionOptions.stateOptions;
    const getSelectOption = item => item.map(i =>
      <Option key={i.value}>{i.label}</Option>,
    );
    const { replace, location } = this.props;
    return (
      <div className={styles.pageCommonHeader}>
        客户:
        <TreeSelect
          showSearch
          style={{ width: '10%' }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="全部"
          allowClear
          treeDefaultExpandAll
          onChange={this.onChange}
          searchPlaceholder="经济客户号/客户名称"
        />

        子类型:
        <CommonSelect
          location={location}
          replace={replace}
          data={getSelectOption(typeOptions)}
          name={'subType'}
        />
        状态:
        <CommonSelect
          location={location}
          replace={replace}
          data={getSelectOption(stateOptions)}
          name={'status'}
        />

        拟稿人:
        <TreeSelect
          showSearch
          style={{ width: '10%' }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="全部"
          allowClear
          treeDefaultExpandAll
          onChange={this.onChange}
        >
          <TreeNode value="parent 1" title="parent 1" key="0-1">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
              <TreeNode value="leaf1" title="my leaf" key="random" />
              <TreeNode value="leaf2" title="your leaf" key="random1" />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
              <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
            </TreeNode>
          </TreeNode>
        </TreeSelect>

        部门:
        <TreeSelect
          showSearch
          style={{ width: '10%' }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="全部"
          allowClear
          treeDefaultExpandAll
          onChange={this.onChange}
        >
          <TreeNode value="parent 1" title="parent 1" key="0-1">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
              <TreeNode value="leaf1" title="my leaf" key="random" />
              <TreeNode value="leaf2" title="your leaf" key="random1" />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
              <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
            </TreeNode>
          </TreeNode>
        </TreeSelect>
      </div>
    );
  }
}
