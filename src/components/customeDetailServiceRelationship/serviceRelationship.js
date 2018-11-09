/*
 * @Author: wangyikai
 * @Date: 2018-11-06 13:23:32
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-09 16:21:42
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'antd';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/table';
import Modal from '../../components/common/biz/CommonModal';
import styles from './serviceRelationship.less';
import { number } from '../../helper';
import { newServiceTeamColumns, newIntroduceColumns, newServiceHistoryColumns} from './config';

export default class ServiceRelationship extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 账户关系下服务团队的数据
    serviceTeam: PropTypes.array.isRequired,
    // 账户关系下介绍信息的数据
    introduce: PropTypes.array.isRequired,
    // 账户关系下服务历史的数据
    serviceHistory: PropTypes.array.isRequired,
    //查询账户关系下的服务团队信息
    getCustServiceTeam: PropTypes.func.isRequired,
    // 查询账户关系下的介绍信息
    getCustDevInfo: PropTypes.func.isRequired,
    //查询账户关系下的服务历史信息
    getCustServiceHistory: PropTypes.func.isRequired,
  }
  constructor(props){
    super(props);
    this.state = {
     // 服务历史的弹出框
     serviceHistoryModalVisible: false,
    };
  }
  componentDidMount(){
    const { getCustServiceTeam, getCustDevInfo, location: {query} } = this.props;
    getCustServiceTeam({
      custId: query && query.custId,
    });
    getCustDevInfo({
      custId: query && query.custId,
    });
  }
  //打开服务历史的弹框
  @autobind
  handleServiceHistoryModalOpen(){
    const { getCustServiceHistory, location: { query } } = this.props;
      getCustServiceHistory({ custId: query && query.custId}).then(() => {
        this.setState({ serviceHistoryModalVisible: true });
      });
  }
  // 关闭服务历史的弹出层
  @autobind
  handleServiceHistoryModalClose() {
    this.setState({ serviceHistoryModalVisible: false});
  }
  render(){
    const {
      serviceHistoryModalVisible,
    } = this.state;
    const { serviceTeam, introduce, serviceHistory } = this.props;
    //  服务历史的数据长度
     const serviceHistoryDatasLength = _.size(serviceHistory);
     // 数据超过10条展示分页，反之不展示
     const showServiceHistoryPagination = serviceHistoryDatasLength > 10;
    //将数据百分比化
    const newIntroduceDatas = _.map(introduce,  (items) => {
      const { weight } = items;
      const newWeight= number.convertRate(weight);
      return {
        ...items,
        weight: newWeight,
      };
    });
    return(
      <div className={styles.tabsContainer}>
      <div className={styles.tabPaneWrap}>
      <div className={styles.accountDetailWrap}>
        <div className={styles.accountBlock}>
          <div className={styles.header}>
            <div className={styles.title}>服务团队</div>
            <Icon type="huiyuandengjibiangeng" className={styles.serviceHistoryIcon}/>
            <div className={styles.serviceHistory} onClick={this.handleServiceHistoryModalOpen}>服务历史</div>
            <Modal
             title="服务历史"
             size='large'
             showOkBtn={false}
             visible={serviceHistoryModalVisible}
             closeModal={this.handleServiceHistoryModalClose}
             onCancel={this.handleServiceHistoryModalClose}
             selfBtnGroup={[(<Button onClick={this.handleServiceHistoryModalClose}>关闭</Button>)]}
             modalKey="serviceHistory"
             maskClosable={false}
            >
             <div className={styles.tabContainer}>
             <Table
              pagination={showServiceHistoryPagination}
              className={styles.tabPaneWrap}
              dataSource={serviceHistory}
              columns={newServiceHistoryColumns}
              scroll={{ x: '1024px' }}
            />
          </div>
          </Modal>
          </div>
          <div className={styles.accountTable}>
            <Table
              pagination={false}
              className={styles.tableBorder}
              dataSource={serviceTeam}
              columns={newServiceTeamColumns}
            />
          </div>
        </div>
        <div className={styles.accountBlock}>
          <div className={styles.header}>
            <div className={styles.title}>介绍信息</div>
          </div>
          <div className={styles.accountTable}>
            <Table
              pagination={false}
              className={styles.tableBorder}
              dataSource={newIntroduceDatas}
              columns={newIntroduceColumns}
            />
          </div>
        </div>
        </div>
      </div>
      </div>
    );
  }
}
