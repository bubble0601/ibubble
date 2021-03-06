<template>
  <div v-if="$pc" class="d-flex h-100">
    <b-list-group flush class="playlists pc">
      <b-list-group-item v-if="playlists.length === 0" variant="secondary" class="text-muted border-0 px-3 py-1 cursor-default">
        <small>empty</small>
      </b-list-group-item>
      <b-list-group-item v-for="p in playlists" :key="p.id"
                        :to="`/music/playlist/${p.id}`"
                        class="border-0 px-3 py-1" active-class="active"
                        @dblclick.native="shuffleAndPlay">
        <small>{{ p.name }}</small>
      </b-list-group-item>
    </b-list-group>
    <song-list ref="songList" context="playlist" class="w-100"/>
  </div>
  <div v-else-if="id !== 0">
    <song-list ref="songList" context="playlist" class="w-100" @back="$router.push('/music/playlist')"/>
  </div>
  <div v-else>
    <b-list-group flush class="playlists">
      <b-list-group-item v-for="p in playlists" :key="`${p.context}-${p.id}`"
                         :to="`/music/${p.context}/${p.id}`" variant="light"
                         class="px-3 py-2" active-class="active"
                         @dblclick.native="shuffleAndPlay">
        <small>{{ p.name }}</small>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator';
import { musicModule, viewModule } from '@/store';
import SongList from './SongList.vue';

@Component({
  components: {
    SongList,
  },
  beforeRouteEnter(to, from, next) {
    const id = Number(to.params.id);
    if (viewModule.isPC && !id && musicModule.playlistId) {
      next(`/music/playlist/${musicModule.playlistId}`);
    } else if (viewModule.isMobile && id > 0) {
      musicModule.FetchPlaylistSongs(id).then(next);
    } else {
      next();
    }
  },
})
export default class Playlists extends Vue {
  @Prop({ type: Number, default: 0 })
  private id!: number;

  @Ref() private songList!: SongList;

  get playlists() {
    if (this.$pc) {
      return musicModule.playlists;
    }
    const sp = musicModule.smartlists.map((l) => ({
      id: l.id,
      name: l.name,
      context: 'smartlist',
    }));
    const pl = musicModule.playlists.map((l) => ({
      id: l.id,
      name: l.name,
      context: 'playlist',
    }));
    return sp.concat(pl);
  }

  @Watch('id', { immediate: true })
  private onIdChanged() {
    musicModule.FetchPlaylistSongs(this.id);
  }

  private created() {
    musicModule.FetchPlaylists();
  }

  private shuffleAndPlay() {
    this.songList.shuffleAndPlay();
  }
}
</script>
<style lang="scss" scoped>
.playlists {
  overflow-y: auto;
  overflow-x: hidden;
  word-break: keep-all;
  &.pc {
    width: 10rem;
  }
}
</style>
