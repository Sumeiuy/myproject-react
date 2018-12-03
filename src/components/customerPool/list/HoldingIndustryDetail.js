/**
 * @Author: XuWenKang
 * @Description: 客户列表-订购精选组合客户持仓证券重合度
 * @Date: 2018-06-05 14:44:05
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-07-12 10:21:37
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Popover, Table } from 'antd';
import { fspContainer } from '../../../config';
import { holdingIndustry } from './config/titleList';
import { number } from '../../../helper';
import styles from './holdingIndustryDetail.less';

const getPopupContainer = () => document.querySelector(fspContainer.container) || document.body;
const holdingIndustryTitleList = holdingIndustry;
const EMPTY_ARRAY = [];
export default class HoldingIndustryDetail extends PureComponent {
  static propTypes = {
    // 行业id
    id: PropTypes.string.isRequired,
    // 客户信息
    listItem: PropTypes.object.isRequired,
    // 持仓行业数据
    data: PropTypes.object.isRequired,
    // 查询持仓证券数据
    queryHoldingIndustryDetail: PropTypes.func.isRequired,
    // 转换价格单位方法
    formatAsset: PropTypes.func.isRequired,
    queryHoldingIndustryDetailReqState: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isMouseEnter: false,
      hasData: false,
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
      id,
      queryHoldingIndustryDetail,
      data,
      listItem: { custId, holdingProducts },
    } = this.props;
    const productList = _.map(holdingProducts, item => item.id);
    if (_.isEmpty(data[`${custId}_${id}`])) {
      queryHoldingIndustryDetail({ custId, industryId: id, productList }).then(() => {
        this.setState({ hasData: true });
      });
    } else {
      this.setState({ hasData: true });
    }
  }

  @autobind
  getContent() {
    const {
      data, id, formatAsset, listItem: { custId }
    } = this.props;
    const list = data[`${custId}_${id}`] || EMPTY_ARRAY;
    const newTitleList = [...holdingIndustryTitleList];
    newTitleList[1].render = value => number.thousandFormat(value);
    newTitleList[2].render = (value) => {
      const asset = formatAsset(value);
      return (<span>{`${asset.value}${asset.unit}`}</span>);
    };
    return (
      <Table
        columns={holdingIndustryTitleList}
        dataSource={list}
        pagination={false}
        rowKey="industryNameCode"
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
  }

  render() {
    const { isMouseEnter, hasData } = this.state;
    const { queryHoldingIndustryDetailReqState } = this.props;
    return (
      <span style={{ cursor: queryHoldingIndustryDetailReqState ? 'wait' : 'pointer' }}>
        <Popover
          overlayClassName={styles.popoverBox}
          title="持有该行业证券"
          content={this.getContent()}
          mouseEnterDelay={0.5}
          placement="top"
          visible={isMouseEnter && hasData}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          getPopupContainer={getPopupContainer}
        >
          <em className={styles.tips}>持仓详情</em>
        </Popover>
      </span>
    );
  }
}
