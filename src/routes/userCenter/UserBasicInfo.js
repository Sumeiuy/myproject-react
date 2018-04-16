import React, { PureComponent } from 'react';
import { Tabs, Button } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
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
};

const mapStateToProps = state => ({
  userBaseInfo: state.userCenter.userBaseInfo,
  allLabels: state.userCenter.allLabels,
  LabelAndDescApprover: state.userCenter.LabelAndDescApprover,
});

const mapDispatchToProps = {
  queryEmpInfo: fetchDataFunction(true, effects.queryEmpInfo),
  queryAllLabels: fetchDataFunction(true, effects.queryAllLabels),
  queryApprovers: fetchDataFunction(true, effects.queryApprovers),
  updateEmpInfo: fetchDataFunction(true, effects.updateEmpInfo),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class UserBasicInfo extends PureComponent {
  static propTypes = {
    userBaseInfo: PropTypes.object.isRequired,
    allLabels: PropTypes.array.isRequired,
    LabelAndDescApprover: PropTypes.array.isRequired,
    queryEmpInfo: PropTypes.func.isRequired,
    queryAllLabels: PropTypes.func.isRequired,
    queryApprovers: PropTypes.func.isRequired,
    updateEmpInfo: PropTypes.func.isRequired,
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
  // 编辑按钮
  @autobind
  getEditorBtn() {
    const APPROVING = 'approving'; // 审批中的状态标识
    const { userBaseInfo: { flowState = APPROVING } } = this.props;
    const { activeTab, editorState } = this.state;
    const { empInfo = {} } = this.context;
    const { tgFlag } = empInfo.empInfo || {};
    // 当在第一个tab页的时候有编辑按钮
    if (activeTab === FIRST_TAB && tgFlag && !editorState) {
      return (<div className={styles.tabsExtraBtn}>
        <Button
          type="primary"
          size="large"
          disabled={flowState === APPROVING}
          onClick={this.changeEditorState}
        >编辑</Button>
      </div>);
    }
    return null;
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
    } = this.props;

    const { editorState } = this.state;

    return (
      <div className={styles.userInfoWrap}>
        <Tabs
          defaultActiveKey={FIRST_TAB}
          tabBarExtraContent={this.getEditorBtn()}
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
