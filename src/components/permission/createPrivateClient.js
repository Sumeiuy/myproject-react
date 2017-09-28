import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import _ from 'lodash';
import CommonModal from '../common/biz/CommonModal';
import ServerPersonel from './ServerPersonel';
import BaseInfoModify from './BaseInfoModify';
import UploadFile from './UploadFile';

const confirm = Modal.confirm;

export default class CreatePrivateClient extends PureComponent {
  static propTypes = {
    searchServerPersonList: PropTypes.array.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    onEmitClearModal: PropTypes.func.isRequired,
    hasServerPersonList: PropTypes.array.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      // 模态框是否显示   默认状态下是隐藏的
      isShowModal: true,
      serverInfo: props.hasServerPersonList,
      attachInfoList: [],
      subType: '',
      customer: {},
      remark: '',
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.hasServerPersonList !== this.props.hasServerPersonList) {
      this.setState({ serverInfo: newProps.hasServerPersonList });
    }
  }

  @autobind
  onOk() {
    console.log('确定要关闭吗');
    // this.setState({isShowModal: false});
  }

  @autobind
  closeModal() {
    // 关闭我的模态框
    const that = this;
    confirm({
      title: '真的要关闭此弹框嘛?',
      content: '亲~~弹框关闭以后，您所填写的信息是不会保存的哟！！！',
      onOk() {
        that.setState({ isShowModal: false });
      },
      onCancel() {

      },
    });
  }

  @autobind
  afterClose() {
    this.props.onEmitClearModal();
  }

  @autobind
  updateValue(name, value) {
    this.setState({ [name]: value });
    console.log(name, value);
  }

  render() {
    return (
      <CommonModal
        title="新建私密客户申请"
        visible={this.state.isShowModal}
        onOk={this.onOk}
        okText="提交"
        closeModal={this.closeModal}
        size="large"
        modalKey="myModal"
        afterClose={this.afterClose}
      >
        <div style={{ padding: '0 50px' }}>
          <BaseInfoModify
            head="基本信息"
            subTypeTxt="全部"
            customer={!_.isEmpty(this.state.customer)
              ?
                `${this.state.customer.custName}（${this.state.customer.custNumber}）`
              :
                ''
            }
            remark={this.state.remark}
            canApplyCustList={this.props.canApplyCustList}
            onEmitEvent={this.updateValue}
          />
          <ServerPersonel
            head="服务人员"
            type="serverInfo"
            info={this.state.serverInfo}
            statusType="modify"
            onEmitEvent={this.updateValue}
            searchServerPersonList={this.props.searchServerPersonList}
          />
          <UploadFile fileList={this.state.attachInfoList} />
        </div>
      </CommonModal>
    );
  }
}
