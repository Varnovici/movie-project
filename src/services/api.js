export const getPaginatedProducts = async (pageNo, pageQty) => {
  const skip = pageNo * pageQty;
  const res = await fetch(
    `https://dummyjson.com/products?skip=${skip}&limit=${pageQty}`
  );
  const data = await res.json();
  return data;
};
