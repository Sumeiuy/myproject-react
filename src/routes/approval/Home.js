import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import MessageList from '../../components/common/MessageList';
import ServerPersonel from '../../components/permission/ServerPersonel';
import Approvals from '../../components/permission/Approval';
import ApprovalRecord from '../../components/permission/ApprovalRecord';
import UploadFile from '../../components/permission/UploadFile';
import withRouter from '../../decorators/withRouter';
import style from './home.less';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  detailMessage: state.permission.detailMessage,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  getDetailMessage: fetchDataFunction(true, 'permission/getDetailMessage'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Approval extends PureComponent {
  static propTypes = {
    detailMessage: PropTypes.object.isRequired,
    getDetailMessage: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      // 审批意见
      approvalComments: '',
    };
  }

  componentWillMount() {
    this.props.getDetailMessage({ id: 'approval' });
  }

  @autobind
  updateValue(name, value) {
    console.log(value);
    this.setState({ [name]: value });
  }

  render() {
    const { detailMessage } = this.props;
    return (
      <div className={style.approval}>
        <div className={style.approvalBox}>
          <div className={style.dcHeader}>
            <span className={style.dcHaderNumb}>编号{detailMessage.num}</span>
          </div>
          <MessageList
            head="基本信息"
            baseInfo={detailMessage.baseInfo}
          />
          <MessageList
            head="拟稿信息"
            baseInfo={detailMessage.draftInfo}
          />
          <ServerPersonel
            head="服务人员"
            type="serverInfo"
            info={detailMessage.serverInfo}
            statusType="ready"
          />
          <UploadFile fileList={detailMessage.attachInfoList} />
          <Approvals
            head="审批"
            type="approvalComments"
            textValue={this.state.approvalComments}
            onEmitEvent={this.updateValue}
          />
          <ApprovalRecord
            head="审批记录"
            info={detailMessage.approvalRecordList}
            statusType="ready"
          />
        </div>
      </div>
    );
  }
}
