import { appSchema, Model, tableSchema } from "@nozbe/watermelondb";
import { date, field, json, readonly } from "@nozbe/watermelondb/decorators";

export const schema = appSchema({
    version: 1,
    tables: [
      tableSchema({
        name: 'trackDetails',
        columns: [
          { name: 'track_id', type: 'string', isIndexed: true },
          { name: 'detail', type: 'string', isOptional: true },
          { name: 'privileges', type: 'string', isOptional: true },
          { name: 'updated_at', type: 'number', isIndexed: true },
        ]
      }),
      tableSchema({
        name: 'lyrics',
        columns: [
          { name: 'lyrics_id', type: 'string', isIndexed: true },
          { name: 'lyrics', type: 'string'},
          { name: 'updated_at', type: 'number', isIndexed: true },
        ]
      }),
      tableSchema({
        name: 'albums',
        columns: [
          { name: 'album_id', type: 'string', isIndexed: true },
          { name: 'album', type: 'string' },
          { name: 'updated_at', type: 'number', isIndexed: true },
        ]
      }),
      tableSchema({
        name: 'trackSources',
        columns: [
          { name: "track_id", type: 'string', isIndexed: true },
          { name: 'source', type: 'string', isOptional: true },
          { name: 'bit_rate', type: 'number', isOptional: true },
          { name: 'from', type: 'string', isOptional: true },
          { name: 'name', type: 'string', isOptional: true },
          { name: 'artist', type: 'string', isOptional: true },
          { name: 'created_at', type: 'number', isIndexed: true }
        ]
      })
    ]
  })
  const sanitizedJSON = (json: JSON) => json
  // const db = new MyDexie('yesplaymusic');
  export class Lyrics extends Model {
    static table = 'lyrics';
  
    @field('lyrics_id') lyricsId
    @json('lyrics', sanitizedJSON) lyrics
    @readonly @date("updated_at") updatedAt
  }
  export class Albums extends Model {
    static table = 'albums';
    @field('album_id') albumId
    @json('album', sanitizedJSON) album
    @readonly @date('updated_at') updatedAt
  }
  export class TrackDetails extends Model {
    static table = 'trackDetails';
  
    @field('track_id') trackId
    @field('detail') detail
    @field('privileges') privileges
    @readonly @date('updated_at') updatedAt
  }
  export class TrackSources extends Model {
    static table = 'trackSources';
  
    @field('track_id') trackId
    @json('source', sanitizedJSON) source
    @field('bit_rate') bitRate
    @field('from') from
    @field('name') name
    @field('artist') artist
    @readonly @date('created_at') createdAt
  
    get resourceSize(): number {
      console.log('getting source size', this.source);
      return this.source.size ?? 0;
    }
  }
  
  export const  modelClassArr = [Lyrics, Albums, TrackDetails, TrackSources]