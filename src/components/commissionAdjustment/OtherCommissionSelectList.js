/**
 * @file components/commissionAdjustment/OtherCommissionSelectList.js
 * @description 其他佣金率Select选择列表
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Icon } from 'antd';

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

  render() {
    const { onChange } = this.props;
    return (
      <div className={styles.otherComsBoxWrap} ref={this.wrapRef}>
        <div className={styles.otherComsBox}>
          <OtherCommissionSelect
            label="B股"
            name="bgCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="债券"
            name="zqCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="回购"
            name="hCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="场内基金"
            name="oCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="权证"
            name="qCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="担保股基"
            name="stkCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="担保债券"
            name="dzCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="担保场内基金"
            name="doCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
        </div>
        <div className={styles.otherComsBox}>
          <OtherCommissionSelect
            label="担保权证"
            name="dqCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="信用股基"
            name="creditCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="信用场内基金"
            name="coCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="港股通（净佣金）"
            name="hkCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="个股期权"
            name="opCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="担保品大宗交易"
            name="ddCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="股转"
            name="stbCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
          <OtherCommissionSelect
            label="大宗交易"
            name="dCommission"
            onChange={onChange}
            getPopupContainer={this.getWrapRef}
          />
        </div>
        <div className={styles.blockTip}>
          <Icon type="exclamation-circle" /> 本功能不提供特殊资产校验的费率设置，如需调整请通过单客户佣金调整功能
        </div>
      </div>
    );
  }
}
