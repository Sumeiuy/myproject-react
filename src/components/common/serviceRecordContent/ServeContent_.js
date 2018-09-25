/**
 * @Author: sunweibin
 * @Date: 2018-04-12 12:03:56
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-21 15:04:11
 * @description 创建服务记录中的服务记录文本输入框组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, Icon, message } from 'antd';
import cx from 'classnames';
import _ from 'lodash';

import ChoiceApproverBoard from '../../commissionAdjustment/ChoiceApproverBoard';
import logable from '../../../decorators/logable';
import ChoiceInvestAdviceModal from './ChoiceInvestAdviceModal_';

import styles from './index.less';

// 自建以及MOT任务的类型
const TASK_TYPE = {
  MOT: 1,
  SELF: 2,
};

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
      // 判断当前是驳回后修改的情景还是新建的情景
      isReject,
      // 判断是否用户已经修改了内容,在只读|驳回下才会已经存在内容,
      hasEditContent: isReject,
      // 用户选择的服务内容是通过固定话术的方式显示的情况下，会存在 templateID
      templateID: '',
    };
  }

  @autobind
  getData() {
    const { eventId, serviceTypeCode } = this.props;
    const {
      serveContentDesc,
      serveContentTitle,
      serveContentType,
      approverId,
      contentMode,
      templateID,
    } = this.state;
    return {
      title: serveContentTitle,
      content: serveContentDesc,
      taskType: serveContentType,
      approval: approverId,
      mode: contentMode,
      templateId: templateID,
      // 添加服务记录中需要针对涨乐财富通的服务方式新增一个eventId,
      // 而自建任务和MOT的任务的对应的值使用了不同的变量，
      eventId: this.isMOTTask() ? eventId : serviceTypeCode,
    };
  }

  @autobind
  isMOTTask() {
    const { taskType } = this.props;
    const type = parseInt(taskType, 10) + 1;
    return type === TASK_TYPE.MOT;
  }

  // 校验必要的数据是否填写选择
  @autobind
  checkData() {
    const {
      serveContentDesc,
      serveContentTitle,
      approverId,
      contentMode,
    } = this.state;
    // 这个是初始值
    const { serveContent, isReject } = this.props;
    // 判断在驳回状态，初始值与state里面的值是否变化了，
    // 如果修改了，则可以给用户提交，如果没有则不让用户提交
    if (isReject) {
      // 原始值
      const { desc } = serveContent;
      if (_.isEqual(desc, serveContentDesc)) {
        // 如果相同代表，用户并没有修改
        message.error('服务内容已被驳回，请修改服务内容后再提交');
        return false;
      }
    }

    if (_.isEmpty(serveContentDesc) || _.isEmpty(serveContentTitle)) {
      message.error('请填写服务内容中的标题和内容');
      return false;
    }
    if (contentMode === 'free') {
      // 自由话术模式，下需要审批
      if (_.isEmpty(approverId)) {
        message.error('自由编辑状态下，需要审批，请选择审批人');
        return false;
      }
    }
    return true;
  }

  /** 点击添加内容按钮 | 编辑修改按钮 */
  // TODO 日志查看：找不到方法 未验证
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '添加内容/编辑修改' } })
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
  handleServeModalOK({ title, type = '', desc, mode, templateID = '' }) {
    this.setState({
      serveContentModal: false,
      serveContentDesc: desc,
      serveContentTitle: title,
      serveContentType: type,
      hasEditContent: !_.isEmpty(desc),
      contentMode: mode,
      templateID,
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

  // TODO 日志查看：找不到方法 未验证
  @autobind
  @logable({ type: 'Click', payload: { name: '点击' } })
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
      isReject,
      templateID,
      contentMode,
    } = this.state;

    const {
      approvalList,
      // 投资建议文本撞墙检测
      testWallCollision,
      // 投资建议文本撞墙检测是否有股票代码
      testWallCollisionStatus,
    } = this.props;
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
              eventId={this.props.eventId}
              serviceTypeCode={this.props.serviceTypeCode}
              custId={this.props.custId}
              taskType={this.props.taskType}
              templateID={templateID}
              onClose={this.handleCloseServeContentModal}
              onOK={this.handleServeModalOK}
              isUpdate={hasEditContent}
              isReject={isReject}
              fromMode={contentMode}
              serveContent={serveContent}
              testWallCollision={testWallCollision}
              testWallCollisionStatus={testWallCollisionStatus}
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
  // 投资建议文本撞墙检测
  testWallCollision: PropTypes.func.isRequired,
  // 投资建议文本撞墙检测是否有股票代码
  testWallCollisionStatus: PropTypes.bool.isRequired,
  onFormDataChange: PropTypes.func,
  eventId: PropTypes.string.isRequired,
  serviceTypeCode: PropTypes.string.isRequired,
  custId: PropTypes.string.isRequired,
  taskType: PropTypes.string.isRequired,
};

ServeContent.defaultProps = {
  serveContent: {},
  approvalList: [],
  onFormDataChange: _.noop,
};
