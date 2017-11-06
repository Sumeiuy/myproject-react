/**
 * @Author: sunweibin
 * @Date: 2017-11-04 13:37:00
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-06 15:42:39
 * @description 单佣金申请内容区域
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { Input, Icon, message } from 'antd';
// import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
// import AutoComplete from '../common/AutoComplete';
// import CommissionLine from './CommissionLine';
import CommonUpload from '../common/biz/CommonUpload';
// import Transfer from '../common/biz/TableTransfer';
// import ThreeMatchTip from './ThreeMatchTip';
// import OtherCommissionSelectList from './OtherCommissionSelectList';
// import { seibelConfig } from '../../config';
// import {
//   pagination,
//   singleColumns,
// } from './commissionTransferHelper/transferPropsHelper';
// import { allCommissionParamName as otherComs } from '../../config/otherCommissionDictionary';
import styles from './createNewApprovalBoard.less';

// const permil =
// (<span style={{ fontSize: '14px',
//  color: '#9b9b9b', lineHeight: '26px', paddingLeft: '4px' }} > ‰ </span>);
// const { comsubs: commadj } = seibelConfig;

export default class SingleCreateBoard extends PureComponent {
  static propTypes = {
    // 客户
    customer: PropTypes.object,
    // 佣金产品列表
    productList: PropTypes.array.isRequired,
    // 查询3匹配信息
    query3Match: PropTypes.func.isRequired,
  }

  static defaultProps = {
    customer: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      // 佣金调整的目标股基佣金率
      newCommission: '',
      // 用户选择的产品以及子产品
      userProductList: [],
      // 目标股基佣金率与用户所选的产品列表佣金率总和的差值
      dValue: 0,
      // 附件信息id
      attachment: '',
    };
  }

  // 单佣金调整穿梭变化的时候处理程序
  @autobind
  handleSingleTransferChange(flag, item, array, dValue) {
    this.setState({
      userProductList: array,
      dValue,
    });
    if (flag === 'add') {
      // 如果是左侧列表添加到右侧列表,则需要查询三匹配信息
      const { prodCode } = item;
      const { customer } = this.props;
      this.props.query3Match({
        custRowId: customer.id,
        custType: customer.custType,
        prdCode: prodCode,
      });
    }
  }

  // 单佣金调整选择子产品的时候的处理程序
  @autobind
  handleSingleTransferSubProductCheck(item, array) {
    this.setState({
      userProductList: array,
    });
  }

  // 附件上传成功后的回调
  @autobind
  uploadCallBack(attachment) {
    this.setState({
      attachment,
    });
  }

  render() {
    // const {
    //   productList,
    // } = this.props;
    // const {
    //   newCommission,
    // } = this.state;
    // 单佣金调整中的产品选择配置
    // const singleTransferProps = {
    //   firstTitle: '可选佣金产品',
    //   secondTitle: '已选产品',
    //   firstData: productList,
    //   secondData: [],
    //   firstColumns: singleColumns,
    //   secondColumns: singleColumns,
    //   transferChange: this.handleSingleTransferChange,
    //   checkChange: this.handleSingleTransferSubProductCheck,
    //   rowKey: 'id',
    //   defaultCheckKey: 'xDefaultOpenFlag',
    //   placeholder: '产品代码/产品名称',
    //   pagination,
    //   aboutRate: [newCommission, 'prodRate'],
    //   supportSearchKey: [['prodCode'], ['prodName']],
    //   totalData: productList,
    // };

    // 附件上传配置项
    const uploadProps = {
      // 可上传，可编辑
      edit: true,
      attachmentList: [],
      // 上传成功callback
      uploadAttachment: this.uploadCallBack,
      // 附件Id
      attachment: '',
      needDefaultText: false,
    };

    return (
      <div className={styles.newApprovalBox}>
        {/* 佣金产品 */}
        {/*
        <div className={styles.approvalBlock}>
          <InfoTitle head="佣金产品选择" />
          <CommissionLine label="目标股基佣金率" labelWidth="110px" needInputBox={false} extra={permil}>
            <AutoComplete
              dataSource={singleGJCommission}
              onChangeValue={this.changeTargetGJCommission}
              onSelectValue={this.selectTargetGJCommission}
              width="100px"
            />
          </CommissionLine>
          <Transfer {...singleTransferProps} />
          <ThreeMatchTip info={threeMatchInfo} />
        </div>
        */}
        {/* 其他佣金费率 */}
        {/*
        <div className={styles.approvalBlock}>
          <InfoTitle head="其他佣金费率" />
          <OtherCommissionSelectList
            showTip={!this.judgeSubtypeNow(commadj.batch)}
            reset={otherComReset}
            otherRatios={singleOtherRatio}
            onChange={this.changeOtherCommission}
            custOpenRzrq={openRzrq}
            subType={commadj.single}
          />
        </div>
        */}
        {/* 附件信息 */}
        <div className={styles.approvalBlock}>
          <InfoTitle head="附件信息" />
          <CommonUpload {...uploadProps} />
        </div>
        {/* 审批人  */}
        {/*
        <div className={styles.approvalBlock}>
          <InfoTitle head="审批人" />
          <CommissionLine label="选择审批人" labelWidth="110px">
            <div className={styles.checkApprover} onClick={this.openApproverBoard}>
              {approverName === '' ? '' : `${approverName}(${approverId})`}
              <div className={styles.searchIcon}>
                <Icon type="search" />
              </div>
            </div>
          </CommissionLine>
        </div>
        */}
      </div>
    );
  }
}
