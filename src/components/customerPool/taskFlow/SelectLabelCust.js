import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Search from '../../common/Search/index';
import TaskSearchRow from './TaskSearchRow';
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
  };

  static defaultProps = {
    storedData: {},
  };

  constructor(props) {
    super(props);
    const { storedData = EMPTY_OBJECT } = props;
    const { labelCust = EMPTY_OBJECT } = storedData;
    this.state = {
      current: 0,
      data: labelCust,
      condition: '',
    };
    this.bigBtn = true;
  }

  // componentWillReceiveProps(nextProps) {
  //   this.getData();
  // }

  @autobind
  getData() {
    const { custId, condition } = this.state;
    const { circlePeopleData } = this.props;
    const labelCust = {
      custId,
      circlePeopleData,
      condition,
    };
    console.log('data---', { data: labelCust });
    return {
      data: labelCust,
    };
  }

  @autobind
  handleSearchClick({ value, selectedItem }) {
    console.log('search click---', value, '--', JSON.stringify(selectedItem));
    const { getLabelInfo } = this.props;
    const param = {
      condition: value,
    };
    this.setState({
      condition: value,
    });
    // console.log(param);
    getLabelInfo(param);
  }

  @autobind
  handleRadioChange(value) {
    console.log('value--', value);
    this.setState({
      custId: value,
    });
  }

  render() {
    // console.log(Search);
    const {
      getLabelPeople,
      circlePeopleData,
      peopleOfLabelData,
    } = this.props;
    const { condition } = this.state;
    return (
      <div className={styles.searchContact}>
        <Search
          searchStyle={{
            height: '50px',
            width: '390px',
          }}
          onSearchClick={this.handleSearchClick}
          isNeedLgSearch={this.bigBtn}
        />
        <TaskSearchRow
          onChange={this.handleRadioChange}
          circlePeopleData={circlePeopleData}
          getLabelPeople={getLabelPeople}
          peopleOfLabelData={peopleOfLabelData}
          condition={condition}
        />
      </div>
    );
  }
}
