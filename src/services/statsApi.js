const request = async (url, options) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
  console.log(`deepak: API_BASE_URL: ${apiBaseUrl}`);
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
