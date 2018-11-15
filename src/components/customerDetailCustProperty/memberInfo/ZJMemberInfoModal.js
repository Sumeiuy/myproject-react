/*
 * @Author: wangyikai
 * @Date: 2018-11-15 16:54:09
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-15 17:16:10
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../../common/Icon';
import { number } from '../../../helper';
import styles from './zjMemberInfo.less';
import Modal from '../../../components/common/biz/CommonModal';
import Table from '../../../components/common/table';
import { integralFlowColumns } from '../config';
import moment from 'moment';
import logable from '../../../decorators/logable';

export default class ZJMemeberInfoModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 紫金积分会员积分兑换流水
    dataSource: PropTypes.object.isRequired,
    // 获取紫金积分会员积分兑换流水
    queryZjPointExchangeFlow: PropTypes.func.isRequired,
  }
  constructor(props){
    super(props);
    this.state = {
      //  当前页码
      pageNum: 1,
    };
  }

  @autobind
  renderColumns(){
    return _.map(integralFlowColumns,  (items) => {
      const { dataIndex } = items;
      let newItems = {...items};
      // 处理日期格式和加上title
      if(dataIndex === 'tradeDate' || dataIndex === 'processDate'){
        newItems =  {
          ...items,
          render: text => {
            const date = text && moment(text).format('YYYY-MM-DD');
            return <span title={text}>{date || '--'}</span>;
          },
        };
      }
      // 处理数据保留两位小数
      if(dataIndex === 'productQuantity') {
        newItems = {
          ...items,
          render: text => {
            const data =  number.thousandFormat(number.toFixed(text));
            return data;
          }
        };
      }
      return newItems;
    });
  }

  // 页码切换的回调
  @autobind
  @logable({ type: 'Click', payload: { name: '页码切换' } })
  handlePaginationChange(page){
    const { queryZjPointExchangeFlow, location: { query} } = this.props;
    this.setState({
      pageNum: page,
    });
    queryZjPointExchangeFlow({
      pageSize: 10,
      pageNum: page,
      custId: query && query.custId,
    });
  }
  render() {
    const { pageNum } = this.state;
    const { dataSource, onClose } = this.props;
    const { tradeFlow = [], page = {} } = dataSource;
    const PaginationOption = {
      current: pageNum || 1,
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
          visible
          closeModal={onClose}
          onCancel={onClose}
          showOkBtn={false}
          cancelText="关闭"
          modalKey="integralFlow"
          maskClosable={false}
          >
          {
            _.isEmpty(tradeFlow)
            ? <div className={styles.noDataContainer}>
              <Icon type="wushujuzhanweitu-" className={styles.noDataIcon}/>
              <div className={styles.noDataText}>没有符合条件的记录</div>
            </div>
              : <div className={styles.tabContainer}>
              <Table
                pagination={showIntegralFlowPagination}
                dataSource={tradeFlow}
                isNeedEmptyRow
                columns={this.renderColumns()}
                scroll={{ x: '1024px' }}
              />
            </div>
          }
        </Modal>
      </div>
    );
  }
}
