<template>
  <div class="canvas-props-box">
    <div class="canvas-props">
      <el-tabs type="border-card" v-model="tabName">
        <el-tab-pane label="图文设置" name="overall">
          <div class="canvas-props-list">
            <el-row :gutter="10">
              <el-col :span="24">
                <div class="canvas-props-title">图文</div>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="12">
                <div class="canvas-props-label">背景颜色</div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-label">&#12288;</div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-content">
                  <el-color-picker :size="size" v-model="bkColor" @change="onchangeCanvas('data', 'bkColor')"></el-color-picker>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-content">
                  &#12288;
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <div class="canvas-props-label">背景图片</div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-label">&#12288;</div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-content">
                  <el-upload
                    class="avatar-uploader"
                    action=""
                    :auto-upload="false"
                    :show-file-list="false"
                    :disabled="image.disabled"
                    :on-change="handleAddImg">
                    <img v-if="image.url" :src="image.url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div v-if="image.url" class="el-upload-list__item-actions">
                      <span class="el-upload-list__item-delete" @click="handleRemove()"><i class="el-icon-delete"></i></span>
                    </div>
                  </el-upload>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-content">
                  &#12288;
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="24">
                <div class="canvas-props-title">画布</div>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="12">
                <div class="canvas-props-label">长度</div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-label">宽度</div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-content">
                  <el-input-number :size="size" v-model="width" controls-position="right" @change="onchangeCanvas('options', 'width')" :min="800" :max="1920"></el-input-number>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-content">
                  <el-input-number :size="size" v-model="height" controls-position="right" @change="onchangeCanvas('options', 'height')" :min="450" :max="1080"></el-input-number>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="12">
                <div class="canvas-props-label">网格</div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-label">网格颜色</div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-content">
                  <el-switch v-model="grid" @change="onchangeCanvas('data', 'grid')"></el-switch>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-content">
                  <el-color-picker :size="size" v-model="gridColor" @change="onchangeCanvas('data', 'gridColor')"></el-color-picker>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="12">
                <div class="canvas-props-label">标尺</div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-label">标尺颜色</div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-content">
                  <el-switch v-model="rule" @change="onchangeCanvas('data', 'rule')"></el-switch>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="canvas-props-content">
                  <el-color-picker :size="size" v-model="ruleColor" @change="onchangeCanvas('data', 'ruleColor')"></el-color-picker>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tips" v-show="tabName === 'overall'">
        <div class="tips-title">小提示</div>
        <ul class="tips-list">
          <li>Ctrl + 鼠标点击：多选</li>
          <li>Ctrl + 鼠标滚轮：缩放画布</li>
          <li>Ctrl + 鼠标拖拽空白：移动整个画布</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    canvas: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      tabName: 'overall',
      size: 'mini',
      bkColor: this.canvas.data.bkColor,
      image: {
        url: this.canvas.data.bkImage,
        disabled: this.canvas.data.bkImage
      },
      grid: this.canvas.data.grid,
      gridColor: this.canvas.data.gridColor,
      rule: this.canvas.data.rule,
      ruleColor: this.canvas.data.ruleColor,
      width: this.canvas.options.width,
      height: this.canvas.options.height
    }
  },
  created () {
  },
  mounted () {
  },
  updated () {
  },
  computed: {
  },
  methods: {
    changeTab (name) {
      this.tabName = name
    },
    onchangeCanvas (option, key) {
      this.canvas[option][key] = this[key]
      if (option === 'options') {
        this.canvas.resize()
      } else {
        this.canvas.render()
      }
    },
    handleAddImg (file) {
      let raw = file.raw
      this.checkFile(raw)
      this.image.url = URL.createObjectURL(raw)
      this.image.disabled = true
      this.canvas.clearBkImg()
      this.canvas.data.bkImage = this.image.url
      this.canvas.render()
    },
    handleRemove () {
      this.image.url = null
      this.canvas.clearBkImg()
      this.canvas.data.bkImage = null
      this.canvas.render()
      setTimeout(() => {
        this.image.disabled = false
      }, 0)
    },
    checkFile (raw) {
      const isJPG = raw.type === 'image/jpeg' || raw.type === 'image/jpg' || raw.type === 'image/png' || raw.type === 'image/bmp' || raw.type === 'image/icon'
      const isLt2M = (raw.size / 1024 / 1024) < 2
      if (!isJPG) {
        this.$message.error('上传图片格式错误!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过2MB!')
        return false
      }
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
      .tips {
        background: #fafafa;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        .tips-title {
          font-weight: bold;
          padding: 10px;
          border-bottom: 1px solid #C0C4CC;
        }
        .tips-list {
          padding: 10px;
          li {
            list-style: inside;
            padding: 5px 0;
            color: #909399;
          }
        }
      }
    }
  }
  .avatar-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: calc(100% - 2px);
  }
  .avatar-uploader /deep/ .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 120px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }
  .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s;
  }
  .el-upload-list__item-actions:hover {
    opacity: 1;
  }
  .el-upload-list__item-delete {
    position: static;
    font-size: inherit;
    color: inherit;
    margin-left: 10px;
    margin-right: 10px;
    display: inline-block;
    cursor: pointer;
  }
  .el-upload-list__item-actions:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }
</style>
