/**
 * @file components/commissionAdjustment/OperationOfCustermorList
 * @description 新建批量佣金调整客户列表选择和移除
 * @author baojiajia
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button } from 'antd';

import SearchSelect from '../common/Select/SearchSelect';
import styles from './operationOfCustermorList.less';

export default class ProductsDropdownBox extends PureComponent {

  static propTypes = {
    labelName: PropTypes.string.isRequired,
    dataSource: PropTypes.array.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    onDelectCustomer: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
  }

  @autobind
  handleValidate(customer) {
    // 验证用户
    this.props.validate(customer);
  }

  render() {
    const {
      labelName,
      dataSource,
      onChangeValue,
      onDelectCustomer,
    } = this.props;
    return (
      <div className={styles.operationOfCustList}>
        <div className={styles.searchSelectArea}>
          <SearchSelect
            onAddCustomer={this.handleValidate}
            onChangeValue={onChangeValue}
            width="184px"
            labelName={labelName}
            dataSource={dataSource}
            defaultInput="经济客户号/客户名称"
          />
        </div>
        <Button className={styles.delectCustomerButton} onClick={onDelectCustomer}>移除</Button>
      </div>
    );
  }
}

