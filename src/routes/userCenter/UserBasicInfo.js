import React, { PureComponent } from 'react';
import { Tabs, Button } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import styles from './userBasicInfo.less';

import BasicInfo from '../../components/userCenter/BasicInfo';

const TabPane = Tabs.TabPane;

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const effects = {
  queryUserBaseInfo: 'userCenter/queryUserBaseInfo',
  queryAllLabels: 'userCenter/queryAllLabels',
  queryEmpLabelAndDescApprover: 'userCenter/queryEmpLabelAndDescApprover',
};

const mapStateToProps = state => ({
  userBaseInfo: state.userCenter.userBaseInfo,
  allLabels: state.userCenter.allLabels,
  LabelAndDescApprover: state.userCenter.LabelAndDescApprover,
});

const mapDispatchToProps = {
  queryUserBaseInfo: fetchDataFunction(true, effects.queryUserBaseInfo),
  queryAllLabels: fetchDataFunction(true, effects.queryAllLabels),
  queryEmpLabelAndDescApprover: fetchDataFunction(true, effects.queryEmpLabelAndDescApprover),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class UserBasicInfo extends PureComponent {
  static propTypes = {
    userBaseInfo: PropTypes.object.isRequired,
    allLabels: PropTypes.array.isRequired,
    LabelAndDescApprover: PropTypes.array.isRequired,
    queryUserBaseInfo: PropTypes.func.isRequired,
    queryAllLabels: PropTypes.func.isRequired,
    queryEmpLabelAndDescApprover: PropTypes.func.isRequired,
  };

  static contextTypes = {
    empInfo: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      editorState: false,
    };
  }

  componentDidMount() {
    const { queryUserBaseInfo } = this.props;
    queryUserBaseInfo();
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
    if (activeTab === '1' && tgFlag && !editorState) {
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
      queryEmpLabelAndDescApprover,
      LabelAndDescApprover,
    } = this.props;

    const { editorState } = this.state;

    return (
      <div className={styles.userInfoWrap}>
        <Tabs
          defaultActiveKey="1"
          tabBarExtraContent={this.getEditorBtn()}
          onChange={this.handleChangeTab}
          tabBarStyle={{
            borderBottom: 'none',
          }}
        >
          <TabPane
            tab="基本信息"
            key="1"
          >
            <BasicInfo
              userBaseInfo={userBaseInfo}
              editorState={editorState}
              queryAllLabels={queryAllLabels}
              queryEmpLabelAndDescApprover={queryEmpLabelAndDescApprover}
              allLabels={allLabels}
              LabelAndDescApprover={LabelAndDescApprover}
              changeEditorState={this.changeEditorState}
            />
          </TabPane>
          <TabPane
            tab="我的审批"
            key="2"
            // disabled
          >
            我的审批
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
