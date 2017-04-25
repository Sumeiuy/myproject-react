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
              "value": '营业部4',
            },
          ]
        },
        {
          "label": '分公司2',
          "value": '分公司2',
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
              "value": '营业部4',
            },
          ]
        },
        {
          "label": '分公司3',
          "value": '分公司3',
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
              "value": '营业部4',
            },
          ]
        },
      ],
    }
  };
}