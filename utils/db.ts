import { Platform } from "react-native";
import axios from 'axios';
// import Dexie from 'dexie';
import { Model, Q } from "@nozbe/watermelondb";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Lyrics, Albums, TrackDetails, TrackSources } from "@/utils/schema";
import { database } from "@/index";





// const database = new Database({
//   adapter: sqliteAdapter,
//   modelClasses: [Lyrics, Albums, TrackDetails, TrackSources]
// })


let tracksCacheBytes = 0;

async function deleteExcessCache() {
  const settings = await AsyncStorage.getItem("persist:settings").then(
    value => value ? JSON.parse(value) : value
  )

  if (
    settings.cacheLimit === false ||
    tracksCacheBytes < settings.cacheLimit * Math.pow(1024, 2)

  ) {
    return;
  }
  try {
    // let delCache = await db.trackSources.orderBy('createTime').first();
    const delCache = await database.get("trackSources").query(
      Q.sortBy('updated_at'),
      Q.take(1)
    );
    console.log(delCache);

    // await db.trackSources.delete(delCache.id);
    await delCache.destroyAllPermanently();
    // tracksCacheBytes -= delCache.source.byteLength;
    // console.debug(
    //   `[debug][db.js] deleteExcessCacheSucces, track: ${delCache.name}, size: ${delCache.source.byteLength}, cacheSize:${tracksCacheBytes}`
    // );
    deleteExcessCache();
  } catch (error) {
    console.debug('[debug][db.js] deleteExcessCacheFailed', error);
  }
}

export function cacheTrackSource(trackInfo, url, bitRate, from = 'netease') {
  if (Platform.OS === 'web') return;
  const name = trackInfo.name;
  const artist =
    (trackInfo.ar && trackInfo.ar[0]?.name) ||
    (trackInfo.artists && trackInfo.artists[0]?.name) ||
    'Unknown';
  let cover = trackInfo.al.picUrl;
  if (cover.slice(0, 5) !== 'https') {
    cover = 'https' + cover.slice(4);
  }
  axios.get(`${cover}?param=512y512`);
  axios.get(`${cover}?param=224y224`);
  axios.get(`${cover}?param=1024y1024`);
  return axios
    .get(url, {
      responseType: 'arraybuffer',
    })
    .then(response => {
      // db.trackSources.put({
      //   id: trackInfo.id,
      //   source: response.data,
      //   bitRate,
      //   from,
      //   name,
      //   artist,
      //   createTime: new Date().getTime(),
      // });
      database.get('trackSources').create((record: Model) => {
        if (record instanceof TrackSources) {
          record.trackId = trackInfo.id;
          record.source = response.data;
          record.bitRate = bitRate;
          record.from = from;
          record.name = name;
          record.artist = artist;
          return;
        }
        console.error("error type in data insertion", typeof record);
        return;
      })
      console.debug(`[debug][db.js] cached track 👉 ${name} by ${artist}`);
      tracksCacheBytes += response.data.byteLength;
      deleteExcessCache();
      return { trackID: trackInfo.id, source: response.data, bitRate };
    });
}

export function getTrackSource(id) {
  let track;
  (async () => {
    track = await database.get('trackSources').query(
      Q.where('trakc_id', id)
    ).fetch();
  })();

  // return db.trackSources.get(Number(id)).then(track => {
  //   if (!track) return null;
  //   console.debug(
  //     `[debug][db.js] get track from cache 👉 ${track.name} by ${track.artist}`
  //   );
  //   return track;
  // });
  if (!track) return null;
  console.debug(
    `[debug][db.js] get track from cache 👉 ${track.name} by ${track.artist}`
  );
  return track;
}

export function cacheTrackDetail(track, privileges) {
  database.get('trackDetails').create((record) => {
    if (record instanceof TrackDetails) {
      record.trackId = track.id;
      record.detail = track;
      record.privileges = privileges;
    } else {
      console.error("cache Track Detail record parse error in", record);

    }
  })
  // db.trackDetail.put({
  //   id: track.id,
  //   detail: track,
  //   privileges: privileges,
  //   updateTime: new Date().getTime(),
  // });
}

export function getTrackDetailFromCache(ids) {
  let trackDetail;
  database.get('trackDetails').query().fetch().then(
    data => {
      trackDetail = data;
    }
  );

  // return db.trackDetail
  return trackDetail
    .filter(track => ids.includes(track.id))
    .toArray()
    .then((tracks: any) => {
      const result = { songs: [], privileges: [] };
      ids.map(id => {
        const one = tracks.find(t => String(t.id) === id);
        result.songs.push(one?.detail);
        result.privileges.push(one?.privileges);
      });
      if (result.songs.includes(undefined)) {
        return undefined;
      }
      return result;
    });
}

export function cacheLyric(id, lyrics) {
  return new Promise (
    resolve => {
      database.get('lyrics').create(
        record => {
          if (record instanceof Lyrics ) {
            record.lyricsId = id;
            record.lyrics = lyrics;
          }
        }
      )
    }
  )
  // db.lyric.put({
  //   id,
  //   lyrics,
  //   updateTime: new Date().getTime(),
  // });
}

export function getLyricFromCache(id) {
  database.get('lyrics').query(
    Q.where('lyrics_id', id)
  ).fetch().then(
    result => result
  ).catch(
    _ => undefined
  )
  // return db.lyric.get(Number(id)).then(result => {
  //   if (!result) return undefined;
  //   return result.lyrics;
  // });
}

export function cacheAlbum(id, album) {
  database.get('albums').create(record => {
    if (record instanceof Albums) {
      record.albumId = id;
      record.album = album;
    }
  })
  // db.album.put({
  //   id: Number(id),
  //   album,
  //   updateTime: new Date().getTime(),
  // });
}

export function getAlbumFromCache(id) {
  database.get('albums').query(
    Q.where('album_id', id)
  ).fetch().then(
    result => result
  ).catch(
    error => {
      console.error(error);
      return undefined;
    }
  )
  // return db.album.get(Number(id)).then(result => {
  //   if (!result) return undefined;
  //   return result.album;
  // });
}

export async function countDBSize() {
  // return   await database.get('trackSource').query.fetch()
  const trackSizes: number[] = [];
  return await database.get('trackSource').query().fetch()
    .then((recordArr) => {
      recordArr.forEach((record) => {
        if (record instanceof TrackSources) {
          trackSizes.push(record.resourceSize);
        }
      })
      // Object.keys(modelArr).length
    }).then(() => {
      const res = {
        bytes: trackSizes.reduce((s1, s2) => s1 + s2, 0),
        length: trackSizes.length,
      };
      tracksCacheBytes = res.bytes;
      console.debug(
        `[debug][db.js] load tracksCacheBytes: ${tracksCacheBytes }`
      );
      return res;
    });

  // const trackSizes = [];
  // return db.trackSources
  //   .each(track => {
  //     trackSizes.push(track.source.byteLength);
  //   })
  //   .then(() => {
  //     const res = {
  //       bytes: trackSizes.reduce((s1, s2) => s1 + s2, 0),
  //       length: trackSizes.length,
  //     };
  //     tracksCacheBytes = res.bytes;
  //     console.debug(
  //       `[debug][db.js] load tracksCacheBytes: ${ }`
  //     );
  //     return res;
  //   });
}

export function clearDB() {
  // return new Promise(resolve => {
  //   db.tables.forEach(function (table) {
  //     table.clear();
  //   });
  //   resolve();
  // });
  return new Promise<void>(resolve => {
    database.unsafeResetDatabase();
    resolve();
  })
}
``