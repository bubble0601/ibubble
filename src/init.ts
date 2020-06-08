import Vue from 'vue';
import Component from 'vue-class-component';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import axios from 'axios';
import VueSlider from 'vue-slider-component';
import { screenModule } from './store';
import { initDialogs } from './utils';
import { VField, VHelp, VInput } from './components';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.component('VueSlider', VueSlider);
Vue.component('VField', VField);
Vue.component('VHelp', VHelp);
Vue.component('VInput', VInput);
initDialogs();

axios.interceptors.response.use(undefined, (err) => {
  const { data } = err.response;
  if (!data || data.error_message) {
    Vue.prototype.$message.error(data.error_message || '通信に失敗しました');
  }
  throw err;
});

if (process.env.NODE_ENV !== 'production') {
  Vue.mixin({
    methods: {
      /* tslint:disable-next-line:no-console */
      $_log: console.log,
    },
  });
}
Vue.mixin({
  computed: {
    $mobile() {
      return screenModule.isMobile;
    },
    $pc() {
      return screenModule.isPC;
    },
  },
  methods: {
    $from: screenModule.from,
    $until: screenModule.until,
  },
});

window.addEventListener('resize', screenModule.RESIZE);
