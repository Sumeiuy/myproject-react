import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { Radio } from 'antd';
// import { autobind } from 'core-decorators';
// import _ from 'lodash';
// import Button from '../../components/common/Button';
import { steps, custSelectType } from '../../../config';
import Search from '../../common/Search/index';
import TaskSearchRow from './TaskSearchRow';
import styles from './selectLabelCust.less';

export default class SelectLabelCust extends PureComponent {
  static propTypes = {
    getCirclePeople: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    // 是否需要恢复数据
    isRestoreData: PropTypes.bool.isRequired,
    // 是否需要保存数据
    isStoreData: PropTypes.bool.isRequired,
    // 保存数据方法
    storeData: PropTypes.func.isRequired,
    // 恢复数据方法
    restoreData: PropTypes.func.isRequired,
    // 保存的数据
    storedData: PropTypes.object,
    // 步骤更新回调
    onStepUpdate: PropTypes.func.isRequired,
    // replace
    replace: PropTypes.func.isRequired,
    // location
    location: PropTypes.object.isRequired,
  };

  static defaultProps = {
    storedData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
    this.bigBtn = true;
  }

  componentWillMount() {
    const { replace, location: { query, pathname } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        // 页面初始化时，恢复option
        isStoreData: 'N',
        step: steps[1].key,
        type: custSelectType[1].key,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      isRestoreData,
      isStoreData,
      // storedData,
      onStepUpdate,
      replace,
      location: { query, pathname, state },
     } = this.props;
    const {
      isRestoreData: nextIsRestoreData,
      isStoreData: nextIsStoreData,
     } = nextProps;

    if (isStoreData !== nextIsStoreData || isStoreData) {
      replace({
        pathname,
        query: {
          ...query,
          isStoreData: nextIsStoreData ? 'Y' : 'N',
          // 第二步
          step: steps[1].key,
          // 标签圈人
          type: custSelectType[1].key,
        },
        state: {
          ...state,
          // currentSelect 2 代表第二个tab
          data: {},
        },
      });

      onStepUpdate({
        type: 'next',
      });
    }

    if (isRestoreData !== nextIsRestoreData || isRestoreData) {
      // 恢复数据
    }
  }

  @autobind
  handleRadioChange(value) {
    console.log('value--', value);
  }

  @autobind
  handleSearchClick({ value, selectedItem }) {
    console.log('search click---', value, '--', JSON.stringify(selectedItem));
    const { getCirclePeople } = this.props;
    // const condition = value;
    const param = {
      condition: value,
    };
    console.log(param);
    getCirclePeople(param);
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
