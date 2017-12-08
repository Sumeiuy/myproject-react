/*
 * @Description: 汇报关系树
 * @Author: zhangjunli
 * @Date: 2017-12-5 15:02:16
 */
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import EditModal from '../../components/relation/EditModal';
import TreeDetail from '../../components/relation/TreeDetail';
import Tree from '../../components/relation/Tree';
import styles from './home.less';
import { treeArray, managerArray, companyArray, centerArray, teamArray } from './mockData';

// editModal 组件的三种弹框类型
const MANAGER_MODAL = 'manager';
const TEAM_MODAL = 'team';
const MEMBER_MODAL = 'member';
// detailTable 组件的三种表格类型
const COMPANY_TABLE = 'company';
const CENTER_TABLE = 'center';
const TEAM_TABLE = 'team';
export default class Home extends Component {
  static propTypes = {
    tableData: PropTypes.array,
    treeData: PropTypes.array,
    mamagerData: PropTypes.array,
  }

  static defaultProps = {
    treeData: [],
    tableData: [],
    mamagerData: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      editModal: false,
      manager: {},
      treeData: treeArray,
      tableData: companyArray,
      mamagerData: managerArray,
      headline: '南京分公司',
      category: 'company',
      type: 'manager',
      updateItem: {},
    };
  }

  @autobind
  closeModal() {
    this.setState({
      editModal: false,
      manager: {},
      updateItem: {},
    });
  }

  @autobind
  handleSelect(menu) {
    if (_.isEmpty(menu)) {
      return;
    }
    const { category, name } = menu;
    let data = [];
    if (category === COMPANY_TABLE) {
      data = companyArray;
    } else if (category === CENTER_TABLE) {
      data = centerArray;
    } else if (category === TEAM_TABLE) {
      data = teamArray;
    }
    this.setState({
      category,
      headline: name,
      tableData: data,
      manager: {},
    });
  }

  @autobind
  handleEdit() {
    this.setState({ editModal: true, type: MANAGER_MODAL });
  }

  @autobind
  handleSearch(keyword) {
    console.log('#####handleSearch#########', keyword);
  }

  @autobind
  handleOk(param) {
    const { select, modalType } = param;
    if (modalType === MANAGER_MODAL) {
      this.setState({ manager: select, editModal: false });
    } else if (modalType === TEAM_MODAL) {
      this.setState({ editModal: false });
    } else if (modalType === MEMBER_MODAL) {
      this.setState({ editModal: false });
    }
  }

  @autobind
  handleAdd(flag) {
    let type = MANAGER_MODAL;
    if (flag === CENTER_TABLE) {
      type = TEAM_MODAL;
    } else if (flag === TEAM_TABLE) {
      type = MEMBER_MODAL;
    }
    this.setState({ type, editModal: true });
  }

  @autobind
  handleDelete(flag, item) {
    console.log('#####handleDelete#########', flag, item);
  }

  @autobind
  handleUpdate(flag, item) {
    this.setState({ type: TEAM_MODAL, updateItem: item, editModal: true });
  }

  render() {
    const {
      type,
      headline,
      category,
      manager,
      treeData,
      tableData,
      mamagerData,
      editModal,
      updateItem,
    } = this.state;
    return (
      <div className={styles.relationContainer}>
        <Tree
          treeData={treeData}
          onSelect={this.handleSelect}
        />
        <TreeDetail
          title={headline}
          category={category}
          manager={manager}
          tableData={tableData}
          onEdit={this.handleEdit}
          onAdd={this.handleAdd}
          onDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
        />
        {
          editModal ? (
            <EditModal
              updateItem={updateItem}
              list={mamagerData}
              visible={editModal}
              modalKey={'editModal'}
              modalType={type}
              onOk={this.handleOk}
              onSearch={this.handleSearch}
              onCancel={this.closeModal}
            />
          ) : null
        }
      </div>
    );
  }
}

