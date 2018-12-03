import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import withRouter from '../../decorators/withRouter';
import styles from './userBasicInfo.less';

import BasicInfo from '../../components/userCenter/BasicInfo';

const TabPane = Tabs.TabPane;
const FIRST_TAB = '1';
const SECOND_TAB = '2';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const effects = {
  queryEmpInfo: 'userCenter/queryEmpInfo',
  queryAllLabels: 'userCenter/queryAllLabels',
  queryApprovers: 'userCenter/queryApprovers',
  updateEmpInfo: 'userCenter/updateEmpInfo',
  cacheUserInfoForm: 'userCenter/cacheUserInfoForm',
};

const mapStateToProps = state => ({
  userBaseInfo: state.userCenter.userBaseInfo,
  allLabels: state.userCenter.allLabels,
  LabelAndDescApprover: state.userCenter.LabelAndDescApprover,
  userInfoForm: state.userCenter.userInfoForm,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  queryEmpInfo: fetchDataFunction(true, effects.queryEmpInfo),
  queryAllLabels: fetchDataFunction(true, effects.queryAllLabels),
  queryApprovers: fetchDataFunction(true, effects.queryApprovers),
  updateEmpInfo: fetchDataFunction(true, effects.updateEmpInfo),
  cacheUserInfoForm: fetchDataFunction(false, effects.cacheUserInfoForm),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class UserBasicInfo extends PureComponent {
  static propTypes = {
    userBaseInfo: PropTypes.object.isRequired,
    userInfoForm: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    allLabels: PropTypes.array.isRequired,
    LabelAndDescApprover: PropTypes.array.isRequired,
    queryEmpInfo: PropTypes.func.isRequired,
    queryAllLabels: PropTypes.func.isRequired,
    queryApprovers: PropTypes.func.isRequired,
    updateEmpInfo: PropTypes.func.isRequired,
    cacheUserInfoForm: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  };

  static contextTypes = {
    empInfo: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: FIRST_TAB,
      editorState: false,
    };
  }

  componentWillMount() {
    const { userInfoForm, location: { query } } = this.props;
    const { cache } = query;
    const { editorState } = userInfoForm;
    if (editorState && cache) {
      this.setState({
        editorState,
      });
    }
  }

  componentDidMount() {
    const { queryEmpInfo } = this.props;
    queryEmpInfo();
  }

  // 切换编辑状态
  @autobind
  changeEditorState() {
    this.setState(preState => ({
      editorState: !preState.editorState,
    }));
  }

  // 切换面板
  @autobind
  handleChangeTab(activeKey) {
    this.setState({
      activeTab: activeKey,
    });
  }

  render() {
    const {
      userBaseInfo,
      queryAllLabels,
      allLabels,
      queryApprovers,
      LabelAndDescApprover,
      updateEmpInfo,
      queryEmpInfo,
      cacheUserInfoForm,
      userInfoForm,
      replace,
    } = this.props;

    const { editorState } = this.state;

    return (
      <div className={styles.userInfoWrap}>
        <Tabs
          defaultActiveKey={FIRST_TAB}
          onChange={this.handleChangeTab}
          tabBarStyle={{
            borderBottom: 'none',
          }}
        >
          <TabPane
            tab="基本信息"
            key={FIRST_TAB}
          >
            <BasicInfo
              userBaseInfo={userBaseInfo}
              editorState={editorState}
              queryAllLabels={queryAllLabels}
              queryEmpInfo={queryEmpInfo}
              queryApprovers={queryApprovers}
              allLabels={allLabels}
              LabelAndDescApprover={LabelAndDescApprover}
              updateEmpInfo={updateEmpInfo}
              changeEditorState={this.changeEditorState}
              cacheUserInfoForm={cacheUserInfoForm}
              userInfoForm={userInfoForm}
              replace={replace}
            />
          </TabPane>
          <TabPane
            tab=""
            key={SECOND_TAB}
            disabled
          >
            我的审批
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
