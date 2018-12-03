/**
 * @file components/customerPool/CustomerTotal.js
 *  客户池-客户列表总数提示
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class CustomerTotal extends PureComponent {
  static propTypes = {
    source: PropTypes.string.isRequired,
    num: PropTypes.number.isRequired,
    bname: PropTypes.string,
    combinationName: PropTypes.string,
    type: PropTypes.string,
    labelName: PropTypes.string,
  }

  static defaultProps = {
    bname: '',
    combinationName: '',
    type: '',
    labelName: '',
  }

  // 显示从联想词过来的数量信息
  getTotalInfoFromAssociation() {
    const { num, labelName, type } = this.props;
    let node = (
      <p className="total-num">
满足搜索条件的客户
        <em>
          {num}
&nbsp;
        </em>
户
      </p>
    );
    // 持仓行业
    if (type === 'INDUSTRY') {
      // 从‘有色金属(240000)’中截取‘有色金属’
      const [industryName] = decodeURIComponent(labelName).split('(');
      node = (
        <p className="total-num">
满足持有
          {industryName}
行业的客户
          <em>
            {num}
&nbsp;
          </em>
户
        </p>
      );
    }
    return node;
  }

  render() {
    // combinationName 是精选组合的订购组合跳转过来时带的组合名称
    const {
      source, num, bname, combinationName
    } = this.props;
    let ele;
    switch (source) {
      case 'search':
        ele = (
          <p className="total-num">
满足搜索条件的客户
            <em>
              {num}
&nbsp;
            </em>
户
          </p>
        );
        break;
      case 'securitiesProducts':
      case 'external':
        ele = (
          <p className="total-num">
满足搜索条件的客户
            <em>
              {num}
&nbsp;
            </em>
户
          </p>
        );
        break;
      case 'association':
        ele = this.getTotalInfoFromAssociation();
        break;
      case 'tag':
        ele = (
          <p className="total-num">
满足标签条件的客户
            <em>
              {num}
&nbsp;
            </em>
户
          </p>
        );
        break;
      case 'business':
        ele = (
          <p className="total-num">
潜在业务客户
            <em>
              {num}
&nbsp;
            </em>
户
          </p>
        );
        break;
      case 'custIndicator':
        ele = (
          <p className="total-num">
            {decodeURIComponent(bname)}
            <em>
              {num}
&nbsp;
            </em>
户
          </p>
        );
        break;
      case 'numOfCustOpened':
        ele = (
          <p className="total-num">
办理
            {decodeURIComponent(bname)}
的客户
            <em>
              {num}
&nbsp;
            </em>
户
          </p>
        );
        break;
      case 'sightingTelescope':
      case 'productPotentialTargetCust':
        ele = (
          <p className="total-num">
符合瞄准镜搜索条件的客户
            <em>
              {num}
&nbsp;
            </em>
户
          </p>
        );
        break;
      case 'orderCombination':
        ele = (
          <p className="total-num">
找到订购
            {decodeURIComponent(combinationName)}
产品的客户
            <em>
              {num}
&nbsp;
            </em>
户
          </p>
        );
        break;
      default: ele = <p className="total-num" />;
    }
    return ele;
  }
}
