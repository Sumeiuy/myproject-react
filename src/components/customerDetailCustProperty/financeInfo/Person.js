/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-财务信息-个人财务信息
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-20 16:46:39
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import InfoItem from '../../common/infoItem';
import BasicEditorCell from '../common/BasiceEditorCell';
import { number } from '../../../helper';
import {
  DEFAULT_VALUE,
  checkIsNeedTitle,
  FINCE_REG,
} from '../config';
import styles from './common.less';

const INFO_ITEM_WITDH_110 = '110px';
const INFO_ITEM_WITDH = '126px';
const MAX_STRING_LENGTH = 30;
// const EMPTY_OBJECT = {};
// 收入水平
const INCOME_NAME  = 'income';
// 房产规模
const HOUSE_SIEZ_NAME  = 'housingSize';
// 银行理财规模
const BANK_MONEY_NAME  = 'bankMoneyScale';
// 保险类资产规模
const INSURED_ASSETS_NAME  = 'insuredAssetsScale';
// 其他资产规模
const OTHER_ASSEST_NAME  = 'otherAssetsScale';
// 投入成本收益率
const YIELD_RATE_NAME  = 'yieldRate';

export default class Person extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    customerBasicInfo: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    // 是否主服务经理
    isMainEmp: PropTypes.bool,
    // 查询个人客户、机构客户的财务信息
    queryFinanceDetail: PropTypes.func.isRequired,
    // 编辑个人客户的财务信息
    updatePerFinaceData: PropTypes.func.isRequired,
  }

  static defaultPropTypes = {
    isMainEmp: false,
  }

  @autobind
  getViewDataByNum(value) {
    return _.isNumber(value) ? number.thousandFormat(value) : DEFAULT_VALUE;
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
    queryFinanceDetail({ custId });
  }

  // 主服务经理并且不是上市公司可以编辑
  @autobind
  checkIsEditable() {
    const { isMainEmp } = this.props;
    // return isMainEmp;
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
      updatePerFinaceData,
    } = this.props;
    return updatePerFinaceData({
      custId,
      custNatrue,
      [name]: value,
    });
  }

  @autobind
  checkNormalValue(value) {
    if (_.isEmpty(value) && !_.isNumber(value)) {
      return {
        validate: false,
        msg: '数据不能为空',
      };
    }
    if (value.length > MAX_STRING_LENGTH) {
      return {
        validate: false,
        msg: '长度不能超过30',
      };
    }
    return {
      validate: true,
      msg: '',
    };
  }

  @autobind
  getYieldValue(value) {
    return _.isEmpty(value) ? '' : `${number.toFixed(value)}%`;
  }

  @autobind
  checkYieldValue(value) {
    if (_.isEmpty(value) && !_.isNumber(value)) {
      return {
        validate: false,
        msg: '数据不能为空',
      };
    }
    if (!FINCE_REG.test(value)) {
      return {
        validate: false,
        msg: '请输入合法的数据',
      };
    }
    return {
      validate: true,
      msg: '',
    };
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
                  label="收入水平"
                  width={INFO_ITEM_WITDH_110}
                  className={styles.infoItem}
                  editorId="person_income"
                  onEditOK={value => this.updateData(INCOME_NAME, value)}
                  value={data.income || ''}
                  displayValue={data.income || ''}
                  checkable
                  onCheck={this.checkNormalValue}
                  onSuccess={this.refreshData}
                />
              )
              : (
                <InfoItem
                  width={INFO_ITEM_WITDH_110}
                  label="收入水平"
                  value={data.income || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.income)}
                  isNeedOverFlowEllipsis
                />
              )
          }
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="收入来源"
            value={data.source || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.source)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="家庭年收入"
            value={data.householdIncome || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.householdIncome)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="负债情况"
            value={data.liabilities || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.liabilities)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH_110}
            label="可投资资产"
            value={data.investableAssets || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.investableAssets)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="可投资资产占比"
            value={this.getViewDataByNum(data.investableAssetsCycle)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewDataByNum(data.investableAssetsCycle))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          {
            this.checkIsEditable()
              ? (
                <BasicEditorCell
                  label="房产规模"
                  width={INFO_ITEM_WITDH}
                  className={styles.infoItem}
                  editorId="person_housingSize"
                  onEditOK={value => this.updateData(HOUSE_SIEZ_NAME, value)}
                  value={data.housingSize || ''}
                  displayValue={data.housingSize || ''}
                  checkable
                  onCheck={this.checkNormalValue}
                  onSuccess={this.refreshData}
                />
              )
              : (
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="房产规模"
                  value={data.housingSize || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.housingSize)}
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
                  label="银行理财规模"
                  width={INFO_ITEM_WITDH}
                  className={styles.infoItem}
                  editorId="person_bank_scale"
                  onEditOK={value => this.updateData(BANK_MONEY_NAME, value)}
                  value={data.bankMoneyScale || ''}
                  displayValue={data.bankMoneyScale || ''}
                  checkable
                  onCheck={this.checkNormalValue}
                  onSuccess={this.refreshData}
                />
              )
              : (
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="银行理财规模"
                  value={data.bankMoneyScale || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.bankMoneyScale)}
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
                  label="保险类资产规模"
                  width={INFO_ITEM_WITDH_110}
                  className={styles.infoItem}
                  editorId="person_insured"
                  onEditOK={value => this.updateData(INSURED_ASSETS_NAME, value)}
                  value={data.insuredAssetsScale || ''}
                  displayValue={data.insuredAssetsScale || ''}
                  checkable
                  onCheck={this.checkNormalValue}
                  onSuccess={this.refreshData}
                />
              )
              : (
                <InfoItem
                  width={INFO_ITEM_WITDH_110}
                  label="保险类资产规模"
                  value={data.insuredAssetsScale || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.insuredAssetsScale)}
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
                  label="其他资产规模"
                  width={INFO_ITEM_WITDH}
                  className={styles.infoItem}
                  editorId="person_insured"
                  onEditOK={value => this.updateData(OTHER_ASSEST_NAME, value)}
                  value={data.otherAssetsScale || ''}
                  displayValue={data.otherAssetsScale || ''}
                  checkable
                  onCheck={this.checkNormalValue}
                  onSuccess={this.refreshData}
                />
              )
              : (
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="其他资产规模"
                  value={data.otherAssetsScale || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.otherAssetsScale)}
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
                  label="投入成本收益率%"
                  width={INFO_ITEM_WITDH}
                  className={styles.infoItem}
                  editorId="person_insured"
                  onEditOK={value => this.updateData(YIELD_RATE_NAME, value)}
                  value={data.yieldRate || ''}
                  displayValue={this.getYieldValue(data.yieldRate)}
                  checkable
                  onCheck={this.checkYieldValue}
                  onSuccess={this.refreshData}
                />
              )
              : (
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="投入成本收益率"
                  value={this.getYieldValue(data.yieldRate) || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(this.getYieldValue(data.yieldRate))}
                  isNeedOverFlowEllipsis
                />
              )
          }
        </div>
        <div className={styles.latestTime}>
          近期风险承受能力评估问卷日期：{data.latestSurveyTime || DEFAULT_VALUE}
        </div>
      </div>
    );
  }
}
