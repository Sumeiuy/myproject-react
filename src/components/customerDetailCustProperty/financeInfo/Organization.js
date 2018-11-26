/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-财务信息-机构财务信息
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-20 16:14:02
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import InfoItem from '../../common/infoItem';
import IfWrap from '../../common/biz/IfWrap';
import BasicEditorCell from '../common/BasiceEditorCell';
import {
  // DEFAULT_VALUE,
  checkIsNeedTitle,
} from '../config';
import styles from './common.less';

const INFO_ITEM_WITDH_110 = '110px';
const INFO_ITEM_WITDH = '126px';
// const EMPTY_OBJECT = {};

// 总收入
const TOTAL_ASSETS_NAME  = 'totalAssets';
// 利润总额
const MASS_PROFIT_NAME  = 'massProfit';
// 净利润
const NET_MARGIN_NAME  = 'netMargin';

export default class Organization extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    customerBasicInfo: PropTypes.object.isRequired,
    // 是否主服务经理
    isMainEmp: PropTypes.bool,
    // 编辑机构客户的财务信息
    updateOrgFinaceData: PropTypes.func.isRequired,
    // 查询个人客户、机构客户的财务信息
    queryFinanceDetail: PropTypes.func.isRequired,
  }

  static defaultPropTypes = {
    isMainEmp: false,
  }

  // 主服务经理并且不是上市公司可以编辑
  @autobind
  checkIsEditable() {
    const {
      isMainEmp,
      data: {
        isQuoteComp,
      },
    } = this.props;
    // return isMainEmp && !isQuoteComp;
    return true;
  }

  @autobind
  updateData(name, value) {
    const {
      customerBasicInfo: {
        custNatrue,
      },
      location: {
        query: {
          custId,
        },
      },
      updateOrgFinaceData,
    } = this.props;
    return updateOrgFinaceData({
      custId,
      custNatrue,
      [name]: value,
    });
  }

  @autobind
  checkNormalValue(value) {
    if (_.isEmpty(value)) {
      return {
        validate: false,
        msg: '数据不能为空',
      };
    }
    return {
      validate: true,
      msg: '',
    };
  }

  @autobind
  getViewData(value) {
    return value;
  }

  @autobind
  refreshData() {
    const {
      location: {
        query: {
          custId,
        }
      },
      queryFinanceDetail,
    } = this.props;
    return queryFinanceDetail({ custId });
  }

  render() {
    const {
      data,
    } = this.props;
    return (
      <div className={styles.infoContainer}>
        <div className={styles.infoItemBox}>
          {
            this.checkIsEditable()
              ? (
                <BasicEditorCell
                  label="总资产"
                  width={INFO_ITEM_WITDH_110}
                  className={styles.infoItem}
                  editorId="total_assets"
                  onEditOK={value => this.updateData(TOTAL_ASSETS_NAME, value)}
                  value={data.totalAssets}
                  displayValue={data.totalAssets}
                  checkable
                  onCheck={this.checkNormalValue}
                  onSuccess={this.refreshData}
                />
              )
              : (
                <InfoItem
                  width={INFO_ITEM_WITDH_110}
                  label="总资产"
                  value={this.getViewData(data.totalAssets)}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.totalAssets))}
                  isNeedOverFlowEllipsis
                />
              )
          }
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="净资产"
            value={this.getViewData(data.netAsset)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.netAsset))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          {
            this.checkIsEditable()
              ? (
                <BasicEditorCell
                  label="利润总额"
                  width={INFO_ITEM_WITDH}
                  className={styles.infoItem}
                  editorId="mass_profit"
                  onEditOK={value => this.updateData(MASS_PROFIT_NAME, value)}
                  value={data.massProfit}
                  displayValue={data.massProfit}
                  checkable
                  onCheck={this.checkNormalValue}
                  onSuccess={this.refreshData}
                />
              )
              : (
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="利润总额"
                  value={this.getViewData(data.massProfit)}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.massProfit))}
                  isNeedOverFlowEllipsis
                />
              )
          }
        </div>
        <div className={styles.infoItemBox}>
          {
            this.checkIsEditable()
            ? (
              <BasicEditorCell
                label="净利润"
                width={INFO_ITEM_WITDH}
                className={styles.infoItem}
                editorId="net_margin"
                onEditOK={value => this.updateData(NET_MARGIN_NAME, value)}
                value={data.netMargin}
                displayValue={data.netMargin}
                checkable
                onCheck={this.checkNormalValue}
                onSuccess={this.refreshData}
              />
            )
            : (
              <InfoItem
                width={INFO_ITEM_WITDH}
                label="净利润"
                value={this.getViewData(data.netMargin)}
                className={styles.infoItem}
                isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.netMargin))}
                isNeedOverFlowEllipsis
              />
            )
          }
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH_110}
            label="企业负债"
            value={this.getViewData(data.enterpriseDebt)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.enterpriseDebt))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="年营业收入"
            value={this.getViewData(data.annualIncome)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.annualIncome))}
            isNeedOverFlowEllipsis
          />
        </div>
        <IfWrap isRender={!data.isQuoteComp}>
          <div className={styles.infoItemBoxHalf}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="证券账户总资产"
              value={this.getViewData(data.securityAssets)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.securityAssets))}
              isNeedOverFlowEllipsis
            />
          </div>
        </IfWrap>
        <div className={styles.latestTime}>
          近期风险承受能力评估问卷日期：{data.latestSurveyTime}
        </div>
      </div>
    );
  }
}
