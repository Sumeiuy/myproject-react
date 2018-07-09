/**
 * @file components/layout/MoreTab.js
 * 更多的tab按钮
 * @author yuanhaojie
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Menu, Dropdown, Icon } from 'antd';
import styles from './moreTab.less';
import { autobind } from 'core-decorators';

export default class TabMenu extends PureComponent {
  static propTypes = {
    activeKey: PropTypes.string.isRequired,
    moreTabArray: PropTypes.array.isRequired,
    onRemove: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  @autobind
  remove(key) {
    const { onRemove } = this.props;
    onRemove(key);
  }

  @autobind
  change(key, activeKey) {
    const { onChange } = this.props;
    if (key !== activeKey) {
      onChange(key);
    }
  }

  getMenus(array) {
    const { activeKey } = this.props;
    return array.map((item) => {
      const active = item.id === activeKey;
      return (
        <Menu.Item 
          key={item.id}
          className={active ? styles.activeItem : null}
        >
          <div className={styles.subMenuItem}>
            <div 
              className={classnames({
                [styles.text]: true,
                [styles.active]: active,  
              })}
              title={`${item.name}`}
              onClick={() => this.change(item.id, activeKey)}
            >
              {item.name}
            </div>
            <div
              className={styles.close} 
              onClick={() => this.remove(item.id)}
            >
              <Icon type="close" />
            </div>
          </div> 
        </Menu.Item>
      );
    });
  }

  render() {
    const { moreTabArray, activeKey } = this.props;
    const tabNum = moreTabArray.length;
    const activeState = !!_.find(moreTabArray, item => item.id === activeKey);

    const menus = (
      <Menu>
        <Menu.Item key="text" disabled>
          <div className={styles.text}>{'更多(' + tabNum + ')'}</div>
        </Menu.Item>
        <Menu.Divider />
        {
          this.getMenus(moreTabArray)
        }
      </Menu>
    );

    return (
      <div className={styles.moreTab}>
        <Dropdown placement='bottomLeft' overlay={menus} trigger={['hover']}>
          <div className={activeState ? styles.active : null}>
            <div>
              {tabNum}
            </div>
          </div>
        </Dropdown>
      </div>
    );
  }
}