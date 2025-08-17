import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from 'sonner';

const initialState = {
  email: '',
  password: ''
}

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then(data=>{
      if(data?.payload?.success){
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Sign in to your account to continue
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <CommonForm
          formControls={loginFormControls}
          buttonText={'Sign In'}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Don't have an account?{' '}
            <Link 
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors" 
              to='/auth/register'
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthLogin;