// 定义点位显示位置对象
// 0 上 1 下 2 左 3 右
export const PositionRect = [
  function (width, height) {
    return {
      x: 0,
      y: -height,
      width,
      height
    }
  },
  function (width, height) {
    return {
      x: 0,
      y: '105%',
      width,
      height
    }
  },
  function (width, height) {
    return {
      x: -width,
      y: '25%',
      width,
      height
    }
  },
  function (width, height) {
    return {
      x: '100%',
      y: '25%',
      width,
      height
    }
  }
]

const Basic = [
  {
    id: 'basic',
    name: '基本形状',
    showType: 'icon',
    children: [
      {
        name: '圆角矩形',
        icon: 'icon-rectangle',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 50
          },
          name: 'rectangle'
        }
      },
      {
        name: '圆',
        icon: 'icon-circle',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          name: 'circle',
          textMaxLine: 1
        }
      },
      {
        name: '三角形',
        icon: 'icon-triangle',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          name: 'triangle'
        }
      },
      {
        name: '菱形',
        icon: 'icon-diamond',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          name: 'diamond'
        }
      },
      {
        name: '五边形',
        icon: 'icon-pentagon',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          name: 'pentagon'
        }
      },
      {
        name: '六边形',
        icon: 'icon-hexagon',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          paddingTop: 10,
          paddingBottom: 10,
          name: 'hexagon'
        }
      },
      {
        name: '五角星',
        icon: 'icon-pentagram',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          name: 'pentagram'
        }
      },
      {
        name: '左箭头',
        icon: 'icon-arrow-left',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 100
          },
          name: 'leftArrow'
        }
      },
      {
        name: '右箭头',
        icon: 'icon-arrow-right',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 100
          },
          name: 'rightArrow'
        }
      },
      {
        name: '双向箭头',
        icon: 'icon-twoway-arrow',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 100
          },
          name: 'twowayArrow'
        }
      },
      {
        name: '直线',
        icon: 'icon-line',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          name: 'line'
        }
      },
      {
        name: '云',
        icon: 'icon-cloud',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          name: 'cloud'
        }
      },
      {
        name: '消息框',
        icon: 'icon-msg',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          name: 'message'
        }
      },
      {
        name: '文档',
        icon: 'icon-file',
        data: {
          text: '',
          rect: {
            width: 80,
            height: 100
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          name: 'file'
        }
      },
      {
        name: '文本',
        icon: 'icon-text',
        data: {
          text: '自定义文本',
          rect: {
            width: 160,
            height: 30
          },
          name: 'text'
        }
      }
    ]
  },
  {
    id: 'other',
    name: '其他组件',
    showType: 'icon-charts',
    children: [
      {
        name: '折线图',
        icon: 'topo-icon-fsux_zhexiantu',
        id: 48,
        data: {
          text: '折线图',
          rect: {
            width: 300,
            height: 200
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                xAxis: {
                  type: 'category',
                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line'
                  }
                ]
              }
            }
          }
        }
      },
      {
        name: '柱状图',
        icon: 'topo-icon-fsux_tubiao_zhuzhuangtu',
        id: 49,
        data: {
          text: '柱状图',
          rect: {
            width: 300,
            height: 200
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                color: ['#3398DB'],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ],
                series: [
                  {
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '60%',
                    data: [10, 52, 200, 334, 390, 330, 220]
                  }
                ]
              }
            }
          }
        }
      },
      {
        name: '饼图',
        icon: 'topo-icon-fsux_tubiao_bingtu1',
        id: 50,
        data: {
          text: '饼图',
          rect: {
            width: 200,
            height: 200
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                  orient: 'vertical',
                  x: 'left',
                  data: [
                    '直接访问',
                    '邮件营销',
                    '联盟广告',
                    '视频广告',
                    '搜索引擎'
                  ]
                },
                series: [
                  {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                      normal: {
                        show: false,
                        position: 'center'
                      },
                      emphasis: {
                        show: true,
                        textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                        }
                      }
                    },
                    labelLine: {
                      normal: {
                        show: false
                      }
                    },
                    data: [
                      { value: 335, name: '直接访问' },
                      { value: 310, name: '邮件营销' },
                      { value: 234, name: '联盟广告' },
                      { value: 135, name: '视频广告' },
                      { value: 1548, name: '搜索引擎' }
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      {
        name: '仪表盘',
        icon: 'topo-icon-fsux_tubiao_yibiaopan',
        id: 51,
        data: {
          text: '仪表盘',
          rect: {
            width: 300,
            height: 300
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                tooltip: {
                  formatter: '{a} <br/>{b} : {c}%'
                },
                toolbox: {
                  feature: {
                    restore: {},
                    saveAsImage: {}
                  }
                },
                series: [
                  {
                    name: '业务指标',
                    type: 'gauge',
                    detail: { formatter: '{value}%' },
                    data: [{ value: 50, name: '完成率' }]
                  }
                ]
              }
            }
          }
        }
      }
    ]
  }
]

const Tools = (images) => {
  return [...Basic]
}
export default Tools
