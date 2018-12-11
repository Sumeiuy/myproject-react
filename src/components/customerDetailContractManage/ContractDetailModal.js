/**
 * @Description: 合约详情弹窗
 * @Author: Liujianshu-K0240007
 * @Date: 2018-12-04 14:54:12
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-12-05 16:17:33
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';

import CommonModal from '../common/biz/CommonModal';
import ContractTerms from './ContractTerms';
import ApprovalHistory from './ApprovalHistory';
import AttachmentList from './AttachmentList';
import logable, { logCommon } from '../../decorators/logable';
import styles from './contractDetailModal.less';
import {
  CONTRACT_DETAIL_TABS_LIST,
  APPROVAL_HISTORY_TYPE,
} from './config';

const TabPane = Tabs.TabPane;

// 默认的 tab 页
const DEFAULT_TAB = CONTRACT_DETAIL_TABS_LIST[0];
const HISTORY_TAB = CONTRACT_DETAIL_TABS_LIST[1];
const ATTACHMENT_TAB = CONTRACT_DETAIL_TABS_LIST[2];
// 审批历史默认type
const DEFAULT_TYPE = APPROVAL_HISTORY_TYPE[0].key;

export default class ContractDetailModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    effects: PropTypes.object.isRequired,
    // 关闭弹窗
    closeModal: PropTypes.func.isRequired,
    // 弹窗状态
    visible: PropTypes.bool.isRequired,
    // 弹窗 KEY
    modalKey: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    queryContractTerms: PropTypes.func.isRequired,
    contractTerms: PropTypes.object.isRequired,
    queryApprovalHistory: PropTypes.func.isRequired,
    approvalHistory: PropTypes.object.isRequired,
    queryAttachmentList: PropTypes.func.isRequired,
    attachmentList: PropTypes.object.isRequired,
    clearData: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: DEFAULT_TAB.key,
    };
  }

  componentDidMount() {
    const {
      id,
      queryContractTerms,
    } = this.props;
    queryContractTerms({ id });
  }

  @autobind
  handleTabChange(key) {
    const {
      id,
      queryContractTerms,
      queryApprovalHistory,
      queryAttachmentList,
    } = this.props;
    let name = '';
    switch (key) {
      case DEFAULT_TAB.key:
        queryContractTerms({ id });
        name = DEFAULT_TAB.name;
        break;
      case HISTORY_TAB.key:
        queryApprovalHistory({
          id,
          type: DEFAULT_TYPE,
        });
        name = HISTORY_TAB.name;
        break;
      default:
        queryAttachmentList({ id });
        name = ATTACHMENT_TAB.name;
        break;
    }
    this.setState({
      activeKey: key,
    });
    logCommon({
      type: 'Click',
      payload: {
        name: `${name}tab`,
      },
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭合约详情弹框' } })
  handleCloseModal() {
    const {
      closeModal,
      modalKey,
    } = this.props;
    this.clearData();
    closeModal({ modalKey });
  }

  // 清除数据
  @autobind
  clearData() {
    const { clearData } = this.props;
    clearData({
      contractTerms: {},
      approvalHistory: {},
      attachmentList: {},
    });
  }

  render() {
    const {
      id,
      effects,
      visible,
      modalKey,
      contractTerms,
      approvalHistory,
      attachmentList,
      queryApprovalHistory,
    } = this.props;
    const { activeKey } = this.state;
    return (
      <CommonModal
        title="合约详情"
        visible={visible}
        closeModal={this.handleCloseModal}
        size="large"
        modalKey={modalKey}
        wrapClassName={styles.detailModal}
        showOkBtn={false}
        cancelText="关闭"
      >
        <div className={styles.modalContent}>
          <Tabs defaultActiveKey={activeKey} onChange={this.handleTabChange}>
            <TabPane
              tab={DEFAULT_TAB.name}
              key={DEFAULT_TAB.key}
            >
              <ContractTerms
                effect={effects.queryContractTerms}
                data={contractTerms}
              />
            </TabPane>
            <TabPane
              tab={HISTORY_TAB.name}
              key={HISTORY_TAB.key}
            >
              <ApprovalHistory
                id={id}
                data={approvalHistory}
                queryList={queryApprovalHistory}
                effect={effects.queryApprovalHistory}
              />
            </TabPane>
            <TabPane
              tab={ATTACHMENT_TAB.name}
              key={ATTACHMENT_TAB.key}
            >
              <AttachmentList data={attachmentList} />
            </TabPane>
          </Tabs>
        </div>
      </CommonModal>
    );
  }
}
