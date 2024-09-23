export interface Artist {
  name: string;
  links: Record<string, string | string[]>;
}

export interface ReleaseInfo {
  links: Record<string, string | string[]>;
}

export interface MetadataResult {
  imageUrl: string | null;
  name: string | null;
  artists: Artist[];
  releaseInfo: ReleaseInfo;
  releaseType: string | null;
  releaseTitle: string | null;
  songTitles: string[] | null;
  genres: string[] | null;
  producer: string | null;
}

export function findInMetadata(obj: any, key: string): any {
  if (obj.k && obj.k.string === key && obj.v) {
    return obj.v.string || (Array.isArray(obj.v.list) ? obj.v.list.map((item: any) => item.string) : null);
  }
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = findInMetadata(item, key);
      if (result !== null) return result;
    }
  }
  if (typeof obj === 'object' && obj !== null) {
    for (const objKey in obj) {
      const result = findInMetadata(obj[objKey], key);
      if (result !== null) return result;
    }
  }
  return null;
}

export function findAllSongTitles(metadata: any): string[] {
  const songTitles: string[] = [];

  const traverse = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) return;

    if (obj.k && obj.k.string === "song_title" && obj.v && obj.v.string) {
      songTitles.push(obj.v.string);
    }

    for (const key in obj) {
      traverse(obj[key]);
    }
  };

  traverse(metadata);
  return songTitles;
}

export function findArtistsAndReleaseInfo(metadata: any, version: string | null): { artists: Artist[], releaseInfo: ReleaseInfo } {
  const artistMap = new Map<string, Artist>();
  const releaseInfo: ReleaseInfo = { links: {} };

  const traverse = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) return;

    if (obj.k && (obj.k.string === "artists" || obj.k.string === "featured_artist")) {
      const artists = obj.v.string ? [obj.v.string] : 
                      (Array.isArray(obj.v.list) ? obj.v.list.map((item: any) => item.string).filter(Boolean) : []);
      artists.forEach((artist: string) => {
        if (!artistMap.has(artist)) {
          artistMap.set(artist, { name: artist, links: {} });
        }
      });
    }

    // Handle the new metadata format
    if (obj.k && obj.k.string === "files" && obj.v && Array.isArray(obj.v.list)) {
      obj.v.list.forEach((file: any) => {
        if (file.map) {
          file.map.forEach((item: any) => {
            if (item.k && item.k.string === "song" && item.v && item.v.map) {
              item.v.map.forEach((songItem: any) => {
                if (songItem.k && songItem.k.string === "artists" && songItem.v && Array.isArray(songItem.v.list)) {
                  songItem.v.list.forEach((artistItem: any) => {
                    if (artistItem.map) {
                      artistItem.map.forEach((artistData: any) => {
                        const artistName = artistData.k.string;
                        if (!artistMap.has(artistName)) {
                          artistMap.set(artistName, { name: artistName, links: {} });
                        }
                        if (artistData.v && artistData.v.map) {
                          artistData.v.map.forEach((linkData: any) => {
                            if (linkData.k && linkData.k.string === "links" && linkData.v && linkData.v.map) {
                              linkData.v.map.forEach((link: any) => {
                                if (link.k && link.k.string && link.v) {
                                  const linkValue = link.v.string || (Array.isArray(link.v.list) ? link.v.list.map((item: any) => item.string) : null);
                                  if (linkValue) {
                                    artistMap.get(artistName)!.links[link.k.string] = linkValue;
                                  }
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }

    if (obj.k && obj.k.string === "links" && obj.v && obj.v.map) {
      obj.v.map.forEach((link: any) => {
        if (link.k && link.k.string) {
          if (link.v.string) {
            releaseInfo.links[link.k.string] = link.v.string;
          } else if (link.v.map) {
            const artistName = link.k.string;
            if (!artistMap.has(artistName)) {
              artistMap.set(artistName, { name: artistName, links: {} });
            }
            link.v.map.forEach((artistLink: any) => {
              if (artistLink.k && artistLink.k.string && artistLink.v && artistLink.v.string) {
                artistMap.get(artistName)!.links[artistLink.k.string] = artistLink.v.string;
              }
            });
          }
        }
      });
    }

    for (const key in obj) {
      traverse(obj[key]);
    }
  };

  traverse(metadata);

  return {
    artists: Array.from(artistMap.values()),
    releaseInfo
  };
}