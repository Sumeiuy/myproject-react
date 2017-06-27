/*
 * @Author: LiuJianShu
 * @Date: 2017-06-23 13:30:03
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-06-27 09:48:24
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Col, Row } from 'antd';

import BoardSelect from '../../components/pageCommon/BoardSelect';
import BoardItem from '../../components/pageCommon/BoardItem';
import styles from './Home.less';

export default class BoardManageHome extends PureComponent {
  static propTypes = {
    boardManage: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }
  // 新建看板事件
  @autobind
  createBoardHandle() {
    console.warn('新建看板事件');
  }
  render() {
    const {
      location,
    } = this.props;
    const dataArr = [{
      id: 1,
      type: 'jyyj',
      title: '总部绩效看板',
      status: '未发布',
      seeAllow: ['经纪业务总部', '分公司'],
      editTime: '2017-05-06 15:40',
      published: false,
    }, {
      id: 2,
      type: 'tgjx',
      title: '分公司客户绩效看板',
      status: '已发布',
      seeAllow: ['经纪业务总部', '分公司', '分公司', '分公司', '分公司', '分公司', '分公司', '分公司', '分公司', '分公司', '分公司', '分公司'],
      editTime: '2017-05-06 15:40',
      published: true,
    }, {
      id: 3,
      type: 'jyyj',
      title: '营业部客户绩效看板',
      status: '未发布',
      seeAllow: ['经纪业务总部', '分公司'],
      editTime: '2017-05-06 15:40',
      published: false,
    }];
    return (
      <div className="page-invest content-inner">
        <div className="reportHeader">
          <Row type="flex" justify="start" align="middle">
            <div className="reportName">
              <BoardSelect
                location={location}
              />
            </div>
          </Row>
        </div>
        <div className={styles.boardList}>
          <Row gutter={19}>
            <Col span={8} className={styles.test}>
              <a
                className={styles.boardItem}
                onClick={this.createBoardHandle}
              >
                <div className={styles.boardAdd}>
                  <img src="/static/images/bg_add.png" alt="" />
                  <h3>创建看板</h3>
                </div>
                <div className={styles.boardImg}>
                  <img src="/static/images/bg_tgyj.png" alt="" />
                </div>
                <div className={styles.boardTitle} />
              </a>
            </Col>
            {
              dataArr.map(item => (
                <Col span={8} key={item.id}>
                  <BoardItem boardData={item} />
                </Col>
              ))
            }
          </Row>
        </div>
      </div>
    );
  }
}

