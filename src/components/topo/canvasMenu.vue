<template>
  <div class="canvasMenu">
    <el-form inline size="mini" @submit.native.prevent>
    </el-form>
    <el-form inline size="mini" @submit.native.prevent>
      <el-divider direction="vertical" class="head-divider"></el-divider>
      <el-form-item label="">
        <el-popover
          popper-class="not-select"
          placement="bottom-end"
          trigger="hover">
          <span class="scale-inside">{{scale}}%</span>
          <el-button class="noBorder-btn" icon="el-icon-minus" @click="changeScale(-1)"></el-button>
          <el-button class="noBorder-btn" icon="el-icon-plus" @click="changeScale(1)"></el-button>
          <el-button @click="changeScale(0)">重置</el-button>
          <div class="scale-outside" slot="reference">视图：{{scale}}%</div>
        </el-popover>
      </el-form-item>
      <el-divider direction="vertical" class="head-divider"></el-divider>
      <el-form-item label="">
        <el-menu mode="horizontal">
          <el-submenu index="state">
            <template slot="title">
              <i :class="`topology icon-${lineName}`"></i>
            </template>
            <el-menu-item-group>
              <template slot="title">连线类型</template>
              <el-menu-item v-for="(item, index) in lineNames" :key="index" :index="`line-${item.value}`" @click="onState('lineName', item)">
                <span>{{ item.name }}：</span>
                <i :class="`topology icon-${item.value}`"></i>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-form-item>
      <el-form-item label="">
        <el-menu mode="horizontal">
          <el-submenu index="state">
            <template slot="title">
              <i :class="`topology icon-from-${fromArrow}`"></i>
            </template>
            <el-menu-item-group>
              <template slot="title">起点箭头</template>
              <el-menu-item v-for="(item, index) in arrowTypes" :key="index" :index="`fromArrow-${item.value}`" @click="onState('fromArrow', item)">
                <i :class="`topology icon-from-${item.value}`"></i>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-form-item>
      <el-form-item label="">
        <el-menu mode="horizontal">
          <el-submenu index="state">
            <template slot="title">
              <i :class="`topology icon-to-${toArrow}`"></i>
            </template>
            <el-menu-item-group>
              <template slot="title">终点箭头</template>
              <el-menu-item v-for="(item, index) in arrowTypes" :key="index" :index="`toArrow-${item.value}`" @click="onState('toArrow', item)">
                <i :class="`topology icon-to-${item.value}`"></i>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-form-item>
      <el-divider direction="vertical" class="head-divider"></el-divider>
<!--      <el-form-item label="">-->
<!--        <el-button icon="el-icon-view">预览</el-button>-->
<!--      </el-form-item>-->
      <el-form-item label="">
        <el-button type="primary" icon="el-icon-view" @click="onViewCanvas()">预览</el-button>
        <el-button type="primary" icon="el-icon-circle-check" @click="onSaveCanvas()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'canvasMenu',
  props: {
    line: String,
    to: String,
    from: String,
    canvas: Object
  },
  data () {
    return {
      // 基础配置
      basicProfile: {
        lineName: this.line, // 连线类型
        fromArrow: this.from, // 箭头类型 from
        toArrow: this.to // 箭头类型 to
      },
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
      ])
    }
  },
  methods: {
    // 选择线
    onState (key, { value }) {
      this.basicProfile[key] = value
      this.$emit('on-change-menu', { key, value })
    },
    // 保存画布
    onSaveCanvas () {
      this.$emit('save-canvas')
    },
    onViewCanvas () {
      this.$emit('view-canvas')
    },
    changeScale (value) {
      if (value === 1) {
        this.canvas.scaleTo(this.canvas.data.scale + 0.1)
      } else if (value === -1) {
        this.canvas.scaleTo(this.canvas.data.scale - 0.1)
      } else {
        this.canvas.scaleTo(1)
      }
    }
  },
  computed: {
    lineName () {
      return this.basicProfile.lineName
    },
    fromArrow () {
      return this.basicProfile.fromArrow
    },
    toArrow () {
      return this.basicProfile.toArrow
    },
    scale () {
      return this.canvas ? (this.canvas.data.scale * 100).toFixed(0) : 100
    }
  }
}

</script>

<style lang="scss" scoped>
  .canvasMenu {
    display: flex;
    justify-content: space-between;
    height: 40px;
    padding: 0 10px;
    border-bottom: 1px solid #C0C4CC;

    /deep/ .el-form {
      display: flex;
      align-items: center;

      .head-divider {
        height: 40px;
        margin: 0 10px;
      }

      .el-form-item {
        margin-left: 5px;
        margin-right: 5px;
        margin-bottom: 0;

        .el-menu {
          border-bottom: none;

          .el-submenu__title {
            border-bottom: none;
            padding: 0;
            height: 40px;
            line-height: 40px;

            i.topology {
              color: #303133;
              font-size: 28px;
            }

            .el-submenu__icon-arrow {
              display: none;
            }
          }
        }
      }

      .el-form-item--medium {
        .el-submenu__title {
          height: 36px !important;
          line-height: 36px !important;
        }
      }

      .el-form-item--small {
        .el-submenu__title {
          height: 32px !important;
          line-height: 32px !important;
        }
      }

      .el-form-item--mini {
        .el-submenu__title {
          height: 28px !important;
          line-height: 28px !important;
        }
      }
    }
  }

  .el-menu--horizontal {
    .el-menu-item-group /deep/ .el-menu-item-group__title {
      padding-left: 10px !important;
    }
    .el-menu-item {
      color: #303133;

      i.topology {
        color: #303133;
        font-size: 28px;
      }
    }
  }

  .scale-inside {
    font-size: 12px;
    width: 50px;
    display: inline-block;
  }

  .scale-outside {
    font-size: 12px;
  }

  .noBorder-btn {
    border: none;
    background: none !important;
    padding: 0;
    font-size: 14px;

    /deep/ i {
      font-weight: bold;
    }
  }
</style>
