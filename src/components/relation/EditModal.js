/**
 * @description 编辑弹框，统一样式
 * @author zhangjunli
 * Usage:
 * <EditModal
 *  visible={bool}
 *  onOk={func}
 *  onCancel={func}
 *  onSearch={func}
 *  modalKey={string}
 *  list={array}
 *  modalType={string}
 * />
 * visible：必需的，用于控制弹框是否显示
 * onOk：必须，按钮的回调事件
 * onCancel：必须，按钮的回调事件
 * onSearch: 必须，下拉控件中搜索事件
 * list：必须，下拉框列表
 * modalKey： 必须，容器组件用来控制modal出现和隐藏的key
 * modalType：非必须，值有，'manager', 'member', 'team'。默认值为manager
 * okText：有默认值：确定，按钮的title
 * cancelText: 有默认值：取消，按钮的title
 */
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import { Input, Modal } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';

import Icon from '../common/Icon';
import Button from '../common/Button';
import DropDownSelect from '../common/dropdownSelect';
import styles from './editModal.less';

const titleArray = {
  manager: ['编辑负责人', '负责人:'],
  member: ['添加成员', '成员:'],
  team: ['添加团队', '团队负责人:', '团队名称:'],
};
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};

export default class EditModal extends Component {
  static propTypes = {
    list: PropTypes.array,
    modalType: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    modalKey: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    updateItem: PropTypes.object,
  }

  static defaultProps = {
    okText: '确定',
    cancelText: '取消',
    list: [],
    modalType: '',
    updateItem: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      select: {},
      teamName: '',
    };
  }

  @autobind
  handleOk() {
    const { onOk, modalKey, modalType } = this.props;
    const { select, teamName } = this.state;
    onOk({ modalKey, select, teamName, modalType });
  }

  @autobind
  handleClose() {
    const { onCancel, modalKey } = this.props;
    onCancel(modalKey);
  }

  @autobind
  handleSelect(obj) {
    const teamName = `${obj.name}团队`;
    this.setState({ select: obj, teamName });
  }

  @autobind
  handleSearch(keyword) {
    this.props.onSearch(keyword);
  }

  @autobind
  handleChange(e) {
    this.setState({ teamName: e.target.value });
  }

  @autobind
  handleClear() {
    this.setState({ teamName: '' });
  }

  @autobind
  renderContent() {
    const { modalType, list, updateItem } = this.props;
    const { manager = '', title = '' } = updateItem || {};
    const { teamName } = this.state;
    const titles = _.isEmpty(modalType) ? titleArray.manager : titleArray[modalType];
    return (
      <div className={styles.modalBody}>
        <div className={styles.row}>
          <div className={styles.infoColumn}>{titles[1]}</div>
          <div className={styles.inputColumn}>
            <DropDownSelect
              placeholder="工号/姓名"
              showObjKey="name"
              objId="code"
              value={manager}
              searchList={list}
              emitSelectItem={this.handleSelect}
              emitToSearch={this.handleSearch}
              boxStyle={dropDownSelectBoxStyle}
            />
          </div>
        </div>
        {
          titles.length > 2 ? (
            <div className={styles.row}>
              <div className={classnames(styles.infoColumn, styles.info)}>{titles[2]}</div>
              <div className={styles.inputColumn}>
                <Input
                  addonAfter={<Icon type="guanbi" onClick={this.handleClear} />}
                  value={title || teamName}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }

  @autobind
  renderFooter() {
    const { okText, cancelText } = this.props;
    return (
      <div className={styles.footer}>
        <Button type="primary" size="large" onClick={this.handleOk} className={styles.ok}>
          {okText}
        </Button>
        <Button type="default" size="large" onClick={this.handleClose} className={styles.cancel}>
          {cancelText}
        </Button>
      </div>
    );
  }

  render() {
    const { visible, modalType } = this.props;
    const title = _.head(titleArray[modalType]);
    return (
      <Modal
        title={title}
        visible={visible}
        footer={this.renderFooter()}
        wrapClassName={styles.modalContainer}
        onCancel={this.handleClose}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}
