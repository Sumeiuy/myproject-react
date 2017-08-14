/**
 *@file

 *@author zhuyanwen

 **/
import React, { PureComponent, PropTypes } from 'react';
import { withRouter } from 'dva/router';
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
import iconNone from '../../../static/images/icon-none.png';
import iconClose from '../../../static/images/icon-close.png';
import iconOpen from '../../../static/images/icon-open.png';
// import IECharts from '../IECharts';

const show = {
  display: 'block',
};
const hide = {
  display: 'none',
};
const riskLevelConfig = {
  704010: '激进型',
  704040: '保守型（最低类别）',
  704030: '保守型',
  704020: '稳健型',
  704025: '谨慎型',
  704015: '积极型',
};
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
  805040: iconNone,
  // 其他
  805999: iconNone,
};
@withRouter
export default class CustomerRow extends PureComponent {
  static propTypes = {
    q: PropTypes.string,
    list: PropTypes.object.isRequired,
  }

  static defaultProps = {
    q: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      showStyle: show,
      hideStyle: hide,
    };
    this.n = 0;
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
  matchWord(q, list) {
    // if (!q) return;
    let rtnEle = '';
    let shortRtnEle = '';
    if (list.name.indexOf(q) > -1) {
      const markedEle = list.name.replace(new RegExp(q, 'g'), `<em class="mark">${q}</em>`);
      rtnEle += `<li><span>姓名：${markedEle}</span></li>`;
      this.n++;
      if (this.n <= 2) {
        shortRtnEle += `<li><span>姓名：${markedEle}</span></li>`;
      }
    }
    if (list.idNum.indexOf(q) > -1) {
      const markedEle = list.idNum.replace(new RegExp(q, 'g'), `<em class="mark">${q}</em>`);
      rtnEle += `<li><span>身份证号码：${markedEle}</span></li>`;
      this.n++;
      if (this.n <= 2) {
        shortRtnEle += `<li><span>身份证号码：${markedEle}</span></li>`;
      }
    }
    if (list.telephone.indexOf(q) > -1) {
      const markedEle = list.telephone.replace(new RegExp(q, 'g'), `<em class="mark">${q}</em>`);
      rtnEle += `<li><span>联系电话：${markedEle}</span></li>`;
      this.n++;
      if (this.n <= 2) {
        shortRtnEle += `<li><span>联系电话：${markedEle}</span></li>`;
      }
    }
    if (list.custId.indexOf(q) > -1) {
      const markedEle = list.custId.replace(new RegExp(q, 'g'), `<em class="mark">${q}</em>`);
      rtnEle += `<li><span>经纪客户号：${markedEle}</span></li>`;
      this.n++;
      if (this.n <= 2) {
        shortRtnEle += `<li><span>经纪客户号：${markedEle}</span></li>`;
      }
    }
    return {
      shortRtnEle: { __html: shortRtnEle },
      rtnEle: { __html: rtnEle },
    };
  }

  render() {
    const { q, list } = this.props;
    return (
      <Row type="flex" className={styles.custoemrRow}>
        <Col span={3} className={styles.avator}>
          <Checkbox className={styles.selectIcon} />
          <div>
            {<img className={styles.avatorImage} src={custNature[list.pOrO].imgSrc} alt="avator" />}
            <div className={styles.avatorText}>{custNature[list.pOrO].name}</div>
            <div className={styles.avatorIconMoney}>
              <img className={styles.iconMoneyImage} src={rankImgSrcConfig[list.levelCode]} alt="icon-money" />
            </div>
          </div>
        </Col>
        <Col span={21} className={styles.customerInfo}>
          <div className={styles.customerBasicInfo}>
            <div className={styles.basicInfoA}>
              <div className={styles.itemA}>
                <span>{list.name}</span>
                <span>{list.custId}</span>
                <span>{list.genderValue}/{list.age}岁</span>

              </div>
              <div className={styles.itemB}>
                <span>服务经理：</span><span>{list.empName}</span>
                <span>{list.orgName}</span>
              </div>
            </div>
            <div className={styles.basicInfoB}>
              {
                list.contactFlag ?
                  <div className={styles.iconSingnedA}>
                    <div className={styles.itemText}>签约客户</div>
                  </div> : null
              }
              {list.highWorthFlag ? <div className={styles.tagA}>高净值</div> : null}
              <div className={styles.tagB}>{riskLevelConfig[list.riskLvl]}</div>
            </div>
            <div className={styles.basicInfoC}>
              <div className={styles.itemA}>
                <span className={styles.assetsText}>总资产：</span>
                <sapn className={styles.assetsNum}>{(list.asset / 10000)}</sapn>
                <span className={styles.assetsText}>万元</span>
                <div className={styles.iconschart}>
                  <div className={styles.showCharts}>
                    <div className={styles.chartsText}>
                      <div><span>年最大时点资产：</span><span className={styles.numA}>1462</span>万元</div>
                      <div><span>本月收益率：</span><span className={styles.numB}>+5.6%</span></div>
                      <div><span>本月收益：<span className={styles.numB}>35,672</span>&nbsp;元</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.itemB}>
                <span>佣金率：</span>
                <span>{list.miniFee * 1000}‰</span>
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
            </div>
            <ul
              style={this.state.showStyle}
              dangerouslySetInnerHTML={this.matchWord(q, list).shortRtnEle}
            />
            <ul
              style={this.state.hideStyle}
              dangerouslySetInnerHTML={this.matchWord(q, list).rtnEle}
            />
          </div>
        </Col>
      </Row>
    );
  }
}
