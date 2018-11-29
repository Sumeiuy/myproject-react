/*
 * @Author: wangyikai
 * @Description: 客户360-业务办理
 * @Date: 2018-11-19 16:20:49
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-29 11:46:01
 */
import React,{ PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import Table from '../common/table';
import styles from './businessHand.less';
import IfTableWrap from '../common/IfTableWrap';
import { openBusinessColumns, notOpenBusinessColumns } from './config';

const DATE_FORMAT = 'YYYY-MM-DD';
const OPEN_CONDITIONS = 'openConditions';
const OPEN_DATAE = 'openDate';
const TRANSACTION_DATE = 'transactionDate';
const BLACK_LIST= 'blackList';
const STANDARD_ASSETS = 'standardAssets';
const DABIAO_ZICHAN = 10000;
const OPEN_NODATA_HINT = '暂无已开通业务';
const NOT_OPEN_NODATA_HINT = '暂无未开通业务';
export default class BusinessHand extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 业务办理下已开通业务数据
    openBusinessData: PropTypes.array.isRequired,
    // 业务办理下未开通业务数据
    notOpenBusinessData: PropTypes.array.isRequired,
    // 业务办理下未开通业务中的操作弹框数据
    operationData: PropTypes.array.isRequired,
    // 查询业务办理下已开通业务信息
    getOpenBusiness: PropTypes.func.isRequired,
    // 查询业务办理下未开通业务信息
    getNotOpenBusiness: PropTypes.func.isRequired,
    // 查询业务办理下未开通业务中的操作弹框信息
    getDetailOperation: PropTypes.func.isRequired,
  }

  @autobind
  renderNotOpenColumns() {
    const notOpenList = [...notOpenBusinessColumns];
    const custNameColumn = _.find(notOpenList, o => o.key === OPEN_CONDITIONS);
    custNameColumn.render = (text, record) => {
      if(!_.isEmpty(record.businessType)) {
        return text === true ? '是' : '否';
      }else {
        return null;
      }
    };
    return notOpenList;
  }

  @autobind
  renderOpenColumns() {
    const openList = [...openBusinessColumns];
    // 黑名单
    const blackColumn = _.find(openList, o => o.key === BLACK_LIST);
    blackColumn.render = (text, record) => {
      if(!_.isEmpty(record.businessType)) {
        return text === true ? '是' : '否';
      }else {
        return null;
      }
    };
    // 开通日期,首次交易日期
    const dateColumn = _.find(openList, o => o.key === OPEN_DATAE );
    dateColumn.render = (text, record) => {
      if(!_.isEmpty(record.businessType) && text!== null) {
        return moment(text).format(DATE_FORMAT);
      }else {
        return null;
      }
    };
    const transactionDateColumn = _.find(openList, o => o.key === TRANSACTION_DATE);
    transactionDateColumn.render = (text, record) => {
      if(!_.isEmpty(record.businessType) && text!== null) {
        return moment(text).format(DATE_FORMAT);
      }else {
        return null;
      }
    };
    // 达标资产
    const standardAssetsColumn = _.find(openList, o => o.key === STANDARD_ASSETS);
    standardAssetsColumn.render = (text, record) => {
      if(!_.isEmpty(record.businessType)) {
        const newTexts =(text/DABIAO_ZICHAN).toFixed(2);
        return (<span title={`${text}元`}>{newTexts}</span>);
      }
    };
    return openList;
  }

  render() {
    const {
      openBusinessData,
      notOpenBusinessData,
    } = this.props;
    const isRenderOpen = !_.isEmpty(openBusinessData);
    const isRenderNotOpen = !_.isEmpty(notOpenBusinessData);
    return (
      <div className={styles.tabsContainer}>
        <div className={styles.tabPaneWrap}>
          <div className={styles.accountDetailWrap}>
            <div className={styles.accountBlock}>
              <div className={styles.header}>
                <div className={styles.title}>已开通业务</div>
              </div>
              <IfTableWrap isRender={isRenderOpen} text={OPEN_NODATA_HINT}>
                <div className={styles.openAccountTable}>
                  <Table
                    pagination={false}
                    className={styles.tableBorder}
                    dataSource={openBusinessData}
                    columns={this.renderOpenColumns()}
                  />
                </div>
              </IfTableWrap>
            </div>
            <div className={styles.accountBlock}>
              <div className={styles.header}>
                <div className={styles.title}>未开通业务</div>
              </div>
              <IfTableWrap isRender={isRenderNotOpen} text={NOT_OPEN_NODATA_HINT}>
                <div className={styles.noOpenAccountTable}>
                  <Table
                    pagination={false}
                    className={styles.tableBorder}
                    dataSource={notOpenBusinessData}
                    columns={this.renderNotOpenColumns()}
                  />
                </div>
              </IfTableWrap>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
