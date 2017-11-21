/*
 * @Description: 执行者视图 home 页面
 * @Author: 洪光情
 * @Date: 2017-11-20 15:38:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import { seibelConfig } from '../../config';

const { permission: { pageType, subType, status } } = seibelConfig;
const mapStateToProps = state => ({
  // 左侧列表数据
  list: state.app.seibleList,
});
const mapDispatchToProps = {
  replace: routerRedux.replace,
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class PerformerView extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  // 头部新建页面
  @autobind
  creatPermossionModal() {

  }

  render() {
    const {
      location,
      replace,
    } = this.props;
    return (
      <div>
        <ConnectedSeibelHeader
          location={location}
          replace={replace}
          page="premissionPage"
          pageType={pageType}
          subtypeOptions={subType}
          stateOptions={status}
          creatSeibelModal={this.creatPermossionModal}
        />
      </div>
    );
  }
}
