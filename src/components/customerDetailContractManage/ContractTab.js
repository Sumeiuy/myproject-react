/**
 * @Description: 合约管理-合约 tab
 * @Author: Liujianshu-K0240007
 * @Date: 2018-12-04 13:35:48
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-12-05 15:12:47
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import classnames from 'classnames';

import Table from '../common/table';
import Tooltip from '../common/Tooltip';
import IfTableWrap from '../common/IfTableWrap';
import IfWrap from '../common/biz/IfWrap';
import { logPV } from '../../decorators/logable';
import ContractDetailModal from './ContractDetailModal';
import {
  CONTRACT_COLUMNS,
  FORMAT_TIME,
  FORMAT_TIME_ALL,
  DEFAULT_TEXT,
} from './config';
import styles from './protocolTab.less';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

const KEY_ID = 'id';
const KEY_CREATOR_NAME = 'creatorName';
const KEY_CREATE_TIME = 'createTime';

// 详情弹窗
const detailModalKey = 'detailModal';

export default class ContractTab extends PureComponent {
  static propTypes = {
    effects: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object,
    data: PropTypes.object.isRequired,
    queryList: PropTypes.func.isRequired,
    queryContractTerms: PropTypes.func.isRequired,
    contractTerms: PropTypes.object.isRequired,
    queryApprovalHistory: PropTypes.func.isRequired,
    approvalHistory: PropTypes.object.isRequired,
    queryAttachmentList: PropTypes.func.isRequired,
    attachmentList: PropTypes.object.isRequired,
    clearData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    empInfo: EMPTY_OBJECT,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      detailModal: false,
    };
  }

  componentDidMount() {
    const {
      queryList,
      location: { query: { custId } }
    } = this.props;
    queryList({
      custId,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        query: prevQuery,
        query: {
          custId: prevCustId = '',
        },
      },
    } = prevProps;
    const {
      location: {
        query,
        query: {
          custId = '',
        },
      },
      queryList,
    } = this.props;
    if (!_.isEqual(prevCustId, custId)) {
      queryList({
        custId,
      });
    }
    if (!_.isEqual(prevQuery, query)) {
      this.closeModal({ modalKey: detailModalKey });
    }
  }

  @autobind
  getContractColumns() {
    const newList = [...CONTRACT_COLUMNS];
    // 编号
    const idColumn = _.find(newList, o => o.key === KEY_ID);
    idColumn.render = text => this.renderIdColumn(text);
    // 创建时间
    const timeColumn = _.find(newList, o => o.key === KEY_CREATE_TIME);
    timeColumn.render = text => this.renderTimeTooltipColumn(text);
    // 创建者
    const creatorColumn = _.find(newList, o => o.key === KEY_CREATOR_NAME);
    creatorColumn.render = (text, record) => this.renderCreatorColumn(text, record);
  }

  // 关闭弹窗
  @autobind
  closeModal(obj) {
    const { modalKey } = obj;
    this.setState({
      [modalKey]: false,
    });
  }

  @autobind
  @logPV({
    pathname: '/modal/contractManage/contractDetail',
    title: '打开合约详情弹窗'
  })
  handleIdClick(text) {
    this.setState({
      id: text,
      detailModal: true,
    });
  }

  // 渲染创建者
  @autobind
  renderCreatorColumn(text = '', record = {}) {
    const showValue = !_.isEmpty(text) ? `${text} (${record.creatorId || ''})` : null;
    return (
      <div>
        {showValue}
      </div>
    );
  }

  // 渲染 time tooltip 列
  @autobind
  renderTimeTooltipColumn(text) {
    if (!_.isEmpty(text)) {
      return (
        <Tooltip title={moment(text).format(FORMAT_TIME_ALL)}>
          {moment(text).format(FORMAT_TIME)}
        </Tooltip>
      );
    }
    return DEFAULT_TEXT;
  }

  @autobind
  renderIdColumn(text) {
    const idClass = classnames({
      [styles.ellipsis]: true,
      [styles.idWrap]: true,
    });
    return (
      <Tooltip title={text}>
        <div
          onClick={() => this.handleIdClick(text)}
          className={idClass}
        >
          {text}
        </div>
      </Tooltip>
    );
  }


  render() {
    const {
      location,
      data: { list = EMPTY_ARRAY },
      queryContractTerms,
      contractTerms,
      queryApprovalHistory,
      approvalHistory,
      queryAttachmentList,
      attachmentList,
      effects,
      clearData,
    } = this.props;
    const {
      id,
      detailModal,
    } = this.state;
    const isRender = !_.isEmpty(list);
    const titleList = this.getContractColumns();
    return (
      <div className={styles.protocolTab}>
        <IfTableWrap isRender={isRender} text="暂无合约信息">
          <Table
            columns={titleList}
            dataSource={list}
            rowKey="id"
            pagination={false}
          />
        </IfTableWrap>
        <IfWrap isRender={detailModal}>
          <ContractDetailModal
            location={location}
            id={id}
            effects={effects}
            modalKey={detailModalKey}
            visible={detailModal}
            closeModal={this.closeModal}
            queryContractTerms={queryContractTerms}
            contractTerms={contractTerms}
            queryApprovalHistory={queryApprovalHistory}
            approvalHistory={approvalHistory}
            queryAttachmentList={queryAttachmentList}
            attachmentList={attachmentList}
            clearData={clearData}
          />
        </IfWrap>
      </div>
    );
  }
}
