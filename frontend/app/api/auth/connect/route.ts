import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    return NextResponse.json(
        { error: 'Not implemented. Please use the backend API directly.' },
        { status: 501 }
    );
}
