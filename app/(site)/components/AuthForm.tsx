// Import các module và thư viện cần thiết từ React và Next.js
'use client';
import axios from "axios";
import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { BsGithub, BsGoogle  } from 'react-icons/bs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";

// Import các thành phần (components) khác trong ứng dụng
import Input from "@/app/components/inputs/Input";
import AuthSocialButton from './AuthSocialButton';
import Button from "@/app/components/Button";
import { toast } from "react-hot-toast";

// Định nghĩa kiểu dữ liệu Variant
type Variant = 'LOGIN' | 'REGISTER';

// Định nghĩa và xuất ra component AuthForm
const AuthForm = () => {
  // Sử dụng hook useSession từ next-auth để quản lý trạng thái đăng nhập
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN'); // Hook để quản lý biến variant (LOGIN hoặc REGISTER)
  const [isLoading, setIsLoading] = useState(false); // Hook để quản lý trạng thái loading

  // Hiệu ứng chuyển trang nếu người dùng đã đăng nhập
  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/conversations');
    }
  }, [session?.status, router]);

  // Hàm chuyển đổi giữa LOGIN và REGISTER
  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  // Sử dụng React Hook Form để quản lý biểu mẫu và các trạng thái liên quan
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  // Xử lý submit form
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Xử lý đăng ký nếu variant là REGISTER
    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
      .then(() => signIn('credentials', {
        ...data,
        redirect: false,
      }))
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations');
        }
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false));
    }

    // Xử lý đăng nhập nếu variant là LOGIN
    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false
      })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations');
        }
      })
      .finally(() => setIsLoading(false));
    }
  }

  // Xử lý đăng nhập với tài khoản mạng xã hội
  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations');
        }
      })
      .finally(() => setIsLoading(false));
  }

  // JSX để hiển thị giao diện của component
  return ( 
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div 
        className="
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form 
          className="space-y-6" 
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Render input cho tên nếu là trang đăng ký */}
          {variant === 'REGISTER' && (
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="name" 
              label="Name"
            />
          )}
          {/* Render input cho email và password */}
          <Input 
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="email" 
            label="Email address" 
            type="email"
          />
          <Input 
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="password" 
            label="Password" 
            type="password"
          />
          {/* Button để submit form */}
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>

        {/* Phần xử lý đăng nhập bằng tài khoản mạng xã hội */}
        <div className="mt-6">
          <div className="relative">
            <div 
              className="
                absolute 
                inset-0 
                flex 
                items-center
              "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Hiển thị các nút đăng nhập bằng mạng xã hội */}
          <div className="mt-6 flex gap-2">
            <AuthSocialButton 
              icon={BsGithub} 
              onClick={() => socialAction('github')} 
            />
            <AuthSocialButton 
              icon={BsGoogle} 
              onClick={() => socialAction('google')} 
            />
          </div>
        </div>

        {/* Hiển thị phần chuyển đổi giữa đăng nhập và đăng ký */}
        <div 
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
        >
          <div>
            {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'} 
          </div>
          <div 
            onClick={toggleVariant} 
            className="underline cursor-pointer"
          >
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
}

// Xuất component AuthForm để sử dụng ở các nơi khác trong ứng dụng
export default AuthForm;
