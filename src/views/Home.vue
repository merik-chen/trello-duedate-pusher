<template>
  <div class="home"  v-loading.fullscreen.lock="loading.cards">
    <el-row class="cards">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8"
        v-for="(card, index) in fliterCards" :key="index">
        <el-card style="margin: 10px;">
          <div class="box-card">
            <span class="cardDue">{{ card.due | toDateStr }}</span>
            <span class="cardName">{{ card.name }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src
import _ from 'lodash';
import { mapState } from 'vuex';

export default {
  name: 'home',
  data() {
    return {
      fliterCards: [],
    };
  },
  computed: {
    ...mapState({
      loading: state => state.loading,
      filterString: state => state.filterString,
      filterBoards: state => state.filterBoards,
      trelloCards: state => state.trelloCards,
    }),
  },
  watch: {
    trelloCards() {
      this.cardFilter();
    },
    filterString() {
      this.cardFilter();
    },
    filterBoards() {
      this.cardFilter();
    },
  },
  async mounted() {
    await this.$store.dispatch('getMember');
  },
  methods: {
    cardFilter() {
      const fStr = this.filterString;
      const fBrd = this.filterBoards;
      let cards = [];

      if (fBrd.length) {
        cards = this.trelloCards.filter(
          card => _.indexOf(fBrd, card.idBoard) > -1,
        );
      } else {
        cards = this.trelloCards;
      }

      if (fStr.length) {
        cards = cards.filter(
          card => card.name.includes(fStr),
        );
      }

      this.fliterCards = cards;
      this.$store.commit('updateFilterCards', this.fliterCards);
    },
  },
  filters: {
    toDateStr(value) {
      if (!value) return '';
      const d = new Date(value);
      return `${d.toLocaleString()}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  min-height: 60px;
}
.cardName,
.cardDue {
  white-space: nowrap;
  display: block;
  margin: 10px 0;
}

.cardDue {
  font-size: 13px;
}
</style>
