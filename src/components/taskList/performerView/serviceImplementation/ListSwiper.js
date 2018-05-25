import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { autobind } from 'core-decorators';
import Swiper from 'react-id-swiper';
import 'react-id-swiper/src/styles/css/swiper.css';
import Icon from '../../../common/Icon';
import styles from './listSwiper.less';
import {
  MALE_CODE,
  FEMALE_CODE,
  PER_CODE,
  ORG_CODE,
  PROD_CODE,
  MALE_ICON,
  FEMALE_ICON,
  ORG_ICON,
  PROD_ICON,
} from './config';

export default class ListSwiper extends PureComponent {
  static propTypes = {
    targetCustList: PropTypes.object.isRequired,
    parameter: PropTypes.object.isRequired,
    onCustomerClick: PropTypes.func,
    containerClass: PropTypes.string,
    onPageChange: PropTypes.func,
  }

  static defaultProps = {
    onCustomerClick: _.noop,
    onPageChange: _.noop,
    containerClass: '',
  }

  @autobind
  goNext() {
    if (this.swiper) {
      const { targetCustList, onPageChange } = this.props;
      const { pageNum, pageSize, totalCount } = targetCustList.page;
      const currentPageNum = pageNum + 1;
      if (currentPageNum <= Math.ceil(totalCount / pageSize)) {
        onPageChange(currentPageNum);
      }
    }
  }

  @autobind
  goPrev() {
    if (this.swiper) {
      const { targetCustList, onPageChange } = this.props;
      const { pageNum } = targetCustList.page;
      const currentPageNum = pageNum - 1;
      if (currentPageNum >= 1) {
        onPageChange(currentPageNum);
      }
    }
  }

  // 渲染客户头像
  // 区分产品机构、一般机构、个人客户：男、女 ，四种头像
  @autobind
  renderAvator({ genderCode = '', custNature = '' }) {
    let type = '';
    if (custNature === PER_CODE) {
      if (genderCode === MALE_CODE) {
        type = MALE_ICON;
      } else if (genderCode === FEMALE_CODE) {
        type = FEMALE_ICON;
      } else {
        type = MALE_ICON;
      }
    } else if (custNature === ORG_CODE) {
      type = ORG_ICON;
    } else if (custNature === PROD_CODE) {
      type = PROD_ICON;
    }
    return (
      <div className={styles.avatarWrap}>
        <Icon type={type} />
      </div>
    );
  }

  @autobind
  renderListItem() {
    const { targetCustList, parameter, onCustomerClick } = this.props;
    const { page: { pageSize, pageNum }, list = [] } = targetCustList;
    const { activeIndex } = parameter;
    console.log('renderListItem: ', this.props);
    const currentIndex = (parseInt(activeIndex, 10) - 1) % pageSize;
    return (
      (list || []).map((item, index) => {
        // 上次选中的客户还在列表里的时候，继续高亮此客户，否则高亮此次列表中的第一条数据
        const cls = cx(
          styles.listItem,
          {
            [styles.active]: currentIndex === index,
          },
        );
        return (
          <div
            className={cls}
            key={item.missionFlowId}
            onClick={() => onCustomerClick({
              activeIndex: (pageSize * (pageNum - 1)) + index + 1,
              currentCustomer: item,
            })}
          >
            <div className={styles.contentBox}>
              {this.renderAvator({ genderCode: item.genderCode, custNature: item.custNature })}
              <p className={styles.name}>{_.truncate(item.custName, { length: 4, omission: '...' })}</p>
              <p className={styles.status}>-{item.missionStatusValue}-</p>
            </div>
          </div>
        );
      })
    );
  }

  @autobind
  saveSwiperRef(node) {
    if (node) { this.swiper = node.swiper; }
  }

  render() {
    const { targetCustList, containerClass, parameter } = this.props;
    const { page: { pageSize, pageNum, totalPage } } = targetCustList;
    const { activeIndex } = parameter;
    const params = {
      containerClass: styles.swiperContainer,
      slidesPerView: pageSize,
      slidesPerGroup: pageSize,
    };
    const containerCls = cx(
      styles.listSwiper,
      { [containerClass]: !!containerClass },
    );
    const prevButtonCls = cx(
      styles.prevButton,
      { [styles.disable]: pageNum === 1 },
    );
    const nextButtonCls = cx(
      styles.nextButton,
      { [styles.disable]: pageNum === totalPage },
    );
    return (
      <div className={containerCls}>
        <Swiper
          key={`${activeIndex}${pageSize}${pageNum}`}
          {...params}
          ref={this.saveSwiperRef}
        >
          {this.renderListItem()}
        </Swiper>
        <Icon type="zuo" className={prevButtonCls} onClick={this.goPrev} />
        <Icon type="you" className={nextButtonCls} onClick={this.goNext} />
      </div>
    );
  }
}
