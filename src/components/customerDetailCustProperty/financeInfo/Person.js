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
import {
  DEFAULT_VALUE,
  checkIsNeedTitle,
} from '../config';
import styles from './common.less';

const INFO_ITEM_WITDH_110 = '110px';
const INFO_ITEM_WITDH = '126px';
// const EMPTY_OBJECT = {};
export default class Person extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    // 是否主服务经理
    isMainEmp: PropTypes.bool,
  }

  static defaultPropTypes = {
    isMainEmp: false,
  }

  @autobind
  getViewDataByNum(value) {
    return value;
  }

  render() {
    const {
      data,
      isMainEmp,
    } = this.props;
    return (
      <div className={styles.infoContainer}>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH_110}
            label="收入水平"
            value={data.income || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.income || DEFAULT_VALUE)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="收入来源"
            value={data.source || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.source || DEFAULT_VALUE)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="家庭年收入"
            value={data.householdIncome || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.householdIncome || DEFAULT_VALUE)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="负债情况"
            value={data.liabilities || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.liabilities || DEFAULT_VALUE)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH_110}
            label="可投资资产"
            value={data.investableAssets || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.investableAssets || DEFAULT_VALUE)}
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
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="房产规模"
            value={data.housingSize || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.housingSize || DEFAULT_VALUE)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="银行理财规模"
            value={data.bankMoneyScale || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.bankMoneyScale || DEFAULT_VALUE)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH_110}
            label="保险类资产规模"
            value={data.insuredAssetsScale || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.insuredAssetsScale || DEFAULT_VALUE)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="其他资产规模"
            value={data.otherAssetsScale || DEFAULT_VALUE}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(data.otherAssetsScale || DEFAULT_VALUE)}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="投入成本收益率"
            value={this.getViewDataByNum(data.yieldRate)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewDataByNum(data.yieldRate))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.latestTime}>
          近期风险承受能力评估问卷日期：{data.latestSurveyTime}
        </div>
      </div>
    );
  }
}
