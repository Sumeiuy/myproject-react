/*
 * @Description: 通道类型协议详情页面
 * @Author: LiuJianShu
 * @Date: 2017-09-19 09:37:42
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-20 17:24:02
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
// import classnames from 'classnames';
// import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import ApproveList from '../common/approveList';
import styles from './detail.less';
import CommonUpload from '../common/biz/CommonUpload';
import CommonTable from '../common/biz/CommonTable';
import { seibelConfig } from '../../config';
import { dateFormat } from '../../utils/helper';

// 子类型列表
// const childTypeList = _.filter(seibelConfig.contract.subType, v => v.label !== '全部');
// const operationList = _.filter(seibelConfig.contract.operationList, v => v.label !== '全部');
// 协议产品的表头、状态
const {
    channelsTypeProtocol: {
      protocolProductTitleList, protocolClauseTitleList,
    },
  } = seibelConfig;
// const operationLabel = (value) => {
//   if (operationList && value) {
//     const nowStatus = _.find(operationList, o => o.value === value) || {};
//     return nowStatus.label || '无';
//   }
//   return '无';
// };
const EMPTY_PARAM = '暂无';
// 合约条款的表头、状态对应值
const { contract: { status } } = seibelConfig;
export default class Detail extends PureComponent {
  static propTypes = {
    protocolDetail: PropTypes.object.isRequired,
    attachmentList: PropTypes.array,
    uploadAttachment: PropTypes.func,
    showEditModal: PropTypes.func,
    flowHistory: PropTypes.array,
    hasEditPermission: PropTypes.bool,
  }

  static defaultProps = {
    baseInfo: {},
    attachmentList: [],
    flowHistory: [],
    uploadAttachment: () => {},
    showEditModal: () => {},
    hasEditPermission: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      // radio: 0,
      // statusType: 'ready',
      // terms: props.baseInfo.terms,
    };
  }

  // 处理接口返回的拟稿提请时间
  @autobind
  getCreatedDate(date) {
    if (date) {
      return `${dateFormat(date.split(' ')[0])} ${date.split(' ')[1]}`;
    }
    return EMPTY_PARAM;
  }

  render() {
    const {
      attachmentList,
      uploadAttachment,
      protocolDetail,
      flowHistory,
    } = this.props;
    // const { terms } = this.state;
    const uploadProps = {
      attachmentList,
      uploadAttachment,
      attachment: protocolDetail.attachment || '',
    };
    const nowStep = {
      // 当前步骤
      stepName: protocolDetail.workflowNode || EMPTY_PARAM,
      // 当前审批人
      handleName: protocolDetail.approver || EMPTY_PARAM,
    };
    const scroll = {
      x: true,
    };
    let statusLabel = '';
    if (protocolDetail.status) {
      statusLabel = status[Number(protocolDetail.status)].label;
    } else {
      statusLabel = '';
    }
    return (
      <div className={styles.detailComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号{protocolDetail.agreementNum}</span>
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="基本信息" />
          <InfoItem label="操作类型" value={protocolDetail.operationType || EMPTY_PARAM} />
          <InfoItem label="子类型" value={protocolDetail.subType || EMPTY_PARAM} />
          <InfoItem label="客户" value={`${(protocolDetail.contactName || protocolDetail.accountName) || EMPTY_PARAM} ${protocolDetail.econNum || EMPTY_PARAM}`} />
          <InfoItem label="协议模板" value={protocolDetail.templateName} />
          <InfoItem label="是否多账户使用" value={protocolDetail.multiUsedFlag} />
          <InfoItem label="是否订购十档行情" value={protocolDetail.levelTenFlag} />
          <InfoItem label="协议开始日期" value={dateFormat(protocolDetail.startDt) || EMPTY_PARAM} />
          <InfoItem label="合约有效期" value={dateFormat(protocolDetail.vailDt) || EMPTY_PARAM} />
          <InfoItem label="备注" value={protocolDetail.content || EMPTY_PARAM} />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="拟稿信息" />
          <InfoItem label="拟稿人" value={`${protocolDetail.divisionName || EMPTY_PARAM} ${protocolDetail.createdName || EMPTY_PARAM}`} />
          <InfoItem label="提请时间" value={this.getCreatedDate(protocolDetail.createdDt)} />
          <InfoItem label="状态" value={statusLabel || EMPTY_PARAM} />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="协议产品" />
          <CommonTable
            data={protocolDetail.item || []}
            titleList={protocolProductTitleList}
            scroll={scroll}
          />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="协议条款" />
          <CommonTable
            data={protocolDetail.term || []}
            titleList={protocolClauseTitleList}
          />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="附件信息" />
          <CommonUpload {...uploadProps} />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="审批记录" />
          <ApproveList data={flowHistory} nowStep={nowStep} />
        </div>
      </div>
    );
  }
}
