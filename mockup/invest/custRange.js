exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "label": '经济营业总部',
      "value": '经济营业总部',
      "children": [
        {
          "label": '分公司1',
          "value": '分公司1',
          "children": [
            {
              "label": '营业部1',
              "value": '营业部1',
            },
            {
              "label": '营业部2',
              "value": '营业部2',
            },
            {
              "label": '营业部3',
              "value": '营业部3',
            },
          ]
        },
        {
          "label": '分公司2',
          "value": '分公司2',
          "children": [
            {
              "label": '营业部4',
              "value": '营业部4',
              "children": [
                {
                  "label": '投顾1',
                  "value": '投顾1',
                },
                {
                  "label": '投顾2',
                  "value": '投顾2',
                },
                {
                  "label": '投顾3',
                  "value": '投顾3',
                },
                {
                  "label": '投顾4',
                  "value": '投顾4',
                },
              ],
            },
            {
              "label": '营业部5',
              "value": '营业部5',
            },
            {
              "label": '营业部6',
              "value": '营业部6',
            },
          ]
        },
        {
          "label": '分公司3',
          "value": '分公司3',
          "children": [
            {
              "label": '营业部7',
              "value": '营业部7',
            },
            {
              "label": '营业部8',
              "value": '营业部8',
            },
            {
              "label": '营业部9',
              "value": '营业部9',
            },
          ]
        },
      ],
    }
  };
}