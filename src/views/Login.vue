<template>
  <div>
    <button @click="startAuth">Login</button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'login',
  computed: {
    ...mapState({
      trelloApiKey: state => state.trelloApiKey,
    }),
  },
  mounted() {
    // this.$store.dispatch('getMemberCards');
  },
  methods: {
    startAuth() {
      const authLink = new URL('authorize', 'https://api.trello.com/1/');
      authLink.searchParams.append('key', this.trelloApiKey);
      authLink.searchParams.append('callback_method', 'fragment');
      authLink.searchParams.append('return_url', `${window.location.origin}/#/rToken?auth`);
      authLink.searchParams.append('scope', 'read,write');
      authLink.searchParams.append('expiration', '30days');
      authLink.searchParams.append('name', 'Due Date Pusher');
      authLink.searchParams.append('response_type', 'fragment');

      console.log(authLink.href);

      window.location.href = authLink.href;
    },
  },
};
</script>
