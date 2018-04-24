/**
 * @file components/customerPool/list/MatchArea.js
 *  客户列表项中的匹配出来的数据
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isSightingScope } from '../helper';
import HoldingProductDetail from './HoldingProductDetail';
import styles from './matchArea.less';

const haveTitle = title => (title ? `<i class="tip">${title}</i>` : null);

const replaceWord = ({ value, q, title = '', type = '' }) => {
  const titleDom = haveTitle(title);
  const regxp = new RegExp(q, 'g');
  // 瞄准镜标签后面添加字符，用以分割
  const holder = type === 'sightingTelescope' ? '-' : '';
  // 容错处理
  if (_.isEmpty(value)) {
    return '';
  }
  return value.replace(regxp,
    `<em class="marked">${q}${titleDom || ''}</em>${holder}`);
};

// const getNewHtml = (value, k) => (`<li><span><i class="label">${value}：</i>${k}</span></li>`);

// 匹配标签区域超过两条显示 展开/收起 按钮
// const FOLD_NUM = 2;

export default class MatchArea extends PureComponent {

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
  }

  static contextTypes = {
    empInfo: PropTypes.object,
  };

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
    custBusinessType.forEach((item) => {
      this.businessConfig.set(item.key, item.value);
    });
  }

  // 匹配姓名
  renderName() {
    const {
      q = '',
      listItem,
      location: { query: { source } },
    } = this.props;
    if (_.includes(['search', 'association'], source)
      && listItem.name
      && listItem.name.indexOf(q) > -1) {
      const markedEle = replaceWord({ value: listItem.name, q });
      return (
        <li>
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
      q = '',
      listItem,
      location: { query: { source } },
    } = this.props;
    if (_.includes(['search', 'association'], source)
      && listItem.idNum
      && listItem.idNum.indexOf(q) > -1) {
      const markedEle = replaceWord({ value: listItem.idNum, q });
      return (
        <li>
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
      q = '',
      listItem,
      location: { query: { source } },
    } = this.props;
    if (_.includes(['search', 'association'], source)
      && listItem.telephone
      && listItem.telephone.indexOf(q) > -1) {
      const markedEle = replaceWord({ value: listItem.telephone, q });
      return (
        <li>
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
      q = '',
      listItem,
      location: { query: { source } },
    } = this.props;
    if (_.includes(['search', 'association'], source)
      && listItem.custId
      && listItem.custId.indexOf(q) > -1) {
      const markedEle = replaceWord({ value: listItem.custId, q });
      return (
        <li>
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
  renderRelatedLabels() {
    const {
      q = '',
      listItem,
      location: { query: { source } },
    } = this.props;
    if (_.includes(['search', 'association', 'tag'], source) && !_.isEmpty(listItem.relatedLabels)) {
      const relatedLabels = _.filter(
        listItem.relatedLabels,
        item => item && _.includes(item.name, q),
      );
      // 有描述
      // const markedEle = relatedLabels.map(item => (
      //   replaceWord({ value: item, q, title: listItem.reasonDesc });
      // ));
      if (!_.isEmpty(relatedLabels)) {
        const markedEle = relatedLabels.map((item) => {
          // 防止热点标签展示重复，这里从query上取source
          if (!isSightingScope(item.source)) {
            return replaceWord({ value: item.name, q });
          }
          return `${replaceWord({ value: item.name, q })}-${q}`;
        });
        return (
          <li>
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

  // 匹配可开通业务
  renderUnrightType() {
    const {
      // q = '',
      listItem,
      location: { query: { source } },
    } = this.props;
    if (_.includes(['numOfCustOpened', 'business'], source) && listItem.unrightType) {
      const unrightTypeList = listItem.unrightType.split(' ');
      const tmpList = _.filter(_.map(unrightTypeList, item => this.businessConfig.get(item)));
      if (!_.isEmpty(tmpList)) {
        const data = tmpList.join('、');
        return (
          <li title={data}>
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
      // q = '',
      listItem,
      location: { query: { source } },
    } = this.props;
    if (_.includes(['numOfCustOpened', 'business'], source) && listItem.userRights) {
      const userRightsList = listItem.userRights.split(' ');
      const tmpList = _.filter(_.map(userRightsList, item => this.businessConfig.get(item)));
      if (!_.isEmpty(tmpList)) {
        const data = tmpList.join('、');
        return (
          <li title={data}>
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

  // 显示账户状态
  renderStatus() {
    const {
      // q = '',
      listItem,
      location: { query: { source } },
    } = this.props;
    if (source === 'custIndicator' && listItem.accountStausName) {
      return (
        <li title={listItem.accountStausName}>
          <span>
            <i className="label">账户状态：</i>
            {listItem.accountStausName}
          </span>
        </li>
      );
    }
    return null;
  }

  // 服务记录的匹配
  renderServiceRecord() {
    const {
      q = '',
      listItem,
      location: { query: { source } },
    } = this.props;
    if (_.includes(['search', 'association'], source)
      && listItem.serviceRecord
      && listItem.serviceRecord.indexOf(q) > -1) {
      const markedEle = replaceWord({ value: listItem.serviceRecord, q });
      // 接口返回的接口数据是截断过的，需要前端在后面手动加...
      return (
        <li>
          <span>
            <i className="label">服务记录：</i>
            <i dangerouslySetInnerHTML={{ __html: markedEle }} />
            <i>...</i>
          </span>
        </li>
      );
    }
    return null;
  }

  // 瞄准镜
  renderSightingTelescope() {
    const {
      q = '',
      listItem,
      location: { query: { source, labelMapping } },
    } = this.props;
    if (source === 'sightingTelescope'
      && !_.isEmpty(listItem.relatedLabels)) {
      // 筛选出source='jzyx'的数据
      const relatedLabels = _.filter(
        listItem.relatedLabels,
        item => item && _.includes(item.source, 'jzyx') && _.includes(item.id, labelMapping),
      );
      // 有描述
      // const markedEle = relatedLabels.map(v => (replaceWord(v, q, listItem.reasonDesc)));
      if (!_.isEmpty(relatedLabels)) {
        // 构造成这种格式,父标签-子标签：标签值；子标签：标签值；子标签：标签值；子标签：标签值；
        let markedEle = relatedLabels.map(item =>
          (replaceWord({ value: item.name, q, type: source })));
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
          <li>
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
    }
    return null;
  }

  // 持仓产品
  renderHoldingProduct() {
    const {
      q = '',
      listItem: { holdingProducts },
      location: { query: { source } },
    } = this.props;
    if (_.includes(['search', 'association'], source) && !_.isEmpty(holdingProducts)) {
      // 匹配到的持仓产品大于1个时，显示 产品的名称/产品代码
      const filteredProducts = this.getFilteredProducts(holdingProducts, q);
      if (filteredProducts.length > 1) {
        return this.getMultipleHoldingProductNode(filteredProducts, q);
      }
      // 匹配到的持仓产品大于1个，显示 产品的名称/产品代码(持仓详情)
      return this.getSingleHoldingProductNode(holdingProducts, q);
    }
    return null;
  }

  // 关键词匹配到的持仓产品
  getFilteredProducts(list, keyword) {
    return _.filter(
      list,
      item => item && (_.includes(item.id, keyword) || _.includes(item.name, keyword)),
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
        item => `${replaceWord({ value: item.name, q: keyword })}/${replaceWord({ value: item.code, q: keyword })}`,
      );
      const htmlString = htmlStringList.join(',');
      return (
        <li title={htmlString.replace(/<\/?[^>]*>/g, '')}>
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
    const filteredProducts = this.getFilteredProducts(list, keyword);
    // 是否显示’持仓详情‘，默认不显示
    let isShowDetailBtn = true;
    // 有“HTSC 交易信息查询权限（非私密客户）”可以看非私密客户的持仓信息
    if (hasNPCTIQPermission && !isPrivateCustomer) {
      isShowDetailBtn = true;
    }
    // 有“HTSC 交易信息查询权限（含私密客户）”可以看所有客户的持仓信息
    // 主服务经理 可以看名下所有客户的持仓信息
    if (hasPCTIQPermission || empInfo.rowId === empId) {
      isShowDetailBtn = true;
    }
    if (!_.isEmpty(filteredProducts)) {
      const { name, code } = filteredProducts[0] || {};
      const htmlString = `${replaceWord({ value: name, q: keyword })}/${replaceWord({ value: code, q: keyword })}`;
      const props = {
        custId,
        data: filteredProducts[0] || {},
        queryHoldingProduct,
        holdingProducts,
        queryHoldingProductReqState,
        formatAsset,
      };
      return (
        <li>
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

  render() {
    return (
      <div className={styles.relatedInfo}>
        <ul>
          {this.renderName()}
          {this.renderIdNum()}
          {this.renderTelephone()}
          {this.renderCustId()}
          {this.renderRelatedLabels()}
          {this.renderUnrightType()}
          {this.renderUserRights()}
          {this.renderStatus()}
          {this.renderServiceRecord()}
          {this.renderSightingTelescope()}
          {this.renderHoldingProduct()}
        </ul>
      </div>
    );
  }
}
