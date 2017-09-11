/**
 * @file customerPool/CustomerIndicators.js
 *  目标客户池-客户指标
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Row, Col } from 'antd';
import { fspContainer } from '../../../config';
import { fspGlobal, helper } from '../../../utils';
import Icon from '../../common/Icon';
import styles from './performanceIndicators.less';

export default class CustomerIndicators extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    data: {},
  }

  // 格式化数字，逢三位加一个逗号
  numFormat(num) {
    let newStr = '';
    let count = 0;
    let negative = '';
    let str = num.toString();
    if (num === '--') {
      return '--';
    }
    if (str.indexOf('-') !== -1) {
      str = Math.abs(str).toString();
      negative = '-';
    }
    if (str.indexOf('.') === -1) {
      for (let i = str.length - 1; i >= 0; i--) {
        if (count % 3 === 0 && count !== 0) {
          newStr = `${str.charAt(i)},${newStr}`;
        } else {
          newStr = `${str.charAt(i)}${newStr}`;
        }
        count++;
      }
      str = newStr;
    } else {
      for (let i = str.indexOf('.') - 1; i >= 0; i--) {
        if (count % 3 === 0 && count !== 0) {
          newStr = `${str.charAt(i)},${newStr}`;
        } else {
          newStr = `${str.charAt(i)}${newStr}`; // 逐个字符相接起来
        }
        count++;
      }
      str = `${newStr}${str.substr(str.indexOf('.'), 3)}`;
    }
    return (<b title={`${negative}${str}`}>{negative}{str}</b>);
  }

  @autobind
  linkTo(value, bname) {
    const { push, location: { query: { orgId, cycleSelect } } } = this.props;
    const pathname = '/customerPool/list';
    const obj = {
      source: 'custIndicator',
      customerType: value,
      bname: encodeURIComponent(bname),
      orgId: orgId || '',
      cycleSelect: cycleSelect || '',
    };
    if (document.querySelector(fspContainer.container)) {
      const url = `${pathname}?${helper.queryToString(obj)}`;
      const param = {
        closable: true,
        forceRefresh: true,
        isSpecialTab: true,
        id: 'RCT_FSP_CUSTOMER_LIST',
        title: '业绩目标客户',
      };
      fspGlobal.openRctTab({ url, param });
    } else {
      push({
        pathname,
        query: obj,
      });
    }
  }

  render() {
    const { data } = this.props;
    const {
      totCust,
      purAddCust,
      purAddNoretailcust,
      purAddHighprodcust,
      newProdCust,
    } = data;
    return (
      <div className={styles.indexItemBox}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <Icon type="kehuzhibiao" />客户指标（户）
              <div className={styles.rightInfo}>
              客户数：<span>{this.numFormat(totCust || '--')}</span>
              </div>
          </div>
          <div className={styles.content}>
            <div className={styles.rowBox}>
              <Row gutter={0}>
                <Col span={13}>
                  <ul>
                    <li >
                      <p
                        className={styles.pointer}
                        onClick={() => { this.linkTo('', '新增有效户'); }}
                      >
                        {this.numFormat(purAddCust || '--')}
                      </p>
                      <div>新增有效户</div>
                    </li>
                  </ul>
                </Col>
                <Col span={11}>
                  <ul>
                    <li className={styles.bd_un_r}>
                      <p
                        className={styles.pointer}
                        onClick={() => { this.linkTo('', '新增非零售客户'); }}
                      >
                        {this.numFormat(purAddNoretailcust || '--')}
                      </p>
                      <div>新增非零售客户</div>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row gutter={0} className={styles.bd_un_b}>
                <Col span={13}>
                  <ul>
                    <li>
                      <p
                        className={styles.pointer}
                        onClick={() => { this.linkTo('', '新增高端产品户'); }}
                      >
                        {this.numFormat(purAddHighprodcust || '--')}
                      </p>
                      <div>新增高端产品户</div>
                    </li>
                  </ul>
                </Col>
                <Col span={11}>
                  <ul>
                    <li className={styles.bd_un_r}>
                      <p
                        className={styles.pointer}
                        onClick={() => { this.linkTo('', '新增产品客户'); }}
                      >
                        {this.numFormat(newProdCust || '--')}
                      </p>
                      <div>新增产品客户</div>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
