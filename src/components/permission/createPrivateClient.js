import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import CommonModal from '../common/biz/CommonModal';
import ServerPersonel from './ServerPersonel';
import BaseInfoModify from './BaseInfoModify';
import UploadFile from './UploadFile';

const confirm = Modal.confirm;

export default class CreatePrivateClient extends PureComponent {
  static propTypes = {
    serverPersonelList: PropTypes.array.isRequired,
    customerList: PropTypes.array.isRequired,
    onEmitClearModal: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      // 模态框是否显示   默认状态下是隐藏的
      isShowModal: true,
      baseInfo: [],
      serverInfo: props.serverPersonelList,
      attachInfoList: [],
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ serverInfo: newProps.serverPersonelList });
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
            baseInfo={this.state.baseInfo}
            customerList={this.props.customerList}
          />
          <ServerPersonel
            head="服务人员"
            type="serverInfo"
            info={this.state.serverInfo}
            statusType="modify"
            onEmitEvent={this.updateValue}
            serverPersonelList={this.props.serverPersonelList}
          />
          <UploadFile fileList={this.state.attachInfoList} />
        </div>
      </CommonModal>
    );
  }
}
