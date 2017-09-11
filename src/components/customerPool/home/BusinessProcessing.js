/**
 * @file customerPool/BusinessProcessing.js
 *  目标客户池-业务办理
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Row, Col } from 'antd';
import { fspContainer } from '../../../config';
import { fspGlobal, helper } from '../../../utils';
import Icon from '../../common/Icon';
import styles from './performanceIndicators.less';

export default class BusinessProcessing extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    data: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      unit: '',
    };
  }

  // 格式化数字，逢三位加一个逗号
  numFormat(num) {
    let newStr = '';
    let count = 0;
    let str = num.toString();
    if (num === '--') {
      return '--';
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
    return (<b title={`${str}`}>{str}</b>);
  }

  @autobind
  linkTo(value, bname) {
    const { push, location: { query: { orgId, cycleSelect } } } = this.props;
    const pathname = '/customerPool/list';
    const obj = {
      source: 'numOfCustOpened',
      rightType: value,
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
        title: '目标客户',
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
      cftCust,
      ttfCust,
      rzrqCust,
      shHkCust,
      szHkCust,
      optCust,
    } = data;
    const { unit } = this.state;
    return (
      <div className={styles.indexItemBox}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <Icon type="yewubanli" />业务开通客户数（{unit}人）
                    </div>
          <div className={`${styles.content}`}>
            <div className={styles.rowBox}>
              <Row gutter={0}>
                <Col span={9}>
                  <ul>
                    <li>
                      <p
                        className={styles.pointer}
                        onClick={() => { this.linkTo('cftCust', '涨乐财富通'); }}
                      >
                        {this.numFormat(cftCust || '--')}
                      </p>
                      <div>涨乐财富通</div>
                    </li>
                  </ul>
                </Col>
                <Col span={8}>
                  <ul>
                    <li>
                      <p
                        className={styles.pointer}
                        onClick={() => { this.linkTo('ttfCust', '天天发'); }}
                      >
                        {this.numFormat(ttfCust || '--')}
                      </p>
                      <div>天天发</div>
                    </li>
                  </ul>
                </Col>
                <Col span={7}>
                  <ul>
                    <li className={styles.bd_un_r}>
                      <p
                        className={styles.pointer}
                        onClick={() => { this.linkTo('rzrqCust', '融资融券'); }}
                      >
                        {this.numFormat(rzrqCust || '--')}
                      </p>
                      <div>融资融券</div>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row gutter={0} className={styles.bd_un_b}>
                <Col span={9}>
                  <ul>
                    <li>
                      <p
                        className={styles.pointer}
                        onClick={() => { this.linkTo('szHkCust', '沪港通'); }}
                      >
                        {this.numFormat(shHkCust || '--')}
                      </p>
                      <div>沪港通</div>
                    </li>
                  </ul>
                </Col>
                <Col span={8}>
                  <ul>
                    <li>
                      <p
                        className={styles.pointer}
                        onClick={() => { this.linkTo('shHkCust', '深港通'); }}
                      >
                        {this.numFormat(szHkCust || '--')}
                      </p>
                      <div>深港通</div>
                    </li>
                  </ul>
                </Col>
                <Col span={7}>
                  <ul>
                    <li className={styles.bd_un_r}>
                      <p
                        className={styles.pointer}
                        onClick={() => { this.linkTo('optCust', '期权'); }}
                      >
                        {this.numFormat(optCust || '--')}
                      </p>
                      <div>期权</div>
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
