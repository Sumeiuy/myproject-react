/**
 * @Author: sunweibin
 * @Date: 2018-04-12 12:03:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-19 15:25:14
 * @description 创建服务记录中的服务记录文本输入框组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, Icon, message } from 'antd';
import cx from 'classnames';
import _ from 'lodash';

import ChoiceApproverBoard from '../../commissionAdjustment/ChoiceApproverBoard';
import ChoiceInvestAdviceModal from './ChoiceInvestAdviceModal_';

import styles from './index.less';

export default class ServeContent extends PureComponent {

  constructor(props) {
    super(props);
    // 只读状态不会到此组件中
    const { isReject, serveContent } = props;
    this.state = {
      // 服务记录内容是固定话术(tmpl)还是自由编辑(free)，固定话术不需要审批，自由编辑需要审批
      // 需要用在添加内容或者编辑修改的时候来确认
      contentMode: '',
      // 弹出修改服务内容的弹出层
      serveContentModal: false,
      // 选择审批人弹出岑
      approvalModal: false,
      // 审批人
      approverName: '',
      approverId: '',
      // 服务内容标题
      serveContentTitle: isReject ? serveContent.title : '',
      // 服务内容类型
      serveContentType: isReject ? serveContent.type : '',
      // 服务内容
      serveContentDesc: isReject ? serveContent.desc : '',
      // 判断是否用户已经修改了内容,在只读|驳回下才会已经存在内容,
      hasEditContent: isReject,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { serveContent: nextSC } = nextProps;
    const { serveContent: prevSC } = this.props;
    if (!_.isEqual(nextSC, prevSC)) {
      this.setState({
        // 服务内容标题
        serveContentTitle: nextSC.title || '',
        // 服务内容类型
        serveContentType: nextSC.type || '',
        // 服务内容
        serveContentDesc: nextSC.desc || '',
        hasEditContent: true,
      });
    }
  }

  // 校验必要的数据是否填写选择
  @autobind
  checkData() {
    let checkResult = true;
    const {
      serveContentDesc,
      serveContentTitle,
      approverId,
      contentMode,
    } = this.state;
    if (contentMode === '') {
      message.error('请添加服务内容');
      checkResult = false;
    }
    if (_.isEmpty(serveContentDesc) || _.isEmpty(serveContentTitle)) {
      message.error('请填写服务内容中的标题和内容');
      checkResult = false;
    }
    if (contentMode === 'free') {
      // 自由话术模式，下需要审批
      if (_.isEmpty(approverId)) {
        message.error('自由编辑状态下，需要审批，请选择审批人');
        checkResult = false;
      }
    }
    return checkResult;
  }

  @autobind
  getData() {
    const {
      serveContentDesc,
      serveContentTitle,
      serveContentType,
      approverId,
      contentMode,
    } = this.state;
    return {
      title: serveContentTitle,
      content: serveContentDesc,
      taskType: serveContentType,
      approval: approverId,
      mode: contentMode,
    };
  }

  /** 点击添加内容按钮 | 编辑修改按钮 */
  @autobind
  handleBtnClick() {
    this.setState({
      serveContentModal: true,
    });
  }

  @autobind
  handleCloseServeContentModal() {
    this.setState({ serveContentModal: false });
  }

  // 添加服务内容按确认按钮
  @autobind
  handleServeModalOK({ title, type = '', desc, mode }) {
    this.setState({
      serveContentModal: false,
      serveContentDesc: desc,
      serveContentTitle: title,
      serveContentType: type,
      hasEditContent: !_.isEmpty(desc),
      contentMode: mode,
    });
  }

  // 关闭审批人弹出层
  @autobind
  handleCloseApprovalModal() {
    this.setState({
      approvalModal: false,
    });
  }

  // 点击审批人弹出层确认按钮
  @autobind
  handleApproverModalOK(approver) {
    this.setState({
      approverName: approver.empName,
      approverId: approver.empNo,
      approvalModal: false,
    });
  }

  // 判断是否自由编辑
  @autobind
  isFreeEditContent() {
    return this.state.contentMode === 'free';
  }

  // 显示需要添加内容的提示
  @autobind
  showAddContentTips() {
    const { hasEditContent } = this.state;
    if (!hasEditContent) {
      return (
        <div className={styles.noCT}>
          <Icon type="exclamation-circle" /> 你还没有添加任何服务内容，请通过选择模板进行添加或者手动编辑添加
        </div>
      );
    }
    return null;
  }

  @autobind
  openApproverBoard() {
    this.setState({ approvalModal: true });
  }

  // 渲染添加内容按钮或者编辑修改内容
  @autobind
  renderBtn() {
    const { hasEditContent } = this.state;
    if (!hasEditContent) {
      return (<Button type="primary" ghost icon="plus" onClick={this.handleBtnClick}>添加内容</Button>);
    }
    return (<Button type="primary" ghost onClick={this.handleBtnClick}>编辑修改</Button>);
  }

  render() {
    const {
      approvalModal,
      serveContentModal,
      approverName,
      approverId,
      serveContentTitle,
      serveContentDesc,
      serveContentType,
      hasEditContent,
    } = this.state;

    const { approvalList } = this.props;
    const newApprovalList = approvalList.map(item => ({
      empNo: item.login,
      empName: item.empName,
      belowDept: item.occupation,
    }));
    // 选择审批人的CSS class类名
    const approvalCls = cx([styles.approval, styles.title]);

    // 自由编辑下的serveContent
    const serveContent = {
      title: serveContentTitle,
      desc: serveContentDesc,
    };

    return (
      <div>
        <div className={styles.serveRecord}>
          <div className={styles.title}>服务内容:</div>
          <div className={styles.rightArea}>
            <div className={styles.btn}>{this.renderBtn()}</div>
            {
              !hasEditContent ? null :
              (
                <div className={styles.ctHeader}>
                  <span className={styles.caption}>{serveContentTitle}</span>
                  <span className={styles.type}>{serveContentType}</span>
                  <div className={styles.rightCT}>{serveContentDesc}</div>
                </div>
              )
            }
            {this.showAddContentTips()}
          </div>
        </div>
        {
          !this.isFreeEditContent() ? null :
          (
            <div className={styles.serveRecord}>
              <div className={approvalCls}>选择审批人:</div>
              <div className={styles.rightArea}>
                <div className={styles.checkApprover} onClick={this.openApproverBoard}>
                  {approverName === '' ? '' : `${approverName}(${approverId})`}
                  <div className={styles.searchIcon}><Icon type="search" /></div>
                </div>
                <div className={styles.noCT}><Icon type="exclamation-circle" /> 注：投资建议需要经过审批才会发送给客户。请提醒审批人及时完成审批流程，以确保投资建议的时效性。</div>
              </div>
            </div>
          )
        }
        {
          !approvalModal ? null :
          (
            <ChoiceApproverBoard
              visible={approvalModal}
              approverList={newApprovalList}
              onClose={this.handleCloseApprovalModal}
              onOk={this.handleApproverModalOK}
            />
          )
        }
        {
          !serveContentModal ? null :
          (
            <ChoiceInvestAdviceModal
              visible={serveContentModal}
              modalKey="serveContentModal"
              onClose={this.handleCloseServeContentModal}
              onOK={this.handleServeModalOK}
              isUpdate={hasEditContent}
              serveContent={serveContent}
            />
          )
        }
      </div>
    );
  }
}

ServeContent.propTypes = {
  isReject: PropTypes.bool.isRequired,
  serveContent: PropTypes.object,
  approvalList: PropTypes.array,
};

ServeContent.defaultProps = {
  serveContent: {},
  approvalList: [],
};
