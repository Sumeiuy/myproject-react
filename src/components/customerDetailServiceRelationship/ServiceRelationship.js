/*
 * @Author: wangyikai
 * @Date: 2018-11-06 13:23:32
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-30 15:28:55
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Icon from '../common/Icon';
import Table from '../common/table';
import styles from './serviceRelationship.less';
import { number } from '../../helper';
import logable, { logPV } from '../../decorators/logable';
import ServiceHistoryModal from './ServiceHistoryModal';
import { serviceTeamColumns, introduceColumns } from './config';
import IfTableWrap from '../common/IfTableWrap';

const NODATA_HINT = '没有符合条件的记录';
export default class ServiceRelationship extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 账户关系下服务团队的数据
    serviceTeam: PropTypes.array.isRequired,
    // 账户关系下介绍信息的数据
    introduce: PropTypes.array.isRequired,
    // 账户关系下服务历史的数据
    serviceHistory: PropTypes.array.isRequired,
    // 查询账户关系下的服务团队信息
    getCustServiceTeam: PropTypes.func.isRequired,
    // 查询账户关系下的介绍信息
    getCustDevInfo: PropTypes.func.isRequired,
    // 查询账户关系下的服务历史信息
    getCustServiceHistory: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 服务历史的弹出框
      serviceHistoryModalVisible: false,
    };
  }

  // 打开服务历史的弹框
  @autobind
  @logPV({
    pathname: '/modal/serviceHistoryModal',
    title: '服务历史的弹框',
  })
  handleServiceHistoryModalOpen() {
    const { getCustServiceHistory, location: { query: { custId } } } = this.props;
    getCustServiceHistory({ custId }).then(() => {
      this.setState({ serviceHistoryModalVisible: true });
    });
  }

  // 关闭服务历史的弹出层
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '服务历史' },
  })
  handleServiceHistoryModalClose() {
    this.setState({ serviceHistoryModalVisible: false });
  }

  render() {
    const { serviceHistoryModalVisible } = this.state;
    const {
      location,
      serviceTeam,
      introduce,
      serviceHistory,
      getCustServiceHistory,
    } = this.props;
    const isRenderServiceTeam = !_.isEmpty(serviceTeam);
    const isRenderIntroduce = !_.isEmpty(introduce);
    // 将数据百分比化
    const newIntroduceDatas = _.map(introduce, (items) => {
      const { weight } = items;
      const newWeight = `${number.toFixed(weight)}%`;
      return {
        ...items,
        weight: newWeight,
      };
    });
    return (
      <div className={styles.tabsContainer}>
        <div className={styles.tabPaneWrap}>
          <div className={styles.accountDetailWrap}>
            <div className={styles.accountBlock}>
              <div className={styles.header}>
                <div className={styles.title}>服务团队</div>
                <Icon type="dengjibiangenglishi" className={styles.serviceHistoryIcon} />
                <div
                  className={styles.serviceHistory}
                  onClick={this.handleServiceHistoryModalOpen}
                >
                  服务历史
                </div>
                <ServiceHistoryModal
                  location={location}
                  visible={serviceHistoryModalVisible}
                  serviceHistory={serviceHistory}
                  getCustServiceHistory={getCustServiceHistory}
                  onClose={this.handleServiceHistoryModalClose}
                />
              </div>
              <IfTableWrap isRender={isRenderServiceTeam} text={NODATA_HINT}>
                <div className={styles.accountTable}>
                  <Table
                    pagination={false}
                    rowKey="productName"
                    className={styles.tableBorder}
                    dataSource={serviceTeam}
                    columns={serviceTeamColumns}
                  />
                </div>
              </IfTableWrap>
            </div>
            <div className={styles.accountBlock}>
              <div className={styles.header}>
                <div className={styles.title}>介绍信息</div>
              </div>
              <IfTableWrap isRender={isRenderIntroduce} text={NODATA_HINT}>
                <div className={styles.accountTable}>
                  <Table
                    pagination={false}
                    rowKey="productName"
                    className={styles.tableBorder}
                    dataSource={newIntroduceDatas}
                    columns={introduceColumns}
                  />
                </div>
              </IfTableWrap>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
