export default [
  {
    path: '/music',
    component: () => import(/* webpackChunkName: "music" */ '../pages/music/Music.vue'),
    meta: { title: 'Music' },
    props: { tab: 'all' },
    children: [
      {
        path: '',
        redirect: '/music/artist',
      },
      {
        path: 'artist',
        component: () => import(/* webpackChunkName: "music" */ '../pages/music/ArtistList.vue'),
      },
      {
        path: 'artist/:id',
        component: () => import(/* webpackChunkName: "music" */ '../pages/music/ArtistList.vue'),
        props: true,
      },
      {
        path: 'playlist',
        component: () => import(/* webpackChunkName: "music" */ '../pages/music/Playlists.vue'),
      },
      {
        path: 'playlist/:id',
        component: () => import(/* webpackChunkName: "music" */ '../pages/music/Playlists.vue'),
        props: true,
      },
      {
        path: 'settings',
        component: () => import(/* webpackChunkName: "music" */ '../pages/music/Settings.vue'),
      },
      {
        path: ':tab',
        component: () => import(/* webpackChunkName: "music" */ '../pages/music/SongList.vue'),
        props: true,
      },
    ],
  },
];
