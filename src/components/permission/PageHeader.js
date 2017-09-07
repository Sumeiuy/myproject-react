/**
 * @file Pageheader.js
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { TreeSelect, Select } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { permissionOptions } from '../../config';

import styles from './jiraLayout.less';

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

  @autobind
  handleSelectChange(name, key) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [name]: _.isArray(key) ? key.join(',') : key,
      },
    });
  }

  render() {
    const typeOptions = permissionOptions.typeOptions;
    const stateOptions = permissionOptions.stateOptions;
    const getSelectOption = item => item.map(i =>
      <Option key={i.value}>{i.label}</Option>,
    );
    const { location: { query: {
      permissionType,
      permissionState,
    } } } = this.props;
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
        />

        子类型:
        <Select
          style={{ width: '12%' }}
          placeholder="全部"
          value={permissionType}
          onChange={key => this.handleSelectChange('permissionType', key)}
          allowClear
        >
          {getSelectOption(typeOptions)}
        </Select>

        状态:
        <Select
          style={{ width: '8%' }}
          placeholder="全部"
          value={permissionState}
          onChange={key => this.handleSelectChange('permissionState', key)}
          allowClear
        >
          {getSelectOption(stateOptions)}
        </Select>

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
