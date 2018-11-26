/*
 * @Author: wangyikai
 * @Date: 2018-11-15 13:53:47
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-23 14:56:49
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../../common/Icon';
import Table from '../../../components/common/table';
import Modal from '../../../components/common/biz/CommonModal';
import { newMemberGradeColumns } from '../config';
import styles from './zlMemberInfo.less';
import logable from '../../../decorators/logable';

const PAGE_SIZE = 10;
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
export default class ZLMemeberInfoModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 涨乐U会员等级变更记录
    dataSource: PropTypes.object.isRequired,
    // 获取涨乐财富通U会员等级变更记录
    queryZLUmemberLevelChangeRecords: PropTypes.func.isRequired,
    // 控制显示弹框
    visible: PropTypes.bool.isRequired,
    // 控制弹框是否关闭
    onClose: PropTypes.func.isRequired,
  }

  // 页码改变的回调
  @autobind
  @logable({ type: 'Click',
payload: { name: '页码切换' } })
  handlePaginationChange(page) {
    const { queryZLUmemberLevelChangeRecords, location: { query: { custId } } } = this.props;
    queryZLUmemberLevelChangeRecords({
      pageSize: PAGE_SIZE,
      pageNum: page,
      custId,
    });
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
      queryZLUmemberLevelChangeRecords,
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    // url中custId发生变化时重新请求相关数据
    if (prevCustId !== custId) {
      queryZLUmemberLevelChangeRecords({ custId });
    }
  }

  render() {
    const { dataSource, onClose, visible } = this.props;
    const { list = EMPTY_ARRAY, page = EMPTY_OBJECT } = dataSource;
    const PaginationOption = {
      current: page.pageNum || 1,
      total: page.totalRecordNum || 0,
      pageSize: page.pageSize || 10,
      onChange: this.handlePaginationChange,
    };
    // 数据长达大于10显示分页
    const showMemberGradePagination =  page.totalPageNum !== 1 ? PaginationOption : false;
    return (
      <div>
        <Modal
          className={styles.memberGradeModal}
          title="会员等级变更"
          size='large'
          visible={visible}
          closeModal={onClose}
          showOkBtn={false}
          cancelText="关闭"
          modalKey="memberGrade"
          maskClosable={false}
        >
          {
            _.isEmpty(list)
            ? (
              <div className={styles.noDataContainer}>
                <Icon type="wushujuzhanweitu-" className={styles.noDataIcon} />
                <div className={styles.noDataText}>没有符合条件的记录</div>
              </div>
              )
            : (
              <div className={styles.tabContainer}>
                <Table
                  pagination={showMemberGradePagination}
                  dataSource={list}
                  columns={newMemberGradeColumns}
                  scroll={{ x: '1024px' }}
                />
              </div>
            )
          }
        </Modal>
      </div>
    );
  }
}
