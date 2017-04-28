exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "label": '经济营业总部',
      "value": '01',
      "children": [
        {
          "label": '分公司1',
          "value": '0101',
          "children": [
            {
              "label": '营业部1',
              "value": '010101',
            },
            {
              "label": '营业部2',
              "value": '010102',
            },
            {
              "label": '营业部3',
              "value": '010103',
            },
          ]
        },
        {
          "label": '分公司2',
          "value": '0102',
          "children": [
            {
              "label": '营业部3',
              "value": '010201',
            },
            {
              "label": '营业部4',
              "value": '010202',
              "children": [
                {
                  "label": '投顾1',
                  "value": '01020201',
                },
                {
                  "label": '投顾2',
                  "value": '01020202',
                },
                {
                  "label": '投顾3',
                  "value": '01020203',
                },
              ],
            },
            {
              "label": '营业部5',
              "value": '010203',
            },
          ]
        },
        {
          "label": '分公司3',
          "value": '0103',
          "children": [
            {
              "label": '营业部6',
              "value": '010301',
            },
            {
              "label": '营业部7',
              "value": '010302',
            },
            {
              "label": '营业部8',
              "value": '010303',
            },
          ]
        },
      ],
    }
  };
}