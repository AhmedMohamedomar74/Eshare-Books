import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const LoginLink = () => {
  const { content } = useSelector((state) => state.lang);

  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-[#757575]">
        {content.login.noAccount} <Link className="font-medium text-[#DF826C] hover:underline" to="/login">{content.login.signUp}</Link>
      </p>
    </div>
  );
};

export default LoginLink;