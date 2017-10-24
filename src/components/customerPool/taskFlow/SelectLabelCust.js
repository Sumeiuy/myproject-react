import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Search from '../../common/Search/index';
import TaskSearchRow from './TaskSearchRow';
import styles from './selectLabelCust.less';

const EMPTY_OBJECT = {};
export default class SelectLabelCust extends PureComponent {
  static propTypes = {
    getCirclePeople: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
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
    };
    this.bigBtn = true;
  }

  @autobind
  getData() {
    const { data } = this.state;
    return {
      labelCust: data,
    };
  }

  @autobind
  handleSearchClick({ value, selectedItem }) {
    console.log('search click---', value, '--', JSON.stringify(selectedItem));
    const { getCirclePeople } = this.props;
    const param = {
      condition: value,
    };
    console.log(param);
    getCirclePeople(param);
  }

  @autobind
  handleRadioChange(value) {
    console.log('value--', value);
  }

  render() {
    console.log(Search);
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
        />
      </div>
    );
  }
}
