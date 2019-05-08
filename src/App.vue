<template>
  <div id="app">
    <el-container v-loading.fullscreen.lock="loading.member">
      <el-header height="auto">
        <el-row class="nav" v-if="trelloUserInfo">
          <el-col>
            <i class="el-icon-user-solid"></i>
            <span style="margin-right:10px;">{{ trelloUserInfo.fullName }}</span>
            <el-button size="small" @click="getCards">Load Overdue Cards</el-button>
            <el-select size="small" v-model="filterBoard" multiple placeholder="Select">
              <el-option
                v-for="item in trelloBoards"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-input size="small" placeholder="Filter" v-model="filterStr">
              <template slot="append">{{ filterCount }}</template>
            </el-input>
            <el-date-picker
              v-model="updateDate"
              type="date" size="small"
              placeholder="Pick a day"
              format="yyyy/MM/dd">
            </el-date-picker>
            <el-button size="small" @click="confirmUpdate">Update Due</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { setTimeout } from 'timers';

export default {
  data() {
    return {
      filterStr: '',
      updateDate: '',
      filterBoard: '',
    };
  },
  created() {
    this.$store.commit('init');
  },
  computed: {
    ...mapState({
      loading: state => state.loading,
      filterCards: state => state.filterCards,
      filterString: state => state.filterString,
      trelloBoards: state => state.trelloBoards,
      trelloUserInfo: state => state.trelloUserInfo,
    }),
    ...mapGetters([
      'filterCount',
    ]),
  },
  watch: {
    filterStr(now) {
      this.$store.commit('updateFilterString', now);
    },
    filterBoard(now) {
      this.$store.commit('updateFilterBoards', now);
    },
  },
  methods: {
    async getCards() {
      await this.$store.dispatch('getMemberBoards');
      await this.$store.dispatch('getMemberCards');
    },
    confirmUpdate() {
      this.$confirm(`Are you sure to update ${this.filterCards.length} card(s) to ${this.updateDate}?`, 'Update Due Date?', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        callback: async (action) => {
          if (action === 'confirm') {
            const loading = this.$loading({
              lock: true,
              text: 'Processing...',
              spinner: 'el-icon-loading',
            });
            await this.$store.dispatch('updateCardsDue', {
              cards: this.filterCards,
              due: this.updateDate,
            });
            setTimeout(async () => {
              loading.close();
              await this.$store.dispatch('getMemberCards');
            }, 5000);
          }
        },
      });
    },
  },
};
</script>


<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
.el-header {
  position: fixed;
  left: 0;
  top: 0;
  background: white;
  width: 100vw;
  z-index: 999;
  box-shadow: 0 4px 2px -2px gray;
  & > .nav {
    margin: 20px;
    & .el-button {
      margin-right: 10px;
    }
    & .el-input {
      width: 260px;
      margin-right: 10px;
    }
  }
}
.el-main {
  margin-top: 60px;
}
</style>
