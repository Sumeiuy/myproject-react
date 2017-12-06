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
 *  category={string}
 * />
 * visible：必需的，用于控制弹框是否显示
 * onOk：必须，按钮的回调事件
 * onCancel：必须，按钮的回调事件
 * onSearch: 必须，下拉控件中搜索事件
 * list：必须，下拉框列表
 * modalKey： 必须，容器组件用来控制modal出现和隐藏的key
 * category：非必须，值有，'manager', 'member', 'team'。默认值为manager
 * okText：有默认值：确定，按钮的title
 * cancelText: 有默认值：取消，按钮的title
 */
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import { Input, Modal } from 'antd';
import _ from 'lodash';

import Icon from '../common/Icon';
import Button from '../common/Button';
import DropDownSelect from '../common/dropdownSelect';
// import _ from 'lodash';

import styles from './editModal.less';

const data = [{
  name: '张三', code: '0987689',
}, {
  name: '李四', code: '09856789',
}];
const titleArray = {
  manager: ['编辑负责人', '负责人:'],
  member: ['添加成员', '成员:'],
  team: ['添加团队', '团队负责人:', '团队名称:'],
};
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 205,
  height: 32,
  border: '1px solid #d9d9d9',
};

export default class EditModal extends Component {
  static propTypes = {
    list: PropTypes.array,
    category: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    modalKey: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  static defaultProps = {
    okText: '确定',
    cancelText: '取消',
    list: data,
    category: 'manager',
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
    const { onOk, modalKey, category } = this.props;
    const { select, teamName } = this.state;
    onOk({ modalKey, category, select, teamName });
  }

  @autobind
  handleClose() {
    const { onCancel, modalKey } = this.props;
    onCancel(modalKey);
  }

  @autobind
  handleSelect(obj) {
    this.setState({ select: obj });
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
  }

  @autobind
  renderContent() {
    const { category, list } = this.props;
    const { select } = this.state;
    const defalutTeamName = (select.name && !_.isEmpty(select.name)) ?
      (`${select.name}团队`) : '';
    const titles = titleArray[category];
    return (
      <div className={styles.modalBody}>
        <div className={styles.row}>
          <div className={styles.infoColumn}>{titles[1]}</div>
          <div className={styles.inputColumn}>
            <DropDownSelect
              placeholder="工号/姓名"
              showObjKey="name"
              objId="code"
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
              <div className={styles.infoColumn}>{titles[2]}</div>
              <div className={styles.inputColumn}>
                <Input
                  addonAfter={<Icon type="guanbi" onClick={this.handleClear} />}
                  defaultValue={defalutTeamName}
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
    const { visible, category } = this.props;
    const title = titleArray[category][0];
    return (
      <Modal
        title={title}
        visible={visible}
        footer={this.renderFooter()}
        wrapClassName={styles.modalContainer}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}
