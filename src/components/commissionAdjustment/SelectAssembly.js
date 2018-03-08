/**
 * @file components/common/Select/SelectAssembly.js
 *  带搜索icon的select和添加按钮
 *  当输入或者选中值后icon变化成关闭点击后清除input的value值
 * @author zhufeiyang
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete } from 'antd';
import _ from 'lodash';

import { seibelConfig } from '../../config';
import confirm from '../common/Confirm';
import styles from './selectAssembly.less';

const { comsubs: commadj } = seibelConfig;
const Option = AutoComplete.Option;

export default class SelectAssembly extends PureComponent {

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    onSearchValue: PropTypes.func.isRequired,
    onSelectValue: PropTypes.func.isRequired,
    onValidateCust: PropTypes.func,
    width: PropTypes.string,
    subType: PropTypes.string,
    validResult: PropTypes.object,
    shouldeCheck: PropTypes.bool,
  }

  static defaultProps = {
    width: '300px',
    subType: '',
    validResult: {},
    shouldeCheck: true,
    onValidateCust: () => { },
    dataSource: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      typeStyle: 'search',
      dataSource: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource: nextData } = nextProps;
    const { dataSource: prevData } = this.props;
    if (nextData !== prevData) {
      this.setState({
        dataSource: _.cloneDeep(nextData),
      });
    }
  }

  // 该用户是否能够被选中
  canSelected = true
  // 选中的客户
  selectedCust = null

  @autobind
  handleInputValue(value) {
    if (this.selectedCust) {
      const { custName, custEcom, riskLevelLabel } = this.selectedCust;
      this.setState({
        inputValue: `${custName}（${custEcom}） - ${riskLevelLabel || ''}`,
        dataSource: [],
        typeStyle: 'close',
      });
      this.selectedCust = null;
    } else {
      this.setState({
        inputValue: value,
        dataSource: [],
        typeStyle: 'search',
      });
    }
  }

  @autobind
  clearCust() {
    this.setState({
      inputValue: '',
      typeStyle: 'search',
    });
    this.selectedCust = null;
    this.canSelected = false;
  }

  @autobind
  handleOKAfterValidate() {
    if (this.canSelected) {
      // 可以选中
      const { subType, onSelectValue, validResult: { openRzrq } } = this.props;
      if (subType === commadj.single) {
        onSelectValue({ ...this.selectedCust, openRzrq });
      } else {
        onSelectValue(this.selectedCust);
      }
      this.setState({
        typeStyle: 'close',
      });
    } else {
      // 干掉客户
      this.clearCust();
    }
  }

  @autobind
  handleCancelAfterValidate() {
    this.clearCust();
  }

  // 校验不通过，弹框
  @autobind
  fail2Validate(shortCut, content) {
    confirm({
      shortCut,
      content,
      onOk: this.handleOKAfterValidate,
      onCancel: this.handleCancelAfterValidate,
    });
    this.canSelected = false;
  }
  // 客户校验
  @autobind
  afterValidateSingleCust() {
    if (_.isEmpty(this.props.validResult)) {
      confirm({ content: '客户校验失败' });
      return;
    }
    const {
      riskRt,
      investRt,
      investTerm,
      validmsg,
      hasorder,
    } = this.props.validResult;
    const { subType } = this.props;
    // 风险测评校验
    if (riskRt === 'N') {
      this.fail2Validate('custRisk');
      return;
    }
    // 偏好品种校验
    if (investRt === 'Y') {
      this.fail2Validate('custInvestRt');
      return;
    }
    // 投资期限校验
    if (investTerm === 'Y') {
      this.fail2Validate('custInvestTerm');
      return;
    }
    if (subType === commadj.single && hasorder === 'Y') {
      // 目前只有单佣金需要对在途订单
      this.fail2Validate('', validmsg);
      return;
    }
    this.canSelected = true;
    this.handleOKAfterValidate();
  }

  // 根据用户选中的option的value值获取对应的数组值
  @autobind
  handleSelectedValue(value) {
    if (value) {
      const keyId = value.substr(0, value.length - 3);
      // 找出那个用户选择的客户数据
      const { shouldeCheck } = this.props;
      const { dataSource } = this.state;
      const item = _.filter(dataSource, o => o.id === keyId)[0];
      // 首先需要做客户校验
      this.selectedCust = null;
      const { id, custType } = item;
      this.selectedCust = item;
      if (shouldeCheck) {
        this.props.onValidateCust({
          custRowId: id,
          custType,
        }).then(() => this.afterValidateSingleCust(item));
      } else {
        this.props.onSelectValue(this.selectedCust);
      }
    }
  }

  @autobind
  changeDataSource() {
    if (this.state.typeStyle === 'search') {
      this.props.onSearchValue(this.state.inputValue);
    } else if (this.state.typeStyle === 'close') {
      this.setState({
        dataSource: [],
        inputValue: '',
        typeStyle: 'search',
      });
    }
  }

  render() {
    const { width } = this.props;
    const { inputValue, typeStyle, dataSource } = this.state;
    const options = dataSource.map((opt) => {
      const { custName, custEcom, riskLevelLabel } = opt;
      const levelText = riskLevelLabel ? ` - ${riskLevelLabel}` : '';
      return (
        <Option
          key={opt.id}
          value={`${opt.id}%%%`}
          text={`${custName}（${custEcom}）${levelText}`}
        >
          <span className={styles.prodValue}>
            {custName}（{custEcom}） {levelText}
          </span>
        </Option>
      );
    });
    return (
      <div className={styles.selectSearchBox}>
        <AutoComplete
          placeholder="客户号/客户姓名"
          className={styles.searchBox}
          dropdownClassName={styles.searchDropDown}
          dropdownStyle={{ width }}
          dropdownMatchSelectWidth={false}
          size="large"
          style={{ width }}
          dataSource={options}
          optionLabelProp="text"
          onChange={this.handleInputValue}
          onSelect={this.handleSelectedValue}
          value={inputValue}
        >
          <Input
            suffix={
              <Icon
                type={typeStyle}
                onClick={this.changeDataSource}
                className={styles.searchIcon}
              />
            }
            onPressEnter={this.changeDataSource}
          />
        </AutoComplete>
      </div>
    );
  }
}
