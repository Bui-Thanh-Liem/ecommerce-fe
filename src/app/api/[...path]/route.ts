const API_KEY = process.env.SERVER_API_KEY
const BE_URL = process.env.SERVER_API_URL

async function handler(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const url = new URL(req.url)
    const path = (await params)?.path?.join("/")
    const hasBody = req.method !== "GET" && req.method !== "HEAD"

    const headers: Record<string, string> = {
      "x-api-key": API_KEY!,
    }

    // Forward Content-Type nếu không phải FormData
    const contentType = req.headers.get("content-type")
    if (contentType) {
      headers["Content-Type"] = contentType
    }

    // 👇 Forward cookie từ browser lên BE
    const cookieHeader = req.headers.get("cookie")
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader
    }

    //
    const text = await req.text()
    const res = await fetch(`${BE_URL}/${path}?${url.searchParams}`, {
      method: req.method,
      headers,
      ...(hasBody && {
        body: text,
        duplex: "half",
      }),
    } as RequestInit)

    // Forward tất cả headers từ BE về browser (bao gồm Set-Cookie)
    const responseHeaders = new Headers()
    res.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase()

      // 👇 KHÔNG forward các header liên quan đến mã hóa nội dung và độ dài
      if (lowerKey === "content-encoding" || lowerKey === "content-length") {
        return
      }

      if (lowerKey === "set-cookie") {
        responseHeaders.append(key, value)
      } else {
        responseHeaders.set(key, value)
      }
    })

    return new Response(res.body, {
      status: res.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Error occurred while fetching API:", error)
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export const GET = handler
export const PATCH = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
