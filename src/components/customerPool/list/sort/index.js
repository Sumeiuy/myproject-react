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
import { sortQuotaConfig, dynamicInsetQuota } from './config';
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
    const dynamicInsetQuotaList = _.filter(dynamicInsetQuota,
        quotaItem => filter[quotaItem.filterType]);
    return _.uniqBy([...sortQuotaConfig, ...dynamicInsetQuotaList], 'sortType');
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
