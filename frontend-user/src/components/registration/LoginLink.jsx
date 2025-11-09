import { Link } from "react-router-dom";

const LoginLink = () => {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-[#757575]">
        Already have an account? <Link className="font-medium text-[#DF826C] hover:underline" to="/login">login</Link>
      </p>
    </div>
  );
};

export default LoginLink;