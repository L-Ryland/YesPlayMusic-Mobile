
import { createTable, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'trackDetails',
          columns: [
            { name: 'track_id', type: 'string', isIndexed: true },
            { name: 'detail', type: 'string', isOptional: true },
            { name: 'privileges', type: 'string', isOptional: true },
            { name: 'updated_at', type: 'number', isIndexed: true },
          ]
        }),
        createTable({
          name: 'lyrics',
          columns: [
            { name: 'lyrics_id', type: 'string', isIndexed: true },
            { name: 'lyrics', type: 'string' },
            { name: 'updated_at', type: 'number', isIndexed: true },
          ]
        }),
        createTable({
          name: 'albums',
          columns: [
            { name: 'album_id', type: 'string', isIndexed: true },
            { name: 'album', type: 'string' },
            { name: 'updated_at', type: 'number', isIndexed: true },
          ]
        }),
        createTable({
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
    }
  ],
})