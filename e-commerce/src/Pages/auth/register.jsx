import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'sonner';

function AuthRegister() {
  const initialState = {
    userName: '',
    email: '',
    password: ''
  }

  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
   
  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data)=> {
      if(data?.payload?.success) {
        toast.success(data?.payload?.message)
        navigate("/auth/login");
      }else {
        toast.error(data?.payload?.message)
      }
    });
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Join us today and start shopping
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <CommonForm
          formControls={registerFormControls}
          buttonText={'Create Account'}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Already have an account?{' '}
            <Link 
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors" 
              to='/auth/login'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthRegister;