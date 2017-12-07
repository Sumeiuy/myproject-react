/**
 * @description 树形展开
 * @author zhangjunli
 * Usage:
 * <Tree
 * />
 * treeData: 不必须，数据源
 * onSelect：不必须，选中事件
 */
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import Icon from '../common/Icon';
import EditModal from './EditModal';
import styles from './treeDetail.less';

const data = { name: '财富中心5', id: '5', category: 'manager' };

export default class TreeDetail extends Component {
  static propTypes = {
    detailData: PropTypes.object,
  }

  static defaultProps = {
    detailData: data,
  }

  constructor(props) {
    super(props);
    console.log('#######constructor#########', props);
    this.state = {
      manager: '',
      editModal: false,
    };
  }

  @autobind
  showModal() {
    console.log('#######showModal##########');
    this.setState({ editModal: true });
  }

  @autobind
  handleSearch(keyword) {
    console.log('#####handleSearch#########', keyword);
  }

  @autobind
  handleOk(param) {
    console.log('######handleOk#######', param);
    const { modalKey, select } = param;
    this.setState({ manager: select });
    this.closeModal(modalKey);
  }

  @autobind
  closeModal(modalKey) {
    this.setState({ [modalKey]: false });
  }

  @autobind
  renderHeader() {
    const { detailData } = this.props;
    const { manager } = this.state;
    return (
      <div className={styles.header}>
        <div className={styles.title}>{detailData.name}</div>
        <div className={styles.managerRow}>
          <div className={styles.info}>{'负责人：'}</div>
          {
            _.isEmpty(manager) ? null : (
              <div className={classnames(styles.info, styles.value)}>{`${manager.name}（${manager.code}）`}</div>
            )
          }
          <Icon type={'beizhu'} onClick={this.showModal} className={styles.editIcon} />
        </div>
      </div>
    );
  }

  render() {
    const { editModal } = this.state;
    const { detailData } = this.props;
    return (
      <div className={styles.detailContainer}>
        {this.renderHeader()}
        <EditModal
          visible={editModal}
          modalKey={'editModal'}
          onSearch={this.handleSearch}
          onOk={this.handleOk}
          onCancel={this.closeModal}
          category={detailData.category}
        />
      </div>
    );
  }
}
