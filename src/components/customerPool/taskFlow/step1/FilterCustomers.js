/**
 * @file components/customerPool/taskFlow/FilterCustomers.js
 *  瞄准镜筛查客户弹窗-客户筛选
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { isSightingScope } from '../../helper';
import { SingleFilter, MultiFilter } from '../../../common/filter';
import styles from './filterCustomers.less';
import Icon from '../../../common/Icon';

// 数据转化
// [{itemCode: '1', itemDesc: 'fg'}] => [{key: '1', value: 'fg'}]
const transformData = list => _.map(list, item => _.mapKeys(item, (value, key) => {
  if (key === 'itemCode') {
    return 'key';
  }
  if (key === 'itemDesc') {
    return 'value';
  }
  return key;
}));

const COMMON_SIZE = 5;

export default class Filter extends PureComponent {
  static propTypes = {
    dict: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    source: PropTypes.string,
    currentItems: PropTypes.array.isRequired,
  }

  static defaultProps = {
    source: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.toggleMoreBtn(props.sightingTelescopeFilters),
      fold: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      sightingTelescopeFilters = {},
    } = nextProps;

    this.setState({
      ...this.toggleMoreBtn(sightingTelescopeFilters),
    });
  }

  @autobind
  toggleMoreBtn(sightingTelescopeFilters = {}) {
    const { filterList = [] } = sightingTelescopeFilters || {};
    const filterSize = _.size(filterList);
    // 默认四条规则，加上瞄准镜规则,只有是瞄准镜标签
    const moreBtnVisible = isSightingScope(this.props.source) && filterSize > 1;

    return { filterSize, moreBtnVisible };
  }

  @autobind
  handleMore() {
    const { fold } = this.state;
    this.setState({
      fold: !fold,
    });
  }

  // 瞄准镜筛选
  @autobind
  renderSightingTelescopeFilter() {
    const {
      sightingTelescopeFilters,
      onFilterChange,
      source,
      currentItems,
    } = this.props;

    const { moreBtnVisible, fold } = this.state;

    if (!isSightingScope(source) ||
      _.isEmpty(sightingTelescopeFilters) || _.isEmpty(sightingTelescopeFilters.filterList)) {
      return null;
    }
    return _.map(sightingTelescopeFilters.filterList, (obj, index) => {
      const target = _.find(currentItems, (item) => {
        const [name] = item.split('.');
        return name === obj.filterCode;
      });
      const backfillValue = (target || '').split('.')[1] || '';

      return (
        <div
          className={classnames({
            // 超过五个，并且可以展开就隐藏
            [styles.none]: moreBtnVisible && fold && Number(index) + 1 > COMMON_SIZE,
          })}
        >
          <SingleFilter
            key={obj.filterCode}
            value={backfillValue}
            filterLabel={obj.filterDesc}
            filter={obj.filterCode}
            filterField={transformData(obj.items)}
            onChange={onFilterChange}
          />
        </div>
      );
    });
  }

  render() {
    const { dict, onFilterChange, currentItems } = this.props;
    const currentValue = _.reduce(currentItems, (result, value) => {
      const [name, code] = value.split('.');
      result[name] = code; // eslint-disable-line
      return result;
    }, {});
    const { moreBtnVisible, fold, filterSize } = this.state;
    const foldClass = classnames({ up: !fold });
    const isFold = moreBtnVisible && fold;
    return (
      <div className={styles.filterSection}>
        {this.renderSightingTelescopeFilter()}
        <div
          className={classnames({
            [styles.none]: isFold && (filterSize + 1) > COMMON_SIZE,
          })}
        >
          <SingleFilter
            value={currentValue.CustomType || ''}
            filterLabel="客户性质"
            filter="CustomType"
            filterField={dict.custNature}
            onChange={onFilterChange}
          />
        </div>
        <div
          className={classnames({
            [styles.none]: isFold && (filterSize + 2) > COMMON_SIZE,
          })}
        >
          <SingleFilter
            value={currentValue.CustClass || ''}
            filterLabel="客户类型"
            filter="CustClass"
            filterField={dict.custType}
            onChange={onFilterChange}
          />
        </div>
        <div
          className={classnames({
            [styles.none]: isFold && (filterSize + 3) > COMMON_SIZE,
          })}
        >
          <SingleFilter
            value={currentValue.RiskLvl || ''}
            filterLabel="风险等级"
            filter="RiskLvl"
            filterField={dict.custRiskBearing}
            onChange={onFilterChange}
          />
        </div>
        <div
          className={classnames({
            [styles.none]: isFold && (filterSize + 4) > COMMON_SIZE,
          })}
        >
          <MultiFilter
            value={currentValue.Rights || ''}
            filterLabel="已开通业务"
            filter="Rights"
            filterField={dict.custBusinessType}
            onChange={onFilterChange}
          />
        </div>
        {
          moreBtnVisible ?
            <div className={styles.moreBtn} onClick={this.handleMore}>
              {fold ? '查看全部' : '收起'}&nbsp;<Icon type="more-down-copy" className={foldClass} />
            </div> :
            null
        }
      </div >
    );
  }
}
