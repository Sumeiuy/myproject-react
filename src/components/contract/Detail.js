/*
 * @Description: 合作合约详情页面
 * @Author: LiuJianShu
 * @Date: 2017-09-19 09:37:42
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-10 13:49:17
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
// import moment from 'moment';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import ApproveList from '../common/approveList';
import styles from './detail.less';
import CommonUpload from '../common/biz/CommonUpload';
import CommonTable from '../common/biz/CommonTable';
import { seibelConfig } from '../../config';

// 合约条款的表头
const { contract: { titleList } } = seibelConfig;
export default class Detail extends PureComponent {
  static propTypes = {
    baseInfo: PropTypes.object,
    attachmentList: PropTypes.array,
    uploadAttachment: PropTypes.func,
    showEditModal: PropTypes.func,
    flowHistory: PropTypes.array,
    operationType: PropTypes.string,
  }

  static defaultProps = {
    baseInfo: {},
    attachmentList: [],
    flowHistory: [],
    uploadAttachment: () => {},
    showEditModal: () => {},
    operationType: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      radio: 0,
      statusType: 'ready',
    };
  }

  // 表格删除事件
  @autobind
  deleteTableData(record, index) {
    this.setState({
      radio: index,
    });
  }

  render() {
    const {
      baseInfo,
      attachmentList,
      uploadAttachment,
      showEditModal,
      flowHistory,
      operationType,
    } = this.props;
    const modifyBtnClass = classnames([styles.dcHeaderModifyBtn,
      { hide: this.state.statusType !== 'ready' },
    ]);
    const uploadProps = {
      attachmentList,
      edit: true,
      uploadAttachment,
      attachment: baseInfo.attachment || '',
    };
    const nowStep = {
      stepName: baseInfo.workflowName,
      userName: baseInfo.workflowName,
    };
    // 表格中需要的操作
    // const operation = {
    //   column: {
    //     key: 'delete', // 'check'\'delete'\'view'
    //     title: '',
    //   },
    //   operate: this.deleteTableData,
    // };
    return (
      <div className={styles.detailComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号</span>
          <span
            onClick={showEditModal}
            className={modifyBtnClass}
          >修改</span>
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="基本信息" />
          <InfoItem label="操作类型" value={operationType} />
          <InfoItem label="子类型" value="私密客户交易信息权限分配" />
          <InfoItem label="客户" value={`${baseInfo.custName} ${baseInfo.custId}`} />
          <InfoItem label="合约开始日期" value="2018/05/31" />
          <InfoItem label="合约有效期" value="2018/05/31" />
          <InfoItem label="合约终止日期" value="2018/05/31" />
          <InfoItem label="备注" value="这里是备注内容" />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="拟稿信息" />
          <InfoItem label="拟稿人" value="南京分公司长江路营业部-李四（001654321）" />
          <InfoItem label="提请时间" value="2017/08/31" />
          <InfoItem label="状态" value="已完成" />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="合约条款" />
          <CommonTable
            data={baseInfo.terms || []}
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
