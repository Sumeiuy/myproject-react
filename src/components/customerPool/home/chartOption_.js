/**
 * @file components/customerPool/home/RectFrame.js
 * 用堆叠柱状图，1.实现单色柱多彩图效果 2.单个多色柱单色图
 * @author zhangjunli
 */
import _ from 'lodash';

const getColourfulItem = ({
  width,
  colourfulIndex,
  colourfulData,
  colourfulTotal,
}) => {
  if (_.isEmpty(colourfulData)) {
    return {};
  }
  const maxIndex = colourfulData.length - 1;
  return colourfulData.map(
    (item, index) => {
      const itemData = [];
      for (let i = 0; i <= colourfulIndex; i++) {
        if (i === colourfulIndex) {
          itemData.push(item.value);
        }
        itemData.push(0);
      }
      const itemConfig = {
        stack: '总量',
        type: 'bar',
        barWidth: width,
        data: itemData,
        itemStyle: {
          normal: { color: item.color },
        },
      };

      if (index !== maxIndex) {
        return itemConfig;
      }
      // 柱的最上面，需要显示label
      return {
        ...itemConfig,
        label: {
          normal: {
            show: true,
            position: 'top',
            fontFamily: 'PingFangSC-Regular',
            fontSize: 12,
            color: '#4a4a4a',
            formatter: (params) => {
              if (params.value !== 0) {
                return `${colourfulTotal}`;
              }
              return '';
            },
          },
        },
      };
    },
  );
};

const getItem = ({
  item,
  index,
  length,
  width,
}) => {
  const itemData = [];
  for (let i = 0; i < length; i++) {
    if (i === index) {
      itemData.push(item.value);
    }
    itemData.push(0);
  }
  return {
    stack: '总量',
    type: 'bar',
    barWidth: width,
    data: itemData,
    itemStyle: {
      normal: { color: item.color },
    },
  };
};

const getBgItem = ({
  data,
  maxValue,
  width,
  bgColor,
}) => {
  const newData = data.map(
    item => (maxValue - item.value),
  );
  return {
    stack: '总量',
    type: 'bar',
    barWidth: width,
    data: newData,
    silent: true,
    itemStyle: {
      normal: { color: bgColor },
    },
    label: {
      normal: {
        show: true,
        position: 'top',
        fontFamily: 'PingFangSC-Regular',
        fontSize: 12,
        color: '#4a4a4a',
        formatter: (params) => {
          if (params.value !== 0) {
            return `${(maxValue - params.value).toFixed(2)}%`;
          }
          return '';
        },
      },
    },
  };
};

// 单色柱多色图
export default ({
  data,
  width,
  bgColor,
  maxValue,
}) => {
  const length = data.length;
  const items = [];
  data.forEach(
    (item, index) => {
      const param = { item, width, length, index };
      items.push(getItem(param));
    },
  );
  if (!_.isEmpty(bgColor)) {
    const bgParam = { data, width, bgColor, maxValue };
    items.push(getBgItem(bgParam));
  }
  return items;
};

// 单个多色柱单色图
export const singleColorBar = ({
  data,
  basicColor,
  width,
  colourfulIndex,
  colourfulData,
  colourfulTotal,
}) => {
  const newColourfulData = getColourfulItem({
    width,
    colourfulIndex,
    colourfulData,
    colourfulTotal,
  });
  return [
    {
      stack: '总量',
      type: 'bar',
      barWidth: width,
      data,
      itemStyle: {
        normal: { color: basicColor },
      },
      label: {
        normal: {
          show: true,
          position: 'top',
          fontFamily: 'PingFangSC-Regular',
          fontSize: 12,
          color: '#2782d7',
          formatter: (params) => {
            if (_.isEmpty(colourfulData)) {
              return `${params.value}`;
            } else if (params.value !== 0 && params.dataIndex !== colourfulIndex) {
              return `${params.value}`;
            }
            return '';
          },
        },
      },
    },
    ...newColourfulData,
  ];
};

export const tooltipConfig = {
  tooltip: {
    trigger: 'item',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow',       // 默认为直线，可选为：'line' | 'shadow'
    },
    formatter: (params) => {
      let tooltipString = '';
      if (!_.isEmpty(params)) {
        if (_.isArray(params)) {
          const maxIndex = params.length - 1;
          params.forEach(
            (item) => {
              if (item.value !== 0 && item.seriesIndex !== maxIndex) {
                const newAxisValue = item.axisValue.replace('\n', '');
                if (!_.isEmpty(tooltipString)) {
                  tooltipString = tooltipString.concat(
                    tooltipString,
                    '\n', `${newAxisValue}: ${item.value}%`,
                  );
                }
                tooltipString = `${newAxisValue}: ${item.value}%`;
              }
            },
          );
        } else {
          tooltipString = `${params.name.replace('\n', '')}: ${params.value}%`;
        }
      }
      return tooltipString;
    },
  },
};
