/*
 * @Author: wangyikai
 * @Date: 2018-11-15 16:54:09
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-27 19:45:54
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import { number } from '../../../helper';
import styles from './zjMemberInfo.less';
import Modal from '../../../components/common/biz/CommonModal';
import Table from '../../../components/common/table';
import { integralFlowColumns } from '../config';
import logable from '../../../decorators/logable';
import IfTableWrap from '../../common/IfTableWrap';

const TABLENUM = 10;
const PAGE_SIZE = 10;
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
const DATE_FORMAT = 'YYYY-MM-DD';
const TRANDE_DATE = 'tradeDate';
const PROCESS_DATE = 'processDate';
const PRODUCT = 'productQuantity';
const NODATA_HINT = '没有符合条件的记录';

export default class ZJMemeberInfoModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 紫金积分会员积分兑换流水
    dataSource: PropTypes.object.isRequired,
    // 获取紫金积分会员积分兑换流水
    queryZjPointExchangeFlow: PropTypes.func.isRequired,
    // 控制显示弹框
    visible: PropTypes.bool.isRequired,
    // 控制弹框是否关闭
    onClose: PropTypes.func.isRequired,
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        query: {
          custId: prevCustId,
        },
      },
    } = prevProps;
    const {
      queryZjPointExchangeFlow,
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    // url中custId发生变化时重新请求相关数据
    if (prevCustId !== custId) {
      queryZjPointExchangeFlow({ custId });
    }
  }

  @autobind
  renderColumns(){
    const integralFlowList = [...integralFlowColumns];
    const integralFlowColumn = _.find(integralFlowList, o => o.key === TRANDE_DATE);
    integralFlowColumn.render = text => {
      const date = text && moment(text).format(DATE_FORMAT);
      return (<span title={text}>{date || '--'}</span>);
    };
    const processDateColumns = _.find(integralFlowList, o => o.key === PROCESS_DATE);
    processDateColumns.render = text => {
      const date = text && moment(text).format(DATE_FORMAT);
      return (<span title={text}>{date || '--'}</span>);
    };
    const productQuantityList = _.find(integralFlowList, o => o.key === PRODUCT);
    productQuantityList.render = text => {
      return number.thousandFormat(number.toFixed(text));
    };
    return integralFlowList;
  }

  // 页码切换的回调
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '页码切换'
    }
  })
  handlePaginationChange(page) {
    const {
      queryZjPointExchangeFlow,
      location: { query: { custId } },
    } = this.props;
    queryZjPointExchangeFlow({
      pageSize: PAGE_SIZE,
      pageNum: page,
      custId,
    });
  }

  render() {
    const { dataSource, onClose, visible } = this.props;
    const { tradeFlow = EMPTY_ARRAY, page = EMPTY_OBJECT } = dataSource;
    const isRender = !_.isEmpty(tradeFlow);
    const PaginationOption = {
      current: page.pageNum || 1,
      total: page.totalRecordNum || 0,
      pageSize: page.pageSize || 10,
      onChange: this.handlePaginationChange,
    };
    // 数据长达大于10显示分页
    const showIntegralFlowPagination =  page.totalPageNum !== 1 ? PaginationOption : false;
    return(
      <div>
        <Modal
          className={styles.integralFlowModal}
          title="积分兑换流水"
          size='large'
          visible={visible}
          closeModal={onClose}
          showOkBtn={false}
          cancelText="关闭"
          modalKey="integralFlow"
          maskClosable={false}
        >
          <IfTableWrap isRender={isRender} text={NODATA_HINT}>
            <div className={styles.tabContainer}>
              <Table
                pagination={showIntegralFlowPagination}
                dataSource={tradeFlow}
                isNeedEmptyRow
                rowNumber={TABLENUM}
                columns={this.renderColumns()}
                scroll={{ x: '1024px' }}
              />
            </div>
          </IfTableWrap>
        </Modal>
      </div>
    );
  }
}

