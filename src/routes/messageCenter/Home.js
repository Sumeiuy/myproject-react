/*
 * @Author: zhangjun
 * @Date: 2018-05-22 19:11:13
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-08-03 13:38:47
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { Tooltip, Button } from 'antd';
import _ from 'lodash';
import { dva, emp } from '../../helper';
import { openFspTab, openRctTab } from '../../utils';
import Pagination from '../../components/common/Pagination';
import Loading from '../../layouts/Loading';
import { windowOpen } from '../../utils/fspGlobal';
import api from '../../api';
import config from './config';
import styles from './home.less';

// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const effects = {
  getRemindMessageList: 'messageCenter/getRemindMessageList',
};

const mapStateToProps = state => ({
  // 消息通知提醒列表
  remindMessages: state.messageCenter.remindMessages,
});

const mapDispatchToProps = {
  // 获取消息通知提醒列表
  getRemindMessageList: effect(effects.getRemindMessageList),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class MessageCenter extends PureComponent {
  static propTypes = {
    // 获取消息通知提醒列表
    getRemindMessageList: PropTypes.func.isRequired,
    // 消息通知提醒列表
    remindMessages: PropTypes.object.isRequired,
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      // 弹窗loading状态
      loadingStatus: false,
    };
    this.removeNotice = true;
  }

  componentDidMount() {
    this.getRemindMessageList({
      pageNum: 1,
    });
  }

  // 获取消息通知提醒列表
  @autobind
  getRemindMessageList({ pageNum }) {
    this.props.getRemindMessageList({
      pageNum,
      pageSize: 10,
    });
  }

  // 切换当前页
  @autobind
  handlePageChange(pageNum) {
    this.getRemindMessageList({ pageNum });
  }

  // 点击消息通知
  @autobind
  handleRemindMessage(data) {
    const { objectVal, rowId, typeName, title } = data;
    const allocation = '转签待分配';
    const flag = title.indexOf(allocation);
    this.removeNotice = true;
    if (typeName === config.tgSign && flag < 0) {
      this.handleMessageByFSPNotAllocation(objectVal);
    } else if (typeName === config.tgSign && flag >= 0) {
      this.handleMessageByFSPAllocation(objectVal);
    } else if (typeName === config.demote) {
      this.handleMessageByBranch(rowId);
    } else if (typeName === config.mainPosition) {
      this.handleMessageByPrimary(rowId, objectVal);
    } else if (typeName === config.taskList) {
      this.handleMessageByInvestment(objectVal);
    } else if (typeName === config.filialeCustTransfer) {
      this.handleMessageByBatch(objectVal, title, rowId);
    } else if (typeName === config.userCenter) {
      this.handleMessageByTG();
    } else if (typeName === config.custAllot) {
      // 分公司客户分配
      this.handleCustAllotMessage(data);
    } else if (typeName === config.departmentCustAllot) {
      // 营业部客户分配
      this.handleDepartmentCustAllotMessage(data);
    } else if (typeName === config.myFeedback) {
      this.handleMessageByMyFeedback();
    } else {
      this.handleMessageByOther(rowId, objectVal);
    }
    if (this.removeNotice && ((typeName !== config.tgSign) || (flag < 0))) {
      this.handleMessageByRemoveNotice(rowId);
    }
  }

  // 处理typeName是HTSC FSP TGSign,标题不含转签待分配的消息通知
  @autobind
  handleMessageByFSPNotAllocation(objectVal) {
    const url = `/customerCenter/360/per/orderDetail?rowId=${objectVal}&flowCode=`;
    const param = {
      id: 'FSP_360VIEW_AGREE_TAB',
      title: '协议详细信息',
      forceRefresh: true,
    };
    const pathName = '/customerCenter/360/per/orderDetail';
    openFspTab({
      routerAction: this.context.push,
      url,
      pathName,
      param,
    });
  }

  // 我的反馈
  @autobind
  handleMessageByMyFeedback() {
    this.removeNotice = false;
    const url = '/myFeedback';
    const param = {
      id: 'FSP_MYFEEDBACK',
      title: '我的反馈',
      forceRefresh: true,
      closable: true,
      isSpecialTab: true,
    };
    openRctTab({
      routerAction: this.context.push,
      url,
      pathName: url,
      param,
    });
    this.removeNotice = true;
  }

  // 处理typeName是HTSC FSP TGSign,标题含转签待分配的消息通知
  @autobind
  async handleMessageByFSPAllocation(objectVal) {
    try {
      let response = await api.getFspData(`/fsp/tgcontract/list/findstatus?rowId=${objectVal}`);
      // 返回数据是string类型，需要转换成JSON类型
      response = JSON.parse(response);
      const { msg } = response.data;
      if (!msg) {
        let loadCntractResponse = await api.getFspData(`/fsp/tgcontract/list/loadCntractBasicCustInfoByArgId?argId=${objectVal}`);
        loadCntractResponse = JSON.parse(loadCntractResponse);
        if (loadCntractResponse) {
          const { custId: busiId, custType } = loadCntractResponse.data;
          const routeType = `${custType}:tgcontracttransfer:${objectVal}:::Y:`;
          const busiIdParam = busiId ? `?busiId=${busiId}` : '';
          const routeTypeParam = routeType ? `&routeType=${routeType}` : '';
          const url = `/client/tgcontracttransfer/wizard/main${busiIdParam}${routeTypeParam}`;
          const param = {
            id: 'utb-stockcontracttransfer-wizard',
            title: '投顾协议转签向导',
            forceRefresh: true,
          };
          const pathName = '/client/tgcontracttransfer/wizard/main';
          openFspTab({
            routerAction: this.context.push,
            url,
            pathName,
            param,
          });
        }
      } else {
        console.error(msg);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 处理typeName是HTSC Branch Assignment Inbox Type的消息通知
  @autobind
  handleMessageByBranch(rowId) {
    this.removeNotice = false;
    const { push } = this.context;
    push(`/demote?notifiId=${rowId}`);
  }

  // 新分公司客户分配
  @autobind
  handleCustAllotMessage(data) {
    const { push } = this.context;
    const { objectVal, rowId, title } = data;
    this.removeNotice = true;
    const valArray = objectVal.split(',');
    const appId = valArray[0] || '';
    const itemId = valArray[1] || '';
    // 失败或者终止都进入失败页面
    if (_.includes(title, config.fail) || _.includes(title, config.abort)) {
      const url = `/custAllot?id=${itemId}&appId=${appId}`;
      const param = {
        id: 'FSP_CROSS_DEPARTMENT_NEW',
        title: '分公司客户分配',
        forceRefresh: true,
        isSpecialTab: true,
        closable: true,
      };
      const pathName = '/custAllot';
      openRctTab({
        routerAction: push,
        url,
        pathName,
        param,
      });
    } else {
      push(`/custAllot/notifies?notifiId=${rowId}&appId=${appId}&currentId=${itemId}`);
    }
  }

  // 营业部客户分配
  @autobind
  handleDepartmentCustAllotMessage(data) {
    const { push } = this.context;
    const { objectVal, rowId, title } = data;
    this.removeNotice = true;
    const valArray = objectVal.split(',');
    const appId = valArray[0] || '';
    const itemId = valArray[1] || '';
    // 失败或者终止都进入失败页面
    if (_.includes(title, config.fail) || _.includes(title, config.abort)) {
      const url = `/departmentCustAllot?id=${itemId}&appId=${appId}`;
      const param = {
        id: 'FSP_DEPARTMENT_CUST_ASSIGN',
        title: '营业部客户分配',
        forceRefresh: true,
        isSpecialTab: true,
        closable: true,
      };
      const pathName = '/departmentCustAllot';
      openRctTab({
        routerAction: push,
        url,
        pathName,
        param,
      });
    } else {
      push(`/departmentCustAllot/notifies?notifiId=${rowId}&appId=${appId}&currentId=${itemId}`);
    }
  }

  // 处理typeName是HTSC Primary Position Change Inbox Type的消息通知
  @autobind
  handleMessageByPrimary(rowId, objectVal) {
    this.removeNotice = true;
    const { push } = this.context;
    push(`/mainPosition/notifies?notifiId=${rowId}&appId=${objectVal}`);
  }

  // 处理typeName是HTSC Investment Advice Inbox Type的消息通知
  @autobind
  handleMessageByInvestment(objectVal) {
    this.removeNotice = true;
    windowOpen(`/fspa/spy/approval/html/taskListApproval.html?notifiId=${objectVal}&empId=${emp.getId()}`);
  }

  // 处理typeName是HTSC Batch Branch Assignment Inbox Type的消息通知
  @autobind
  handleMessageByBatch(objectVal, title, rowId) {
    let type = 'faild';
    let appId = '';
    let itemId = '';
    appId = objectVal.substring(0, objectVal.indexOf(','));
    itemId = objectVal.substring(objectVal.indexOf(',') + 1, objectVal.length);
    if (title.indexOf(config.fail) >= 0) {
      this.removeNotice = true;
    } else if (title.indexOf(config.abort) >= 0) {
      type = 'falseOver';
      this.removeNotice = true;
    } else {
      type = 'succ';
      this.removeNotice = true;
    }
    if (type === 'succ') {
      const { push } = this.context;
      push(`/filialeCustTransfer/notifies?notifiId=${rowId}&appId=${appId}&currentId=${itemId}&type=${type}`);
    } else {
      const url = `/filialeCustTransfer?id=${itemId}&appId=${appId}`;
      const param = {
        id: 'FSP_CROSS_DEPARTMENT',
        title: '分公司客户人工划转',
        forceRefresh: true,
        isSpecialTab: true,
        closable: true,
      };
      const pathName = '/filialeCustTransfer';
      openRctTab({
        routerAction: this.context.push,
        url,
        pathName,
        param,
      });
    }
  }

  // 处理typeName是HTSC TG Approval Inbox Type的消息通知
  @autobind
  handleMessageByTG() {
    this.removeNotice = false;
    const url = '/usercenter';
    const param = {
      id: 'FSP_USER_CENTER',
      title: '用户中心',
      forceRefresh: true,
      closable: true,
      isSpecialTab: true,
    };
    openRctTab({
      routerAction: this.context.push,
      url,
      pathName: url,
      param,
    });
    this.removeNotice = true;
  }

  // 处理typeName是其他的消息通知
  @autobind
  handleMessageByOther(rowId, objectVal) {
    this.setState({ loadingStatus: true });
    api
    .getFspData(`/fsp/asset/basis/queryTacticalAllocationSingle?rowId=${objectVal}&notificationId=${rowId}`)
    .then((response) => {
      this.setState({ loadingStatus: false });
      Window.show({
        id: 'queryTacticalAllocationSingle',
        showExit: true,
        width: 630,
        height: 600,
        scrollY: false,
        scrollX: false,
        title: '大类资产战术配置明细',
        content: response,
      });
    })
    .catch((e) => {
      console.error(e);
    });
  }

  // 根据removeNotice处理的消息通知
  @autobind
  handleMessageByRemoveNotice(rowId) {
    api
    .getFspData(`/fsp/updateSvrNotification?rowid=${rowId}`)
    .then(() => {
      // 刷新列表
      // $('#showMessageInfo').EBDataTable('queryData');
      const { page } = this.props.remindMessages;
      const { curPageNum } = page;
      this.getRemindMessageList({
        pageNum: curPageNum,
      });
    })
    .catch((e) => {
      console.error(e);
    });
  }

  render() {
    const {
      notificationMsgRespDTOList: list = [],
      page = {},
    } = this.props.remindMessages;
    const { curPageNum, pageSize, totalRecordNum } = page;
    const { loadingStatus } = this.state;
    const messageList = list.map((item) => {
      // 标题长度超过50状态
      const isTitleLengthStatus = item.title.length > 50;
      if (isTitleLengthStatus) {
        return (
          <li key={item.rowId} >
            <Tooltip
              title={item.title}
              placement="bottomLeft"
              overlayClassName={styles.remindMessageTip}
            >
              <Button
                onClick={() => this.handleRemindMessage(item)}
              >
                {item.title.substr(0, 50)}...
              </Button>
            </Tooltip>
            <span className={styles.listCreateTime}>{item.createdTime.substr(0, 10)}</span>
          </li>
        );
      }
      return (
        <li key={item.rowId}>
          <span
            className={styles.title}
            onClick={() => this.handleRemindMessage(item)}
          >
            {item.title}
          </span>
          <span className={styles.listCreateTime}>{item.createdTime.substr(0, 10)}</span>
        </li>
      );
    });
    return (
      <div className={styles.messageCenter}>
        <div className={styles.messageContent}>
          <div className={styles.head}>
            <span className={styles.title}>提醒内容</span>
            <span className={styles.createTime}>创建时间</span>
          </div>
          <Loading loading={loadingStatus} />
          <div className={styles.listWrapper}>
            <ul className={styles.list}>
              {messageList}
            </ul>
          </div>
        </div>
        {
            _.isEmpty(page) ? null
            : (
              <Pagination
                current={curPageNum}
                total={totalRecordNum}
                pageSize={pageSize}
                onChange={this.handlePageChange}
              />)
          }
      </div>
    );
  }
}
