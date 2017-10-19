/*
 * @Description: 合作合约详情页面
 * @Author: LiuJianShu
 * @Date: 2017-09-19 09:37:42
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-19 15:44:12
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import ApproveList from '../common/approveList';
import styles from './detail.less';
import CommonUpload from '../common/biz/CommonUpload';
import CommonTable from '../common/biz/CommonTable';
import { seibelConfig } from '../../config';
import { dateFormat } from '../../utils/helper';

// 子类型列表
const childTypeList = _.filter(seibelConfig.contract.subType, v => v.label !== '全部');
// 合约条款的表头、状态对应值
const { contract: { titleList, status } } = seibelConfig;
export default class Detail extends PureComponent {
  static propTypes = {
    baseInfo: PropTypes.object,
    attachmentList: PropTypes.array,
    uploadAttachment: PropTypes.func,
    showEditModal: PropTypes.func,
    flowHistory: PropTypes.array,
    operationType: PropTypes.string,
    createTime: PropTypes.string,
  }

  static defaultProps = {
    baseInfo: {},
    attachmentList: [],
    flowHistory: [],
    uploadAttachment: () => {},
    showEditModal: () => {},
    operationType: '',
    createTime: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      radio: 0,
      statusType: 'ready',
      terms: props.baseInfo.terms,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { baseInfo: preBI } = this.props;
    const { baseInfo: nextBI } = nextProps;
    if (!_.isEqual(preBI, nextBI)) {
      this.setState({
        terms: nextBI.terms,
      });
    }
  }

  render() {
    const {
      baseInfo,
      attachmentList,
      uploadAttachment,
      showEditModal,
      flowHistory,
      operationType,
      createTime,
    } = this.props;
    const { terms } = this.state;
    const modifyBtnClass = classnames([styles.dcHeaderModifyBtn,
      { hide: this.state.statusType !== 'ready' },
    ]);
    const uploadProps = {
      attachmentList,
      uploadAttachment,
      edit: true,
      attachment: baseInfo.attachment || '',
    };
    const nowStep = {
      // 当前步骤
      stepName: baseInfo.workflowNode,
      // 当前审批人
      userName: baseInfo.workflowName,
    };
    let statusLabel = '';
    if (typeof (baseInfo.status) === 'number') {
      statusLabel = status[Number(baseInfo.status)].label;
    } else {
      statusLabel = '';
    }
    return (
      <div className={styles.detailComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号{baseInfo.contractNum}</span>
          <span
            onClick={showEditModal}
            className={modifyBtnClass}
          >修改</span>
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="基本信息" />
          <InfoItem label="操作类型" value={operationType} />
          <InfoItem label="子类型" value={childTypeList[0].label} />
          <InfoItem label="客户" value={`${baseInfo.custName} ${baseInfo.econNum || ''}`} />
          <InfoItem label="合约开始日期" value={dateFormat(baseInfo.startDt)} />
          <InfoItem label="合约有效期" value={dateFormat(baseInfo.vailDt)} />
          <InfoItem label="合约终止日期" value={dateFormat(baseInfo.endDt)} />
          <InfoItem label="备注" value={baseInfo.description} />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="拟稿信息" />
          <InfoItem label="拟稿人" value={`${baseInfo.divisionName} ${baseInfo.createdName}`} />
          <InfoItem label="提请时间" value={createTime} />
          <InfoItem label="状态" value={statusLabel} />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="合约条款" />
          <CommonTable
            data={terms || []}
            titleList={titleList}
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
