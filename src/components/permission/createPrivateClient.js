import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import CommonModal from '../common/biz/CommonModal';
// import MessageList from '../common/MessageList';
import ServerPersonel from './ServerPersonel';
// import Approval from './Approval';
// import ApprovalRecord from './ApprovalRecord';
import BaseInfoModify from './BaseInfoModify';
// import UploadFile from './UploadFile';

export default class CreatePrivateClient extends PureComponent {
  static propTypes = {
    isShow: PropTypes.bool,
    serverPersonelList: PropTypes.array.isRequired,
    childTypeList: PropTypes.array.isRequired,
    customerList: PropTypes.array.isRequired,
    onEmitSHowOrHideModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isShow: false,
  }

  constructor(props) {
    super(props);
    this.state = {
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
    console.log('success');
    // this.setState({isShowModal: false});
  }

  @autobind
  onCancel() {
    this.props.onEmitSHowOrHideModal();
  }
  @autobind
  updateValue(name, value) {
    console.log(name, value);
  }

  render() {
    return (
      <CommonModal
        title="新建私密客户申请"
        visible={this.props.isShow}
        onOk={this.onOk}
        okText="提交"
        closeModal={this.onCancel}
        size="large"
        modalKey="sxx"
      >
        <BaseInfoModify
          head="基本信息"
          baseInfo={this.state.baseInfo}
          customerList={this.props.customerList}
          childTypeList={this.props.childTypeList}
        />
        <ServerPersonel
          head="服务人员"
          type="serverInfo"
          info={this.state.serverInfo}
          statusType="modify"
          onEmitEvent={this.updateValue}
          serverPersonelList={this.props.serverPersonelList}
        />
      </CommonModal>
    );
  }
}
