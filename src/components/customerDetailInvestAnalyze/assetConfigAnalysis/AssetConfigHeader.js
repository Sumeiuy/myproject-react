/*
 * @Author: zhangjun
 * @Date: 2018-12-04 10:52:33
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-04 20:44:07
 * @description 资产配置头部
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SingleFilter } from 'lego-react-filter/src';
import InfoTitle from '../InfoTitle';
import { ASSET_CLASSIFY_LIST } from './config';
import styles from './assetConfigHeader.less';

export default class AssetConfigHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    // 资产分类
    classify: PropTypes.string.isRequired,
    // 资产分类数据变化
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const {
      title,
      classify,
      onChange,
    } = this.props;
    return (
      <div className={styles.assetConfigHeader}>
        <InfoTitle title={title} />
        <div className={styles.classifySelectContainer}>
          <SingleFilter
            useCustomerFilter
            dataMap={['value', 'label']}
            data={ASSET_CLASSIFY_LIST}
            value={classify}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }
}
