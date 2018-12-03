/*
 * @Author: wangyikai
 * @Date: 2018-11-15 17:54:43
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-27 17:23:21
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from '../common/table';
import Modal from '../common/biz/CommonModal';
import styles from './serviceRelationship.less';
import { serviceHistoryColumns } from './config';
import IfTableWrap from '../common/IfTableWrap';

const TABLENUM = 10;
const NODATA_HINT = '没有符合条件的记录';
export default class ServiceHistoryModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 查询账户关系下的服务历史信息
    getCustServiceHistory: PropTypes.func.isRequired,
    // 账户关系下服务历史的数据
    serviceHistory: PropTypes.array.isRequired,
    // 控制弹框是否关闭
    onClose: PropTypes.func.isRequired,
    // 控制显示弹框
    visible: PropTypes.bool.isRequired,
  };

  componentDidUpdate(prevProps) {
    const {
      location: {
        query: {
          custId: prevCustId,
        },
      },
    } = prevProps;
    const {
      getCustServiceHistory,
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    // url中custId发生变化时重新请求相关数据
    if (prevCustId !== custId) {
      getCustServiceHistory({ custId });
    }
  }

  render() {
    const {
      serviceHistory,
      onClose,
      visible,
    } = this.props;
    const isRender = !_.isEmpty(serviceHistory);
    //  服务历史的数据长度
    const serviceHistoryDatasLength = _.size(serviceHistory);
    // 数据超过10条展示分页，反之不展示
    const showServiceHistoryPagination = serviceHistoryDatasLength > 10;
    return (
      <Modal
        title="服务历史"
        size="large"
        showOkBtn={false}
        visible={visible}
        cancelText="关闭"
        closeModal={onClose}
        modalKey="serviceHistory"
        maskClosable={false}
      >
        <IfTableWrap isRender={isRender} text={NODATA_HINT}>
          <div className={styles.tabContainer}>
            <Table
              pagination={showServiceHistoryPagination}
              className={styles.tabPaneWrap}
              dataSource={serviceHistory}
              columns={serviceHistoryColumns}
              isNeedEmptyRow
              rowNumber={TABLENUM}
              scroll={{ x: '1024px' }}
            />
          </div>
        </IfTableWrap>
      </Modal>
    );
  }
}
