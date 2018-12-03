import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Radio, Menu } from 'antd';
import { Button } from 'lego-react-filter/src';
import styles from './bussinessOpenedMenu.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const SubMenu = Menu.SubMenu;

export default class BusinessFilterMenu extends PureComponent {
  static propTypes = {
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired, // 选中某项的回调， function({label, value})
    data: PropTypes.object.isRequired,
  }

  state = {
    openKeys: [],
    visible: false,
    dateTypeErr: false,
    businessTypeErr: false,
    dateType: this.props.value[0] || '',
    businessType: this.props.value[1] || 'all',
  }

  getSubmenuTitle = () => {
    const { data } = this.props;
    const { businessType } = this.state;
    const findBusinessType = _.find(data.businessType, item => item.key === businessType);
    return findBusinessType ? findBusinessType.value : '不限';
  }

  handleRidioChange = (e) => {
    this.setState({
      dateType: e.target.value,
      dateTypeErr: false,
    });
  }

  handleTitleClick = () => {
    if (this.state.visible) {
      this.setState({
        openKeys: [],
        visible: !this.state.visible,
      });
    } else {
      this.setState({
        openKeys: ['select'],
        visible: !this.state.visible,
      });
    }
  }

  handleItemClick = ({ key }) => {
    this.setState({
      openKeys: [],
      businessType: key,
      visible: false,
      businessTypeErr: false,
    });
  }

  handleResetBtnClick = () => {
    this.setState({
      dateType: '',
      businessType: 'all',
      openKeys: [],
      visible: false,
      dateTypeErr: false,
      businessTypeErr: false,
    });

    this.props.onChange({
      dateType: '',
      businessType: 'all',
    });
  }

  handleSubmitBtnClick = () => {
    const { dateType, businessType } = this.state;
    if ((!dateType && businessType === 'all')
      || (dateType && businessType !== 'all')) {
      this.setState({
        openKeys: [],
        visible: false,
      });
      this.props.onChange({
        dateType: this.state.dateType,
        businessType: this.state.businessType,
      }, {
        inVisible: true,
      });
    } else if (!dateType) {
      this.setState({
        openKeys: [],
        visible: false,
        dateTypeErr: true,
      });
      this.props.onChange({
        dateType: this.state.dateType,
        businessType: this.state.businessType,
      }, {
        isUnValid: true,
      });
    } else if (businessType === 'all') {
      this.setState({
        openKeys: [],
        visible: false,
        businessTypeErr: true,
      });
      this.props.onChange({
        dateType: this.state.dateType,
        businessType: this.state.businessType,
      }, {
        isUnValid: true,
      });
    }
  }

  render() {
    const { data } = this.props;
    const radioCls = classNames({
      [styles.errMessage]: true,
      [styles.show]: this.state.dateTypeErr,
    });

    const selectCls = classNames({
      [styles.errMessage]: true,
      [styles.show]: this.state.businessTypeErr,
    });

    return (
      <div className={styles.businessMenu}>
        <div className={styles.radioGroup} onChange={this.handleRidioChange}>
          <div className={styles.label}>周期</div>
          <RadioGroup value={this.state.dateType} size="large">
            {
              _.map(data.dateType, item => ((
                <RadioButton key={item.key} value={item.key} autoFocus>{item.value}</RadioButton>
              )))
            }
          </RadioGroup>
          <div className={radioCls}>请选择周期</div>
        </div>
        <div className={styles.menuSelect} ref={ref => this.elem = ref}>
          <div className={styles.label}>开通业务</div>
          <Menu
            key="Menu"
            theme="light"
            mode="inline"
            inlineIndent={0}
            selectedKeys={[this.state.businessType]}
            openKeys={this.state.openKeys}
            onClick={this.handleItemClick}
            forceSubMenuRender
          >
            <SubMenu
              key="select"
              title={(
                <span>{this.getSubmenuTitle()}</span>
              )}
              onTitleClick={this.handleTitleClick}
            >
              {
                _.map(data.businessType, item => ((
                  <Menu.Item key={item.key} value={item.key}>
                    <span className={styles.menuItem}>{item.value}</span>
                  </Menu.Item>
                )))
              }
            </SubMenu>
          </Menu>
          <div className={selectCls}>请选择开通业务</div>
        </div>
        <div className={styles.btnGroup}>
          <Button onClick={this.handleResetBtnClick} type="cancel">重置</Button>
          <Button onClick={this.handleSubmitBtnClick} type="submit">确定</Button>
        </div>
      </div>
    );
  }
}
