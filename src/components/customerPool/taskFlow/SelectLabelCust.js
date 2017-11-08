import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
// import Search from '../../common/Search/index';
import TaskSearchRow from './TaskSearchRow';
import SimpleSearch from '../groupManage/CustomerGroupListSearch';
import { helper } from '../../../utils';
import styles from './selectLabelCust.less';

const EMPTY_OBJECT = {};
export default class SelectLabelCust extends PureComponent {
  static propTypes = {
    getLabelInfo: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    peopleOfLabelData: PropTypes.object.isRequired,
    // 保存的数据
    storedData: PropTypes.object,
    orgId: PropTypes.string,
    isLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    isHasAuthorize: PropTypes.bool,
  };

  static defaultProps = {
    storedData: {},
    orgId: null,
    isHasAuthorize: false,
  };

  constructor(props) {
    super(props);
    const { storedData = EMPTY_OBJECT } = props;
    const { labelCust = EMPTY_OBJECT } = storedData;
    const { condition = '', labelId = '', tipsSize = 0 } = labelCust || EMPTY_OBJECT;

    this.state = {
      current: 0,
      labelCust,
      condition,
      currentSelectLabel: labelId,
      labelId,
      tipsSize,
    };
    this.bigBtn = true;
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

    const { circlePeopleData } = this.props;
    const matchedData = _.find(circlePeopleData, item => item.id === labelId);
    const { labelDesc = '', customNum = '', labelMapping } = matchedData || EMPTY_OBJECT;

    const labelCust = {
      labelId,
      labelMapping,
      labelDesc,
      condition,
      customNum,
      tipsSize,
    };

    return {
      labelCust,
    };
  }

  @autobind
  handleSearchClick(value) {
    const { getLabelInfo, isHasAuthorize, orgId } = this.props;

    const param = {
      condition: value,
      ptyMngId: helper.getEmpId(),
    };

    this.setState({
      condition: value,
      labelId: '',
      labelDesc: '',
      customNum: 0,
      currentSelectLabel: '',
    });

    if (_.isEmpty(value)) {
      this.setState({
        tipsSize: 0,
      });
      return;
    }

    if (isHasAuthorize) {
      // 有首页绩效指标查看权限
      getLabelInfo({
        ...param,
        orgId,
      });
    } else {
      getLabelInfo(param);
    }
  }

  @autobind
  handleRadioChange(value) {
    this.setState({
      labelId: value,
      currentSelectLabel: value,
    });
  }

  render() {
    const {
      getLabelPeople,
      circlePeopleData,
      peopleOfLabelData,
      orgId,
      isLoadingEnd,
      onCancel,
    } = this.props;
    const { condition, currentSelectLabel, tipsSize } = this.state;
    return (
      <div className={styles.searchContact}>
        <SimpleSearch
          onSearch={this.handleSearchClick}
          searchStyle={{
            height: '30px',
            width: '400px',
          }}
          defaultValue={condition}
          isNeedBtn
        />
        {!_.isEmpty(condition)
          ? <h4 className={styles.tipsWord}>共找到<span>{tipsSize}</span>条相关标签</h4>
          :
          null
        }
        <TaskSearchRow
          onCancel={onCancel}
          isLoadingEnd={isLoadingEnd}
          onChange={this.handleRadioChange}
          circlePeopleData={circlePeopleData}
          getLabelPeople={getLabelPeople}
          peopleOfLabelData={peopleOfLabelData}
          condition={condition}
          currentSelectLabel={currentSelectLabel}
          orgId={orgId}
        />
      </div>
    );
  }
}
