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
  // DEFAULT_VALUE,
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
  getViewData(value) {
    return value;
  }

  render() {
    const {
      data,
    } = this.props;
    return (
      <div className={styles.infoContainer}>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH_110}
            label="收入水平"
            value={this.getViewData(data.income)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.income))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="收入来源"
            value={this.getViewData(data.source)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.source))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="家庭年收入"
            value={this.getViewData(data.householdIncome)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.householdIncome))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="负债情况"
            value={this.getViewData(data.liabilities)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.liabilities))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH_110}
            label="可投资资产"
            value={this.getViewData(data.investableAssets)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.investableAssets))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="可投资资产占比"
            value={this.getViewData(data.investableAssetsCycle)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.investableAssetsCycle))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="房产规模"
            value={this.getViewData(data.housingSize)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.housingSize))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="银行理财规模"
            value={this.getViewData(data.bankMoneyScale)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.bankMoneyScale))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH_110}
            label="保险类资产规模"
            value={this.getViewData(data.insuredAssetsScale)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.insuredAssetsScale))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="其他资产规模"
            value={this.getViewData(data.otherAssetsScale)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.otherAssetsScale))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="投入成本收益率"
            value={this.getViewData(data.yieldRate)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getViewData(data.yieldRate))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.latestTime}>
          近期适当性服务问卷调查日期：{data.latestSurveyTime}
        </div>
      </div>
    );
  }
}
