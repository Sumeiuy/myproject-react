/**
 * @Descripter: 给客户打标签
 * @Author: K0170179
 * @Date: 2018/7/6
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Modal, Tag } from 'antd';

import CreateLabel from './CreateLabel';
import { MultiFilterWithSearch } from '../../../../../node_modules/lego-react-filter';
import Icon from '../../../common/Icon';
import styles from './addCustomerLabel.less';
import logable from '../../../../decorators/logable';

const EMPTY_LIST = [];

export function replaceKeyWord(text, word = '') {
  if (!word) {
    return text;
  }
  const keyWordRegex = new RegExp(_.escapeRegExp(word), 'g');
  const keyWordText = _.replace(text, keyWordRegex, match => (
    `<span class=${styles.keyWord}>${match}</span>`
  ));
  return <span dangerouslySetInnerHTML={{ __html: keyWordText }} />;
}

export default class SignCustomerLabel extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { preCustId } = state;
    const { custId, custLabel } = props;
    let nextState = {
      preCustId: custId,
    };
    if (custId !== preCustId) {
      const selectedLabels = custLabel[custId] || EMPTY_LIST;
      nextState = {
        ...nextState,
        selectedLabels,
        custId,
      };
    }
    return nextState;
  }

  static propTypes = {
    custId: PropTypes.string.isRequired,
    mainPosition: PropTypes.bool,
    custLabel: PropTypes.object.isRequired,
    currentPytMng: PropTypes.object.isRequired,
    custLikeLabel: PropTypes.array.isRequired,
    queryLikeLabelInfo: PropTypes.func.isRequired,
    signCustLabels: PropTypes.func.isRequired,
    handleCancelSignLabelCustId: PropTypes.func.isRequired,
    addLabel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    mainPosition: true,
  }

  constructor(props) {
    super(props);
    const { custId } = props;
    this.state = {
      selectedLabels: EMPTY_LIST,
      value: '',
      custId,
      preCustId: custId,
      createLabelVisible: false,
    };
  }

  @autobind
  getOptionItemValue({ value }) {
    const { value: searchValue } = this.state;
    return (
      <span className={styles.labelItemWrap}>
        {replaceKeyWord(value.labelName, searchValue)}
        ({value.labelTypeName})
      </span>);
  }

  @autobind
  handleSearch(value) {
    this.queryLabelInfo(value, () => {
      this.setState({ value });
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '多客户打标签',
      value: '$args[0].value',
    },
  })
  handleSelect({ value }) {
    const { custLikeLabel } = this.props;
    const { selectedLabels } = this.state;
    const finalDate = [...custLikeLabel, ...selectedLabels];
    const finalSelectedId = _.compact(value);
    const finalSelectedLabels = _.map(
      finalSelectedId,
      itemId => _.find(finalDate, { id: itemId }),
    );
    this.setState({
      selectedLabels: finalSelectedLabels,
    });
  }

  @autobind
  handleSubmitSignLabel() {
    const { signCustLabels, handleCancelSignLabelCustId, currentPytMng } = this.props;
    const { selectedLabels, custId } = this.state;
    const { ptyMngId } = currentPytMng;
    const labelIds = _.map(selectedLabels, item => item.id);
    signCustLabels({
      custId,
      labelIds,
      ptyMngId,
    }).then(handleCancelSignLabelCustId);
  }

  @autobind
  queryLabelInfo(labelName = '', callback = _.noop) {
    const { queryLikeLabelInfo } = this.props;
    // 获得焦点时获取全部数据
    queryLikeLabelInfo({
      labelNameLike: labelName,
      currentPage: 1,
      pageSize: 10,
    }).then(callback);
  }

  @autobind
  deleteUserLabel(id) {
    const { selectedLabels } = this.state;
    const fianlSelectedLabels = _.filter(
      selectedLabels,
      labelItem => labelItem.id !== id,
    );
    this.setState({
      selectedLabels: fianlSelectedLabels,
    });
  }

  @autobind
  getSearchFooter() {
    const { custLikeLabel } = this.props;
    const { value } = this.state;
    const currentLabel = _.find(
      custLikeLabel,
      labelItem =>
        labelItem.labelName === value,
    );
    if (currentLabel) {
      return null;
    }
    return (<div
      className={styles.newLabel}
      onClick={this.handleCloseAddLabelModal}
    >
      {`+ 新建"${value}"标签`}
    </div>);
  }

  @autobind
  handleCloseAddLabelModal() {
    this.setState({
      custId: '',
    });
  }

  @autobind
  handleOpenNewLabelModal() {
    const { custId } = this.props;
    if (custId) {
      this.setState({
        createLabelVisible: true,
      });
    }
  }

  @autobind
  handleCloseNewLabelModal() {
    const { custId } = this.props;
    this.queryLabelInfo('', () => {
      this.setState({
        createLabelVisible: false,
        custId,
      });
    });
  }

  render() {
    const { handleCancelSignLabelCustId, custLikeLabel, mainPosition, addLabel } = this.props;
    const { selectedLabels, custId, createLabelVisible, value } = this.state;
    return (
      <span>
        <Modal
          title="添加客户标签"
          width={650}
          visible={Boolean(custId)}
          wrapClassName={styles.signCustomerLabel}
          onCancel={handleCancelSignLabelCustId}
          destroyOnClose
          maskClosable={false}
          onOk={this.handleSubmitSignLabel}
          afterClose={this.handleOpenNewLabelModal}
        >
          <div className={styles.selectedInfo}>请为已选择客户选择一个标签：</div>
          <div className={styles.singleLabel}>
            {mainPosition ?
              selectedLabels
                .map(labelItem =>
                  <Tag
                    closable
                    onClose={() => {
                      this.deleteUserLabel(labelItem.id);
                    }}
                    color="gold"
                    key={labelItem.id}
                  >
                    {labelItem.labelName}
                  </Tag>,
                ) :
              selectedLabels
                .map(labelItem =>
                  <Tag color="gold" key={labelItem.id}>
                    {labelItem.labelName}
                  </Tag>,
                )
            }
            {
              mainPosition ?
                <span
                  className={styles.addLabel}
                >
                  <span className={styles.addLabelBtn}>请选择标签<Icon type="more-down-copy" /></span>
                  <MultiFilterWithSearch
                    data={custLikeLabel}
                    value={_.isEmpty(selectedLabels) ? '' : selectedLabels}
                    className={styles.signSelect}
                    dataMap={['id', 'labelName']}
                    filterName="客户标签"
                    useCustomerFilter
                    useDefaultLabel
                    isAlwaysVisible
                    getOptionItemValue={this.getOptionItemValue}
                    onChange={this.handleSelect}
                    onInputChange={this.handleSearch}
                    searchFooter={this.getSearchFooter()}
                  />
                </span> :
                null
            }
          </div>
        </Modal>
        <CreateLabel
          visible={createLabelVisible}
          labelName={value}
          addLabel={addLabel}
          closeModal={this.handleCloseNewLabelModal}
        />
      </span>
    );
  }
}
