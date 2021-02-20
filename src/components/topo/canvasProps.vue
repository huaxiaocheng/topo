<template>
  <div class="canvas-props-box">
    <div class="canvas-props">
      <el-tabs type="border-card" v-model="tabName">
        <el-tab-pane label="外观" name="face">
          <div class="canvas-props-list" v-show="tabName === 'face'">
            <template v-if="!props.multi">
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

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="canvas-props-label">水平偏移（px）</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-label">垂直偏移（px）</div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">

                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="canvas-props-content">

                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
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
            <template v-else>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自定义信息" name="custom" v-if="!props.multi && props.node && props.node.data">
          <div class="canvas-props-list" v-if="!props.multi && props.node && props.node.data" v-show="tabName === 'custom'">
            <template v-if="props.node.data">
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
      </el-tabs>
    </div>
  </div>
</template>

<script>
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
      tabName: 'face',
      size: 'mini',
      echartsProps: !this.props.multi && this.props.node.data.echarts ? JSON.stringify(this.props.node.data.echarts.option) : ''
    }
  },
  created () {
  },
  mounted () {
  },
  updated () {
  },
  methods: {
    changeTab (name) {
      this.tabName = name
    },
    onChange (value) {
      this.$emit('change', this.props.node)
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
</style>
