export async function GET(req,res){
    console.log('GET request to /api/ecom/checkout/webhook')
    console.log(req)
    return new Response(200, {message: 'Hello World'});
}
export async function POST(req,res){
    console.log('POST request to /api/ecom/checkout/webhook')
    const body = await req.json()
    console.log(JSON.stringify(body))
    return new Response(200, {message: 'Hello World'});
}