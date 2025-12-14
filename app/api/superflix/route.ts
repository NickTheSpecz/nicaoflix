import { NextRequest, NextResponse } from 'next/server';

const SUPERFLIX_BASE_URL = 'https://superflixapi.run';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
  }

  try {
    const url = `${SUPERFLIX_BASE_URL}${endpoint}`;
    console.log('Proxying request to:', url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`SuperFlixAPI returned ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('SuperFlixAPI proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from SuperFlixAPI' },
      { status: 500 }
    );
  }
}
