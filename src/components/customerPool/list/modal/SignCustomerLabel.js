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
import { MultiFilterWithSearch } from 'lego-react-filter/src';

import CreateLabel from './CreateLabel';
import styles from './addCustomerLabel.less';
import logable, { logPV } from '../../../../decorators/logable';

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
    checkDuplicationName: PropTypes.func.isRequired,
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
      <span className={styles.signItemWrap}>
        <span>{replaceKeyWord(value.labelName, searchValue)}</span>
        <span className={styles.labelType} title={value.createdOrgName}>{value.createdOrgName}</span>
      </span>);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '添加标签', value: '$args[0]' } })
  handleSearch(value) {
    this.queryLabelInfo(value, () => {
      this.setState({ value });
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '单客户打标签',
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
  @logable({
    type: 'Submit',
    payload: {
      name: '客户标签-提交',
      value: '$state.selectedLabels',
    },
  })
  handleSubmitSignLabel() {
    const { signCustLabels, currentPytMng } = this.props;
    const { selectedLabels, custId } = this.state;
    const { ptyMngId } = currentPytMng;
    const labelIds = _.map(selectedLabels, item => item.id);
    signCustLabels({
      custId,
      labelIds,
      ptyMngId,
    }).then(this.handleCloseModal);
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
  @logable({ type: 'Click', payload: { name: '删除标签', value: '$args[0]' } })
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
  getSearchHeader() {
    const { custLikeLabel } = this.props;
    const { value } = this.state;
    const currentLabel = _.find(
      custLikeLabel,
      labelItem => labelItem.labelName === value,
    );
    if (currentLabel) {
      return null;
    }
    const labelText = value ? `"${value}"` : '';
    return (
      <div
        className={styles.newLabel}
        onClick={this.handleCloseAddLabelModal}
      >
        {`+ 新建${labelText}标签`}
      </div>
    );
  }

  @autobind
  @logPV({ pathname: '/modal/closeAddLabelModal', title: '关闭客户标签打开新建标签弹窗' })
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
  handleCloseNewLabelModal(labelId) {
    const { custId } = this.props;
    const { selectedLabels } = this.state;
    this.queryLabelInfo('', () => {
      const labelIds = _.map(selectedLabels, labelItem => labelItem.id);
      const value = [...labelIds, labelId];
      this.handleSelect({ value });
      this.setState({
        createLabelVisible: false,
        value: '',
        custId,
      });
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '关闭客户标签' } })
  handleCloseModal() {
    this.props.handleCancelSignLabelCustId();
  }

  render() {
    const {
      custLikeLabel,
      mainPosition,
      addLabel,
      checkDuplicationName,
    } = this.props;

    const {
      selectedLabels,
      custId,
      createLabelVisible,
      value,
    } = this.state;
    return (
      <span>
        <Modal
          title="客户标签"
          width={650}
          visible={Boolean(custId)}
          wrapClassName={styles.signCustomerLabel}
          onCancel={this.handleCloseModal}
          destroyOnClose
          maskClosable={false}
          onOk={this.handleSubmitSignLabel}
          afterClose={this.handleOpenNewLabelModal}
        >
          <div className={styles.selectedInfo}>
            {
              mainPosition
                ? '请为已选客户选择或添加多个标签：'
                : null
            }
            {
              !mainPosition && !selectedLabels.length
                ? '服务经理还没有给这个客户设置标签'
                : null
            }
          </div>
          {
              mainPosition
                ? (
                  <div className={styles.addLabelContainer}>
                    <span className={styles.addLabel}>
                      <span className={styles.addLabelBtn}>
                        <span className={styles.addLabelIcon} />
                        <span className={styles.addLabelText}>添加标签</span>
                      </span>
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
                        searchHeader={this.getSearchHeader()}
                        listStyle={{ maxHeight: 220 }}
                        dropdownStyle={{ maxHeight: 324 }}
                      />
                    </span>
                  </div>
                ) : null
            }
          <div className={styles.singleLabel}>
            {mainPosition
              ? selectedLabels
                .map(labelItem => (
                  <Tag
                    closable
                    afterClose={() => {
                      this.deleteUserLabel(labelItem.id);
                    }}
                    color="gold"
                    key={labelItem.id}
                  >
                    {labelItem.labelName}
                  </Tag>
                ), )
              : selectedLabels
                .map(labelItem => (
                  <Tag color="gold" key={labelItem.id}>
                    {labelItem.labelName}
                  </Tag>
                ), )
            }
          </div>
        </Modal>
        <CreateLabel
          visible={createLabelVisible}
          labelName={value}
          addLabel={addLabel}
          closeModal={this.handleCloseNewLabelModal}
          checkDuplicationName={checkDuplicationName}
        />
      </span>
    );
  }
}
