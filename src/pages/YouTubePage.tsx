import { useEffect, useState } from 'react';
import { Youtube, Play, Users, Eye, Video, AlertCircle } from 'lucide-react';
import styles from './YouTubePage.module.css';

type YouTubeData = {
  channel: {
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
    title: string;
    customUrl: string;
    thumbnail: string;
  };
  videos: Array<{
    id: string;
    title: string;
    description: string;
    publishedAt: string;
    thumbnail: string;
    viewCount?: string;
    likeCount?: string;
  }>;
};

export default function YouTubePage() {
  const [data, setData] = useState<YouTubeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/youtube');
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || 'Failed to fetch YouTube feed');
        }

        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="app-loading">Syncing with YouTube...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.error}>
        <AlertCircle size={48} />
        <h2>Live Feed Unavailable</h2>
        <p>{error || 'Please check back later.'}</p>
        <button onClick={() => window.location.reload()} className="btn-secondary" style={{ marginTop: 20 }}>
          Retry Sync
        </button>
      </div>
    );
  }

  const { channel, videos } = data;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <span className="subheading">Live from Channel</span>
          <h1 className="serif">Impact in <span className="text-gradient">Motion</span></h1>
          <p>Real-time updates and stories from our YouTube channel. Watch how your support is changing lives across Uganda.</p>
        </div>

        <a
          href={`https://youtube.com/${channel.customUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.channelCard}
        >
          <img src={channel.thumbnail} alt={channel.title} className={styles.channelThumb} />
          <div className={styles.channelStats}>
            <span className={styles.channelTitle}>{channel.title}</span>
            <div className={styles.statRow}>
              <span className={styles.statItem}><Users size={12} /> <strong>{Number(channel.subscriberCount).toLocaleString()}</strong> subscribers</span>
              <span className={styles.statItem}><Video size={12} /> <strong>{Number(channel.videoCount).toLocaleString()}</strong> videos</span>
            </div>
          </div>
        </a>
      </header>

      <div className={styles.grid}>
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.videoCard}
          >
            <div className={styles.thumbWrapper}>
              <img src={video.thumbnail} alt={video.title} className={styles.thumbnail} />
              <div className={styles.playOverlay}>
                <Play fill="white" size={48} />
              </div>
            </div>
            <div className={styles.videoInfo}>
              <h3 className={styles.videoTitle}>{video.title}</h3>
              <div className={styles.videoMeta}>
                <span>{new Date(video.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Eye size={14} /> {Number(video.viewCount).toLocaleString()}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {videos.length === 0 && (
        <div className={styles.error}>
          <Youtube size={48} />
          <p>No recent videos found. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
