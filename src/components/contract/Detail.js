/*
 * @Description: 合作合约详情页面
 * @Author: LiuJianShu
 * @Date: 2017-09-19 09:37:42
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-26 09:28:26
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import ApproveList from '../common/approveList';
import styles from './detail.less';
import CommonUpload from '../common/biz/CommonUpload';
import CommonTable from '../common/biz/CommonTable';

export default class Detail extends PureComponent {
  static propTypes = {
    baseInfo: PropTypes.object,
    attachmentList: PropTypes.array,
    deleteAttachment: PropTypes.func,
    uploadAttachment: PropTypes.func,
  }

  static defaultProps = {
    baseInfo: {},
    attachmentList: [],
    deleteAttachment: () => {},
    uploadAttachment: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      radio: 0,
    };
  }

  // 表格删除事件
  @autobind
  deleteTableData(record, index) {
    console.warn('record', record);
    console.warn('index', index);
    this.setState({
      radio: index,
    });
  }

  render() {
    const { baseInfo, attachmentList, deleteAttachment, uploadAttachment } = this.props;
    const modifyBtnClass = classnames([styles.dcHeaderModifyBtn,
      { hide: this.state.statusType !== 'ready' },
    ]);
    const uploadProps = {
      attachmentList,
      edit: true,
      deleteAttachment,
      uploadAttachment,
      attachment: baseInfo.attachment || '',
    };

    const titleList = [
      {
        dataIndex: 'termsName',
        key: 'termsName',
        title: '条款名称',
      },
      {
        dataIndex: 'paraName',
        key: 'paraName',
        title: '明细参数',
      },
      {
        dataIndex: 'paraVal',
        key: 'paraVal',
        title: '值',
      },
      {
        dataIndex: 'divName',
        key: 'divName',
        title: '合作部门',
      },
    ];
    // 表格中需要的操作
    // const operation = {
    //   column: {
    //     key: 'radio', // 'check'\'delete'\'view'
    //     title: '',
    //     radio, // radio 仅在 key: radio 时需要
    //   },
    //   operate: this.deleteTableData,
    // };
    return (
      <div className={styles.detailComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号</span>
          <span
            onClick={() => { this.setState({ statusType: 'modify' }); }}
            className={modifyBtnClass}
          >修改</span>
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="基本信息" />
          <InfoItem label="操作类型" value="这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值" />
          <InfoItem label="子类型" value="私密客户交易信息权限分配" />
          <InfoItem label="客户" value="张三 123456" />
          <InfoItem label="合约开始日期" value="2017/08/31" />
          <InfoItem label="合约有效期" value="2018/05/31" />
          <InfoItem label="合约终止日期" value="2018/05/31" />
          <InfoItem label="备注" value="这里是合约内容" />
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
            data={baseInfo.terms}
            titleList={titleList}
          />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="附件信息" />
          <CommonUpload {...uploadProps} />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="审批记录" />
          <ApproveList />
        </div>
      </div>
    );
  }
}
