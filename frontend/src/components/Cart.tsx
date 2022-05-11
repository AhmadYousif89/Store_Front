import { useEffect } from "react";
import * as Hi from "react-icons/hi";
import { MdRemoveShoppingCart } from "react-icons/md";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  decrement,
  displayCartInfo,
  emptyCart,
  increment,
  removeProduct,
} from "../redux/features/users/cartSlice";
import "./styles/Cart.css";

function ShoppingCart() {
  const emptyCartImg =
    window.location.origin + "/assets/empty-shopping-cart.png";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, totalAmount } = useSelector(
    (state: RootStateOrAny) => state.cart,
  );
  const { user } = useSelector((state: RootStateOrAny) => state.auth);

  useEffect(() => {
    dispatch(displayCartInfo());
  }, [cart, dispatch]);

  const handleEmptyCart = () => {
    dispatch(emptyCart());
    navigate("/");
  };

  const handleCheckout = () => {
    if (!user) {
      toast.info("please login first");
      navigate("/login");
    } else {
      toast.info("to be implemented");
    }
  };

  return (
    <section>
      <h1 className="cart-titel">Shopping Cart</h1>
      {!cart?.length ? (
        <div className="cart-empty">
          <p>Your cart is currently empty . . . </p>
          <img src={emptyCartImg} alt="empty-cart" width={"400px"} />
          <p className="go-back" onClick={() => navigate("/")}>
            <Hi.HiArrowNarrowLeft /> Start Shopping
          </p>
        </div>
      ) : (
        <section className="cart-container">
          <div className="cart-headers">
            <h3 id="product-titel">Product</h3>
            <h3 id="product-price">Price</h3>
            <h3 id="product-quantity">Quantity</h3>
            <h3 id="product-total">Total</h3>
          </div>
          <div className="cart-products-details">
            {cart.map((item: any) => (
              <div className="cart-item" key={item.p_id}>
                <div className="item-card">
                  <img src={item.image_url} alt={item.p_name} />
                  <div className="item-details">
                    <p id="item-brand">{item.brand}</p>
                    <p id="item-name">{item.p_name}</p>
                    <p id="item-color">
                      color: <br /> {item.color}
                    </p>
                    <button
                      id="item-btn"
                      onClick={() => dispatch(removeProduct(item))}>
                      <Hi.HiShoppingCart /> Remove
                    </button>
                  </div>
                </div>
                <div id="item-price">
                  <span>$</span> <>{item.price}</>
                </div>
                <div id="item-quantity">
                  <Hi.HiOutlineMinusCircle
                    onClick={() => dispatch(decrement(item))}
                  />
                  <p id="item-count">{item.quantity}</p>
                  <Hi.HiOutlinePlusCircle
                    onClick={() => dispatch(increment(item))}
                  />
                </div>
                <div id="item-total">
                  <span>$</span> {item.quantity * item.price}
                </div>
              </div>
            ))}
          </div>
          <div className="cart-details">
            <div className="clear-cart" onClick={handleEmptyCart}>
              <MdRemoveShoppingCart />
            </div>
            <div className="cart-checkout">
              <div className="subtotal">
                <p>SUBTOTAL</p>
                <p>
                  <span>$</span>
                  {totalAmount}
                </p>
              </div>
              <p id="checkout-text">
                Taxes and shipping calculated at checkout
              </p>
              <button id="checkout-btn" onClick={handleCheckout}>
                CHECK OUT
              </button>
              <p className="go-back checkout" onClick={() => navigate("/")}>
                <Hi.HiArrowNarrowLeft /> Continue Shopping
              </p>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}

export default ShoppingCart;
