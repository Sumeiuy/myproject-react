/**
 * @Author: XuWenKang
 * @Description: 客户列表-订购精选组合客户持仓证券重合度
 * @Date: 2018-06-05 14:44:05
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-11 17:16:35
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Popover, Table } from 'antd';
import { fspContainer } from '../../../config';
import { holdingCombinationSecurity } from './config/titleList';
import styles from './holdingCombinationDetail.less';

const getPopupContainer = () => document.querySelector(fspContainer.container) || document.body;
const holdingSecurityTitleList = holdingCombinationSecurity;
const EMPTY_ARRAY = [];
export default class HoldingCombinationDetail extends PureComponent {
  static propTypes = {
    // 经济客户号
    custId: PropTypes.string.isRequired,
    // 组合code
    combinationCode: PropTypes.string.isRequired,
    // 持仓证券数据
    data: PropTypes.object.isRequired,
    // 查询持仓证券数据
    queryHoldingSecurityRepetition: PropTypes.func.isRequired,
    // 转换价格单位方法
    formatAsset: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      hasData: false,
      isMouseEnter: false,
    };
    this.debounced = _.debounce(
      this.getDetail,
      500,
      { leading: false },
    );
  }

  /**
   * 获取持仓产品的详情
   * 判断当前产品的详情是否已经存在，不存在时再去请求
   * 详情已经存在，直接显示popover，不需要发请求
   */
  @autobind
  getDetail() {
    const {
      combinationCode,
      queryHoldingSecurityRepetition,
      data,
      custId,
    } = this.props;
    if (_.isEmpty(data[`${custId}_${combinationCode}`])) {
      queryHoldingSecurityRepetition({ custId, combinationCode }).then(() => {
        this.setState({ hasData: true });
      });
    } else {
      this.setState({ hasData: true });
    }
  }

  @autobind
  getContent() {
    const {
      data, combinationCode, custId, formatAsset
    } = this.props;
    const list = data[`${custId}_${combinationCode}`] || EMPTY_ARRAY;
    const newTitleList = [...holdingSecurityTitleList];
    newTitleList[2].render = (text) => {
      const price = formatAsset(text);
      return (<span>{`${price.value}${price.unit}`}</span>);
    };
    return (
      <Table
        columns={holdingSecurityTitleList}
        dataSource={list}
        pagination={false}
        rowKey="securityCode"
      />
    );
  }

  @autobind
  handleMouseEnter() {
    this.setState({
      isMouseEnter: true,
    });
    this.debounced();
  }

  @autobind
  handleMouseLeave() {
    this.setState({
      isMouseEnter: false,
    });
    this.debounced.cancel();
    // this.setState({
    //   popoverVisible: false,
    // });
  }

  render() {
    const { hasData, isMouseEnter } = this.state;
    return (
      <Popover
        overlayClassName={styles.popoverBox}
        title="客户持仓与组合持仓重合证券"
        content={this.getContent()}
        mouseEnterDelay={0.5}
        placement="top"
        visible={isMouseEnter && hasData}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        getPopupContainer={getPopupContainer}
      >
        <em className={styles.tips}>持仓重合证券</em>
      </Popover>
    );
  }
}
