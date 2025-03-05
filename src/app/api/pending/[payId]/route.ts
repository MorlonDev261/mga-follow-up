export async function GET(
  request: Request,
  { params }: { params: { payId: string } }
) {
  return new Response(JSON.stringify({ id: params.payId }), {
    headers: { "Content-Type": "application/json" },
  });
}
