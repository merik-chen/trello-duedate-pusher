/* eslint no-param-reassign: ["error", { "props": false }] */

import Vue from 'vue';
import Vuex from 'vuex';

import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: {
      member: false,
      boards: false,
      cards: false,
    },
    trelloRequester: null,
    trelloApiKey: 'c0eef75d8aeba06dfa70003980de988f',
    trelloToken: null,
    trelloUserInfo: null,
    trelloCards: [],
    trelloBoards: [],
    filterString: '',
    filterCards: [],
    filterBoards: [],
  },
  getters: {
    filterCount: state => state.filterCards.length,
  },
  mutations: {
    init(state) {
      const token = localStorage.getItem('trello-api-token');
      if (token) {
        state.trelloToken = token;
      }
      state.trelloRequester = axios.create({
        baseURL: 'https://api.trello.com/1/',
        params: {
          key: state.trelloApiKey,
          token: state.trelloToken,
        },
      });
    },
    setApiToken(state, payload) {
      state.trelloToken = payload;
      localStorage.setItem('trello-api-token', payload);
    },
    removeApiToken(state) {
      state.trelloToken = null;
      localStorage.removeItem('trello-api-token');
    },
    updateFilterString(state, string) {
      state.filterString = string;
    },
    updateFilterBoards(state, boards) {
      state.filterBoards = boards;
    },
    updateFilterCards(state, cards) {
      state.filterCards = cards;
    },
  },
  actions: {
    async getMember({ state }) {
      state.loading.member = true;
      const { data } = await state.trelloRequester.get(`tokens/${state.trelloToken}/member`);
      state.trelloUserInfo = data;
      state.loading.member = false;
      console.dir(data);
    },
    async getMemberBoards({ state }) {
      state.loading.boards = true;
      const { data } = await state.trelloRequester.get(`members/${state.trelloUserInfo.id}/boards`, {
        params: {
          filter: [
            'members',
            'open',
            'organization',
            'public',
            'starred',
          ].join(','),
          fields: ['id', 'name'].join(','),
          lists: 'none',
          memberships: 'none',
        },
      });
      // eslint-disable-next-line max-len
      // state.trelloBoards = _.filter(data, card => (card.dueComplete === false) && (card.due !== null));
      state.trelloBoards = data;
      state.loading.boards = false;
    },
    async getMemberCards({ state }) {
      const todayTs = +new Date();
      state.loading.cards = true;
      const { data } = await state.trelloRequester.get(`members/${state.trelloUserInfo.id}/cards`, {
        params: {
          fields: 'id,idBoard,name,due,dueComplete',
        },
      });
      const cards = _.filter(data, card => (card.dueComplete === false) && (card.due !== null));
      cards.forEach((card) => {
        card.due = moment(card.due);
        card.dueTs = +new Date(card.due);
      });
      state.trelloCards = _.filter(cards, card => card.dueTs <= todayTs);
      state.loading.cards = false;
    },
    async updateCardsDue({ state }, { cards, due }) {
      cards.forEach(async (card) => {
        const newDue = new Date(due.getTime());
        newDue.setHours(card.due.hour(), card.due.minute(), card.due.second());
        console.log(card.due.toISOString(), newDue.toISOString());
        const { data } = await state.trelloRequester.put(`cards/${card.id}/due`, {}, {
          params: {
            value: newDue.toISOString(),
          },
        });
        console.log(data);
      });
    },
  },
});
