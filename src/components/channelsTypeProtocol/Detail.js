/*
 * @Description: 通道类型协议详情页面
 * @Author: LiuJianShu
 * @Date: 2017-09-19 09:37:42
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-11-07 16:12:55
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import ApproveList from '../common/approveList';
import styles from './detail.less';
import MultiUploader from '../common/biz/MultiUploader';
import CommonTable from '../common/biz/CommonTable';
import { seibelConfig } from '../../config';
import { dateFormat } from '../../utils/helper';

const {
  underCustTitleList,  // 下挂客户表头集合
  protocolClauseTitleList,  // 协议条款表头集合
  protocolProductTitleList,  // 协议产品表头集合
} = seibelConfig.channelsTypeProtocol;

const EMPTY_PARAM = '暂无';
// const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
// bool MAP数据
const mapBoolData = {
  Y: '是',
  N: '否',
};
// 合约条款的表头、状态对应值
const { contract: { status } } = seibelConfig;
export default class Detail extends PureComponent {
  static propTypes = {
    protocolDetail: PropTypes.object.isRequired,
    flowHistory: PropTypes.array.isRequired,
    attachmentList: PropTypes.array,
    // showEditModal: PropTypes.func,
    // hasEditPermission: PropTypes.bool,
  }

  static defaultProps = {
    attachmentList: EMPTY_ARRAY,
    flowHistory: EMPTY_ARRAY,
    uploadAttachment: () => {},
    // showEditModal: () => {},
    // hasEditPermission: false,
  }

  // 处理接口返回的拟稿提请时间
  @autobind
  getCreatedDate(date) {
    if (date) {
      return `${dateFormat(date.split(' ')[0])} ${date.split(' ')[1]}`;
    }
    return EMPTY_PARAM;
  }

  @autobind
  changeEdit() {
    this.setState({
      edit: true,
    });
  }

  render() {
    const {
      protocolDetail,
      flowHistory,
      attachmentList,
      // showEditModal,
      // hasEditPermission,
    } = this.props;
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
          <span className={styles.dcHaderNumb}>编号{protocolDetail.appId}</span>
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="基本信息" />
          <InfoItem label="操作类型" value={protocolDetail.operationType || EMPTY_PARAM} />
          <InfoItem label="子类型" value={protocolDetail.subType || EMPTY_PARAM} />
          <InfoItem label="客户" value={`${(protocolDetail.contactName || protocolDetail.accountName) || EMPTY_PARAM} ${protocolDetail.econNum || EMPTY_PARAM}`} />
          <InfoItem label="协议模板" value={protocolDetail.templateId} />
          <InfoItem label="是否多账户使用" value={mapBoolData[protocolDetail.multiUsedFlag]} />
          <InfoItem label="是否订购十档行情" value={mapBoolData[protocolDetail.levelTenFlag]} />
          <InfoItem label="协议开始日期" value={dateFormat(protocolDetail.startDt) || EMPTY_PARAM} />
          <InfoItem label="协议有效期" value={dateFormat(protocolDetail.vailDt) || EMPTY_PARAM} />
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
            data={protocolDetail.term || EMPTY_ARRAY}
            titleList={protocolClauseTitleList}
          />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="下挂客户" />
          <CommonTable
            data={protocolDetail.cust}
            titleList={underCustTitleList}
          />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="附件信息" />
          {
            attachmentList.map(item => (<MultiUploader
              attachmentList={item.attachmentList}
              attachment={''}
              title={item.title}
              key={`${protocolDetail.id}${item.title}`}
            />))
          }
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="审批记录" />
          <ApproveList data={flowHistory} nowStep={nowStep} />
        </div>
      </div>
    );
  }
}
