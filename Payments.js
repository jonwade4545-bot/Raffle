Raffle payment client

const SUPABASE_FUNCTION_URL =
  "https://ldvnshfoqjdwglbhvyxe.supabase.co/functions/v1/Create-checkout-";

export async function startPayment(promotionId) {
  if (!promotionId) {
    throw new Error("Promotion ID is required.");
  }

  const response = await fetch(SUPABASE_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      promotionId
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to start payment.");
  }

  const data = await response.json();

  if (!data.checkoutUrl) {
    throw new Error("Checkout URL was not returned.");
  }

  window.location.href = data.checkoutUrl;
}
