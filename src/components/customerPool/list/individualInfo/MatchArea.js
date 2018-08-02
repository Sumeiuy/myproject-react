/**
 * @file components/customerPool/list/MatchArea.js
 *  客户列表个性化信息
 * @author xiaZhiQiang
 *  客户列表项中的匹配出来的数据
 * @author wangjunjun
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-01 16:56:06
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { isSightingScope, handleOpenFsp360TabAction, getDetailBtnVisible } from '../../helper';
import { url as urlHelper, url, number } from '../../../../helper';
import { seperator, sessionStore } from '../../../../config';
import { openRctTab } from '../../../../utils/index';
import { RANDOM } from '../../../../config/filterContant';
import HoldingProductDetail from '../HoldingProductDetail';
import HoldingCombinationDetail from '../HoldingCombinationDetail';
import HoldingIndustryDetail from '../HoldingIndustryDetail';
import Icon from '../../../common/Icon';
import matchAreaConfig from './config';
import styles from './matchArea.less';

const unlimited = '不限'; // filter 可能暴露出的值
const AIM_LABEL_ID = 'sightingTelescope'; // 瞄准镜标签标识

const haveTitle = title => (title ? `<i class="tip">${title}</i>` : null);

const replaceWord = ({ value, searchText, title = '', type = '' }) => {
  const titleDom = haveTitle(title);
  const regxp = new RegExp(searchText, 'g');
  // 瞄准镜标签后面添加字符，用以分割
  const holder = type === AIM_LABEL_ID ? '-' : '';
  // 容错处理
  if (_.isEmpty(value)) {
    return '';
  }
  return value.replace(regxp,
    `<em class="marked">${searchText}${titleDom || ''}</em>${holder}`);
};

export default class MatchArea extends PureComponent {
  static setFilterOrder(id, value, hashString) {
    const filterOrder = sessionStore.get(`CUSTOMERPOOL_FILTER_ORDER_${hashString}`) || [];
    const finalId = _.isArray(id) ? id : [id];
    let finalOrder = _.difference(filterOrder, finalId);
    if (value && !_.includes(value, unlimited)) {
      finalOrder = [...finalId, ...finalOrder];
    }
    sessionStore.set(`CUSTOMERPOOL_FILTER_ORDER_${hashString}`, [...new Set(finalOrder)]);
  }

  static propTypes = {
    dict: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    listItem: PropTypes.object.isRequired,
    q: PropTypes.string.isRequired,
    hasNPCTIQPermission: PropTypes.bool.isRequired,
    hasPCTIQPermission: PropTypes.bool.isRequired,
    queryHoldingProduct: PropTypes.func.isRequired,
    holdingProducts: PropTypes.object.isRequired,
    queryHoldingProductReqState: PropTypes.bool.isRequired,
    formatAsset: PropTypes.func.isRequired,
    // 组合产品订购客户查询持仓证券重合度
    queryHoldingSecurityRepetition: PropTypes.func.isRequired,
    holdingSecurityData: PropTypes.object.isRequired,
    queryHoldingIndustryDetail: PropTypes.func.isRequired,
    industryDetail: PropTypes.object.isRequired,
    queryHoldingIndustryDetailReqState: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    push: PropTypes.func.isRequired,
    empInfo: PropTypes.object,
    dict: PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    const {
      dict: {
        custBusinessType = [],
      custUnrightBusinessType = [],
      },
      location: {
        query,
      },
      hasNPCTIQPermission,
      hasPCTIQPermission,
      listItem,
    } = props;
    const { empInfo: { empInfo = {} } } = context;
    this.businessConfig = new Map();
    this.hashString = query.hashString || RANDOM;
    custBusinessType.forEach((item) => {
      this.businessConfig.set(item.key, item.value);
    });
    // 可开通业务的匹配
    this.custUnrightBusinessType = {};
    custUnrightBusinessType.forEach((item) => {
      this.custUnrightBusinessType[item.key] = item.value;
    });
    this.state = {
      showAll: false,
    };
    // 是否显示持仓产品、持仓行业、订购组合查看详情的按钮
    this.isShowDetailBtn = getDetailBtnVisible({
      hasNPCTIQPermission,
      hasPCTIQPermission,
      empInfo,
      customerData: listItem,
    });
  }

  getFilters() {
    const {
      location: { query: { filters } },
    } = this.props;
    const query = url.transfromFilterValFromUrl(filters);
    const { searchText = '' } = query;
    return {
      ...query,
      searchText: window.decodeURIComponent(searchText),
    };
  }

  // 关键词匹配到的持仓产品
  getFilteredProducts(list, keyword) {
    return _.filter(
      list,
      item => item && (_.includes(item.code, keyword) || _.includes(item.name, keyword)),
    );
  }

  // 产品id匹配到的持仓产品
  getFilteredProductsById(list, id) {
    return _.filter(
      list,
      item => item && (_.includes(item.id, id)),
    );
  }

  /**
   * 根据持仓产品的字段返回多个持仓产品的html
   * @param {*} list [{name: '12345', id:'0008'},{name: '29999', id:'0002'}]
   * @param {*} keyword '2'
   */
  getMultipleHoldingProductNode(list, keyword) {
    if (!_.isEmpty(list)) {
      const htmlStringList = _.map(
        list,
        item => `${replaceWord({ value: item.name, searchText: keyword })}/${replaceWord({ value: item.code, searchText: keyword })}`,
      );
      const htmlString = htmlStringList.join(',');
      return (
        <li key={htmlString} title={htmlString.replace(/<\/?[^>]*>/g, '')}>
          <span>
            <i className="label">持仓产品：</i>
            <i dangerouslySetInnerHTML={{ __html: htmlString }} />
          </span>
        </li>
      );
    }
    return null;
  }

  // 根据持仓产品的字段返回单个持仓产品的html
  getSingleHoldingProductNode(list, keyword) {
    const {
      listItem: { custId },
      queryHoldingProduct,
      holdingProducts,
      queryHoldingProductReqState,
      formatAsset,
    } = this.props;
    if (!_.isEmpty(list)) {
      const { name, code } = list[0] || {};
      const htmlString = `${replaceWord({ value: name, searchText: keyword })}/${replaceWord({ value: code, searchText: keyword })}`;
      const props = {
        custId,
        data: list[0] || {},
        queryHoldingProduct,
        holdingProducts,
        queryHoldingProductReqState,
        formatAsset,
      };
      return (
        <li key={htmlString}>
          <span>
            <i className="label">持仓产品：</i>
            <i dangerouslySetInnerHTML={{ __html: htmlString }} />
            {this.isShowDetailBtn && <HoldingProductDetail {...props} />}
          </span>
        </li>
      );
    }
    return null;
  }

  @autobind
  getFilterOrder() {
    const { location: { query: { filters, individualInfo } } } = this.props;
    const needInfoFilter = _.keys(matchAreaConfig);
    if (!individualInfo) {
      sessionStore.remove(`CUSTOMERPOOL_FILTER_ORDER_${this.hashString}`);
      const filtersArray = filters ? filters.split(seperator.filterSeperator) : [];
      const filterList = _.map(filtersArray, item =>
        item.split(seperator.filterInsideSeperator)[0]);
      const filterOrder = _.filter(needInfoFilter, item => _.includes(filterList, item));
      MatchArea.setFilterOrder(filterOrder, true, this.hashString);
      return filterOrder;
    }
    return _.filter(sessionStore.get(`CUSTOMERPOOL_FILTER_ORDER_${this.hashString}`), item => _.includes(needInfoFilter, item));
  }

  // 点击订购组合名称跳转到详情页面
  @autobind
  handleOrderCombinationClick({ name, code }) {
    const { push } = this.context;
    const query = { id: code, name };
    const pathname = '/choicenessCombination/combinationDetail';
    const detailURL = `${pathname}?${urlHelper.stringify(query)}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_JX_GROUP_DETAIL',
      title: '组合详情',
    };
    openRctTab({
      routerAction: push,
      url: detailURL,
      query,
      pathname,
      param,
      state: {
        url: detailURL,
      },
    });
  }

  @autobind
  showAllIndividual() {
    const { showAll } = this.state;
    this.setState({
      showAll: !showAll,
    });
  }

  // 如果含有周期项，则个性化信息label前添加周期描述
  convertCycle(id) {
    const { dict: { kPIDateScopeType } } = this.context;
    const filter = this.getFilters();
    const currentFilter = filter[id];
    const cycleCode = currentFilter[0];
    const { value } = _.find(kPIDateScopeType, cycleItem => cycleItem.key === cycleCode);
    return value;
  }

  // 直接取后端返回值渲染的情况
  renderDefaultVal(item) {
    const {
      listItem,
    } = this.props;
    const { name, id, unit = '', hasCycle } = item;
    const currentVal = listItem[id];
    if (!_.isNull(currentVal)) {
      return (
        <li title={currentVal}>
          <span>
            <i className="label">
              {hasCycle ? this.convertCycle(id) : ''}
              {name}：
            </i>
            {
              unit === '元' ?
                number.thousandFormat(Number(currentVal).toFixed(2), false) :
                currentVal
            }{unit}
          </span>
        </li>
      );
    }
    return null;
  }

  // 未完备信息
  @autobind
  renderNoCompleted(currentItem) {
    const {
      listItem,
    } = this.props;
    const { name, id, descMap } = currentItem;
    let noCompleteIdList = _.omitBy(descMap, (value, key) => listItem[key] === 'Y');
    noCompleteIdList = _.values(noCompleteIdList);
    if (noCompleteIdList.length) {
      return (
        <li key={id}>
          <span>
            <i className="label">{name}：</i>
            {_.join(noCompleteIdList, ',')}
          </span>
        </li>
      );
    }
    return null;
  }
  // 精选组合页面的订购组合
  @autobind
  renderOrderCombination() {
    const {
      listItem: { jxgrpProducts, custId },
      queryHoldingSecurityRepetition,
      holdingSecurityData,
      formatAsset,
    } = this.props;
    const { primaryKeyJxgrps } = this.getFilters();
    if (!_.isEmpty(jxgrpProducts)) {
      const id = decodeURIComponent(primaryKeyJxgrps[0]);
      const currentItem = _.find(jxgrpProducts, item => item.id === id);
      if (!_.isEmpty(currentItem)) {
        const { code: combinationCode, name, id: combinationId } = currentItem;
        const props = {
          combinationCode,
          custId,
          queryHoldingSecurityRepetition,
          data: holdingSecurityData,
          formatAsset,
        };
        return (
          <li key={id}>
            <span>
              <i className="label">订购组合：</i>
              <i>
                <em
                  className={`marked ${styles.clickable}`}
                  onClick={() => this.handleOrderCombinationClick(currentItem)}
                >
                  {name}
                </em>
                /{combinationId}
              </i>
              {this.isShowDetailBtn && <HoldingCombinationDetail {...props} />}
            </span>
          </li>
        );
      }
    }
    return null;
  }

  // 匹配姓名
  renderName() {
    const {
      listItem,
    } = this.props;
    const { searchText = '' } = this.getFilters();
    if (listItem.name
      && listItem.name.indexOf(searchText) > -1) {
      const markedEle = replaceWord({ value: listItem.name, searchText });
      return (
        <li key={listItem.name}>
          <span>
            <i className="label">姓名：</i>
            <i
              dangerouslySetInnerHTML={{ __html: markedEle }} // eslint-disable-line
            />
          </span>
        </li>
      );
    }
    return null;
  }

  // 匹配身份证号码
  renderIdNum() {
    const {
      listItem,
    } = this.props;
    const { searchText = '' } = this.getFilters();
    if (listItem.idNum
      && listItem.idNum.indexOf(searchText) > -1) {
      const markedEle = replaceWord({ value: listItem.idNum, searchText });
      return (
        <li key={listItem.idNum}>
          <span>
            <i className="label">身份证号码：</i>
            <i
              dangerouslySetInnerHTML={{ __html: markedEle }} // eslint-disable-line
            />
          </span>
        </li>
      );
    }
    return null;
  }

  // 匹配联系电话
  renderTelephone() {
    const {
      listItem,
    } = this.props;
    const { searchText = '' } = this.getFilters();
    if (listItem.telephone
      && listItem.telephone.indexOf(searchText) > -1) {
      const markedEle = replaceWord({ value: listItem.telephone, searchText });
      return (
        <li key={listItem.telephone}>
          <span>
            <i className="label">联系电话：</i>
            <i
              dangerouslySetInnerHTML={{ __html: markedEle }} // eslint-disable-line
            />
          </span>
        </li>
      );
    }
    return null;
  }

  // 匹配经纪客户号
  renderCustId() {
    const {
      listItem,
    } = this.props;
    const { searchText = '' } = this.getFilters();
    if (listItem.custId
      && listItem.custId.indexOf(searchText) > -1) {
      const markedEle = replaceWord({ value: listItem.custId, searchText });
      return (
        <li key={listItem.custId}>
          <span>
            <i className="label">经纪客户号：</i>
            <i
              dangerouslySetInnerHTML={{ __html: markedEle }} // eslint-disable-line
            />
          </span>
        </li>
      );
    }
    return null;
  }

  // 匹配标签
  renderRelatedLabels(matchLabels) {
    const {
      listItem,
    } = this.props;
    if (_.isArray(matchLabels) && !matchLabels.length) {
      return null;
    }
    const { searchText = '' } = this.getFilters();
    if (!_.isEmpty(listItem.relatedLabels)) {
      let relatedLabels = _.filter(
        listItem.relatedLabels,
        item => item && _.includes(item.name, searchText),
      );
      if (_.isArray(matchLabels)) {
        relatedLabels = matchLabels;
      }
      if (!_.isEmpty(relatedLabels)) {
        const markedEle = relatedLabels.map((item) => {
          // 防止热点标签展示重复，这里从query上取source
          if (!isSightingScope(item.source)) {
            return replaceWord({ value: item.name, searchText });
          }
          return `${replaceWord({ value: item.name, searchText })}-${searchText}`;
        });
        return (
          <li key={markedEle}>
            <span>
              <i className="label">匹配标签：</i>
              <i
                dangerouslySetInnerHTML={{ __html: markedEle }} // eslint-disable-line
              />
            </span>
          </li>
        );
      }
    }
    return null;
  }

  // 模糊搜索匹配持仓产品
  renderSearchProduct() {
    const {
      listItem: { holdingProducts },
    } = this.props;
    const { searchText = '' } = this.getFilters();
    if (!_.isEmpty(holdingProducts)) {
      // 模糊匹配用搜索关键词取匹配产品的code和name
      // 匹配到的持仓产品大于1个时，显示 产品的名称/产品代码
      const filteredProducts = this.getFilteredProducts(holdingProducts, searchText);
      if (filteredProducts.length > 1) {
        return this.getMultipleHoldingProductNode(filteredProducts, searchText);
      }
      // 联想词进入列表并匹配到的持仓产品等于1个，显示 产品的名称/产品代码(持仓详情)
      return this.getSingleHoldingProductNode(filteredProducts, searchText);
    }
    return null;
  }

  // 服务记录的匹配
  renderServiceRecord() {
    const {
      listItem,
    } = this.props;
    const { searchText = '' } = this.getFilters();
    if (listItem.serviceRecord
      && listItem.serviceRecord.indexOf(searchText) > -1) {
      const markedEle = replaceWord({ value: listItem.serviceRecord, searchText });
      // 接口返回的接口数据是截断过的，需要前端在后面手动加...
      return (
        <li key={listItem.serviceRecord}>
          <span className={styles.serviceRecord}>
            <i className="label">服务记录：</i>
            <i dangerouslySetInnerHTML={{ __html: markedEle }} />
            <i>...</i>
          </span>
          <span
            className={styles.more}
            onClick={() => handleOpenFsp360TabAction({
              itemData: listItem,
              keyword: searchText,
              routerAction: this.context.push,
            })}
          >详情</span>
        </li>
      );
    }
    return null;
  }

  // 匹配可开通业务
  renderUnrightType() {
    const {
      listItem,
    } = this.props;
    if (listItem.unrightType) {
      const unrightTypeList = listItem.unrightType.split(' ');
      const tmpList = _.map(unrightTypeList, item => this.custUnrightBusinessType[item]);
      if (!_.isEmpty(tmpList)) {
        const data = tmpList.join('、');
        return (
          <li key={listItem.unrightType} title={data}>
            <span>
              <i className="label">{`可开通业务(${tmpList.length})`}：</i>
              {data}
            </span>
          </li>
        );
      }
    }
    return null;
  }

  // 匹配已开通业务
  renderUserRights() {
    const {
      listItem,
    } = this.props;
    if (listItem.userRights) {
      const userRightsList = listItem.userRights.split(' ');
      const tmpList = _.filter(_.map(userRightsList, item => this.businessConfig.get(item)));
      if (!_.isEmpty(tmpList)) {
        const data = tmpList.join('、');
        return (
          <li key={data} title={data}>
            <span>
              <i className="label">{`已开通业务(${tmpList.length})`}：</i>
              {data}
            </span>
          </li>
        );
      }
    }
    return null;
  }

  // 瞄准镜
  renderSightingTelescope(aimLabel) {
    const {
      listItem,
    } = this.props;
    const { id: labelMapping, name } = aimLabel;
    const relatedLabels = _.filter(
      listItem.relatedLabels,
      item => item && _.includes(item.source, 'jzyx') && _.includes(item.id, labelMapping),
    );
    // 构造成这种格式,父标签-子标签：标签值；子标签：标签值；子标签：标签值；子标签：标签值；
    let markedEle = relatedLabels.map(item =>
      (replaceWord({
        value: item.name,
        searchText: name,
        type: AIM_LABEL_ID,
      })));
    // 去除空字符串
    markedEle = _.filter(markedEle, item => !_.isEmpty(item));
    // 只有一个标签，去除-符号
    if (_.size(markedEle) === 1) {
      markedEle[0].replace('-', '');
    }
    const first = _.head(markedEle);
    let remain = _.slice(markedEle, 1);
    remain = remain.join('；');
    markedEle = _.concat(first, remain).join('');

    return (
      <li key={labelMapping}>
        <span>
          <i className="label">瞄准镜：</i>
          <i
            title={markedEle.replace(/<\/?[^>]*>/g, '')}
            dangerouslySetInnerHTML={{ __html: markedEle }} // eslint-disable-line
          />
        </span>
      </li>
    );
  }

  // 持仓产品
  renderHoldingProduct() {
    const {
      listItem: { holdingProducts },
    } = this.props;
    if (!_.isEmpty(holdingProducts)) {
      const { primaryKeyPrdts: [id, name] } = this.getFilters();
      const filteredProducts = this.getFilteredProductsById(holdingProducts, id);
      // 联想词进入列表并产品id匹配到的持仓产品等于1个，显示 产品的名称/产品代码(持仓详情)
      return !_.isEmpty(filteredProducts) &&
        this.getSingleHoldingProductNode(filteredProducts, name);
    }
    return null;
  }

  @autobind
  renderCustomerLabels() {
    const labelList = sessionStore.get(`CUSTOMERPOOL_MORE_FILTER_STORAGE_${this.hashString}`);
    const labelListId = _.map(labelList, item => item.key);
    const {
      listItem: { relatedLabels },
    } = this.props;
    if (!_.isEmpty(relatedLabels)
      && labelList.length) {
      // 瞄准镜标签对应的个性化信息
      const aimLabelList = _.filter(relatedLabels, item =>
        item.name && _.includes(labelListId, item.id) && isSightingScope(item.source));
      const amiListNode = _.map(aimLabelList, item => this.renderSightingTelescope(item));
      // 普通标签对应的个性化信息
      const normalLabelList = _.filter(relatedLabels, item =>
        item.name && _.includes(labelListId, item.id) && !isSightingScope(item.source));
      const normalListNode = this.renderRelatedLabels(normalLabelList);
      return [normalListNode, ...amiListNode];
    }
    return null;
  }

  // 持仓行业
  @autobind
  renderHoldingIndustry() {
    const {
      listItem,
      listItem: { custId, holdingIndustry },
      queryHoldingIndustryDetail,
      industryDetail,
      formatAsset,
      queryHoldingIndustryDetailReqState,
    } = this.props;
    if (!_.isEmpty(holdingIndustry)) {
      const { name, id } = holdingIndustry[0] || {};
      const props = {
        listItem,
        id,
        queryHoldingIndustryDetail,
        data: industryDetail,
        formatAsset,
        queryHoldingIndustryDetailReqState,
      };
      return (
        <li key={`${custId}${id}`}>
          <span>
            <i className="label">持仓行业：</i>
            <i>
              <em className="marked">
                {name}
              </em>
            </i>
            {this.isShowDetailBtn && <HoldingIndustryDetail {...props} />}
          </span>
        </li>
      );
    }
    return null;
  }

  @autobind
  renderIndividual(filterOrder) {
    let individualInfo = [];
    let individualId = [];
    _.forEach(filterOrder, (filterItem, index) => {
      const currentIndividual = matchAreaConfig[filterItem];
      const { key = [], inset } = currentIndividual;
      const isEnd = filterOrder.length === index + 1;
      if (inset || isEnd) {
        _.forEach(key, (individualItem) => {
          const { render: renderName, id } = individualItem;
          if (!_.includes(individualId, id)) {
            let itemNode = this[renderName](individualItem);
            individualId = [...individualId, id];
            itemNode = _.isArray(itemNode) ? itemNode : [itemNode];
            individualInfo = [...individualInfo, ...itemNode];
          }
        });
      }
    });
    individualInfo = _.compact(individualInfo);
    if (individualInfo.length) {
      return individualInfo;
    }
    return [
      this.renderUserRights(),
      this.renderUnrightType(),
    ];
  }

  render() {
    const { showAll } = this.state;
    const filterOrder = this.getFilterOrder();
    const individualList = this.renderIndividual(filterOrder);
    return (
      <div
        className={classNames({
          [styles.relatedInfo]: true,
          [styles.collapseItem]: !showAll,
        })}
      >
        <ul>
          {individualList}
        </ul>
        {
          individualList.length > 2 ?
            <div className={styles.showAll}>
              <Icon
                type={showAll ? 'shouqi2' : 'zhankai1'}
                className={styles.icon}
                onClick={this.showAllIndividual}
              />
            </div> :
            null
        }
      </div>
    );
  }
}
