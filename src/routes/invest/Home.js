/**
 * @file invest/Home.js
 *  投顾业绩汇总首页
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Row, Col, Radio } from 'antd';

import styles from './Home.less';

// RadioButton
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const mapStateToProps = state => ({
  performance: state.invest.performance,
});

const mapDispatchToProps = {
  getPerformance: query => ({
    type: 'invest/getPerformance',
    payload: query || {},
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class InvestHome extends PureComponent {

  static propTypes = {
    getPerformance: PropTypes.func.isRequired,
    performance: PropTypes.array,
  }

  static defaultProps = {
    performance: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      duration: this.getDurationString('m'),
    };
  }
  componentWillMount() {
    this.props.getPerformance();
  }

  @autobind
  getDurationString(flag) {
    let duration = '';
    const now = new Date();
    const month = now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`;
    const day = now.getDate();
    let qStartMonth = (Math.floor((now.getMonth() + 3) / 3) * 3) - 2;
    qStartMonth = qStartMonth < 10 ? `0${qStartMonth}` : `${qStartMonth}`;
    // 本月
    if (flag === 'm') {
      duration = `${month}/01-${month}/${day}`;
    } else if (flag === 'q') {
      duration = `${qStartMonth}/01-${month}/${day}`;
    } else if (flag === 'y') {
      duration = `01/01-${month}/${day}`;
    }
    return duration;
  }

  @autobind
  durationChange(value) {
    const duration = this.getDurationString(value);
    this.setState({
      duration,
    });
  }
  // 期间变化
  @autobind
  handleDurationChange(e) {
    const value = e.target.value;
    this.durationChange(value);
  }

  render() {
    const { duration } = this.state;
    const { performance } = this.props;
    console.log(performance);
    return (
      <div className="page-invest content-inner">
        <div className={styles.investBlock}>
          <div className={styles.headerFilter}>
            <Row type="flex" justify="start" align="middle">
              <Col span={15}>
                投顾业绩汇总
              </Col>
              <Col span={9} className={styles.textAlignRight}>
                <div className={styles.dateFilter}>{duration}</div>
                <RadioGroup
                  defaultValue="m"
                  onChange={this.handleDurationChange}
                >
                  <RadioButton value="m">本月</RadioButton>
                  <RadioButton value="q">本季</RadioButton>
                  <RadioButton value="y">本年</RadioButton>
                </RadioGroup>
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles.investBlock}>
          <div className={styles.investIndex}>
            {/* TODO 添加内容 */}
          </div>
        </div>
        <div className={styles.investBlock}>
          {/* TODO 后期迭代任务 */}
        </div>
      </div>
    );
  }
}

