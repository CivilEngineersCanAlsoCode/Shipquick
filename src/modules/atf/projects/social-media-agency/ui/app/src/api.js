const API = '/api';

export async function fetchPosts() {
  const res = await fetch(API + '/sma-fetch-past-posts');
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  return res.json();
}

export async function fetchConfig(configId = 'sma_main_config') {
  const res = await fetch(API + '/sma-fetch-config?config_id=' + encodeURIComponent(configId));
  if (!res.ok) throw new Error(`Failed to fetch config: ${res.status}`);
  return res.json();
}
