import { getApiBaseUrl } from './env';

type ServerFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const { revalidate = 60, tags } = options;
  const url = `${getApiBaseUrl()}${path}`;

  const response = await fetch(url, {
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
