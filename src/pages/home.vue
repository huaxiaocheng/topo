<template>
  <div>
    <CanvasEdit v-if="edit" @change-mode="changeMode" :canvasString="canvasString" style="height: 100vh;"></CanvasEdit>
    <CanvasView v-if="!edit" @change-mode="changeMode" :canvasString="canvasString" style="height: 100vh;"></CanvasView>
  </div>
</template>

<script>
import CanvasEdit from '@/components/topo/canvasEdit'
import CanvasView from '@/components/topo/CanvasView'
import authService from '@/api/system/authService.js'
import * as websocket from '@/utils/websocket.js'

export default {
  components: {
    CanvasEdit,
    CanvasView
  },
  data () {
    return {
      edit: true,
      canvasString: ''
    }
  },
  methods: {
    changeMode (val, string) {
      this.edit = val
      this.canvasString = string
    },
    login: function () {
      authService.login({username: 'admin', password: '123456'}).then(res => {
        if (res !== false) {
          this.$store.dispatch('asynSetAccount', JSON.stringify(res))
          websocket.wsConnection()
        }
      }).finally(() => {
      })
    }
  },
  mounted () {
    this.login()
  }
}
</script>

<style scoped>

</style>
