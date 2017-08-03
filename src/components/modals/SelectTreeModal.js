
import React, { PropTypes, PureComponent } from 'react';
import { Modal, Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import BoardSelectTree from '../Edit/BoardSelectTree';
import styles from './modalCommon.less';

export default class SelectTreeModal extends PureComponent {
  static propTypes = {
    modalCaption: PropTypes.string.isRequired,
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    summuryLib: PropTypes.object.isRequired,
    saveIndcatorToHome: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: false,
  }

  constructor(props) {
    super(props);
    const { visible, summuryLib } = props;
    // console.warn('summuryIndicator', summuryIndicator);
    console.warn('constructor summuryLib', summuryLib);
    this.state = {
      modalVisible: visible,
      summuryLib,
      btnStatus: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.warn('进入 componentWillReceiveProps', nextProps.summuryLib);
    const { visible, summuryLib } = nextProps;
    const { visible: preVisible, summuryLib: preSummuryLib } = this.props;
    if (!_.isEqual(visible, preVisible)) {
      this.setState({
        modalVisible: visible,
      });
    }
    if (!_.isEqual(summuryLib, preSummuryLib)) {
      console.warn('summuryLib 不相等');
      this.setState({
        summuryLib,
        summuryKeys: summuryLib.checkedKeys,
      });
    }
  }

  @autobind
  closeSelectTreeModal() {
    const { modalKey, closeModal } = this.props;
    // TODO 清空已选择的指标
    closeModal(modalKey);
  }

  @autobind
  saveSelectTreeModal() {
    console.warn('点击了确认按钮');
    const { summuryIndicator } = this.state;
    const { saveIndcatorToHome } = this.props;
    saveIndcatorToHome(summuryIndicator);
    // todo 调用接口保存数据
    // 隐藏Modal
    this.closeSelectTreeModal();
  }
  @autobind
  saveIndcator(type, indicators) {
    if (type === 'summury') {
      const btnStatus = indicators.length < 4;
      // console.warn('save summuryKeys', summuryKeys);
      // if (_.isEqual(summuryKeys, indicators)) {
      //   btnStatus = true;
      // }
      this.setState({
        summuryIndicator: indicators,
        btnStatus,
      });
    } else {
      this.setState({
        detailIndicator: indicators,
      });
    }
  }

  render() {
    const { modalVisible, summuryLib, btnStatus } = this.state;
    const { modalCaption } = this.props;
    return (
      <Modal
        title={modalCaption}
        visible={modalVisible}
        closeable
        onCancel={this.closeSelectTreeModal}
        maskClosable={false}
        wrapClassName={styles.selectTreeModal}
        footer={[
          <Button key="back" size="large" onClick={this.closeSelectTreeModal}>取消</Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            disabled={btnStatus}
            onClick={this.saveSelectTreeModal}
          >
            确认
          </Button>,
        ]}
      >
        {
          modalVisible ?
            <BoardSelectTree
              data={summuryLib}
              lengthLimit
              saveIndcator={this.saveIndcator}
            />
          :
            ''
        }
      </Modal>
    );
  }
}
