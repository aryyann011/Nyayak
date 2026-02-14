const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const SUPABASE_FUNCTION_URL =
  `${supabaseUrl}/functions/v1/create-order`;

export const createOrder = async (amount) => {
  const res = await fetch(SUPABASE_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });

  if (!res.ok) {
    throw new Error("Failed !!");
  }

  return res.json();
};
