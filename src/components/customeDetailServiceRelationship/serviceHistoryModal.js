/*
 * @Author: wangyikai
 * @Date: 2018-11-15 17:54:43
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-16 09:27:24
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/table';
import Modal from '../../components/common/biz/CommonModal';
import styles from './serviceRelationship.less';
import { serviceHistoryColumns } from './config';

export default class ServiceHistoryModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 账户关系下服务历史的数据
    serviceHistory: PropTypes.array.isRequired,
    //查询账户关系下的服务历史信息
    getCustServiceHistory: PropTypes.func.isRequired,
  }
  render() {
    const {
      serviceHistory,
      onClose,
    } = this.props;
    //  服务历史的数据长度
     const serviceHistoryDatasLength = _.size(serviceHistory);
     // 数据超过10条展示分页，反之不展示
     const showServiceHistoryPagination = serviceHistoryDatasLength > 10;
    return(
      <Modal
        className={styles.serviceHistoryModal}
        title="服务历史"
        size='large'
        showOkBtn={false}
        cancelText="关闭"
        visible
        closeModal={onClose}
        onCancel={onClose}
        modalKey="serviceHistory"
        maskClosable={false}
      >
      {
          _.isEmpty(serviceHistory)
          ? (
            <div className={styles.noDataContainer}>
              <Icon type="wushujuzhanweitu-" className={styles.noDataIcon}/>
              <div className={styles.noDataText}>没有符合条件的记录</div>
            </div>
            )
          : (
          <div className={styles.tabContainer}>
            <Table
            pagination={showServiceHistoryPagination}
            className={styles.tabPaneWrap}
            dataSource={serviceHistory}
            columns={serviceHistoryColumns}
            scroll={{ x: '1024px' }}
            />
          </div>
          )
    }
    </Modal>
    );
  }
}
