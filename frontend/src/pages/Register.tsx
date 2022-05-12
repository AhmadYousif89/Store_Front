import { reset, register } from "../redux/features/users/userSlice";
import { useSelector, useDispatch, RootStateOrAny } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { IoPersonCircleOutline } from "react-icons/io5";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isSuccess, isLoading, isError, message } = useSelector(
    (state: RootStateOrAny) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (user) {
      if (isSuccess) toast.success(message);
      navigate(`/products`);
    }
    dispatch(reset());
  }, [user, isSuccess, isError, message, navigate, dispatch]);

  const handleForm = (e: { target: { name: string; value: string } }) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Password does not match !");
    } else {
      const user = {
        name,
        email,
        password,
      };
      dispatch(register(user));
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <section className="heading">
        <h1>Create new account </h1>
        <p>FREE REGISTERATION</p>
      </section>
      <section className="form">
        <form onSubmit={handleSubmit}>
          <div className="form-content">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={name}
                placeholder="Enter your name"
                onChange={handleForm}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={handleForm}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                placeholder="Enter password"
                onChange={handleForm}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password2"
                name="password2"
                value={password2}
                placeholder="Confirm password"
                onChange={handleForm}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-block">
                S U B M I T
              </button>
            </div>
          </div>
          <p className="form-link">
            Already have an account ?{" "}
            <Link to="/login" id="form-link">
              LOGIN <IoPersonCircleOutline />
            </Link>
          </p>
        </form>
      </section>
    </>
  );
}

export default Register;
