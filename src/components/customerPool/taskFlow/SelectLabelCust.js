import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
// import Search from '../../common/Search/index';
import TaskSearchRow from './TaskSearchRow';
import SimpleSearch from '../groupManage/CustomerGroupListSearch';
import styles from './selectLabelCust.less';

const EMPTY_OBJECT = {};
export default class SelectLabelCust extends PureComponent {
  static propTypes = {
    getLabelInfo: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    peopleOfLabelData: PropTypes.array.isRequired,
    // 保存的数据
    storedData: PropTypes.object,
  };

  static defaultProps = {
    storedData: {},
  };

  constructor(props) {
    super(props);
    const { storedData = EMPTY_OBJECT } = props;
    const { labelCust = EMPTY_OBJECT } = storedData;
    const { condition = '', labelId = '' } = labelCust || EMPTY_OBJECT;

    this.state = {
      current: 0,
      labelCust,
      condition,
      currentSelectLabel: labelId,
      labelId,
    };
    this.bigBtn = true;
  }

  @autobind
  getData() {
    const { labelId = '', condition } = this.state;
    const { circlePeopleData } = this.props;
    const matchedData = _.find(circlePeopleData, item => item.id === labelId);
    const { labelDesc = '', customNum = '' } = matchedData || EMPTY_OBJECT;

    const labelCust = {
      labelId,
      labelDesc,
      condition,
      customNum,
    };

    return {
      labelCust,
    };
  }

  @autobind
  handleSearchClick(value) {
    const { getLabelInfo } = this.props;

    const param = {
      condition: value,
    };

    this.setState({
      condition: value,
    });

    getLabelInfo(param);
  }

  @autobind
  handleRadioChange(value) {
    console.log('value--', value);
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
    } = this.props;
    const { condition, currentSelectLabel } = this.state;

    return (
      <div className={styles.searchContact}>
        <SimpleSearch
          onSearch={this.handleSearchClick}
          searchStyle={{
            height: '30px',
            width: '350px',
          }}
          defaultValue={condition}
          isNeedBtn
        />
        <TaskSearchRow
          onChange={this.handleRadioChange}
          circlePeopleData={circlePeopleData}
          getLabelPeople={getLabelPeople}
          peopleOfLabelData={peopleOfLabelData}
          condition={condition}
          currentSelectLabel={currentSelectLabel}
        />
      </div>
    );
  }
}
