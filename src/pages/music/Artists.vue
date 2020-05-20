<template>
  <div v-if="$pc" class="d-flex h-100">
    <div class="artists">
      <b-input-group class="search_input-group">
        <b-input-group-prepend is-text>
          <b-icon icon="search"/>
        </b-input-group-prepend>
        <b-form-input v-model="query" class="search_input"/>
      </b-input-group>
      <b-list-group flush>
        <b-list-group-item v-for="artist in artists" :key="artist.id"
                          :to="`/music/artist/${artist.id}`" variant="secondary"
                          class="border-0 px-3 py-1" active-class="active"
                          @dblclick.native="shuffleAndPlay">
          <small>{{ artist.name }}</small>
        </b-list-group-item>
      </b-list-group>
    </div>
    <song-list ref="songList" context="artist" class="w-100"/>
  </div>
  <div v-else-if="id >= 0">
    <song-list ref="songList" context="artist" class="w-100"/>
  </div>
  <div v-else class="artists">
    <b-input-group class="search_input-group">
      <b-input-group-prepend is-text>
        <b-icon icon="search"/>
      </b-input-group-prepend>
      <b-form-input v-model="query" class="search_input"/>
    </b-input-group>
    <b-list-group flush>
      <b-list-group-item v-for="artist in artists" :key="artist.id"
                         :to="`/music/artist/${artist.id}`" variant="light"
                         class="px-3 py-2" active-class="active"
                         @dblclick.native="shuffleAndPlay">
        <small>{{ artist.name }}</small>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator';
import { NavigationGuard } from 'vue-router';
import { musicModule, screenModule } from '@/store';
import SongList from './SongList.vue';

@Component({
  components: {
    SongList,
  },
  beforeRouteEnter(to, from, next) {
    const id = Number(to.params.id);
    if (screenModule.isMobile && id >= 0) {
      musicModule.FetchSongs({ artist: id }).then(next);
    } else {
      next();
    }
  },
})
export default class Artists extends Vue {
  @Prop({ type: Number, default: -1 })
  private id!: number;

  private query: string = '';

  @Ref() private songList!: SongList;

  get artists() {
    if (!this.query) return musicModule.artists;
    return musicModule.artists.filter((artist) => artist.name.includes(this.query));
  }

  @Watch('id', { immediate: true })
  private onIdChanged() {
    musicModule.FetchSongs({ artist: this.id });
  }

  private created() {
    musicModule.FetchArtists();
  }

  private shuffleAndPlay() {
    this.songList.shuffleAndPlay();
  }
}
</script>
<style lang="scss" scoped>
.artists {
  background-color: #9994;
  overflow-y: auto;
  overflow-x: hidden;
  word-break: keep-all;
}

.search_input:focus {
  border-color: #ced4da;
  border-bottom-color: #80bdff;
  box-shadow: 0 -0.08rem 0 0 rgba(0, 123, 255, 0.125) inset;
}
</style>
<style lang="scss">
.artists .search_input-group {
  .search_input, .input-group-text {
    border-radius: 0;
  }
}
</style>