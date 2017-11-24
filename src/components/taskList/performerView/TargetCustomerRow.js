/**
 * @fileOverview components/customerPool/TargetCustomerRow.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户列表
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Row, Col } from 'antd';
import classnames from 'classnames';

import Icon from '../../common/Icon';
import { riskLevelConfig, rankClsConfig } from './targetCustomerConfig';

import styles from './targetCustomerRow.less';

// 客户男女code码
const MALE_CODE = '109001';
const FEMALE_CODE = '109002';

// 男性客户的头像
const MALE_ICON = 'gerenkehu';
// 女性客户的头像
const FEMALE_ICON = 'nvxingtouxiang';
// 一般机构的头像
const ORG_ICON = 'yibanjigou';
// 产品机构的头像
const PROD_ICON = 'chanpinjigou';

// 个人对应的code码
const PER_CODE = 'per';
// 一般机构对应的code码
const ORG_CODE = 'org';
// 产品机构对应的code码
const PROD_CODE = 'prod';

// 男性客户的头像颜色值class名
const MALE_COLOR = 'maleColor';
// 女性客户的头像颜色值class名
const FEMALE_COLOR = 'femaleColor';
// 一般机构客户的头像颜色值class名
const ORG_COLOR = 'orgColor';
// 产品机构的头像颜色值class名
const PROD_COLOR = 'prodColor';


export default class TargetCustomerRow extends PureComponent {

  static propTypes = {
    isFold: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    // 默认选中的客户id
    defaultSelectId: PropTypes.string.isRequired,
  }

  @autobind
  handleClick() {
    const { item, onClick } = this.props;
    onClick({ id: item.custId });
  }

  /**
   * 传入客户的性别编码 genderCode 和客户性质 custNature
   * 渲染客户头像
   * 区分产品机构、一般机构、个人客户：男、女 ，四种头像
   */
  @autobind
  renderAvator(genderCode = '', custNature = '') {
    let type = '';
    let colorCls = '';
    if (custNature === PER_CODE) {
      if (genderCode === MALE_CODE) {
        type = MALE_ICON;
        colorCls = MALE_COLOR;
      } else if (genderCode === FEMALE_CODE) {
        type = FEMALE_ICON;
        colorCls = FEMALE_COLOR;
      }
    } else if (custNature === ORG_CODE) {
      type = ORG_ICON;
      colorCls = ORG_COLOR;
    } else if (custNature === PROD_CODE) {
      type = PROD_ICON;
      colorCls = PROD_COLOR;
    }
    return (<Icon
      type={type}
      className={styles[colorCls]}
    />);
  }

  // 传入客户的风险等级编码 riskLevelCode 渲染客户的风险等级小图标
  @autobind
  renderRiskLevelIcon(riskLevelCode = '') {
    if (!riskLevelCode || !riskLevelConfig[riskLevelCode]) {
      return '';
    }
    const name = riskLevelConfig[riskLevelCode].name;
    const cls = riskLevelConfig[riskLevelCode].colorCls;
    return (<span
      className={`${styles.riskLevel} ${styles[cls]}`}
    >
      { name }
    </span>);
  }

  // 传入客户等级编码 levelCode ，返回客户的等级小图标
  renderRankIcon(levelCode = '') {
    const cls = rankClsConfig[levelCode];
    return (
      <span className={`${styles.vipLevel} ${styles[cls]}`} />
    );
  }

  render() {
    const {
      isFold,
      item = {},
      location: {
        query: {
          targetCustId = '',
        },
      },
      defaultSelectId = '',
    } = this.props;
    const {
      missionStatusValue,
      riskLevelCode,
      genderCode,
      custNature,
      levelCode,
      custName,
      custId,
      isSign,
    } = item;
    // 根据左侧列表的收起和展开来设置数据三列显示还是两列显示
    const colSpanValue = isFold ? 12 : 24;
    // 数据三列显示时，给第三列增加左内边距35px
    const col3Cls = classnames([styles.ln24], {
      [styles.pl35]: isFold,
    });
    // url中的targetCustId存在，就选中url中targetCustId对应的数据，否则默认选中第一条数据
    const rowItemCls = classnames([styles.rowItem], {
      [styles.active]: targetCustId ? targetCustId === custId : custId === defaultSelectId,
    });
    return (
      <div className={rowItemCls} onClick={this.handleClick}>
        <Row type="flex" justify="start" align="middle">
          <Col className={`${styles.textCenter} ${styles.status}`} span={7}>{missionStatusValue}</Col>
          <Col span={17} className={styles.pr14}>
            <Row>
              <Col span={colSpanValue} className={`${styles.ln24} ${styles.ellipsis}`}>
                {this.renderAvator(genderCode, custNature)}
                <span className={styles.name}>{custName}</span>
              </Col>
              <Col span={colSpanValue} className={col3Cls}>
                { this.renderRankIcon(levelCode) }
                { this.renderRiskLevelIcon(riskLevelCode) }
                {
                  isSign ? <span className={styles.sign}>签约</span> : null
                }
              </Col>
            </Row>
          </Col>
        </Row>
        <span className={styles.triangle} />
      </div>
    );
  }
}

