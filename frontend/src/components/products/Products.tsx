import "./styles/Products.css";
import { getProducts, reset } from "../../redux/features/products/productSlice";
import { useSelector, RootStateOrAny, useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/users/cartSlice";
import { useEffect } from "react";
import Spinner from "../utils/Spinner";
import ProductList from "./ProductList";

function Products() {
  const dispatch = useDispatch();

  const { products, isLoading } = useSelector(
    (state: RootStateOrAny) => state.products,
  );

  useEffect((): any => {
    dispatch(getProducts());
    return () => dispatch(reset());
  }, [dispatch]);

  const handleAddToCart = (product: object) => {
    dispatch(addToCart(product));
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <section className="main-header">
        <h1>New Arrivals</h1>
      </section>
      {!products.length ? (
        <p>Store Is Under Construction , Sorry.</p>
      ) : (
        <ProductList moveToCart={handleAddToCart} products={products} />
      )}
    </>
  );
}

export default Products;
