<template>
  <div class="canvas-props-box">
    <div class="canvas-props">
      <div class="nav nav-tab">
        <div :class="['item',tabName === 'face' ?  'item-active' : '']" @click="changeTab('face')">外观</div>
        <div v-if="!props.multi && props.node && props.node.data" :class="['item',tabName === 'custom' ?  'item-active' : '']" @click="changeTab('custom')">自定义信息</div>
      </div>
      <!-- 选中节点 -->
      <div v-show="tabName === 'face'">
        <template v-if="!props.multi">
          <div class="title">位置和大小</div>
          <div class="items">
            <div class="flex grid">
              <div>X（px）</div>
              <div class="ml5">Y（px）</div>
            </div>
            <div class="flex grid mt5">
              <div>
                <el-input-number size="small" v-model="props.node.rect.x" controls-position="right" @change="onChange">
                </el-input-number>
              </div>
              <div class="ml5">
                <el-input-number size="small" v-model="props.node.rect.y" controls-position="right" @change="onChange">
                </el-input-number>
              </div>
            </div>
          </div>
          <div class="items">
            <div class="flex grid">
              <div>宽（px）</div>
              <div class="ml5">高（px）</div>
            </div>
            <div class="flex grid">
              <div>
                <el-input-number size="small" v-model="props.node.rect.width" controls-position="right"
                                 @change="onChange"></el-input-number>
              </div>
              <div class="ml5">
                <el-input-number size="small" v-model="props.node.rect.height" controls-position="right"
                                 @change="onChange"></el-input-number>
              </div>
            </div>
          </div>
          <div class="items">
            <div class="flex grid">
              <div title="百分比%对应的小数值">圆角（0 - 1）</div>
              <div class="ml5">旋转（°）</div>
            </div>
            <div class="flex grid">
              <div>
                <el-input-number size="small" v-model="props.node.borderRadius" controls-position="right"
                                 @change="onChange" :min="0" :max="1" :step="0.1"></el-input-number>
              </div>
              <div class="ml5">
                <el-input-number size="small" v-model="props.node.rotate" controls-position="right" @change="onChange">
                </el-input-number>
              </div>
            </div>
          </div>
          <div class="items">
            <div class="flex grid">
              <div title="padding-left">内边距-左</div>
              <div title="padding-right" class="ml5">内边距-右</div>
            </div>
            <div class="flex grid">
              <div>
                <el-input size="small" v-model="props.node.paddingLeft" controls-position="right" @change="onChange">
                </el-input>
              </div>
              <div class="ml5">
                <el-input size="small" v-model="props.node.paddingRight" controls-position="right" @change="onChange">
                </el-input>
              </div>
            </div>
          </div>
          <div class="items">
            <div class="flex grid">
              <div title="padding-top">内边距-上</div>
              <div title="padding-bottom" class="ml5">内边距-下</div>
            </div>
            <div class="flex grid">
              <div>
                <el-input size="small" v-model="props.node.paddingTop" controls-position="right" @change="onChange">
                </el-input>
              </div>
              <div class="ml5">
                <el-input size="small" v-model="props.node.paddingBottom" controls-position="right" @change="onChange">
                </el-input>
              </div>
            </div>
          </div>
          <div class="items gray" style="line-height: 1.5">
            内边距：输入数字表示像素；输入%表示百分比
          </div>
          <div class="title">文字</div>
          <div class="items">
            <div class="flex grid">
              <div>字体</div>
              <div class="ml5">大小</div>
            </div>
            <div class="flex grid mt5">
              <div>
                <el-input size="small" v-model="props.node.font.fontFamily" controls-position="right" @change="onChange">
                </el-input>
              </div>
              <div class="ml5">
                <el-input size="small" v-model="props.node.font.fontSize" controls-position="right" @change="onChange">
                </el-input>
              </div>
            </div>
          </div>
          <div class="items">
            <div class="flex grid">
              <div>颜色</div>
              <div class="ml5">背景</div>
            </div>
            <div class="flex grid mt5">
              <el-color-picker size="small" v-model="props.node.font.color" @change="onChange"></el-color-picker>
              <el-color-picker size="small" v-model="props.node.font.background" @change="onChange"></el-color-picker>

            </div>
          </div>
          <div class="items">
            <div class="flex grid">
              <div>水平对齐</div>
              <div class="ml5">垂直对齐</div>
            </div>
            <div class="flex grid mt5">
              <div>
                <el-select v-model="props.node.font.textAlign" size="small" @change="onChange">
                  <el-option value="left" label="左对齐"></el-option>
                  <el-option value="center" label="居中"></el-option>
                  <el-option value="right" label="右对齐"></el-option>
                </el-select>
              </div>
              <div class="ml5">
                <el-select v-model="props.node.font.textBaseline" size="small" @change="onChange">
                  <el-option value="top" label="顶部对齐"></el-option>
                  <el-option value="middle" label="居中"></el-option>
                  <el-option value="bottom" label="底部对齐"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="title">样式</div>
          <div class="items">
            <div class="flex grid">
              <div class="ml5">背景色</div>
            </div>
            <div class="flex grid mt5">
              <el-color-picker size="small" v-model="props.node.fillStyle" @change="onChange"></el-color-picker>
              <div></div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="title">对齐</div>
          <div class="items flex grid">
            <i class="topology icon-align-left" title="左对齐" @click="handleNodesAlign('left')"></i>
            <i class="topology icon-align-right" title="右对齐" @click="handleNodesAlign('right')"></i>
            <i class="topology icon-align-top" title="顶部对齐" @click="handleNodesAlign('top')"></i>
            <i class="topology icon-align-bottom" title="底部对齐" @click="handleNodesAlign('bottom')"></i>
            <i class="topology icon-align-center" title="垂直居中" @click="handleNodesAlign('center')"></i>
            <i class="topology icon-align-middle" title="水平居中" @click="handleNodesAlign('middle')"></i>
          </div>
          <div class="title">排版</div>
          <div class="items flex grid lh30">
            <span>最大宽度：</span>
            <el-input size="small" v-model="layout.maxW" controls-position="right"></el-input>
          </div>
          <div class="items flex grid lh30">
            <span>水平个数：</span>
            <el-input size="small" v-model="layout.num" controls-position="right"></el-input>
          </div>
          <div class="items flex grid lh30">
            <span>水平间距：</span>
            <el-input size="small" v-model="layout.hs" controls-position="right"></el-input>
          </div>
          <div class="items flex grid lh30">
            <span>垂直间距：</span>
            <el-input size="small" v-model="layout.vs" controls-position="right"></el-input>
          </div>
          <div class="items flex grid lh30" style="justify-content:flex-end">
            <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="handleNodesLayout">提交
            </el-button>
          </div>
        </template>
      </div>
      <div v-if="!props.multi && props.node && props.node.data" v-show="tabName === 'custom'">
        <template v-if="props.node.data">
          <div class="items flex grid lh30">
            <span>代码：</span>
            <el-input type="textarea" v-model="echartsProps" @blur="chartsProps(props.node.id)"></el-input>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// utils
