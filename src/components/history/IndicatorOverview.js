/**
 * @file /history/IndicatorOverview.js
 *  历史指标-指标概览
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { autobind } from 'core-decorators';
import Icon from '../common/Icon';
import PickIndicators from './PickIndicators';
import ChartRadar from '../chartRealTime/ChartRadar';
import IndexItem from './IndexItem';
import styles from './indicatorOverview.less';

export default class IndicatorOverview extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectIndex: 'select0', // 默认选中项
    };
  }

  /**
   * 问题处理提交
  */
  @autobind
  handleCreate(f) {
    const form = f;
    console.log(form);
  }
  /**
   * 存储处理问题form
  */
  saveFormRef = (form) => {
    this.handlingForm = form;
  }
  /**
   * 弹窗处理（关闭）
  */
  handleCancel = () => {
    this.setState({ visible: false });
  }
  /**
   * 弹窗处理（开启）
  */
  showModal = () => {
    this.setState({ visible: true });
  }

  // 概览项选中
  @autobind
  handleClick(event) {
    const dataKey = event.currentTarget.getAttribute('data-key');
    this.setState({
      selectIndex: `select${dataKey}`,
    });
  }

  render() {
    const { data } = this.props;
    return (
      <div className={styles.overviewBox}>
        <Row>
          <Col span="14">
            <div className={styles.overview}>
              <div className={styles.titleDv}>
                <Button
                  type="primary"
                  ghost className={styles.btn_r}
                  onClick={this.showModal}
                >
                  <Icon type="jia" />
                  挑选指标
                </Button>
                指标概览
              </div>
              <PickIndicators
                ref={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
              />
              <div className={styles.content}>
                {/* 交易：icon-test 客户：kehu 指标：iczhibiao24px 钱袋：qiandai*/}
                <ul>
                  {
                    data.map((item, index) => {
                      const selectIndex = `select${index}`;
                      return (
                        <li
                          onClick={event => this.handleClick(event)}
                          key={selectIndex}
                          data-key={index}
                        >
                          <IndexItem
                            itemData={item}
                            active={this.state.selectIndex}
                            itemIndex={selectIndex}
                          />
                        </li>
                      );
                    })
                  }
                  <div className={styles.clear} />
                </ul>
              </div>
              <div className={styles.bottomInfo}>
                <i />
                <p>
                  <span>资产交易量：</span>
                  资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资
产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量。</p>
              </div>
            </div>
          </Col>
          <Col span="10">
            <div className={styles.radarBox}>
              <div className={styles.titleDv}>
                强弱指示分析
              </div>
              <div className={styles.radar}>
                <ChartRadar />
              </div>
              <div className={styles.radarInfo}>
                <i />新开客户：本期排名：
                <span className={styles.now}>3</span>
                上期排名：<span className={styles.before}>4</span>
                共 <span className={styles.all}>9</span> 家营业
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
