import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Standardizes API responses and catches common errors like Zod validation 
 * or generic server errors.
 */
export async function apiAction(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    console.error('[API Error]:', error);

    // Handle Zod validation errors (400)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    // Handle generic Errors with custom messages (400)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Default server error (500)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
