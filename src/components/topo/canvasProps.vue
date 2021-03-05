<template>
  <div class="canvas-props-box">
    <div class="canvas-props">
      <el-tabs type="border-card" v-model="tabName">
        <el-tab-pane label="外观" name="face">
          <div class="canvas-props-list">
            <template v-if="props.node">
              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="canvas-props-title">位置和大小</div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">X（px）</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">Y（px）</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.node.rect.x" controls-position="right" @change="onChange"></el-input-number>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.node.rect.y" controls-position="right" @change="onChange"></el-input-number>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">宽（px）</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">高（px）</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.node.rect.width" controls-position="right" :min="10" @change="onChange"></el-input-number>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.node.rect.height" controls-position="right" :min="10" @change="onChange"></el-input-number>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label" title="百分比%对应的小数值">圆角（0 - 1）</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">旋转（°）</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.node.borderRadius" controls-position="right" @change="onChange" :min="0" :max="1" :step="0.1"></el-input-number>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.node.rotate" controls-position="right" @change="onChange"></el-input-number>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">内边距-左</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">内边距-右</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input :size="size" v-model="props.node.paddingLeft" controls-position="right" @change="onChange"></el-input>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input :size="size" v-model="props.node.paddingRight" controls-position="right" @change="onChange"></el-input>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">内边距-上</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">内边距-下</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input :size="size" v-model="props.node.paddingTop" controls-position="right" @change="onChange"></el-input>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input :size="size" v-model="props.node.paddingBottom" controls-position="right" @change="onChange"></el-input>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="canvas-props-tips">内边距：输入数字表示像素；输入%表示百分比</div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="canvas-props-title">样式</div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">线条样式</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">背景颜色</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-select v-model="props.node.dash" :size="size" @change="onChange">
                      <el-option :value="0" label="实线"></el-option>
                      <el-option :value="1" label="虚线"></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-color-picker :size="size" v-model="props.node.fillStyle" @change="onChange" show-alpha></el-color-picker>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">线条宽度</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">线条颜色</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.node.lineWidth" controls-position="right" @change="onChange" :min="1" :step="1"></el-input-number>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-color-picker :size="size" v-model="props.node.strokeStyle" @change="onChange" show-alpha></el-color-picker>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="canvas-props-title">文字</div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">字体</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">大小</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input :size="size" v-model="props.node.font.fontFamily" controls-position="right" @change="onChange"></el-input>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.node.font.fontSize" controls-position="right" @change="onChange" :min="8"></el-input-number>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">颜色</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">背景</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-color-picker :size="size" v-model="props.node.font.color" @change="onChange" show-alpha></el-color-picker>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-color-picker :size="size" v-model="props.node.font.background" @change="onChange" show-alpha></el-color-picker>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">水平对齐</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">垂直对齐</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-select v-model="props.node.font.textAlign" :size="size" @change="onChange">
                      <el-option value="left" label="左对齐"></el-option>
                      <el-option value="center" label="居中"></el-option>
                      <el-option value="right" label="右对齐"></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-select v-model="props.node.font.textBaseline" :size="size" @change="onChange">
                      <el-option value="top" label="顶部对齐"></el-option>
                      <el-option value="middle" label="居中"></el-option>
                      <el-option value="bottom" label="底部对齐"></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10" v-if="!props.node.hideInput">
                <el-col :span="24">
                  <div class="canvas-props-label">内容</div>
                </el-col>
                <el-col :span="24">
                  <div class="canvas-props-content">
                    <el-input type="textarea" v-model="props.node.text" @blur="onChange" :autosize="{ minRows: 3}"></el-input>
                  </div>
                </el-col>
              </el-row>

            </template>
            <template v-else-if="props.line">
              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="canvas-props-title">样式</div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">线条样式</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">连线类型</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-select v-model="props.line.dash" :size="size" @change="onChange">
                      <el-option :value="0" label="实线"></el-option>
                      <el-option :value="1" label="虚线"></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-select v-model="props.line.name" :size="size" @change="onChangeName" ref="name" class="line-select" placeholder="">
                      <el-option v-for="(item, index) in lineNames" :key="index" :value="item.value" :label="item.value">
                        <i :class="`topology font28 icon-${item.value}`"></i>
                      </el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">线条宽度</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">线条颜色</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.line.lineWidth" controls-position="right" @change="onChange" :min="1" :step="1"></el-input-number>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-color-picker :size="size" v-model="props.line.strokeStyle" @change="onChange" show-alpha></el-color-picker>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">起点箭头</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">终点箭头</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-select v-model="props.line.fromArrow" :size="size" @change="onChangeFromArrow" ref="fromArrow" class="line-select" placeholder="">
                      <el-option v-for="(item, index) in arrowTypes" :key="index" :value="item.value" :label="item.value">
                        <i :class="`topology font28 icon-from-${item.value}`"></i>
                      </el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-select v-model="props.line.toArrow" :size="size" @change="onChangeToArrow" ref="toArrow" class="line-select" placeholder="">
                      <el-option v-for="(item, index) in arrowTypes" :key="index" :value="item.value" :label="item.value">
                        <i :class="`topology font28 icon-to-${item.value}`"></i>
                      </el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">起点箭头颜色</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">终点箭头颜色</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-color-picker :size="size" v-model="props.line.fromArrowColor" @change="onChange" show-alpha></el-color-picker>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-color-picker :size="size" v-model="props.line.toArrowColor" @change="onChange" show-alpha></el-color-picker>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">起点箭头大小</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">终点箭头大小</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.line.fromArrowSize" controls-position="right" @change="onChange" :min="1"></el-input-number>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.line.toArrowSize" controls-position="right" @change="onChange" :min="1"></el-input-number>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="canvas-props-title">文字</div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">字体</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">大小</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input :size="size" v-model="props.line.font.fontFamily" controls-position="right" @change="onChange"></el-input>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-input-number :size="size" v-model="props.line.font.fontSize" controls-position="right" @change="onChange" :min="8"></el-input-number>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">颜色</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">背景</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-color-picker :size="size" v-model="props.line.font.color" @change="onChange" show-alpha></el-color-picker>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">
                    <el-color-picker :size="size" v-model="props.line.font.background" @change="onChange" show-alpha></el-color-picker>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="canvas-props-label">内容</div>
                </el-col>
                <el-col :span="24">
                  <div class="canvas-props-content">
                    <el-input type="textarea" v-model="props.line.text" @blur="onChange" :autosize="{ minRows: 3}"></el-input>
                  </div>
                </el-col>
              </el-row>
            </template>
            <template v-else>
              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="canvas-props-title">对齐</div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="4">
                  <div class="canvas-props-label align-btn">
                    <el-button :size="size" icon="topology icon-align-left" title="左对齐" @click="handleNodesAlign('left')"></el-button>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="canvas-props-label align-btn">
                    <el-button :size="size" icon="topology icon-align-right" title="右对齐" @click="handleNodesAlign('right')"></el-button>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="canvas-props-label align-btn">
                    <el-button :size="size" icon="topology icon-align-top" title="顶部对齐" @click="handleNodesAlign('top')"></el-button>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="canvas-props-label align-btn">
                    <el-button :size="size" icon="topology icon-align-bottom" title="底部对齐" @click="handleNodesAlign('bottom')"></el-button>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="canvas-props-label align-btn">
                    <el-button :size="size" icon="topology icon-align-center" title="垂直居中" @click="handleNodesAlign('center')"></el-button>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="canvas-props-label align-btn">
                    <el-button :size="size" icon="topology icon-align-middle" title="水平居中" @click="handleNodesAlign('middle')"></el-button>
                  </div>
                </el-col>
              </el-row>

            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自定义信息" name="custom" v-if="!props.multi && props.node && props.node.data && props.node.data.echarts">
          <div class="canvas-props-list">
            <template>
              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="canvas-props-label">代码</div>
                </el-col>
                <el-col :span="24">
                  <div class="canvas-props-content">
                    <el-input type="textarea" v-model="echartsProps" @blur="chartsProps(props.node.id)" :autosize="{ minRows: 10}"></el-input>
                  </div>
                </el-col>
              </el-row>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据" name="data" v-if="!props.multi && props.node">
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="canvas-props-label">设备</div>
            </el-col>
            <el-col :span="12">
              <div class="canvas-props-label">信息位置</div>
            </el-col>
            <el-col :span="12">
              <div class="canvas-props-content">
                <el-select v-model="currentDeviceId" :size="size" @change="changeDevice">
                  <el-option v-for="(item, index) in deviceList" :key="index" :value="item.id" :label="item.name"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="canvas-props-content">
                <el-select v-model="showPosition" :size="size" @change="onChangePosition">
                  <el-option :value="0" label="上"></el-option>
                  <el-option :value="1" label="下"></el-option>
                  <el-option :value="2" label="左"></el-option>
                  <el-option :value="3" label="右"></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { echartsObjs } from '@topology/chart-diagram'
