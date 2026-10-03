import { NextResponse, type NextRequest } from 'next/server'
import {
  buildBackendUrl,
  buildProxyRequestHeaders,
} from '@/lib/api/proxy'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = { params: { path: string[] } }

async function proxyRequest(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const targetUrl = buildBackendUrl(context.params.path ?? [], request.nextUrl.search)
  const headers = buildProxyRequestHeaders(request)

  const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(request.method)
  const body = hasBody ? await request.arrayBuffer() : undefined

  let upstream: Response
  try {
    upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upstream request failed'
    return NextResponse.json(
      {
        detail: `API proxy error: ${message}. Check API_BACKEND_URL and that the backend is reachable.`,
      },
      { status: 502 },
    )
  }

  const responseHeaders = new Headers()
  const contentType = upstream.headers.get('content-type')
  if (contentType) responseHeaders.set('content-type', contentType)

  return new NextResponse(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function OPTIONS(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context)
}
