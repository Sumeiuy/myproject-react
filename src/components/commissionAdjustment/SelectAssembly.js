/**
 * @file components/common/Select/SelectAssembly.js
 *  带搜索icon的select和添加按钮
 *  当输入或者选中值后icon变化成关闭点击后清除input的value值
 * @author baojiajia
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete } from 'antd';
import _ from 'lodash';

import { seibelConfig } from '../../config';
import confirm from '../common/Confirm/confirm';
import styles from './selectAssembly.less';

const { comsubs: commadj } = seibelConfig;
const Option = AutoComplete.Option;

export default class SelectAssembly extends PureComponent {

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    onSearchValue: PropTypes.func.isRequired,
    onSelectValue: PropTypes.func.isRequired,
    onValidateCust: PropTypes.func.isRequired,
    width: PropTypes.string,
    subType: PropTypes.string,
    validResult: PropTypes.object.isRequired,
  }

  static defaultProps = {
    width: '300px',
    subType: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      typeStyle: 'search',
    };
  }

  // 该用户是否能够被选中
  canSelected = true
  // 选中的客户
  selectedCust = null

  @autobind
  handleInputValue(value) {
    this.setState({
      inputValue: value,
    });
    if (value === '') {
      this.setState({
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
    // TODO 测试说校验成功后，不用提示，不过还是觉得校验成功的时候，需要提示下用户
    // confirm({
    //   shortCut: 'custPass',
    //   onOk: this.handleOKAfterValidate,
    // });
    this.handleOKAfterValidate();
    const { custName, custEcom, riskLevelLabel } = this.selectedCust;
    this.setState({
      inputValue: `${custName}（${custEcom}） - ${riskLevelLabel || ''}`,
      typeStyle: 'close',
    });
  }

  // 根据用户选中的option的value值获取对应的数组值
  @autobind
  handleSelectedValue(value) {
    if (value) {
      // 找出那个用户选择的客户数据
      const { dataSource } = this.props;
      const item = _.filter(dataSource, o => o.id === value)[0];
      // 首先需要做客户校验
      this.selectedCust = null;
      const { id, custType } = item;
      this.selectedCust = item;
      // this.props.onSelectValue(item);
      this.props.onValidateCust({
        custRowId: id,
        custType,
      }).then(() => this.afterValidateSingleCust(item));
    } else {
      this.setState({
        inputValue: '',
        typeStyle: 'search',
      });
    }
  }

  @autobind
  changeDataSource() {
    if (this.state.typeStyle === 'search') {
      this.props.onSearchValue(this.state.inputValue);
    } else if (this.state.typeStyle === 'close') {
      this.setState({
        inputValue: '',
        typeStyle: 'search',
      });
    }
  }


  render() {
    const { dataSource, width } = this.props;
    const { inputValue, typeStyle } = this.state;
    const options = dataSource.map((opt) => {
      const { custName, custEcom, riskLevelLabel } = opt;
      const levelText = riskLevelLabel ? ` - ${riskLevelLabel}` : '';
      return (
        <Option
          key={opt.id}
          value={opt.id}
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
          />
        </AutoComplete>
      </div>
    );
  }
}
