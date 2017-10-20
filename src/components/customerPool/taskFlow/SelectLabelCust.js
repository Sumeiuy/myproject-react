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
    // 保存数据方法
    storeData: PropTypes.func.isRequired,
    // 保存的数据
    storedData: PropTypes.object,
    saveDataEmitter: PropTypes.object.isRequired,
    onStepUpdate: PropTypes.func.isRequired,
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

  componentWillMount() {
    const { saveDataEmitter } = this.props;
    saveDataEmitter.on('saveSelectCustData', this.handleSaveData);
  }

  componentWillUnmount() {
    const { saveDataEmitter } = this.props;
    saveDataEmitter.removeListener('saveSelectCustData', this.handleSaveData);
  }

  @autobind
  handleRadioChange(value) {
    console.log('value--', value);
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
  handleSaveData() {
    const { storeData, storedData, onStepUpdate } = this.props;
    const { data } = this.state;

    storeData({
      ...storedData,
      labelCust: data,
    });

    onStepUpdate();
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
