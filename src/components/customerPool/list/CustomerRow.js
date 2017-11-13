/**
 *@file

 *@author zhuyanwen
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import {
  fspGlobal,
  // helper,
} from '../../../utils';
import QuickMenu from './QuickMenu';
import SixMonthEarnings from './SixMonthEarnings';
import MatchArea from './MatchArea';
import styles from './customerRow.less';

import iconavator from '../../../../static/images/icon-avator.png';
import iconGeneralGgency from '../../../../static/images/icon-general-agency.png';
import iconProductAgency from '../../../../static/images/icon-product-agency.png';
import iconMoney from '../../../../static/images/icon-money.png';
import iconDiamond from '../../../../static/images/icon-diamond-card.png';
import iconGold from '../../../../static/images/icon-gold-card.png';
import iconSliver from '../../../../static/images/icon-sliver-card.png';
import iconWhiteGold from '../../../../static/images/icon-white-gold.png';
// import iconNone from '../../../../static/images/icon-none.png';
import iconEmpty from '../../../../static/images/icon-empty.png';

// 风险等级配置
const riskLevelConfig = {
  704010: {
    name: '激',
    title: '激进型',
    colorCls: 'jijin',
  },
  704040: {
    name: '低',
    title: '保守型（最低类别）',
    colorCls: 'zuidi',
  },
  704030: {
    name: '保',
    title: '保守型',
    colorCls: 'baoshou',
  },
  704020: {
    name: '稳',
    title: '稳健型',
    colorCls: 'wenjian',
  },
  704025: {
    name: '谨',
    title: '谨慎型',
    colorCls: 'jinshen',
  },
  704015: {
    name: '积',
    title: '积极型',
    colorCls: 'jiji',
  },
};
// 客户性质配置
const custNature = {
  per: {
    name: '个人客户',
    imgSrc: iconavator,
  },
  org: {
    name: '一般机构',
    imgSrc: iconGeneralGgency,
  },
  prod: {
    name: '产品机构',
    imgSrc: iconProductAgency,
  },
};
// 客户等级的图片源
const rankImgSrcConfig = {
  // 钻石
  805010: iconDiamond,
  // 白金
  805015: iconWhiteGold,
  // 金卡
  805020: iconGold,
  // 银卡
  805025: iconSliver,
  // 理财
  805030: iconMoney,
  // 无
  805040: iconEmpty,
  // 其他
  805999: '',
};

// const formatNumber = value => helper.toUnit(value, '元').value;

// const formatUnit = value => helper.toUnit(value, '元').unit;

export default class CustomerRow extends PureComponent {
  static propTypes = {
    q: PropTypes.string,
    listItem: PropTypes.object.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    isAllSelect: PropTypes.bool.isRequired,
    selectedIds: PropTypes.array,
    onSendEmail: PropTypes.func.isRequired,
    onAddFollow: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    createContact: PropTypes.func.isRequired,
    custEmail: PropTypes.object.isRequired,
    currentFollowCustId: PropTypes.string.isRequired,
    emailCustId: PropTypes.string.isRequired,
    isFollows: PropTypes.object.isRequired,
    custIncomeReqState: PropTypes.bool.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    formatAsset: PropTypes.func.isRequired,
    mainServiceManager: PropTypes.bool,
    handleCheck: PropTypes.func.isRequired,
  }

  static defaultProps = {
    q: '',
    selectedIds: [],
    mainServiceManager: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  @autobind
  toDetail() {
    const {
      listItem: {
        pOrO,
        custId,
        rowId,
        ptyId,
      },
    } = this.props;
    const type = (!pOrO || pOrO === 'per') ? 'per' : 'org';
    const param = {
      id: 'FSP_360VIEW_M_TAB',
      title: '客户360视图-客户信息',
      forceRefresh: true,
    };
    fspGlobal.openFspTab({
      url: `/customerCenter/360/${type}/main?id=${custId}&rowId=${rowId}&ptyId=${ptyId}`,
      param,
    });
  }

  @autobind
  handleSelect() {
    const { onChange, listItem: { custId, name }, handleCheck } = this.props;
    // 手动发送日志
    handleCheck({ custId, name });
    onChange(custId, name);
  }

  @autobind
  createModal(listItem) {
    const { pOrO, custId, name } = listItem;
    const { createContact } = this.props;
    createContact({
      custName: name,
      custId,
      custType: (!pOrO || pOrO === 'per') ? 'per' : 'org',
    });
  }

  @autobind
  renderAgeOrOrgName() {
    const { listItem } = this.props;
    if (listItem.pOrO === 'per') {
      // 客户性质为个人
      return <span>{listItem.genderValue}/{listItem.age}岁</span>;
    } else if (listItem.pOrO === 'org' && listItem.orgTypeName) {
      // 客户性质为一般机构
      return <span>{listItem.orgTypeName}</span>;
    } else if (listItem.pOrO === 'prod' && listItem.prodTypeCode) {
      // 客户性质为产品机构
      return <span>{listItem.prodTypeCode}</span>;
    }
    return '';
  }

  renderRankImg(listItem = {}) {
    return rankImgSrcConfig[listItem.levelCode] ?
      <img className={styles.iconMoneyImage} src={rankImgSrcConfig[listItem.levelCode]} alt="" />
      : null;
  }

  render() {
    const { q, listItem, monthlyProfits, isAllSelect, selectedIds,
      onAddFollow,
      currentFollowCustId,
      isFollows,
      custIncomeReqState,
      toggleServiceRecordModal,
      custEmail,
      onSendEmail,
      emailCustId,
      getCustIncome,
      location,
      dict,
      formatAsset,
      mainServiceManager,
    } = this.props;
    const rskLev = _.trim(listItem.riskLvl);
    const str = `${listItem.custId}.${listItem.name}`;
    const isChecked = _.includes(selectedIds, str) || isAllSelect;
    let assetValue = '--';
    let assetUnit = '';
    if (listItem.asset) {
      const obj = formatAsset(listItem.asset);
      assetValue = obj.value;
      assetUnit = obj.unit;
    }
    // 佣金率
    let miniFee = '--';
    if (listItem.miniFee !== null) {
      miniFee = `${(listItem.miniFee * 1000).toFixed(2)}‰`;
    }
    // 归集率
    let hsRate = '--';
    if (listItem.hsRate !== null) {
      hsRate = listItem.hsRate < 0 ? listItem.hsRate : `${listItem.hsRate}%`;
    }
    return (
      <div
        className={styles.customerRow}
      >
        {
          mainServiceManager ?
            <QuickMenu
              listItem={listItem}
              createModal={this.createModal}
              toggleServiceRecordModal={toggleServiceRecordModal}
              custEmail={custEmail}
              emailCustId={emailCustId}
              onSendEmail={onSendEmail}
              currentFollowCustId={currentFollowCustId}
              isFollows={isFollows}
              onAddFollow={onAddFollow}
            /> : null
        }
        <div className={styles.selectIcon}>
          <Checkbox
            disabled={isAllSelect}
            checked={isChecked}
            onChange={this.handleSelect}
          />
        </div>
        <div
          className={styles.customerRowContent}
        >
          <div className={`${styles.customerRowLeft} clear`}>
            <div className={styles.avatorContent}>
              <img
                className={styles.avatorImage}
                src={custNature[listItem.pOrO].imgSrc}
                alt=""
                onClick={this.toDetail}
              />
              <div className={styles.avatorText}>{custNature[listItem.pOrO].name}</div>
              {
                this.renderRankImg(listItem)
              }
            </div>
          </div>
          <div className={styles.customerRowRight}>
            <div className="row-one">
              {
                listItem.name ?
                  <span className="name" onClick={this.toDetail}>{listItem.name}</span> :
                  null
              }
              <span>{listItem.custId}</span>
              <span className="cutOffLine">|</span>
              {
                listItem.genderValue && listItem.age
                  ? <span>{listItem.genderValue}/{listItem.age}岁</span>
                  : null
              }
              {
                listItem.genderValue && listItem.age
                  ? <span className="cutOffLine">|</span>
                  : null
              }
              <span>
                {`${listItem.openDt.slice(0, 4)}-${listItem.openDt.slice(4, 6)}-${listItem.openDt.slice(6, 8)} 开户`}
              </span>
              {
                (rskLev === '' || rskLev === 'null')
                  ? '' :
                  <div
                    className={`riskLevel ${riskLevelConfig[rskLev].colorCls}`}
                  >
                    <div className="itemText">{`风险等级：${riskLevelConfig[rskLev].title}`}</div>
                    {riskLevelConfig[rskLev].name}
                  </div>
              }
              {listItem.highWorthFlag ? <div className="highWorthFlag">高净值</div> : null}
              {
                listItem.contactFlag ?
                  <div className="iconSingned">
                    签约
                    <div className="itemText">签约客户</div>
                  </div> : null
              }
            </div>
            <div className="row-two">
              <span className="imputation">归集率: <em>{hsRate}</em></span>
              <span className="cutOffLine">|</span>
              <span className="commission">佣金率: <em>{miniFee}</em></span>
              <span className="cutOffLine">|</span>
              <span>总资产：</span>
              <span className="asset">{assetValue}</span>
              <span className="assetunit">{assetUnit}</span>
              <SixMonthEarnings
                listItem={listItem}
                monthlyProfits={monthlyProfits}
                custIncomeReqState={custIncomeReqState}
                getCustIncome={getCustIncome}
              />
              <div className="department">
                <span>
                  服务经理：
                  {
                    `${listItem.orgName || '无'}-${listItem.empName || '无'}`
                  }
                </span>
              </div>
            </div>
            <MatchArea
              q={q}
              dict={dict}
              location={location}
              listItem={listItem}
              mainServiceManager={mainServiceManager}
            />
          </div>
        </div>
      </div>
    );
  }
}