import { getRect, Node } from '@topology/core'
import { alignNodes, spaceBetween, layout } from '@topology/layout'
import { PositionRect } from '../../utils/tools'
import { echartsObjs } from '@topology/chart-diagram'

export default {
  props: {
    canvas: {
      type: Object,
      require: true
    },
    props: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      nodeId: null,
      nodeIsJson: false,
      nodeData: '',
      // 自定义
      tabName: 'face',
      // 车间列表
      deptList: [],
      // 当前选中车间
      currentDept: '',
      // 产线列表
      lineList: [],
      // 当前选中产线
      currentLine: '',
      // 设备列表
      deviceList: [],
      // 当前选中设备
      currentDeviceSn: '',
      currentDevice: {},
      // 点位列表
      pointList: [],
      // 当前勾选点位列表
      selectedPoints: [],
      // 物理模型列表
      productList: [],
      // 显示位置
      showPosition: 0,
      layout: {
        maxW: 1000,
        num: 0,
        hs: 20,
        vs: 20
      },
      echartsProps: JSON.stringify(this.props.node.data.echarts.option)
    }
  },
  created () {
    console.log('创建')
    this.initBaseData()
  },
  mounted () {
    this.onInit()
  },
  updated () {
    if (!this.props.node || this.nodeId === this.props.node.id) {
      return
    }
    this.props.expand = false
    this.nodeId = this.props.node.id
    let originData = this.props.node.data
    this.nodeIsJson = this.isJson(originData)
    this.nodeData = this.nodeIsJson ? JSON.stringify(originData, null, 4) : this.nodeData = originData
  },
  methods: {
    onInit () {
      const rect = getRect(this.canvas.activeLayer.pens)
      this.layout.maxW = rect.width
      var deviceInfo = this.props.node.data
      if (!deviceInfo.device || !deviceInfo.device.id) {
        return
      }

      this.currentDevice = JSON.parse(JSON.stringify(deviceInfo.device))
      this.selectedPoints = deviceInfo.showMap
      this.currentDeviceSn = deviceInfo.device.serialNo
      this.showPosition = deviceInfo.showPosition
      // 根据设备ID获取设备信息
    },
    // 初始化基础数据
    initBaseData: function () {
    },
    /**
     *
     *  @对齐布局事件
     * */
    handleNodesAlign (align) {
      alignNodes(this.canvas.activeLayer.pens, this.canvas.activeLayer.rect, align)
      this.canvas.updateProps()
    },
    handleNodesSpaceBetween () {
      spaceBetween(this.canvas.activeLayer.pens, this.canvas.activeLayer.rect.width)
      this.canvas.updateProps()
    },
    handleNodesLayout () {
      layout(this.canvas.data.pens, {
        maxWidth: this.layout.maxW,
        nodeWidth: 60,
        nodeHeight: 80,
        maxCount: this.layout.num,
        spaceWidth: this.layout.hs,
        spaceHeight: this.layout.vs
      })
      this.canvas.render()
    },
    onShowPointDetail (id) {
      /**
       * onUpdateProps 是异步操作
       *  1. 找到当前编辑节点
       *  2. 清空当前节点的显示文本子节点
       *  3. 判断新增的展示数据长度 为 0 直接跳过
       *     不为 0 设置str 文本显示，去除最后一行的换行
       *           new 新的子节点 设置一些禁止属性 以及相对父节点的位置属性
       *           当前节点设置子节点
       *
       * */
      this.canvas.data.pens.forEach(pen => {
        if (pen.id === id) {
          // 设备绑定设备名称
          pen.text = this.currentDevice.name
          // 清空显示
          pen.children = null
          let len = pen.data.showMap.length
          let str = ''
          let width = Math.max(...pen.data.showMap.map(item => item.displayName.length * 16 + 24))
          // width = width ? width : 50
          let height = len * 20
          if (len) {
            /** 设置子节点 添加文本 */
            pen.data.showMap.forEach((item, index) => {
              if (index < len - 1) {
                str += (item.displayName + '：' + '\n')
              } else {
                str += (item.displayName + '：')
              }
            })

            let child = new Node({
              text: str,
              rect: {
                width: 200,
                height: 50
              },
              name: 'text',
              data: null
            })
            child.hideInput = true
            child.hideRotateCP = true
            child.hideSizeCP = true
            child.hideAnchor = true
            child.font.textAlign = 'left'
            child.paddingLeft = 5
            // 设置子节点相对父节点属性
            child.rectInParent = PositionRect[pen.data.showPosition](width, height)
            pen.setChild([child])
            this.props.node = pen
          }
        }
      })
      this.canvas.render()
    },
    // tab
    changeTab (name) {
      this.tabName = name
    },
    onChange (value) {
      if (this.props.node) {
        this.props.node.data = this.nodeIsJson ? JSON.parse(this.nodeData) : this.nodeData
      }
      this.$emit('change', this.props.node)
    },
    isJson (obj) {
      return typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
    },
    chartsProps (id) {
      this.props.node.data.echarts.option = JSON.parse(this.echartsProps)
      echartsObjs[id].chart.setOption(JSON.parse(this.echartsProps), true)
    }
  }
}
</script>

