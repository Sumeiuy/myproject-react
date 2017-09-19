/**
 *@file

 *@author zhuyanwen
*/

import React, { PureComponent, PropTypes } from 'react';
// import { withRouter } from 'dva/router';
import { Checkbox } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';

// import CreateContactModal from './CreateContactModal';
import Icon from '../../common/Icon';
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
import iconClose from '../../../../static/images/icon-close.png';
import iconOpen from '../../../../static/images/icon-open.png';

import ChartLineWidget from './ChartLine';

const show = {
  display: 'block',
};
const hide = {
  display: 'none',
};
// 风险等级配置
const riskLevelConfig = {
  704010: {
    name: '激进',
    title: '激进型',
    colorCls: 'jijin',
  },
  704040: {
    name: '最低',
    title: '保守型（最低类别）',
    colorCls: 'zuidi',
  },
  704030: {
    name: '保守',
    title: '保守型',
    colorCls: 'baoshou',
  },
  704020: {
    name: '稳健',
    title: '稳健型',
    colorCls: 'wenjian',
  },
  704025: {
    name: '谨慎',
    title: '谨慎型',
    colorCls: 'jinshen',
  },
  704015: {
    name: '积极',
    title: '积极型',
    colorCls: 'jiji',
  },
};
// 客户性质配置
const custNature = {
  P: {
    name: '个人客户',
    imgSrc: iconavator,
  },
  O: {
    name: '一般机构',
    imgSrc: iconGeneralGgency,
  },
  F: {
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

// 数字常量
const WAN = 10000;
const YI = 100000000;

// 单位常量
const UNIT_DEFAULT = '元';
const UNIT_WAN = '万元';
const UNIT_YI = '亿元';

// 匹配标签区域超过两条显示 展开/收起 按钮
const FOLD_NUM = 2;

const haveTitle = title => (title ? `<i class="tip">${title}</i>` : null);

const replaceWord = (value, q, title = '') => {
  const titleDom = haveTitle(title);
  return value.replace(new RegExp(q, 'g'), `<em class="marked">${q}${titleDom || ''}</em>`);
};

const getNewHtml = (value, k) => (`<li><span><i class="label">${value}：</i>${k}</span></li>`);

const generateUnit = (num) => {
  const absNum = Math.abs(num);
  if (absNum >= YI) {
    return UNIT_YI;
  }
  if (absNum >= WAN) {
    return UNIT_WAN;
  }
  return UNIT_DEFAULT;
};

const formatNumber = (num) => {
  const absNum = Math.abs(num);
  if (absNum >= YI) {
    return (num / YI).toFixed(2);
  }
  if (absNum >= WAN) {
    return (num / WAN).toFixed(2);
  }
  return num;
};

let contactModalKeyCount = 0;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

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
    createServiceRecord: PropTypes.func.isRequired,
    toEmail: PropTypes.func.isRequired,
    addFollow: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    createContact: PropTypes.func.isRequired,
    isSms: PropTypes.bool.isRequired,
    custContactData: PropTypes.object.isRequired,
    serviceRecordData: PropTypes.array.isRequired,
    email: PropTypes.string.isRequired,
    currentEmailCustId: PropTypes.string.isRequired,
    currentFollowCustId: PropTypes.string.isRequired,
    follow: PropTypes.bool.isRequired,
    isGetCustIncome: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    q: '',
    selectedIds: [],
  }

  constructor(props) {
    super(props);
    const {
      dict: {
        custBusinessType = [],
      },
      listItem: { asset },
    } = props;

    this.state = {
      showStyle: show,
      hideStyle: hide,
      unit: '元',
      newAsset: asset,
      visible: false,
      isShowModal: false,
      modalKey: `contactModalKey${contactModalKeyCount}`,
      currentCustId: '',
      custType: '',
      checked: false,
      followClass: null,
    };

    this.businessConfig = new Map();
    custBusinessType.forEach((v) => {
      this.businessConfig.set(v.key, v.value);
    });

    this.debounced = _.debounce(
      this.getCustIncome,
      800,
      { leading: false },
    );
  }
  componentWillMount() {
    const { listItem: { asset } } = this.props;
    const unit = generateUnit(+asset);
    const newAsset = formatNumber(+asset);
    this.setState({
      unit,
      newAsset,
      isShowCharts: false,
    });
    this.state.followClass = classnames({
      [styles.follows]: this.props.follow,
    });
  }
  componentWillReceiveProps(nextProps) {
    const {
      custContactData: prevCustContactData = EMPTY_OBJECT,
      serviceRecordData: prevServiceRecordData = EMPTY_LIST,
     } = this.props;
    const {
      custContactData: nextCustContactData = EMPTY_OBJECT,
      serviceRecordData: nextServiceRecordData = EMPTY_LIST,
     } = nextProps;
    const { isShowModal, currentCustId } = this.state;
    const prevContact = prevCustContactData[currentCustId] || EMPTY_OBJECT;
    const nextContact = nextCustContactData[currentCustId] || EMPTY_OBJECT;
    if (prevContact !== nextContact || prevServiceRecordData !== nextServiceRecordData) {
      if (!isShowModal) {
        this.setState({
          isShowModal: true,
          modalKey: `contactModalKey${contactModalKeyCount++}`,
        });
      }
    }
    if (nextProps.currentFollowCustId !== '') {
      const followClass = classnames({
        [styles.follows]: nextProps.follow,
      });
      this.setState({
        followClass,
      });
    }
  }
  componentDidUpdate() {
    if (this.props.email !== '') {
      const evt = new MouseEvent('click', { bubbles: false, cancelable: false, view: window });
      document.querySelector('#sendEmail').dispatchEvent(evt);
    }
  }

  getLastestData(arr) {
    if (arr && arr instanceof Array && arr.length !== 0) {
      return arr[arr.length - 1];
    }
    return {};
  }

  @autobind
  getCustIncome() {
    const { getCustIncome, listItem, monthlyProfits } = this.props;
    const thisMonthlyProfits = monthlyProfits[listItem.custId];
    if (!thisMonthlyProfits || _.isEmpty(thisMonthlyProfits)) {
      // test data empId = 01041128、05038222、035000002899、02004642
      getCustIncome({ custNumber: listItem.custId });
    }
    this.setState({
      isShowCharts: true,
    });
  }

  @autobind
  handleMouseLeave() {
    this.debounced.cancel();
    this.setState({
      isShowCharts: false,
    });
  }

  @autobind
  handleCollapse(type) {
    if (type === 'open') {
      const prosshow = {
        display: 'none',
      };
      const proshide = {
        display: 'block',
      };
      this.setState({
        showStyle: prosshow,
        hideStyle: proshide,
      });
    } else if (type === 'close') {
      const consshow = {
        display: 'block',
      };
      const conshide = {
        display: 'none',
      };
      this.setState({
        showStyle: consshow,
        hideStyle: conshide,
      });
    }
  }

  @autobind
  matchWord(q, listItem) {
    // if (!q) return;
    const { location: { query: { source } } } = this.props;
    let rtnEle = '';  // 全部展示的数据
    let shortRtnEle = ''; // 只展示两条的数据
    let n = 0;
    const isSearch = source === 'search' || source === 'association';
    const isTag = source === 'tag';
    const isCustIndicator = source === 'custIndicator';
    const isNumOfCustOpened = source === 'numOfCustOpened';
    const isBusiness = source === 'business';
    if (isSearch && listItem.name && listItem.name.indexOf(q) > -1) {
      const markedEle = replaceWord(listItem.name, q);
      const domTpl = getNewHtml('姓名', markedEle);
      rtnEle += domTpl;
      n++;
      if (n <= FOLD_NUM) {
        shortRtnEle += domTpl;
      }
    }
    if (isSearch && listItem.idNum && listItem.idNum.indexOf(q) > -1) {
      const markedEle = replaceWord(listItem.idNum, q);
      const domTpl = getNewHtml('身份证号码', markedEle);
      rtnEle += domTpl;
      n++;
      if (n <= FOLD_NUM) {
        shortRtnEle += domTpl;
      }
    }
    if (isSearch && listItem.telephone && listItem.telephone.indexOf(q) > -1) {
      const markedEle = replaceWord(listItem.telephone, q);
      const domTpl = getNewHtml('联系电话', markedEle);
      rtnEle += domTpl;
      n++;
      if (n <= FOLD_NUM) {
        shortRtnEle += domTpl;
      }
    }
    if (isSearch && listItem.custId && listItem.custId.indexOf(q) > -1) {
      const markedEle = replaceWord(listItem.custId, q);
      const domTpl = getNewHtml('经纪客户号', markedEle);
      rtnEle += domTpl;
      n++;
      if (n <= FOLD_NUM) {
        shortRtnEle += domTpl;
      }
    }
    // 匹配标签
    if ((isTag || isSearch) && listItem.relatedLabels) {
      const relatedLabels = listItem.relatedLabels.split(' ').filter((v) => { //eslint-disable-line
        if (v.indexOf(q) > -1) {
          return v;
        }
      });
      // 有描述
      // const markedEle = relatedLabels.map(v => (replaceWord(v, q, listItem.reasonDesc)));
      if (!_.isEmpty(relatedLabels)) {
        const markedEle = relatedLabels.map(v => (replaceWord(v, q)));
        const domTpl = getNewHtml('匹配标签', markedEle);
        rtnEle += domTpl;
        n++;
        if (n <= FOLD_NUM) {
          shortRtnEle += domTpl;
        }
      }
    }
    // 匹配可开通业务
    if ((isBusiness || isNumOfCustOpened) && listItem.unrightType) {
      const unrightTypeArr = listItem.unrightType.split(' ');
      const tmpArr = _.filter(_.map(unrightTypeArr, v => this.businessConfig.get(v)));
      if (!_.isEmpty(tmpArr)) {
        const domTpl = getNewHtml(`可开通业务(${tmpArr.length})`, tmpArr.join('、'));
        rtnEle += domTpl;
        n++;
        if (n <= FOLD_NUM) {
          shortRtnEle += domTpl;
        }
      }
    }
    // 匹配已开通业务
    if ((isBusiness || isNumOfCustOpened) && listItem.userRights) {
      const userRightsArr = listItem.userRights.split(' ');
      const tmpArr = _.filter(_.map(userRightsArr, v => this.businessConfig.get(v)));
      if (!_.isEmpty(tmpArr)) {
        const domTpl = getNewHtml(`已开通业务(${tmpArr.length})`, tmpArr.join('、'));
        rtnEle += domTpl;
        n++;
        if (n <= FOLD_NUM) {
          shortRtnEle += domTpl;
        }
      }
    }
    // 显示开户日期
    if (isCustIndicator && listItem.openDt) {
      const openDate = `${listItem.openDt.slice(0, 4)}年${listItem.openDt.slice(4, 6)}月${listItem.openDt.slice(6, 8)}日`;
      const domTpl = getNewHtml('开户日期', openDate);
      rtnEle += domTpl;
      n++;
      if (n <= FOLD_NUM) {
        shortRtnEle += domTpl;
      }
    }
    // 显示账户状态
    if (isCustIndicator && listItem.accountStausName) {
      const domTpl = getNewHtml('账户状态', listItem.accountStausName);
      rtnEle += domTpl;
      n++;
      if (n <= FOLD_NUM) {
        shortRtnEle += domTpl;
      }
    }
    return {
      shortRtnEle: { __html: shortRtnEle },
      rtnEle: { __html: rtnEle },
      n,
    };
  }

  @autobind
  handleSelect() {
    const { onChange, listItem: { custId, name } } = this.props;
    onChange(custId, name);
  }
  /**
   * 回调，关闭modal打开state
   */
  @autobind
  resetModalState() {
    this.setState({
      isShowModal: false,
    });
  }
  @autobind
  renderAgeOrOrgName() {
    const { listItem } = this.props;
    if (listItem.pOrO === 'P') {
      return <span>{listItem.genderValue}/{listItem.age}岁</span>;
    } else if (listItem.pOrO === 'O' || listItem.pOrO === 'F' || listItem.orgTypeName) {
      return <span>{listItem.orgTypeName}</span>;
    }
    return '';
  }

  render() {
    const { q, listItem, monthlyProfits, isAllSelect, selectedIds,
      isSms,
      toEmail,
      currentEmailCustId,
      email,
      addFollow,
      currentFollowCustId,
      follow,
      createContact,
      createServiceRecord,
      isGetCustIncome,
    } = this.props;
    const {
      unit,
      newAsset,
      isShowCharts,
    } = this.state;
    const thisMonthlyProfits = monthlyProfits[listItem.custId] || [];
    const lastestProfit = Number(this.getLastestData(thisMonthlyProfits).assetProfit);
    const lastestProfitRate = Number(this.getLastestData(thisMonthlyProfits).assetProfitRate);
    const matchedWord = this.matchWord(q, listItem);
    const rskLev = _.trim(listItem.riskLvl);
    const str = `${listItem.custId}.${listItem.name}`;
    const isChecked = _.includes(selectedIds, str) || isAllSelect;
    return (
      <div className={styles.customerRow}>
        {
          isSms ?
            <div className={styles.basicInfoD}>
              <ul className={styles.operationIcon}>
                <li onClick={() => createContact(listItem)}>
                  <Icon type="dianhua" />
                  <span>电话联系</span>
                </li>
                <li onClick={() => toEmail(listItem)}>
                  <Icon type="youjian" />
                  <span>{currentEmailCustId === listItem.custId && email ? <a id={email && currentEmailCustId === listItem.custId ? 'sendEmail' : ''} href={`mailto:${email}`} > 邮件联系 </a> : '邮件联系' }</span>
                </li>
                <li onClick={() => createServiceRecord(listItem)}>
                  <Icon type="jilu" />
                  <span>添加服务记录</span>
                </li>
                <li onClick={() => addFollow(listItem)} className={currentFollowCustId === listItem.custId ? this.state.followClass : ''}>
                  <Icon type="guanzhu" className={currentFollowCustId === listItem.custId ? this.state.followClass : ''} />
                  <span>{follow}-----{currentFollowCustId === listItem.custId && follow ? '已关注' : '关注'}</span>
                </li>
              </ul>
            </div>
            :
            null
        }
        <div className={`${styles.customerRowLeft} clear`}>
          <div className={styles.selectIcon}>
            <Checkbox
              disabled={isAllSelect}
              checked={isChecked}
              onChange={this.handleSelect}
            />
          </div>
          <div className={styles.avatorContent}>
            <img className={styles.avatorImage} src={custNature[listItem.pOrO].imgSrc} alt="" />
            <div className={styles.avatorText}>{custNature[listItem.pOrO].name}</div>
            <img className={styles.iconMoneyImage} src={rankImgSrcConfig[listItem.levelCode]} alt="" />
          </div>
        </div>
        <div className={styles.customerRowRight}>
          <div className="row-one">{listItem.name ? <span className="name">{listItem.name}</span> : null}
            {
              listItem.contactFlag ?
                <div className="iconSingned">
                  <div className="itemText">签约客户</div>
                </div> : null
            }
            {listItem.highWorthFlag ? <div className="highWorthFlag">高净值</div> : null}
            {
              (rskLev === '' || rskLev === 'null')
                ? '' :
                <div
                  className={`riskLevel ${riskLevelConfig[rskLev].colorCls}`}
                >
                  <div className="itemText">{riskLevelConfig[rskLev].title}</div>
                  {riskLevelConfig[rskLev].name}
                </div>
            }
          </div>
          <div className="row-two">
            <span>{listItem.custId}</span>
            <span className="cutOffLine">|</span>
            {this.renderAgeOrOrgName()}
            <span className="commission">佣金率: <em>{(listItem.miniFee * 1000).toFixed(2)}‰</em></span>
          </div>
          <div className="row-three">
            <span>总资产：</span>
            <span className="asset">{newAsset}</span>
            <span>{unit}</span>
            <span
              className="showChart"
              style={{
                cursor: isGetCustIncome ? 'wait' : 'pointer',
              }}
            >
              <p
                onMouseEnter={this.debounced}
                onMouseLeave={this.handleMouseLeave}
              >
                查看详情
              </p>
              <div
                className={`${styles.showCharts}`}
                style={{
                  display: isShowCharts ? 'block' : 'none',
                }}
              >
                <div className={styles.chartsContent}>
                  <ChartLineWidget chartData={thisMonthlyProfits} />
                </div>
                <div className={styles.chartsText}>
                  <div>
                    <span>年最大时点资产：</span>
                    <span className={styles.numA}>
                      {listItem.maxTotAsetY ? formatNumber(listItem.maxTotAsetY) : '--'}
                    </span>
                    {listItem.maxTotAsetY ? generateUnit(listItem.maxTotAsetY) : ''}
                  </div>
                  <div>
                    <span>本月收益率：</span>
                    <span className={styles.numB}>
                      {
                        thisMonthlyProfits.length ?
                          `${lastestProfitRate.toFixed(2)}%`
                          :
                          '--'
                      }
                    </span>
                  </div>
                  <div>
                    <span>
                      本月收益：
                      <span className={styles.numB}>
                        {
                          thisMonthlyProfits.length ?
                            formatNumber(lastestProfit)
                            :
                            '--'
                        }
                      </span>
                      &nbsp;
                      {thisMonthlyProfits.length ? generateUnit(lastestProfit) : null}
                    </span>
                  </div>
                </div>
              </div>
            </span>
            <div className="department">
              <span>{listItem.orgName}</span>
              <span className="cutOffLine">|</span>
              <span>{`服务经理：${listItem.empName || '无'}`}</span>
            </div>
          </div>
          <div className={styles.relatedInfo}>
            {
              matchedWord.n > 2 ?
                <div className={styles.collapseItem}>
                  <span style={this.state.showStyle}>
                    <a onClick={() => this.handleCollapse('open')}>
                      <span className={styles.itemA}>展开</span>
                      <img src={iconOpen} alt="open" />
                    </a>
                  </span>
                  <span style={this.state.hideStyle}>
                    <a onClick={() => this.handleCollapse('close')}>
                      <span className={styles.itemA}>收起</span>
                      <img src={iconClose} alt="open" />
                    </a>
                  </span>
                </div> : null
            }
            <ul
              style={this.state.showStyle}
              dangerouslySetInnerHTML={matchedWord.shortRtnEle} // eslint-disable-line
            />
            <ul
              style={this.state.hideStyle}
              dangerouslySetInnerHTML={matchedWord.rtnEle} // eslint-disable-line
            />
          </div>
        </div>
      </div>
    );
  }
}
