/**
 * @fileOverview components/customerPool/TargetCustomerRow.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户列表
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Row, Col } from 'antd';

import Icon from '../../common/Icon';

import styles from './targetCustomerRow.less';

// 客户男女code码
const MALE_CODE = '109001';
const FEMALE_CODE = '109002';

// 个人对应的code码
const PER_CODE = 'per';
// 一般机构对应的code码
const ORG_CODE = 'org';
// 产品机构对应的code码
const PROD_CODE = 'prod';

export default class TargetCustomerRow extends PureComponent {

  static propTypes = {
    item: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  @autobind
  handleClick() {
    const { item, onClick } = this.props;
    onClick({ id: item.custId });
  }

  // 渲染客户头像
  // 区分产品机构、一般机构、个人客户：男、女 ，四种头像
  @autobind
  renderAvator({ genderCode = '', custNature = '' }) {
    let type = '';
    if (custNature === PER_CODE) {
      if (genderCode === MALE_CODE) {
        type = 'gerenkehu';
      } else if (genderCode === FEMALE_CODE) {
        type = 'nvxingtouxiang';
      }
    } else if (custNature === ORG_CODE) {
      type = 'icon-yibanjigou';
    } else if (custNature === PROD_CODE) {
      type = 'chanpinjigou';
    }
    return (<Icon
      type={'gerenkehu'}
    />);
  }

  render() {
    const { item } = this.props;
    return (
      <div className={styles.rowItem} onClick={this.handleClick}>
        <Row>
          <Col className={`${styles.textCenter} ${styles.status}`} span={7}>{item.missionStatusValue}</Col>
          <Col span={16}>
            <Row>
              <Col>
                {this.renderAvator(item)}
                <span className={styles.name}>{item.custName}</span>
              </Col>
              <Col></Col>
            </Row>
          </Col>
        </Row>
        {/* <span className={styles.status}>{item.missionStatusValue}</span>
        <div className={styles.relateInfo}>
          <Row>
            <Col></Col>
          </Row>
        </div> */}
      </div>
    );
  }
}

