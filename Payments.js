Raffle payment client

export async function startPayment(promotionId) {
  if (!promotionId) {
    throw new Error("Promotion ID is required.");
  }

  const response = await fetch(
    "YOUR_SUPABASE_FUNCTION_URL",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        promotionId
      })
    }
  );

  if (!response.ok) {
    throw new Error("Unable to start payment.");
  }

  const data = await response.json();

  if (!data.checkoutUrl) {
    throw new Error("Checkout URL was not returned.");
  }

  window.location.href = data.checkoutUrl;
}
Paste that into the big “Enter
