/**
 *@file

 *@author zhuyanwen
*/

import React, { PureComponent, PropTypes } from 'react';
// import { withRouter } from 'dva/router';
import { Row, Col, Checkbox } from 'antd';
import { autobind } from 'core-decorators';
import styles from './customerRow.less';
import iconavator from '../../../static/images/icon-avator.png';
import iconGeneralGgency from '../../../static/images/icon-general-agency.png';
import iconProductAgency from '../../../static/images/icon-product-agency.png';
import iconMoney from '../../../static/images/icon-money.png';
import iconDiamond from '../../../static/images/icon-diamond-card.png';
import iconGold from '../../../static/images/icon-gold-card.png';
import iconSliver from '../../../static/images/icon-sliver-card.png';
import iconWhiteGold from '../../../static/images/icon-white-gold.png';
// import iconNone from '../../../static/images/icon-none.png';
import iconEmpty from '../../../static/images/icon-empty.png';
import iconClose from '../../../static/images/icon-close.png';
import iconOpen from '../../../static/images/icon-open.png';

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

const trim = str => (str.replace(/(^\s+)|(\s+$)/g, ''));

const haveTitle = title => (title ? `<i class="tip">${title}</i>` : null);

const replaceWord = (value, q, title = '') => {
  const titleDom = haveTitle(title);
  return value.replace(new RegExp(q, 'g'), `<em class="mark">${q}${titleDom || ''}</em>`);
};

const getNewHtml = (value, k) => (`<li><span>${value}：${k}</span></li>`);

const generateUnit = (num) => {
  if (num >= YI) {
    return UNIT_YI;
  }
  if (num >= WAN) {
    return UNIT_WAN;
  }
  return UNIT_DEFAULT;
};

const formatNumber = (num) => {
  if (num >= YI) {
    return (num / YI).toFixed(2);
  }
  if (num >= WAN) {
    return (num / WAN).toFixed(2);
  }
  return num;
};

export default class CustomerRow extends PureComponent {
  static propTypes = {
    q: PropTypes.string,
    listItem: PropTypes.object.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    monthlyProfits: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    q: '',
  }

  constructor(props) {
    super(props);
    const { listItem: { asset } } = props;
    this.state = {
      showStyle: show,
      hideStyle: hide,
      unit: '元',
      newAsset: asset,
    };
  }

  componentWillMount() {
    const { listItem: { asset } } = this.props;
    const unit = generateUnit(+asset);
    const newAsset = formatNumber(+asset);
    this.setState({
      unit,
      newAsset,
    });
  }

