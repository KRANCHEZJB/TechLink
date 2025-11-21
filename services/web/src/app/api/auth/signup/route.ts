import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, email, password, phone } = data

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // For now, just log the user data
    console.log('New user signup:', { name, email, password, phone })

    // Respond with success
    return NextResponse.json(
      { message: 'User registered successfully', user: { name, email, phone } },
      { status: 201 }
    )
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