<style lang="scss" scoped>
  .canvas-props-box {
    height: calc(100vh - 41px);
    overflow: auto;
  }
  .canvas-props {
    font-size: 12px;
    flex-shrink: 0;
    width: 240px;
    padding: 0;
    background-color: #f8f8f8;
    border-left: 1px solid #d9d9d9;
    overflow: auto;
    position: relative;

    .nav-tab {
      display: flex;
      border-bottom: 1px solid #d9d9d9;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;

      .item {
        font-size: 14px;
        line-height: 32px;
        margin: 0 10px;
        cursor: pointer;
      }

      .item-active {
        color: #262626;
        border-bottom: 2px solid #1890ff;
      }
    }

    .ml5 {
      margin-left: 5px;
    }

    .lh30 {
      line-height: 32px;
    }

    /deep/ .el-color-picker__trigger {
      width: 100%;
    }

    .topology {
      margin-right: 15px;
      font-size: 18px;
      cursor: pointer;
    }
  }

  .star {
    display: block;
    color: #f60 !important;
    text-decoration: underline;
    margin-bottom: 10px;
  }

  .title {
    font-size: 12px;
    color: #0d1a26;
    font-weight: 600;
    padding: 5px 15px;
    border-bottom: 1px solid #ccc;
  }

  .group {
    margin: 10px 0 20px 30px;
    padding: 0;

    a,
    li {
      line-height: 2;
    }

    li {
      list-style: initial;
    }
  }

  .bottom {
    position: absolute;
    bottom: 10px;
  }

  .items {
    padding: 5px 15px;

    .el-input-number {
      width: 102px;
      line-height: 32px;

      .el-input__inner {
        padding-left: 0;
        padding-right: 40px;
        height: 34px;
        line-height: 34px;
      }

      .el-input-number__increase {
        line-height: 16px;
      }
    }
    .custom-data i {
      cursor: pointer;
      float: right;
      color: #409eff;
      height: 2em;
      line-height: 2em;
    }

    .expand-data {
      position: absolute;
      right: 15px;
      width: 500px;
    }
  }

  .formItem {
    margin-bottom: 10px;
  }

</style>