  getLastestData(arr) {
    if (arr && arr instanceof Array && arr.length !== 0) {
      return arr[arr.length - 1];
    }
    return {};
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
  handleMouseEnter() {
    const { getCustIncome, listItem, monthlyProfits } = this.props;
    if (monthlyProfits.length !== 0) {
      return;
    }
    // test data empId = 01041128、05038222、035000002899、02004642
    getCustIncome({ custNumber: listItem.custId });
  }

  @autobind
  matchWord(q, listItem) {
    // if (!q) return;
    const { location: { query: { source } } } = this.props;
    let rtnEle = '';
    let shortRtnEle = '';
    let n = 0;
    const isSearch = source === 'search';
    const isTag = source === 'tag';
    if (isSearch && listItem.name && listItem.name.indexOf(q) > -1) {
      const markedEle = replaceWord(listItem.name, q);
      const domTpl = getNewHtml('姓名', markedEle);
      rtnEle += domTpl;
      n++;
      if (n <= 2) {
        shortRtnEle += domTpl;
      }
    }
    if (isSearch && listItem.idNum && listItem.idNum.indexOf(q) > -1) {
      const markedEle = replaceWord(listItem.idNum, q);
      const domTpl = getNewHtml('身份证号码', markedEle);
      rtnEle += domTpl;
      n++;
      if (n <= 2) {
        shortRtnEle += domTpl;
      }
    }
    if (isSearch && listItem.telephone && listItem.telephone.indexOf(q) > -1) {
      const markedEle = replaceWord(listItem.telephone, q);
      const domTpl = getNewHtml('联系电话', markedEle);
      rtnEle += domTpl;
      n++;
      if (n <= 2) {
        shortRtnEle += domTpl;
      }
    }
    if (isSearch && listItem.custId && listItem.custId.indexOf(q) > -1) {
      const markedEle = replaceWord(listItem.custId, q);
      const domTpl = getNewHtml('经纪客户号', markedEle);
      rtnEle += domTpl;
      n++;
      if (n <= 2) {
        shortRtnEle += domTpl;
      }
    }
    // 匹配标签
    if (isTag && isSearch && listItem.relatedLabels) {
      const relatedLabels = listItem.relatedLabels.split(' ').filter((v) => { //eslint-disable-line
        if (v.indexOf(q) > -1) {
          return v;
        }
      });
      // 有描述
      // const markedEle = relatedLabels.map(v => (replaceWord(v, q, listItem.reasonDesc)));
      const markedEle = relatedLabels.map(v => (replaceWord(v, q)));
      const domTpl = getNewHtml('匹配标签', markedEle);
      rtnEle += domTpl;
      n++;
      if (n <= 2) {
        shortRtnEle += domTpl;
      }
    }
    // if (listItem.relatedLabels && listItem.relatedLabels.indexOf(q) > -1) {
    //   const markedEle = replaceWord(listItem.relatedLabels, q, listItem.reasonDesc);
    //   const domTpl = getNewHtml('匹配标签', markedEle);
    //   rtnEle += domTpl;
    //   n++;
    //   if (n <= 2) {
    //     shortRtnEle += domTpl;
    //   }
    // }
    return {
      shortRtnEle: { __html: shortRtnEle },
      rtnEle: { __html: rtnEle },
      n,
    };
  }

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
    const { q, listItem, monthlyProfits } = this.props;
    const { unit, newAsset } = this.state;
    const lastestProfit = Number(this.getLastestData(monthlyProfits).assetProfit);
    const lastestProfitRate = Number(this.getLastestData(monthlyProfits).assetProfitRate);
    const matchedWord = this.matchWord(q, listItem);
    const rskLev = trim(listItem.riskLvl);
    console.log('listItem', listItem, listItem.riskLvl);
    return (
      <Row type="flex" className={styles.custoemrRow}>
        <Col span={3} className={styles.avator}>
          <div className={styles.selectIcon}><Checkbox /></div>
          <div className={styles.avatorContent}>
            <img className={styles.avatorImage} src={custNature[listItem.pOrO].imgSrc} alt="" />
            <div className={styles.avatorText}>{custNature[listItem.pOrO].name}</div>
            <img className={styles.iconMoneyImage} src={rankImgSrcConfig[listItem.levelCode]} alt="" />
          </div>
        </Col>
        <Col span={21} className={styles.customerInfo}>
          <div className={styles.customerBasicInfo}>
            <div className={styles.basicInfoA}>
              <div className={styles.itemA}>
                <span>{listItem.name}</span>
                <span>{listItem.custId}</span>
                {this.renderAgeOrOrgName()}
              </div>
              <div className={styles.itemB}>
                <span>服务经理：</span><span>{listItem.empName}</span>
                <span>{listItem.orgName}</span>
              </div>
            </div>
            <div className={styles.basicInfoB}>
              {
                listItem.contactFlag ?
                  <div className={styles.iconSingnedA}>
                    <div className={styles.itemText}>签约客户</div>
                  </div> : null
              }
              {listItem.highWorthFlag ? <div className={styles.tagA}>高净值</div> : null}
              {
                (rskLev === '' || rskLev === 'null') ? '' :
                <div
                  className={`tagB ${riskLevelConfig[rskLev].colorCls}`}
                >
                  <div className="itemText">{riskLevelConfig[rskLev].title}</div>
                  {riskLevelConfig[rskLev].name}
                </div>
              }
            </div>
            <div className={styles.basicInfoC}>
              <div className={styles.itemA}>
                <span className={styles.assetsText}>总资产：</span>
                <sapn className={styles.assetsNum}>{newAsset}</sapn>
                <span className={styles.assetsText}>{unit}</span>
                <div className={styles.iconschart} onMouseEnter={this.handleMouseEnter}>
                  <div className={styles.showCharts}>
                    <div className={styles.chartsContent}>
                      <ChartLineWidget chartData={monthlyProfits} />
                    </div>
                    <div className={styles.chartsText}>
                      {/* <div>
                        <span>年最大时点资产：</span>
                        <span className={styles.numA}>1462</span>万元
                      </div> */}
                      <div>
                        <span>本月收益率：</span>
                        <span className={styles.numB}>
                          {
                            monthlyProfits.length ?
                            `${lastestProfitRate * 10}%`
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
                              monthlyProfits.length ?
                              formatNumber(lastestProfit)
                              :
                              '--'
                            }
                          </span>
                          &nbsp;
                          {monthlyProfits.length ? generateUnit(lastestProfit) : null}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.itemB}>
                <span>佣金率：</span>
                <span>{listItem.miniFee * 1000}‰</span>
              </div>
            </div>
            <div className={styles.basicInfoD}>
              <ul className={styles.operationIcon}>
                <li><div className={styles.iconIphone} /><span>电话联系</span></li>
                <li><div className={styles.iconEmail} /><span>邮件联系</span></li>
                <li><div className={styles.iconRecordService} /><span>添加服务记录</span></li>
                <li><div className={styles.iconFocus} /><span>关注</span></li>
              </ul>
            </div>
          </div>
          <div className={styles.customerOtherInfo}>
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
              dangerouslySetInnerHTML={matchedWord.shortRtnEle}
            />
            <ul
              style={this.state.hideStyle}
              dangerouslySetInnerHTML={matchedWord.rtnEle}
            />
          </div>
        </Col>
      </Row>
    );
  }
}
