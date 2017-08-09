/**
 * @file /history/IndicatorOverview.js
 *  历史指标-指标概览
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';

import Icon from '../common/Icon';
import ChartRadar from '../chartRealTime/ChartRadar';
import IndexItem from './IndexItem';
import styles from './indicatorOverview.less';
import { SelectTreeModal } from '../modals';

export default class IndicatorOverview extends PureComponent {
  static propTypes = {
    overviewData: PropTypes.array,
    indexData: PropTypes.object,
    summuryLib: PropTypes.object.isRequired,
    saveIndcatorToHome: PropTypes.func.isRequired,
    changeCore: PropTypes.func.isRequired,
    level: PropTypes.string.isRequired,
  }

  static defaultProps = {
    overviewData: [],
    indexData: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectTreeModal: false,
      selectIndex: 0, // 默认选中项
    };
  }

  componentWillReceiveProps(nextProps) {
    const { overviewData: preCore } = this.props;
    const { overviewData: nextCore } = nextProps;
    if (!_.isEqual(preCore, nextCore)) {
      this.setState({
        selectIndex: 0,
      });
    }
  }

  /**
   * 弹窗处理（关闭）
  */
  @autobind
  handleCancel() {
    this.setState({ selectTreeModal: false });
  }
  /**
   * 弹窗处理（开启）
  */
  @autobind
  showModal() {
    this.setState({ selectTreeModal: true });
  }

  // 选中Core指标
  @autobind
  handleCoreClick(index, key) {
    return () => {
      const { changeCore } = this.props;
      this.setState({
        selectIndex: index,
      });
      changeCore(key);
    };
  }

  @autobind
  closeModal(modal) {
    this.setState({
      [modal]: false,
    });
  }

  render() {
    const {
      overviewData,
      indexData,
      summuryLib,
      saveIndcatorToHome,
      level,
    } = this.props;
    if (_.isEmpty(overviewData)) {
      return null;
    }
    const { selectIndex, selectTreeModal } = this.state;
    // 创建共同配置项
    const selectTreeProps = {
      modalKey: 'selectTreeModal',
      modalCaption: '挑选指标（挑选您向要查看的指标名称，最少选择 4 项，最多选择 9 项）',
      closeModal: this.closeModal,
      summuryLib,
      visible: selectTreeModal,
      saveIndcatorToHome,
    };
    const radarHide = _.isEmpty(indexData) || level === '1';
    const overviewBoxSpan = radarHide ? '24' : '13';
    const ulClass = classnames({
      [styles.content]: !radarHide,
      [styles.contentNoRadar]: radarHide,
    });
    return (
      <div className={styles.overviewBox}>
        <Row gutter={10}>
          <Col span={overviewBoxSpan}>
            <div className={styles.overview}>
              <div className={styles.titleDv}>
                <Button
                  className={styles.btn_r}
                  onClick={this.showModal}
                >
                  <Icon type="jia" />
                  挑选指标
                </Button>
                指标概览
              </div>
              <div className={ulClass}>
                <ul>
                  {
                    overviewData.map((item, index) => {
                      const itemIndex = `select${index}`;
                      const active = selectIndex === index;
                      const key = item.key;
                      return (
                        <li
                          onClick={this.handleCoreClick(index, key)}
                          key={itemIndex}
                        >
                          <IndexItem
                            itemData={item}
                            active={active}
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
                {
                  overviewData.length ?
                    <p>
                      <span>{overviewData[selectIndex].name}：</span>
                      <span>{overviewData[selectIndex].description}</span>
                    </p>
                  :
                    null
                }
              </div>
            </div>
          </Col>
          {
            radarHide
            ? null
            : (
              <Col span="11">
                <ChartRadar
                  radarData={indexData.data}
                  total={indexData.scopeNum}
                  selectCore={selectIndex}
                  localScope={level}
                />
              </Col>
            )
          }
        </Row>
        <SelectTreeModal {...selectTreeProps} />
      </div>
    );
  }
}
