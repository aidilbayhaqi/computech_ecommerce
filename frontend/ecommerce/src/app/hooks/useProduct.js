"use client";
import { useEffect, useState } from "react";
import { getAllProducts, getProductById } from "../services/product";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // optional
  const [error, setError] = useState(null); // optional

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, loading, error };
};

export const useProductById = (id) => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      const res = await getProductById(id);
      setProduct(res.products);

      setLoading(false);
    };

    fetch();
  }, [id]);

  return { product, loading };
};