<template>
  <div class="topology-headers">
    <div class="topology-headers-name"><span>组态名称：</span>
      <el-input v-model="topoForm.topoName" size="small"></el-input>
    </div>
    <el-button size="small" @click="oriScale()">100%居中</el-button>
    <el-menu mode="horizontal" class="full"></el-menu>
    <div class="canvas-menu-title">连线类型：</div>
    <el-menu mode="horizontal">
      <el-submenu index="state" :popper-append-to-body="false">
        <template slot="title">
          <i :class="`topology icon-${lineName}`"></i>
        </template>
        <el-menu-item v-for="(item, index) in lineNames" :key="index" :index="`line-${item.value}`"
                      @click="onState('lineName', item)">
          <span>{{ item.name }}：</span>
          <i :class="`topology icon-${item.value}`"></i>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="canvas-menu-title">起点箭头：</div>
    <el-menu mode="horizontal">
      <el-submenu index="state">
        <template slot="title">
          <i :class="`topology icon-from-${fromArrowType}`"></i>
        </template>
        <el-menu-item v-for="(item, index) in arrowTypes" :key="index" :index="`fromArrow-${item.value}`"
                      @click="onState('fromArrowType', item)">
          <i :class="`topology icon-from-${item.value}`"></i>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="canvas-menu-title">终点箭头：</div>
    <el-menu mode="horizontal">
      <el-submenu index="state" :popper-append-to-body="false">
        <template slot="title">
          <i :class="`topology icon-to-${toArrowType}`"></i>
        </template>
        <el-menu-item v-for="(item, index) in arrowTypes" :key="index" :index="`toArrow-${item.value}`"
                      @click="onState('toArrowType', item)">
          <i :class="`topology icon-to-${item.value}`"></i>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="canvas-save">
      <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="$emit('save-canvas',topoForm)">保存</el-button>
      <el-button type="default" size="mini" @click="$emit('back')">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'canvasMenu',
  props: {
    line: String,
    to: String,
    from: String,
    canvas: Object,
    topoForm: {}
  },
  data () {
    return {
      // 基础配置
      basicProfile: {
        // 连线类型
        lineName: this.line,
        // 箭头类型 from
        fromArrowType: this.from,
        toArrowType: this.to
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
      console.log(value)
      this.basicProfile[key] = value
      this.$emit('on-change-menu', {
        key,
        value
      })
    },
    // 保存画布
    onSaveCanvas () {
      this.$emit('save-canvas', this.topoForm)
    },
    oriScale () {
      this.canvas.scaleTo(1)
      this.canvas.centerView()
    }
  },
  computed: {
    scale () {
      return Math.floor(this.basicProfile.scale * 100)
    },
    lineName () {
      return this.basicProfile.lineName
    },
    fromArrowType () {
      return this.basicProfile.fromArrowType
    },
    toArrowType () {
      return this.basicProfile.toArrowType
    },
    bkImage () {
      return this.basicProfile.bkImage
    }
  }
}

</script>
<style lang="scss" scoped>
  .topology-headers {
    // padding: 5px 0 0 0;
    display: flex;
    background-color: #fff;
    font-size: 14px;
    height: 40px;
    border-bottom: solid 1px #e6e6e6;

    .topology-headers-name {
      margin-top: 4px;
      margin-left: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      span {
        width: 80px;
        font-size: 14px;
        color: #000;
        opacity: 0.8;
        font-weight: 500;
        flex: 0 0 auto;
      }
    }

    .canvas-menu-title {
      line-height: 40px;
    }

    .canvas-save {
      line-height: 40px;
      padding: 0 10px 0 30px;
    }

    .full {
      flex: 1;
    }

    .logo {
      img {
        height: 22px;
        position: relative;
        top: -4px;
      }
    }

    /deep/ .el-menu {
      padding: 0 10px;
      border-bottom: none !important;

      .el-menu-item,
      .el-submenu__title {
        color: #314659 !important;
        font-size: 13px;
        padding: 0 10px;
        height: 40px !important;
        line-height: 40px !important;

        &.separator {
          border-top: 1px solid #e8e8e8;
          margin: 0 10px;
          height: 10px !important;
          line-height: 10px !important;
        }

        a {
          text-decoration: none;
          color: #314659;
        }

        .topology {
          color: #314659;
          font-size: 26px;
        }
      }
    }
  }

</style>
