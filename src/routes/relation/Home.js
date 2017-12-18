/*
 * @Description: 汇报关系树
 * @Author: zhangjunli
 * @Date: 2017-12-5 15:02:16
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import EditModal from '../../components/relation/EditModal';
import TreeDetail from '../../components/relation/TreeDetail';
import Tree from '../../components/relation/Tree';
import styles from './home.less';

// editModal 组件的三种弹框类型
const MANAGER_MODAL = 'manager';
const TEAM_MODAL = 'team';
const MEMBER_MODAL = 'member';
// detailTable 组件的三种表格类型
// const COMPANY_TABLE = 'company';
const CENTER_TABLE = 'center';
const TEAM_TABLE = 'team';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  treeInfo: state.relation.treeInfo,
  detailInfo: state.relation.detailInfo,
  searchList: state.relation.searchList,
});

const mapDispatchToProps = {
  getTreeInfo: fetchDataFunction(true, 'relation/getTreeInfo'),
  getDetailInfo: fetchDataFunction(true, 'relation/getDetailInfo'),
  getSearchList: fetchDataFunction(true, 'relation/getSearchList'),
  addTeam: fetchDataFunction(true, 'relation/addTeam'),
  deleteTeam: fetchDataFunction(true, 'relation/deleteTeam'),
  addMember: fetchDataFunction(true, 'relation/addMember'),
  deleteMember: fetchDataFunction(true, 'relation/deleteMember'),
  updateManager: fetchDataFunction(true, 'relation/updateManager'),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends Component {
  static propTypes = {
    treeInfo: PropTypes.array,
    detailInfo: PropTypes.object,
    searchList: PropTypes.array,
    getTreeInfo: PropTypes.func.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    getSearchList: PropTypes.func.isRequired,
    addTeam: PropTypes.func.isRequired,
    deleteTeam: PropTypes.func.isRequired,
    addMember: PropTypes.func.isRequired,
    deleteMember: PropTypes.func.isRequired,
    updateManager: PropTypes.func.isRequired,
  }

  static defaultProps = {
    detailInfo: {},
    treeInfo: [],
    searchList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      editModal: false, // 弹框的控制项
      category: '', // 树菜单数据类别
      modalType: '', // 弹框类型，自定义有三种类型
      currentItem: {}, // 当前展示的信息
      searchList: [], // 弹框中搜索框搜索的数据
    };
  }

  componentDidMount() {
    const { getTreeInfo } = this.props;
    // 请求菜单树数据
    getTreeInfo({});
  }

  componentWillReceiveProps(nextProps) {
    const { searchList } = nextProps;
    if (searchList !== this.props.searchList) {
      this.setState({ searchList });
    }
  }

  // 关闭弹框时，清空弹框显示相关的数据
  @autobind
  closeModal() {
    this.setState({ editModal: false, currentItem: {}, searchList: [] });
  }

  // 选中菜单
  @autobind
  handleSelect(menu) {
    if (_.isEmpty(menu)) {
      return;
    }
    const { category, id } = menu;
    const { getDetailInfo } = this.props;
    this.setState({ category }, () => { getDetailInfo({ category, id }); });
  }

  // 触发弹框中的搜索框搜索事件
  @autobind
  handleSearch(keyword) {
    // 搜索关键字为空，则不搜索
    if (_.isEmpty(keyword)) {
      return;
    }
    const { getSearchList } = this.props;
    const { category } = this.state;
    getSearchList({ category, keyword });
  }

  // 弹框确定事件
  @autobind
  handleOk(param) {
    const { select, modalType, isUpdate } = param;
    const { category } = this.state;
    const { addTeam, addMember, updateManager, getDetailInfo, getTreeInfo } = this.props;
    this.setState({ editModal: false, searchList: [], currentItem: {} }, () => {
      // 去重
      if (!isUpdate) {
        return;
      }
      // 责任人弹框
      if (modalType === MANAGER_MODAL) {
        // 请求更新负责人和详情表格数据
        updateManager({ category, ...select }).then(
          () => { getDetailInfo({ category, ...select }); },
        );
      } else if (modalType === TEAM_MODAL) {
        // 请求添加/更新团队和菜单树数据
        addTeam({ ...select, category }).then(
          () => {
            getTreeInfo({}).then(
              () => { getDetailInfo(category, ...select); },
            );
          },
        );
      } else if (modalType === MEMBER_MODAL) {
        // 请求添加成员和详情数据
        addMember({ ...select, category }).then(
          () => { getDetailInfo({ category, ...select }); },
        );
      }
    });
  }

  // 添加事件弹框（添加团队/添加成员）
  @autobind
  handleAdd(category) {
    this.setState({
      modalType: category === TEAM_TABLE ? MEMBER_MODAL : TEAM_MODAL,
      editModal: true,
    });
  }

  @autobind
  handleDelete(category, item) {
    const { deleteTeam, deleteMember, getTreeInfo, getDetailInfo } = this.props;
    if (category === CENTER_TABLE) {
      deleteTeam({ ...item }).then(
        () => {
          getTreeInfo({}).then(
            () => { getDetailInfo(category, ...item); },
          );
        },
      );
    } else if (category === TEAM_TABLE) {
      deleteMember({ ...item });
    }
  }

  @autobind
  handleUpdate(category, item, isManagerMdoal) {
    this.setState({
      modalType: isManagerMdoal ? MANAGER_MODAL : TEAM_MODAL,
      currentItem: item,
      editModal: true,
    });
  }

  render() {
    const { modalType, category, editModal, currentItem, searchList } = this.state;
    const { detailInfo, treeInfo } = this.props;
    return (
      <div className={styles.relationContainer}>
        <Tree
          treeData={treeInfo}
          onSelect={this.handleSelect}
        />
        <TreeDetail
          detail={detailInfo}
          category={category}
          onAdd={this.handleAdd}
          onDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
        />
        {
          editModal ? (
            <EditModal
              list={searchList}
              visible={editModal}
              modalType={modalType}
              defultItem={currentItem}
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

