/**
 * @file components/commissionAdjustment/AddCustomer.js
 * @description 批量佣金调整添加客户
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
// import _ from 'lodash';

import SearchSelect from '../common/Select/SearchSelect';
import styles from './addCustomer.less';

export default class AddCustomer extends PureComponent {
  static propTypes = {
    // name: PropTypes.string,
  }

  static defaultProps = {
    // name: '',
  }

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className={styles.addCustomersBox}>
        <SearchSelect
          addClick={() => {}}
          changeValue=""
          width="184px"
          labelName="客户"
          dataSource={[]}
        />
      </div>
    );
  }
}
