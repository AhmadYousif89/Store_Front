import { useSelector, RootStateOrAny, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { getProducts } from "../redux/features/products/productSlice";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import "./styles/Products.css";
import { createOrder } from "../redux/features/orders/orderSlice";
import { addToCart } from "../redux/features/users/cartSlice";

function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootStateOrAny) => state.auth);

  const { products, isLoading } = useSelector(
    (state: RootStateOrAny) => state.products,
  );

  const { cart } = useSelector((state: RootStateOrAny) => state.user_cart);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleAddToCart = (product: object) => {
    if (user) {
      dispatch(createOrder({ userId: user.data.user_id }));
      dispatch(addToCart(product));
    } else {
      toast.info("please login first");
      navigate("/login");
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <section className="heading">
        <h1>New Arrivals</h1>
      </section>
      {!products.length ? (
        <p>Store Is Empty Right Now , Sorry.</p>
      ) : (
        <section className="products">
          {products.map((product: any) => (
            <ul className="product-card" key={product.p_id}>
              <div id="img-card">
                <img src={product.image_url} alt={product.p_name} />
              </div>
              <div className="card_details">
                <p id="brand">{product.brand}</p>
                <h5>{product.p_name}</h5>
                <p>{product.description}</p>
                <span className="price-tag">
                  <span>$</span> <p id="price">{product.price}</p>
                  <IoIosColorPalette />
                  <p id="color">{product.color}</p>
                </span>
                <button
                  className="btn-card"
                  onClick={() => handleAddToCart(product)}>
                  <FaShoppingCart /> Add to cart
                </button>
              </div>
            </ul>
          ))}
        </section>
      )}
    </>
  );
}

export default Products;
