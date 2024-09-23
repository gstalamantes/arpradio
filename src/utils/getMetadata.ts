import { createDbConnection } from './db';
import { MetadataResult, findInMetadata, findAllSongTitles, findArtistsAndReleaseInfo } from './metadata';

export async function getMetadata(policy_id: string, name: string): Promise<MetadataResult> {
  const connection = await createDbConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT metadata FROM cip60 WHERE policyid = ? AND name = ? LIMIT 1',
      [policy_id, name]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const metadata = (rows[0] as any).metadata;

      let parsedMetadata;
      if (typeof metadata === 'string') {
        parsedMetadata = JSON.parse(metadata);
      } else if (typeof metadata === 'object' && metadata !== null) {
        parsedMetadata = metadata;
      } else {
        console.log("Invalid metadata format");
        return { 
          releaseInfo: { links: {} }, 
          imageUrl: "/album.gif", 
          name: null, 
          artists: [], 
          releaseType: null, 
          releaseTitle: null, 
          songTitles: null, 
          genres: null, 
          producer: null 
        };
      }

      const imageUrl = findInMetadata(parsedMetadata, "image");
      const metadataName = findInMetadata(parsedMetadata, "name");
      const release_title = findInMetadata(parsedMetadata, "release_title");
      const release_type = findInMetadata(parsedMetadata, "release_type");
      const metadataVersion = findInMetadata(parsedMetadata, "music_metadata_version");

      const songTitles = findAllSongTitles(parsedMetadata);
      const { artists, releaseInfo } = findArtistsAndReleaseInfo(parsedMetadata, metadataVersion);
      const genres = findInMetadata(parsedMetadata, "genres");
      const producer = findInMetadata(parsedMetadata, "producer");

      return { 
        imageUrl: imageUrl, 
        name: metadataName, 
        artists: artists,
        releaseInfo: releaseInfo,
        releaseTitle: release_title,
        releaseType: release_type,
        songTitles: songTitles,
        genres: genres,
        producer: producer
      };
 
    } else {
      console.log("No rows found or invalid row structure");
      return { 
        imageUrl: null, 
        name: null, 
        artists: [], 
        releaseInfo: { links: {} },
        releaseType: null, 
        releaseTitle: null, 
        songTitles: null, 
        genres: null, 
        producer: null 
      };
    }
  } catch (error) {
    console.error('Failed to fetch metadata:', error);
    return { 
      imageUrl: null, 
      name: null, 
      artists: [], 
      releaseInfo: { links: {} },
      releaseType: null, 
      releaseTitle: null, 
      songTitles: null, 
      genres: null, 
      producer: null 
    };
  } finally {
    await connection.end();
  }
}