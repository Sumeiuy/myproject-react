/*
 * @Author: zuoguangzu
 * @Date: 2018-11-08 13:09:34
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-11-09 10:32:16
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import styles from './toDoNav.less';
import { toDoType } from './config';

export default class ToDoNav extends PureComponent {
  static propTypes = {
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className={styles.header}>
          {
            _.map(toDoType, item =>
            (
              <div className={styles.item}>
                {item.label}
              </div>
            )
          )
          }
        </div>
        <div className={styles.content}>

        </div>

      </div>
    );
  }
}
