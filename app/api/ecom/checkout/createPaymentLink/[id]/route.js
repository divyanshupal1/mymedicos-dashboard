const format = {
    "amount": 1000,
    "currency": "INR",
    "accept_partial": true,
    "first_min_partial_amount": 100,
    "expire_by": 1691097057,
    "reference_id": "TSsd1989",
    "description": "Payment for policy no #23456",
    "customer": {
      "name": "Gaurav Kumar",
      "contact": "+919000090000",
      "email": "gaurav.kumar@example.com"
    },
    "notify": {
      "sms": true,
      "email": true
    },
    "reminder_enable": true,
    "notes": {
      "policy_name": "Jeevan Bima"
    },
    "callback_url": "https://example-callback-url.com/",
    "callback_method": "get"
}

export async function GET(req,{params}){
    console.log('GET request to /api/ecom/checkout/createPaymentLink')
    console.log(req)
    return new Response(params, {message: 'Hello World'});
}