<template>
  <div class="dashboard-container">
    <div class="dashboard-text">tools_networkcfg</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TNetworkcfg',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
