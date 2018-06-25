/**
 * @file components/customerPool/list/MatchArea.js
 *  客户列表项中的匹配出来的数据
 * @author wangjunjun
 * @Last Modified by: xiaZhiQiang
 * @Last Modified time: 2018-06-21 12:12:31
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import store from 'store';
import { isSightingScope } from '../../helper';
import { url as urlHelper, url } from '../../../../helper';
import seperator from '../../../../config/filterSeperator';
import { openFspTab, openRctTab } from '../../../../utils/index';
import { MORE_FILTER_STORAGE } from '../../../../config/filterContant';
import HoldingProductDetail from '../HoldingProductDetail';
import HoldingCombinationDetail from '../HoldingCombinationDetail';
import matchAreaConfig from './config';
import styles from './matchArea.less';

const FILTER_ORDER = `FILTER_ORDER_${_.random(1, 100000)}`; // 作为过滤器触发顺利在localStorage存储的key
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

// 个人对应的code码
const PER_CODE = 'per';
// 一般机构对应的code码
const ORG_CODE = 'org';

export default class MatchArea extends PureComponent {
  static setFilterOrder(id, value) {
    const filterOrder = store.get('filterOrder') || [];
    const finalId = _.isArray(id) ? id : [id];
    let finalOrder = _.difference(filterOrder, finalId);
    if (value && !_.includes(value, unlimited)) {
      finalOrder = [...finalId, ...finalOrder];
    }
    store.set(FILTER_ORDER, [...new Set(finalOrder)]);
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
  };

  static contextTypes = {
    push: PropTypes.func.isRequired,
    empInfo: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const {
      dict: {
        custBusinessType = [],
        custUnrightBusinessType = [],
      },
    } = props;

    this.businessConfig = new Map();
    custBusinessType.forEach((item) => {
      this.businessConfig.set(item.key, item.value);
    });
    // 可开通业务的匹配
    this.custUnrightBusinessType = {};
    custUnrightBusinessType.forEach((item) => {
      this.custUnrightBusinessType[item.key] = item.value;
    });
  }

  /**
   * 跳转到360服务记录页面
   * @param {*object} itemData 当前列表item数据
   * @param {*} keyword 当前输入关键字
   */
  @autobind
  handleOpenFsp360TabAction(itemData, keyword) {
    const { custNature, custId, rowId, ptyId } = itemData;
    const type = (!custNature || custNature === PER_CODE) ? PER_CODE : ORG_CODE;
    const url360 = `/customerCenter/360/${type}/main?id=${custId}&rowId=${rowId}&ptyId=${ptyId}&keyword=${keyword}`;
    const pathname = '/customerCenter/fspcustomerDetail';
    openFspTab({
      routerAction: this.context.push,
      url360,
      query: {
        custId,
        rowId,
        ptyId,
        keyword,
      },
      pathname,
      param: {
        id: 'FSP_360VIEW_M_TAB',
        title: '客户360视图-客户信息',
        forceRefresh: true,
        activeSubTab: ['服务记录'],
        // 服务记录搜索
        serviceRecordKeyword: keyword,
        // 服务渠道
        serviceRecordChannel: encodeURIComponent('理财服务平台'),
      },
      state: {
        url,
      },
    });
  }

  getFilters() {
    const {
      location: { query: { filters } },
    } = this.props;
    return url.transfromFilterValFromUrl(filters);
  }

  // 直接取后端返回值渲染的情况
  renderDefaultVal(item) {
    const {
      listItem,
    } = this.props;
    const { name, id, unit = '' } = item;
    const currentVal = listItem[id];
    if (currentVal) {
      return (
        <li title={currentVal}>
          <span>
            <i className="label">{name}：</i>
            {currentVal}{unit}
          </span>
        </li>
      );
    }
    return null;
  }

  @autobind
  renderNoCompleted(currentItem) {
    const {
      listItem,
    } = this.props;
    const { name, id, descMap } = currentItem;
    let noCompleteIdList = _.omitBy(descMap, (value, key) => listItem[key] === 'N');
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
      listItem: { jxgrpProducts, isPrivateCustomer, empId, custId },
      hasNPCTIQPermission,
      hasPCTIQPermission,
      queryHoldingSecurityRepetition,
      holdingSecurityData,
      formatAsset,
    } = this.props;
    const { primaryKeyJxgrps } = this.getFilters();
    if (!_.isEmpty(jxgrpProducts)) {
      const { empInfo: { empInfo = {} } } = this.context;
      // 是否显示’持仓详情‘，默认不显示
      let isShowDetailBtn = false;
      // 有“HTSC 交易信息查询权限（非私密客户）”可以看非私密客户的持仓信息
      if (hasNPCTIQPermission && !isPrivateCustomer) {
        isShowDetailBtn = true;
      }
      // 有“HTSC 交易信息查询权限（含私密客户）”可以看所有客户的持仓信息
      // 主服务经理 可以看名下所有客户的持仓信息
      if (hasPCTIQPermission || empInfo.rowId === empId) {
        isShowDetailBtn = true;
      }
      const id = decodeURIComponent(primaryKeyJxgrps[0]);
      const currentItem = _.find(jxgrpProducts, item => item.id === id);
      const { code: combinationCode } = currentItem;
      const props = {
        combinationCode,
        custId,
        queryHoldingSecurityRepetition,
        data: holdingSecurityData,
        formatAsset,
      };
      if (!_.isEmpty(currentItem)) {
        return (
          <li key={id}>
            <span>
              <i className="label">订购组合：</i>
              <i>
                <em
                  className={`marked ${styles.clickable}`}
                  onClick={() => this.handleOrderCombinationClick(currentItem.name)}
                >
                  {currentItem.name}
                </em>
                /{currentItem.code}
              </i>
              {isShowDetailBtn && <HoldingCombinationDetail {...props} />}
            </span>
          </li>
        );
      }
    }
    return null;
  }

  // 点击订购组合名称跳转到详情页面
  @autobind
  handleOrderCombinationClick(name) {
    const { push } = this.context;
    const { location: { query: { combinationCode } } } = this.props;
    const query = { id: combinationCode, name };
    const sUrl = `/choicenessCombination/combinationDetail?${urlHelper.stringify(query)}`;
    const pathname = '/choicenessCombination/combinationDetail';
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_JX_GROUP_DETAIL',
      title: '组合详情',
    };
    openRctTab({
      routerAction: push,
      sUrl,
      query,
      pathname,
      param,
      state: {
        sUrl,
      },
    });
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
    if (matchLabels && !matchLabels.length) {
      return [];
    }
    const { searchText = '' } = this.getFilters();
    if (!_.isEmpty(listItem.relatedLabels)) {
      let relatedLabels = _.filter(
        listItem.relatedLabels,
        item => item && _.includes(item.name, searchText),
      );
      if (matchLabels) {
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
      location: { query: { filters } },
    } = this.props;
    const { searchText = '' } = url.transfromFilterValFromUrl(filters);
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
            onClick={() => this.handleOpenFsp360TabAction(listItem, searchText)}
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
      listItem: { isPrivateCustomer, empId, custId },
      hasNPCTIQPermission,
      hasPCTIQPermission,
      queryHoldingProduct,
      holdingProducts,
      queryHoldingProductReqState,
      formatAsset,
    } = this.props;
    const { empInfo: { empInfo = {} } } = this.context;
    // 是否显示’持仓详情‘，默认不显示
    let isShowDetailBtn = false;
    // 有“HTSC 交易信息查询权限（非私密客户）”可以看非私密客户的持仓信息
    if (hasNPCTIQPermission && !isPrivateCustomer) {
      isShowDetailBtn = true;
    }
    // 有“HTSC 交易信息查询权限（含私密客户）”可以看所有客户的持仓信息
    // 主服务经理 可以看名下所有客户的持仓信息
    if (hasPCTIQPermission || empInfo.rowId === empId) {
      isShowDetailBtn = true;
    }
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
            {isShowDetailBtn && <HoldingProductDetail {...props} />}
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
      store.remove(FILTER_ORDER);
      const filtersArray = filters ? filters.split(seperator.filterSeperator) : [];
      const filterList = _.map(filtersArray, item =>
        item.split(seperator.filterInsideSeperator)[0]);
      const filterOrder = _.filter(needInfoFilter, item => _.includes(filterList, item));
      MatchArea.setFilterOrder(filterOrder, true);
      return filterOrder;
    }
    return _.filter(store.get(FILTER_ORDER), item => _.includes(needInfoFilter, item));
  }

  @autobind
  renderCustomerLabels() {
    const labelList = store.get(MORE_FILTER_STORAGE);
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
    return [];
  }

  @autobind
  renderIndividual(filterOrder) {
    let individualInfo = [];
    let individualId = [];
    _.map(filterOrder, (filterItem, index) => {
      const currentIndividual = matchAreaConfig[filterItem];
      const { key = [], inset } = currentIndividual;
      const isEnd = filterOrder.length === index + 1;
      if (inset || isEnd) {
        _.map(key, (individualItem) => {
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
    if (filterOrder.length && individualInfo.length) {
      return individualInfo;
    }
    return [
      this.renderUserRights(),
      this.renderUnrightType(),
    ];
  }

  render() {
    const filterOrder = this.getFilterOrder();
    return (
      <div className={styles.relatedInfo}>
        <ul>
          {this.renderIndividual(filterOrder)}
        </ul>
      </div>
    );
  }
}
