/*
 * @Author: wangyikai
 * @Date: 2018-11-19 16:20:49
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-26 10:38:27
 */
import React,{ PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import Table from '../common/table';
import styles from './businessHand.less';
import { number } from '../../helper';
import { openBusinessColumns, notOpenBusinessColumns } from './config';

const DATE_FORMAT = 'YYYY-MM-DD';
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

  constructor(props) {
    super(props);
    this.state = {};
  }

  @autobind
  notOpenRenderColumns() {
    return _.map( notOpenBusinessColumns, item=>{
      const { key } = item;
      let newItem = {...item};
      if( key === 'openConditions' ) {
        newItem = {
          ...item,
          render: ( text,record ) => {
            if( !_.isEmpty(record.businessType) ) {
              return text === true ? '是' : '否';
            }else {
              return null;
            }
          }
        };
      }
      return newItem;
    });
  }

  @autobind
  openRenderColumns() {
    return _.map(openBusinessColumns, item=>{
      const { dataIndex } = item;
      let newItem = {...item};
      if( dataIndex === 'openDate' || dataIndex === 'transactionDate') {
        newItem = {
          ...item,
          render: ( text,record ) => {
            if( !_.isEmpty(record.businessType) ) {
              return moment(text).format(DATE_FORMAT);
            }else {
              return null;
            }
          }
        };
      };
      if( dataIndex === 'blackList' ) {
        newItem = {
          ...item,
          render: ( text,record ) => {
            if( !_.isEmpty(record.businessType) ) {
              return text === true ? '是' : '否';
            }else {
              return null;
            }
          }
        };
      };
      if( dataIndex === 'standardAssets') {
        newItem = {
          ...item,
          render: (text,record) => {
            if( !_.isEmpty(record.businessType) ) {
              const newData = number.formatToUnit({
                num: text,
                isThousandFormat: true,
                floatLength: 2,
                isRound: false,
              });
              const newsData = newData.substring(0, newData.length-1);
              return newsData;
            }
          }
        };
      }
      return newItem;
    });
  }

  render() {
    const {
      openBusinessData,
      notOpenBusinessData,
    } = this.props;
    return (
      <div className={styles.tabsContainer}>
        <div className={styles.tabPaneWrap}>
          <div className={styles.accountDetailWrap}>
            <div className={styles.accountBlock}>
              <div className={styles.header}>
                <div className={styles.title}>已开通业务</div>
              </div>
              <div className={styles.openAccountTable}>
                <Table
                  pagination={false}
                  className={styles.tableBorder}
                  isNeedEmptyRow
                  dataSource={openBusinessData}
                  columns={this.openRenderColumns()}
                />
              </div>
            </div>
            <div className={styles.accountBlock}>
              <div className={styles.header}>
                <div className={styles.title}>未开通业务</div>
              </div>
              <div className={styles.noOpenAccountTable}>
                <Table
                  pagination={false}
                  className={styles.tableBorder}
                  isNeedEmptyRow
                  dataSource={notOpenBusinessData}
                  columns={this.notOpenRenderColumns()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