import { alignNodes } from '@topology/layout'
import { Node } from '@topology/core' // todo：getRect
import { PositionRect } from '../../utils/tools'
import deviceService from '@/api/device/deviceService.js'

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
      tabName: 'face',
      size: 'mini',
      // 线集合
      lineNames: Object.freeze([{
        name: '曲线',
        value: 'curve'
      }, {
        name: '直线',
        value: 'line'
      }, {
        name: '线段',
        value: 'polyline'
      }
      ]),
      // 箭头集合
      arrowTypes: Object.freeze([{
        name: '',
        value: ''
      }, {
        name: '',
        value: 'triangleSolid'
      }, {
        name: '',
        value: 'diamondSolid'
      }, {
        name: '',
        value: 'diamond'
      }, {
        name: '',
        value: 'circleSolid'
      }, {
        name: '',
        value: 'circle'
      }, {
        name: '',
        value: 'line'
      }, {
        name: '',
        value: 'lineUp'
      }, {
        name: '',
        value: 'lineDown'
      }
      ]),
      echartsProps: !this.props.multi && this.props.node && this.props.node.data && this.props.node.data.echarts ? JSON.stringify(this.props.node.data.echarts.option, null, 4) : '',
      deviceList: [],
      currentDevice: {},
      currentDeviceId: null,
      showPosition: 1
    }
  },
  created () {
  },
  mounted () {
    this.initDevice()
    if (this.props.node) {
      let data = this.props.node.data
      if (data.device) {
        this.currentDevice = JSON.parse(JSON.stringify(data.device))
        this.currentDeviceId = this.currentDevice.id
      }
      if (data.showPosition === undefined) {
        data.showPosition = 1
      }
      this.showPosition = data.showPosition
    }
    if (this.props.line) {
      this.onChangeName(this.props.line.name)
      this.onChangeFromArrow(this.props.line.fromArrow)
      this.onChangeToArrow(this.props.line.toArrow)
    }
  },
  updated () {
    if (this.props.line) {
      this.onChangeName(this.props.line.name)
      this.onChangeFromArrow(this.props.line.fromArrow)
      this.onChangeToArrow(this.props.line.toArrow)
    }
  },
  methods: {
    onChangeName (val) {
      this.onChangeSvg('name', val)
    },
    onChangeFromArrow (val) {
      this.onChangeSvg('fromArrow', val)
    },
    onChangeToArrow (val) {
      this.onChangeSvg('toArrow', val)
    },
    onChangeSvg (key, val) {
      let iconName = ''
      switch (key) {
        case 'name':
          iconName = '' + val
          break
        case 'fromArrow':
          iconName = 'from-' + val
          break
        case 'toArrow':
          iconName = 'to-' + val
          break
      }
      this.props.line[key] = val
      // 获取当前el-select标签第一层div
      const dom = this.$refs[key].$el
      // 创建需要添加到其中的标签 并填充内容
      const svgDom = document.createElement('span')
      svgDom.setAttribute('class', 'el-input__prefix')
      svgDom.innerHTML = '<i class="topology icon-' + iconName + '"></i>'
      // 将创建的标签添加到父节点(第二层div)
      if (dom.children[0].querySelector('.el-input__prefix')) {
        dom.children[0].querySelector('.el-input__prefix').innerHTML = '<i class="topology icon-' + iconName + '"></i>'
      } else {
        dom.children[0].appendChild(svgDom)
      }
      // 得到el-select中的input标签
      this.onChange()
    },
    changeTab (name) {
      this.tabName = name
    },
    onChange (value) {
      this.$emit('change', this.props.node)
    },
    chartsProps (id) {
      this.props.node.data.echarts.option = JSON.parse(this.echartsProps)
      echartsObjs[id].chart.setOption(JSON.parse(this.echartsProps), true)
    },
    handleNodesAlign (align) {
      alignNodes(this.canvas.activeLayer.pens, this.canvas.activeLayer.rect, align)
      this.canvas.updateProps()
    },
    initDevice () {
      deviceService.getDeviceAll().then((res) => {
        if (res !== false) {
          this.deviceList = res
        }
      }).finally({
      })
    },
    changeDevice () {
      this.currentDevice = this.deviceList.find(item => item.id === this.currentDeviceId)
      this.props.node.data.device = this.currentDevice
      this.updatePoint(this.props.node.id)
    },
    onChangePosition () {
      this.props.node.data.showPosition = this.showPosition
      if (this.props.node.data.device) {
        this.updatePoint(this.props.node.id)
      }
    },
    updatePoint (id) {
      deviceService.getPointList(this.currentDevice.serialNo, this.currentDevice.productId).then((res) => {
        if (res !== false) {
          this.props.node.data.pointList = res
          let pointList = JSON.parse(JSON.stringify(res))
          this.canvas.data.pens.forEach(pen => {
            if (pen.id === id) {
              pen.children = null
              let len = pointList.length
              let str = ''
              let width = Math.max(...pointList.map(item => item.displayName.length * 16 + 24))
              let height = len * 20
              if (len) {
                /** 设置子节点 添加文本 */
                pointList.forEach((item, index) => {
                  if (index < len - 1) {
                    str += (item.displayName + '：**数据**' + '\n')
                  } else {
                    str += (item.displayName + '：**数据**')
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
                child.rectInParent = PositionRect[this.showPosition](width, height)
                pen.setChild([child])
                this.props.node = pen
              }
            }
          })
          this.canvas.render()
        }
      }).finally({
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .canvas-props-box {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    .canvas-props {
      font-size: 12px;
      width: 300px;
      height: 100%;
      padding: 0;
      background-color: #fafafa;
      border-left: 1px solid #C0C4CC;
      overflow: auto;
      position: relative;
      .el-tabs--border-card {
        border: none;
        box-shadow: none;
      }
      .canvas-props-list {
        .canvas-props-title {
          font-weight: bold;
          padding: 15px 0 5px;
          margin-bottom: 5px;
          border-bottom: 1px solid #f1f1f1;
        }
        .canvas-props-label {
          padding: 5px 0;
        }
        .canvas-props-content {
          margin-bottom: 5px;
          > .el-input-number, > .el-color-picker, > .el-color-picker /deep/ .el-color-picker__trigger {
            width: 100%;
          }
        }
        .canvas-props-tips {
          color: #C0C4CC;
        }
      }
    }
  }
  .line-select {
    /deep/ .el-input__inner {
      color: transparent;
    }
    /deep/ .el-input__prefix {
      width: calc(100% - 40px);
      color: #606266;
      i {
        font-size: 28px;
      }
    }
  }
  .font28 {
    font-size: 28px;
  }
  .align-btn {
    text-align: center;
  }
  .align-btn .el-button {
    padding: 7px;
  }
</style>
