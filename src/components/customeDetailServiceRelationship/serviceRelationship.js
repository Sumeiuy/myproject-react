/*
 * @Author: wangyikai
 * @Date: 2018-11-06 13:23:32
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-08 13:35:50
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
import { serviceTeamColumns, introduceColumns, serviceHistoryColumns} from './config';

export default class ServiceRelationship extends PureComponent {
  // static getDerivedStateFromProps(props, state) {
  //   const { prevProps } = state;
  //   let nextState = {
  //     prevProps: props,
  //   };
  //   if (props.initialStartDate !== prevProps.initialStartDate) {
  //     nextState = {
  //       ...nextState,
  //       startDate: props.initialStartDate,
  //     };
  //   }
  //   return nextState;
  // }
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
    getCustDevTeam: PropTypes.func.isRequired,
    //查询账户关系下的服务历史信息
    getCustServiceHistory: PropTypes.func.isRequired,
  }
  constructor(props){
    super(props);
    this.state = {
     // 服务历史的弹出框
     serviceHistoryModalVisible: false,
     prevProps: props,
    };
  }
  componentDidMount(){
    const { getCustServiceTeam, getCustDevTeam } = this.props;
    const { query } = this.props.location;
    getCustServiceTeam({
      custId: query && query.custId,
    });
    getCustDevTeam({
      custId: query && query.custId,
    });
  }
  //打开服务历史的弹框
  @autobind
  handleServiceHistoryModalOpen(){
    const { query } = this.props.location;
    const { getCustServiceHistory } = this.props;
      getCustServiceHistory({ custId: query && query.custId}).then(() => {
        this.setState({ serviceHistoryModalVisible: true });
      });
  }// 关闭服务历史的弹出层
  @autobind
  handleServiceHistoryModalClose() {
    this.setState({ serviceHistoryModalVisible: false});
  }
  //数据为空时，默认显示空行
  @autobind
  padEmptyRow(data) {
    const len = _.size(data);
    let newData = _.cloneDeep(data);
    if (len < 2) {
      const padLen = 2 - len;
      for (let i = 0; i < padLen; i++) {
        newData = _.concat(newData, [{
          key: `empty_row_${i}`,
          flag: true,
        }]);
      }
    }
    return newData;
  }
  render(){
    const {
      serviceHistoryModalVisible,
    } = this.state;
    const { serviceTeam, introduce, serviceHistory } = this.props;
     // 空白数据填充
     const introduceDatas = this.padEmptyRow(introduce);
     const serviceTeamDatas = this.padEmptyRow(serviceTeam);
     const serviceHistoryDatas = this.padEmptyRow(serviceHistory);
    //  服务历史的数据长度
     const serviceHistoryDatasLength = _.size(serviceHistoryDatas);
     // 数据超过10条展示分页，反之不展示
     const showServiceHistoryPagination = serviceHistoryDatasLength > 10;
     // 修改Table的Column
    const newServiceTeamColumns = _.map(serviceTeamColumns, column => ({
      ...column,
      render(text, record) {
       const { flag } = record;
       return flag ? '' : text;
      }
    }));
    const newIntroduceColumns = _.map(introduceColumns, column => ({
       ...column,
       render(text, record) {
        const { flag } = record;
        return flag ? '' : text;
       }
    }));
    const newServiceHistoryColumns = _.map(serviceHistoryColumns, column => ({
      ...column,
      render(text, record) {
       const { flag } = record;
       return flag ? '' : text;
      }
    }));
    //将数据百分比化
    const newIntroduceDatas = _.map(introduceDatas,  (items) => {
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
              dataSource={serviceHistoryDatas}
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
              dataSource={serviceTeamDatas}
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
