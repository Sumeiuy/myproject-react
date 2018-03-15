import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Input } from 'antd';
import TaskSearchRow from './TaskSearchRow';
import { emp, fsp } from '../../../helper';
import styles from './selectLabelCust.less';

const EMPTY_OBJECT = {};
const Search = Input.Search;


export default class SelectLabelCust extends PureComponent {
  static propTypes = {
    dict: PropTypes.object.isRequired,
    getLabelInfo: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    peopleOfLabelData: PropTypes.object.isRequired,
    // 保存的数据
    storedData: PropTypes.object,
    orgId: PropTypes.string.isRequired,
    isLoadingEnd: PropTypes.bool.isRequired,
    isSightTelescopeLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    isAuthorize: PropTypes.bool,
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    switchBottomFromSearch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    storedData: {},
    isAuthorize: false,
  };

  constructor(props) {
    super(props);
    const { storedData = EMPTY_OBJECT } = props;
    const { labelCust = EMPTY_OBJECT } = storedData;
    const {
      condition = '',
      labelId = '',
      tipsSize = 0,
      shouldclearBottomLabel = true,
      currentSelectLabelName = null,
      currentFilterNum = 0,
    } = labelCust || EMPTY_OBJECT;

    this.state = {
      current: 0,
      labelCust,
      condition,
      currentSelectLabel: labelId,
      labelId,
      tipsSize,
      shouldclearBottomLabel,
      currentFilterNum,
      currentSelectLabelName,
    };
    this.bigBtn = true;
  }

  componentDidMount() {
    // 在初始化的时候，回滚fsp滚动条到顶部
    fsp.scrollToTop();
  }

  componentWillReceiveProps(nextProps) {
    const { circlePeopleData } = nextProps;
    const { circlePeopleData: prevCirclePeopleData } = this.props;
    if (circlePeopleData !== prevCirclePeopleData) {
      this.setState({
        tipsSize: _.size(circlePeopleData),
      });
    }
  }

  @autobind
  getData() {
    const { labelId = '', condition, tipsSize } = this.state;
    if (_.isEmpty(condition)) {
      return {
        labelCust: {},
      };
    }

    const {
      filterNumObject = {},
      argsOfQueryCustomer = {},
      currentFilterObject = {},
    } = this.taskSearchRowRef.getSelectFilters();
    const { circlePeopleData } = this.props;
    const { shouldclearBottomLabel, currentFilterNum, currentSelectLabelName } = this.state;
    const matchedData = _.find(circlePeopleData, item => item.id === labelId);
    const { labelDesc = '', labelMapping, labelName = '', customNum = 0 } = matchedData || EMPTY_OBJECT;

    const labelCust = {
      labelId,
      labelMapping,
      labelDesc,
      condition,
      custNum: `${labelId}` in filterNumObject ? filterNumObject[labelId] : customNum,
      tipsSize,
      labelName,
      custSource: '瞄准镜标签',
      argsOfQueryCustomer,
      currentFilterObject,
      filterNumObject,
      shouldclearBottomLabel,
      currentFilterNum,
      currentSelectLabelName,
    };

    return {
      labelCust,
    };
  }

  @autobind
  handleSearchClick(value) {
    const { getLabelInfo, isAuthorize, orgId } = this.props;
    const param = {
      condition: value,
    };
    this.setState({
      shouldclearBottomLabel: true,
      condition: value,
      labelId: '',
      labelDesc: '',
      custNum: 0,
      currentSelectLabel: '',
    });
    const clearFromSearch = true;
    this.props.switchBottomFromSearch(clearFromSearch); // 隐藏底部标签文字
    if (_.isEmpty(value)) {
      this.setState({
        tipsSize: 0,
      });
    }
    if (isAuthorize) {
      // 有首页绩效指标查看权限
      getLabelInfo({
        ...param,
        orgId,
      });
    } else {
      getLabelInfo({
        ...param,
        ptyMngId: emp.getId(),
      });
    }
  }

  @autobind
  handleRadioChange({ currentLabelId, filterNumObject, currentSelectLabelName }) {
    const currentFilterNum = filterNumObject && filterNumObject[currentLabelId];
    const state = {
      labelId: currentLabelId || this.state.labelId,
      currentSelectLabel: currentLabelId || this.state.labelId,
      currentSelectLabelName: currentSelectLabelName || this.state.currentSelectLabelName,
      currentFilterNum:
        currentFilterNum !== undefined ? currentFilterNum : this.state.currentFilterNum,
      clearFromSearch: false,
    };
    this.setState({
      ...state,
    });
    // 将标签列表项的全部状态信息暴露出去
    this.props.onChange({
      ...state,
    });
  }


  render() {
    const {
      getLabelPeople,
      circlePeopleData,
      peopleOfLabelData,
      orgId,
      isLoadingEnd,
      isSightTelescopeLoadingEnd,
      onCancel,
      isAuthorize,
      dict,
      getFiltersOfSightingTelescope,
      sightingTelescopeFilters,
      storedData,
    } = this.props;
    const { condition, currentSelectLabel, tipsSize } = this.state;
    return (
      <div className={styles.searchContact}>
        <Search
          placeholder="标签名称"
          onSearch={this.handleSearchClick}
          style={{
            height: '28px',
            width: '186px',
          }}
          defaultValue={condition}
        />
        <h4 className={styles.tipsWord}>共有<span>{tipsSize}</span>条可选标签</h4>
        <TaskSearchRow
          ref={(ref) => {
            if (ref) {
              this.taskSearchRowRef = ref;
            }
          }}
          dict={dict}
          onCancel={onCancel}
          isLoadingEnd={isLoadingEnd}
          isSightTelescopeLoadingEnd={isSightTelescopeLoadingEnd}
          onChange={this.handleRadioChange}
          circlePeopleData={circlePeopleData}
          getLabelPeople={getLabelPeople}
          peopleOfLabelData={peopleOfLabelData}
          condition={condition}
          currentSelectLabel={currentSelectLabel}
          orgId={orgId}
          isAuthorize={isAuthorize}
          getFiltersOfSightingTelescope={getFiltersOfSightingTelescope}
          sightingTelescopeFilters={sightingTelescopeFilters}
          getFilterNumberList={this.getFilterNumberList}
          storedData={storedData}
        />
      </div>
    );
  }
}

