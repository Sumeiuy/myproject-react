/*
 * @Author: zhangjun
 * @Date: 2018-06-09 21:45:26
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-11 17:53:51
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Select from '../common/Select';
import styles from './EditBasicInfo.less';

const EMPTY_INFO = '--';

export default class EditBasicInfo extends PureComponent {
  static propTypes = {
    // 客户基本信息
    custInfo: PropTypes.object.isRequired,
    // 客户Id和客户名称信息
    customer: PropTypes.string.isRequired,
    // 基本信息的多个select数据
    selectMapData: PropTypes.object.isRequired,
    getSelectMap: PropTypes.func.isRequired,
    // 流程Id
    flowId: PropTypes.string.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps === prevState) {
      return null;
    }
    return {
      selectMapData: nextProps.selectMapData,
      stockCustType: nextProps.stockCustType,
      reqType: nextProps.reqType,
      openOptMktCatg: nextProps.openOptMktCatg,
      busPrcDivId: nextProps.busPrcDivId,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: 10,
      stockCustType: '',
      reqType: '',
      openOptMktCatg: '',
      busPrcDivId: '',
      selectMapData: {
        stockCustTypeMap: [],
        reqTypeMap: [],
        klqqsclbMap: [],
        busDivisionMap: [],
      },
    };
  }

  // 选择客户类型
  @autobind
  updateStockCustType(value) {
    this.setState({ stockCustType: value });
  }

  // 选择申请类型
  @autobind
  updateReqType(value) {
    this.setState({ reqType: value });
  }

  // 选择开立期权市场类别
  @autobind
  updateOpenOptMktCatg(value) {
    this.setState({ openOptMktCatg: value });
  }

  // 选择业务受理营业部
  @autobind
  updateBusPrcDiv(value) {
    this.setState({ busPrcDivId: value });
  }

  render() {
    const {
      custInfo,
      custInfo: {
        divisionName,
        openDivName,
        idTypeName,
        idNum,
        isProfessInvset,
        aAcct,
        openSysName,
        custTransLvName,
        stockCustType,
        // stockCustTypeName,
        reqType,
        // reqTypeName,
        openOptMktCatg,
        // openOptMktCatgName,
        busPrcDivId,
        // busPrcDivName,
        accptTime,
        declareBus,
      },
    } = this.props;
    const {
      selectMapData: {
        stockCustTypeMap,
        reqTypeMap,
        klqqsclbMap,
        busDivisionMap,
      },
    } = this.state;
    let isProfessInvsetor = '';
    if (isProfessInvset) {
      isProfessInvsetor = isProfessInvset === 'Y' ? '是' : '否';
    }
    const isSelectDisabled = _.isEmpty(custInfo);
    return (
      <div className={styles.editBasicInfo}>
        <div className={styles.basicInfoWrapper}>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              所属营业部
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {divisionName || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              开户营业部
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {openDivName || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              证件类型
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {idTypeName || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              证件号码
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {idNum || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              是否专业投资者
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {isProfessInvsetor || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              上海A股账号
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {aAcct || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              开户系统
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {openSysName || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              客户交易级别
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {custTransLvName || EMPTY_INFO}
            </div>
          </div>
        </div>
        <div className={styles.basicInfo}>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              <i className={styles.isRequired}>*</i>
              客户类型
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value} >
              <Select
                name="stockCustType"
                data={stockCustTypeMap}
                disabled={isSelectDisabled}
                onChange={this.updateStockCustType}
                value={stockCustType || '请选择'}
              />
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              <i className={styles.isRequired}>*</i>
              申请类型
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              <Select
                name="reqType"
                data={reqTypeMap}
                disabled={isSelectDisabled}
                onChange={this.updateReqType}
                value={reqType || '请选择'}
              />
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              <i className={styles.isRequired}>*</i>
              开立期权市场类别
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              <Select
                name="openOptMktCatg"
                data={klqqsclbMap}
                disabled={isSelectDisabled}
                onChange={this.updateOpenOptMktCatg}
                value={openOptMktCatg || '请选择'}
              />
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              业务受理营业部
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              <Select
                name="busPrcDiv"
                data={busDivisionMap}
                disabled={isSelectDisabled}
                onChange={this.updateBusPrcDiv}
                value={busPrcDivId || '请选择'}
              />
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              受理时间
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value} >
              {accptTime || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>
              <i className={styles.isRequired}>*</i>
              申报事项
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value} >
              {declareBus || EMPTY_INFO}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
