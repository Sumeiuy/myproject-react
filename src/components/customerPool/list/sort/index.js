/**
 * @Descripter: 客户列表=》排序
 * @Author: K0170179
 * @Date: 2018/7/18
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { url } from '../../../../helper';
import withRouter from '../../../../decorators/withRouter';
import { sortQuotaConfig, dynamicInsertQuota } from './config';
import CommonSort from '../../../common/sort';

@withRouter
export default class Sort extends PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  getSortQuota() {
    const {
      location: { query: { filters } },
    } = this.props;
    const filter = url.transfromFilterValFromUrl(filters);
    const dynamicInsertQuotaList = _.filter(
      dynamicInsertQuota,
      (quotaItem) => {
        const filterValue = filter[quotaItem.filterType];
        if (_.isArray(filterValue)) {
          const finalFilterValue = _.filter(filterValue, item => item !== '');
          return !_.isEmpty(finalFilterValue);
        }
        return filterValue;
      },
    );
    return _.uniqBy([...sortQuotaConfig, ...dynamicInsertQuotaList], 'sortType');
  }

  @autobind
  handleChange(value) {
    const { onChange } = this.props;
    onChange(value);
  }

  render() {
    const { value } = this.props;
    return (
      <CommonSort
        value={value}
        onChange={this.handleChange}
        data={this.getSortQuota()}
      />
    );
  }
}
