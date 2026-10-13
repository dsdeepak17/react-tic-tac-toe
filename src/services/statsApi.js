const request = async (url, options) => {
  const apiBaseUrl = process.env.API_BASE_URL || '';
  const response = await fetch(`${apiBaseUrl}${url}`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Stats API request failed.');
  }

  return result;
};

export const archiveStats = (stats) =>
  request('/api/stat-archives', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stats),
  });

export const getStatArchives = (signal) =>
  request('/api/stat-archives', { signal });
