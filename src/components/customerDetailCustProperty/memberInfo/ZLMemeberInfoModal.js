/*
 * @Author: wangyikai
 * @Date: 2018-11-15 13:53:47
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-16 09:41:41
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../../common/Icon';
import Table from '../../../components/common/table';
import Modal from '../../../components/common/biz/CommonModal';
import { MemberGradeColumns } from '../config';
import styles from './zlMemberInfo.less';
import moment from 'moment';
import logable from '../../../decorators/logable';

const PAGE_SIZE = 10;
export default class ZLMemeberInfoModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 涨乐U会员等级变更记录
    dataSource: PropTypes.object.isRequired,
    // 获取涨乐财富通U会员等级变更记录
    queryZLUmemberLevelChangeRecords: PropTypes.func.isRequired,
  }
  constructor(props){
    super(props);
    this.state = {
      // 当前页码
      pageNum: 1,
    };
  }
  // 页码改变的回调
  @autobind
  @logable({ type: 'Click', payload: { name: '页码切换' } })
  handlePaginationChange(page){
    const { queryZLUmemberLevelChangeRecords, location: { query} } = this.props;
    this.setState({
      pageNum: page,
    });
    queryZLUmemberLevelChangeRecords({
      pageSize: PAGE_SIZE,
      pageNum: page,
      custId: query && query.custId,
    });
  }
  render() {
    const { pageNum } = this.state;
    const { dataSource, onClose } = this.props;
    const { list = [], page = {} } = dataSource;
    const PaginationOption = {
      current: pageNum || 1,
      total: page.totalRecordNum || 0,
      pageSize: page.pageSize || 10,
      onChange: this.handlePaginationChange,
    };
    // 数据长达大于10显示分页
    const showMemberGradePagination =  page.totalPageNum !== 1 ? PaginationOption : false;
    //  处理日期
     const newmemberGradeDatas = _.map(list, (items) => {
      const { time } = items;
      const newTime = moment(time).format('YYYY-MM-DD hh:mm:ss');
      return {
        ...items,
        time: newTime,
      };
    });
    return (
      <div>
        <Modal
          className={styles.memberGradeModal}
          title="会员等级变更"
          size='large'
          visible
          closeModal={onClose}
          onCancel={onClose}
          showOkBtn={false}
          cancelText="关闭"
          modalKey="memberGrade"
          maskClosable={false}
        >
          {
            _.isEmpty(list)
            ? <div className={styles.noDataContainer}>
                <Icon type="wushujuzhanweitu-" className={styles.noDataIcon}/>
                <div className={styles.noDataText}>没有符合条件的记录</div>
              </div>
            : <div className={styles.tabContainer}>
                <Table
                  pagination={showMemberGradePagination}
                  dataSource={newmemberGradeDatas}
                  columns={MemberGradeColumns}
                  scroll={{ x: '1024px' }}
                />
              </div>
          }
        </Modal>
      </div>
    );
  }
}
