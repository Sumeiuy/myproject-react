import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import TaskSearchRow from './TaskSearchRow';
import SimpleSearch from '../groupManage/CustomerGroupListSearch';
import { emp } from '../../../helper';
import styles from './selectLabelCust.less';

const EMPTY_OBJECT = {};
export default class SelectLabelCust extends PureComponent {
  static propTypes = {
    dict: PropTypes.object.isRequired,
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
    visible: PropTypes.bool.isRequired,
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
    const { labelDesc = '', customNum = '', labelMapping, labelName = '' } = matchedData || EMPTY_OBJECT;

    const labelCust = {
      labelId,
      labelMapping,
      labelDesc,
      condition,
      custNum: customNum,
      tipsSize,
      labelName,
      custSource: '瞄准镜标签',
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
    };

    this.setState({
      condition: value,
      labelId: '',
      labelDesc: '',
      custNum: 0,
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
      getLabelInfo({
        ...param,
        ptyMngId: emp.getId(),
      });
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
      visible,
      isHasAuthorize,
      dict,
    } = this.props;
    const { condition, currentSelectLabel, tipsSize } = this.state;
    return (
      <div className={styles.searchContact}>
        <SimpleSearch
          titleNode={<span className={styles.searchTitle}>瞄准镜：</span>}
          placeholder="标签名称"
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
          dict={dict}
          onCancel={onCancel}
          isLoadingEnd={isLoadingEnd}
          visible={visible}
          onChange={this.handleRadioChange}
          circlePeopleData={circlePeopleData}
          getLabelPeople={getLabelPeople}
          peopleOfLabelData={peopleOfLabelData}
          condition={condition}
          currentSelectLabel={currentSelectLabel}
          orgId={orgId}
          isHasAuthorize={isHasAuthorize}
        />
      </div>
    );
  }
}
