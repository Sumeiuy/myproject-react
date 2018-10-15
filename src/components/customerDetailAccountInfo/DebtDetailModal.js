/*
 * @Author: sunweibin
 * @Date: 2018-10-12 08:45:31
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-15 10:43:48
 * @description 资产分布的负债详情弹出层
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Modal from '../common/biz/CommonModal';
import MarginTradindDetail from './MarginTradingDetail';
import OtherDebtDetail from './OtherDebtDetail';
import { convertMoney } from './utils';

import styles from './debtDetailModal.less';

export default class DebtDetailModal extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    // 负债详情数据
    debtDetail: PropTypes.object.isRequired,
    // 查询负债详情数据接口
    queryDebtDetail: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    // 初始进入后需要查询下负债的详情数据
    const {
      location: { query: { custId } },
    } = this.props;
    this.props.queryDebtDetail({ custId });
  }

  @autobind
  handleCloseModal() {
    this.props.onClose();
  }

  render() {
    const {
      debtDetail: {
        totalDebt,
        marginTrading,
        smallLoan,
        bondDebt,
        stockPledge,
      },
    } = this.props;
    // 总负债
    const totalDebtMoney = convertMoney(totalDebt, { unit: '元', formater: true });
    // 融资融券
    const hasNoMargin = _.isEmpty(marginTrading);
    // 小额贷
    const hasNoSmallLoan = _.isEmpty(smallLoan);
    // 债券负债
    const hasNobondDebt = _.isEmpty(bondDebt);
    // 股票质押
    const hasNoStockPledge = _.isEmpty(stockPledge);
    // 底部确定按钮
    const button = (
      <Button type="primary" onClick={this.handleCloseModal}>确定</Button>
    );

    return (
      <Modal
        visible
        modalKey="debtDetailModal"
        title="负债详情"
        selfBtnGroup={button}
        closeModal={this.handleCloseModal}
      >
        <div className={styles.debtDetailContainer}>
          <div className={styles.totalDebt}>
            <span className={styles.label}>总负债</span>
            <span className={styles.value}>{`${totalDebtMoney.formatedValue}${totalDebtMoney.unit}`}</span>
          </div>
          { _.map(marginTrading, item => <MarginTradindDetail data={item} />)}
          { _.map(smallLoan, item => <OtherDebtDetail title="小额贷" data={item} />)}
          { _.map(bondDebt, item => <OtherDebtDetail title="债券负债" data={item} />)}
          { _.map(stockPledge, item => <OtherDebtDetail title="股票质押" data={item} />)}
        </div>
      </Modal>
    );
  }
}
