/**
 * @file components/customerPool/list/MatchArea.js
 *  客户列表项中的匹配出来的数据
 * @author wangjunjun
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './matchArea.less';

import iconClose from '../../../../static/images/icon-close.png';
import iconOpen from '../../../../static/images/icon-open.png';

const haveTitle = title => (title ? `<i class="tip">${title}</i>` : null);

const replaceWord = (value, q, title = '') => {
  const titleDom = haveTitle(title);
  return value.replace(new RegExp(q, 'g'), `<em class="marked">${q}${titleDom || ''}</em>`);
};

const getNewHtml = (value, k) => (`<li><span><i class="label">${value}：</i>${k}</span></li>`);

// 匹配标签区域超过两条显示 展开/收起 按钮
const FOLD_NUM = 2;

export default class MatchArea extends PureComponent {

  static propTypes = {
    dict: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    listItem: PropTypes.object.isRequired,
    q: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const {
      dict: {
        custBusinessType = [],
      },
    } = props;

    this.state = {
      showAll: false,
    };
    this.businessConfig = new Map();
    custBusinessType.forEach((v) => {
      this.businessConfig.set(v.key, v.value);
    });
  }

  @autobind
  handleCollapse(bool, e) {
    e.stopPropagation();
    this.setState({
      showAll: bool,
    });
  }

  @autobind
  matchWord() {
    const {
      q = '',
      listItem,
      location: { query: { source } },
    } = this.props;
    let rtnEle = '';  // 全部展示的数据
    let shortRtnEle = ''; // 只展示两条的数据
    let n = 0; // 计数器，判断匹配是否超过2条
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

  render() {
    const {
      showAll,
    } = this.state;
    const matchedWord = this.matchWord();
    return (
      <div className={styles.relatedInfo}>
        {
          matchedWord.n > FOLD_NUM ?
            <div className={styles.collapseItem}>
              {
                !showAll ?
                  <span>
                    <a onClick={e => this.handleCollapse(true, e)}>
                      <span className={styles.itemA}>展开</span>
                      <img src={iconOpen} alt="open" />
                    </a>
                  </span>
                :
                  <span>
                    <a onClick={e => this.handleCollapse(false, e)}>
                      <span className={styles.itemA}>收起</span>
                      <img src={iconClose} alt="open" />
                    </a>
                  </span>
              }
            </div> : null
        }
        {
          !showAll ?
            <ul
              dangerouslySetInnerHTML={matchedWord.shortRtnEle}
            />
          :
            <ul
              dangerouslySetInnerHTML={matchedWord.rtnEle}
            />
        }
      </div>
    );
  }
}
