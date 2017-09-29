/**
 * @file components/commissionAdjustment/OtherCommissionSelectList.js
 * @description 其他佣金率Select选择列表
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Icon } from 'antd';

import dictMap from '../../config/otherCommissionDictionary';
import OtherCommissionSelect from './OtherCommissionSelect';
import styles from './otherCommissionSelectList.less';

export default class OtherCommissionSelectList extends PureComponent {
  static propTypes = {
    otherRatios: PropTypes.array,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    otherRatios: [],
    onChange: () => {},
  };

  @autobind
  getWrapRef() {
    return this.wrap;
  }

  @autobind
  wrapRef(input) {
    this.wrap = input;
  }

  @autobind
  makeSelect(item) {
    const { onChange } = this.props;
    const { code, options } = item;
    const { brief, paramName } = dictMap[code];
    const newOptions = options.map(option => ({
      label: option.codeDesc,
      value: option.codeValue,
      show: true,
    }));
    return (
      <OtherCommissionSelect
        key={code}
        label={brief}
        name={paramName}
        options={newOptions}
        onChange={onChange}
        getPopupContainer={this.getWrapRef}
      />
    );
  }

  render() {
    const { otherRatios } = this.props;
    const compactRatios = _.compact(otherRatios);
    const oddCommissionArray = _.filter(compactRatios, (v, index) => index % 2 === 1);
    const evenCommissionArray = _.filter(compactRatios, (v, index) => index % 2 === 0);
    return (
      <div className={styles.otherComsBoxWrap} ref={this.wrapRef}>
        <div className={styles.otherComsBox}>
          {
            evenCommissionArray.map(this.makeSelect)
          }
        </div>
        <div className={styles.otherComsBox}>
          {
            oddCommissionArray.map(this.makeSelect)
          }
        </div>
        <div className={styles.blockTip}>
          <Icon type="exclamation-circle" /> 本功能不提供特殊资产校验的费率设置，如需调整请通过单客户佣金调整功能
        </div>
      </div>
    );
  }
}
