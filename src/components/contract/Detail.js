/*
 * @Description: 合作合约详情页面
 * @Author: LiuJianShu
 * @Date: 2017-09-19 09:37:42
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-24 18:59:08
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
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
const operationList = _.filter(seibelConfig.contract.operationList, v => v.label !== '全部');
const operationLabel = (value) => {
  if (operationList && value) {
    const nowStatus = _.find(operationList, o => o.value === value) || {};
    return nowStatus.label || '无';
  }
  return '无';
};
const EMPTY_PARAM = '暂无';
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
    hasEditPermission: PropTypes.bool,
  }

  static defaultProps = {
    baseInfo: {},
    attachmentList: [],
    flowHistory: [],
    uploadAttachment: () => {},
    showEditModal: () => {},
    operationType: '',
    hasEditPermission: false,
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
      baseInfo,
      attachmentList,
      uploadAttachment,
      showEditModal,
      flowHistory,
      operationType,
      hasEditPermission,
    } = this.props;
    const { terms } = this.state;
    const modifyBtnClass = classnames([styles.dcHeaderModifyBtn,
      { hide: this.state.statusType !== 'ready' },
    ]);
    const uploadProps = {
      attachmentList,
      uploadAttachment,
      attachment: baseInfo.attachment || '',
    };
    const nowStep = {
      // 当前步骤
      stepName: baseInfo.workflowNode || EMPTY_PARAM,
      // 当前审批人
      handleName: baseInfo.approver || EMPTY_PARAM,
    };
    let statusLabel = '';
    if (baseInfo.status) {
      statusLabel = status[Number(baseInfo.status)].label;
    } else {
      statusLabel = '';
    }
    // 表格中需要的操作--测试数据
    // const operation = {
    //   column: {
    //     // beizhu = edit , shanchu = delete
    //     key: [
    //       {
    //         key: 'beizhu',
    //         operate: this.editTableData,
    //       },
    //       {
    //         key: 'shanchu',
    //         operate: this.deleteTableData,
    //       },
    //     ], // 'check'\'delete'\'view'
    //     title: '操作',
    //   },
    // };
    return (
      <div className={styles.detailComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号{baseInfo.contractNum}</span>
          {
            hasEditPermission ?
              <span
                onClick={showEditModal}
                className={modifyBtnClass}
              >修改</span>
            :
              null
          }
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="基本信息" />
          <InfoItem label="操作类型" value={operationLabel(operationType) || EMPTY_PARAM} />
          <InfoItem label="子类型" value={childTypeList[0].label || EMPTY_PARAM} />
          <InfoItem label="客户" value={`${baseInfo.custName || EMPTY_PARAM} ${baseInfo.econNum || EMPTY_PARAM}`} />
          <InfoItem label="合约开始日期" value={dateFormat(baseInfo.startDt) || EMPTY_PARAM} />
          <InfoItem label="合约有效期" value={dateFormat(baseInfo.vailDt) || EMPTY_PARAM} />
          <InfoItem label="备注" value={baseInfo.description || EMPTY_PARAM} />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="拟稿信息" />
          <InfoItem label="拟稿人" value={`${baseInfo.divisionName || EMPTY_PARAM} ${baseInfo.createdName || EMPTY_PARAM}`} />
          <InfoItem label="提请时间" value={this.getCreatedDate(baseInfo.createdDt)} />
          <InfoItem label="状态" value={statusLabel || EMPTY_PARAM} />
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
