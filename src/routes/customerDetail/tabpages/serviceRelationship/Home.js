/*
 * @Author: wangyikai
 * @Date: 2018-11-05 17:45:53
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-06 19:20:50
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { connect } from 'dva';
import { dva } from '../../../../helper';
import ServiceRelationship from '../../../../components/customeDetailServiceRelationship/serviceRelationship';
const effect = dva.generateEffect;
const mapStateToProps = state => ({
  // 账户关系下服务团队的数据
  serviceTeam: state.detailServiceRelationship.serviceTeam,
  // 账户关系下介绍信息的数据
  introduce: state.detailServiceRelationship.introduce,
   // 账户关系下服务历史的数据
   serviceHistory: state.detailServiceRelationship.serviceHistory,
});
const mapDispatchToProps = {
  // 查询账户关系下的服务团队信息
  getCustServiceTeam: effect('detailServiceRelationship/getCustServiceTeam'),
 // 查询账户关系下的介绍信息
 getCustDevTeam: effect('detailServiceRelationship/getCustDevTeam'),
 // 查询账户关系下的服务历史信息
 getCustServiceHistory: effect('detailServiceRelationship/getCustServiceHistory'),
  // 清除Redux中的数据
  clearReduxData: effect('detailServiceRelationship/clearReduxData', { loading: false }),
};
@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends PureComponent {
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
      // 清除Redux中的数据
   clearReduxData: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
    };
  }
  render() {
    const {
      location,
      serviceTeam,
      introduce,
      serviceHistory,
      getCustServiceTeam,
      getCustDevTeam,
      getCustServiceHistory,
    } = this.props;
    // console.warn(getCustServiceTeam);
    return (
      <div>
        <ServiceRelationship
        location={location}
        serviceTeam={serviceTeam}
        introduce={introduce}
        serviceHistory={serviceHistory}
        getCustServiceTeam={getCustServiceTeam}
        getCustDevTeam={getCustDevTeam}
        getCustServiceHistory={getCustServiceHistory}
        />
      </div>
    );
  }
}
