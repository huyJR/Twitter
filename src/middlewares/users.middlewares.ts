import { error } from 'console' // Không cần thiết và nên xóa
import { Request, Response, NextFunction } from 'express' // Nhập các kiểu dữ liệu Request, Response, và NextFunction từ Express
import { checkSchema } from 'express-validator' // Nhập hàm checkSchema từ express-validator
import usersService from '~/services/user.services' // Nhập dịch vụ người dùng từ user.services
import { validate } from '~/utils/validation' // Nhập hàm validate từ utils/validation


// Middleware để xác thực dữ liệu đăng nhập
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body // Lấy email và password từ body của yêu cầu
  if (!email || !password) {
    // Kiểm tra nếu email hoặc password bị thiếu
    return res.status(400).json({
      error: 'Missing email or password' // Trả về lỗi 400 nếu thiếu email hoặc password
    })
  }
  next() // Gọi hàm next() để tiếp tục xử lý yêu cầu nếu không có lỗi
}

// Middleware để xác thực dữ liệu đăng ký
export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true, // Kiểm tra không được rỗng
      isString: true, // Kiểm tra phải là chuỗi
      isLength: {
        options: { min: 1, max: 100 } // Độ dài từ 1 đến 100 ký tự
      },
      trim: true // Loại bỏ khoảng trắng ở đầu và cuối
    },
    email: {
      notEmpty: true, // Kiểm tra không được rỗng
      isEmail: true, // Kiểm tra định dạng email hợp lệ
      trim: true, // Loại bỏ khoảng trắng ở đầu và cuối
      custom: {
        options: async (value) => {
          const isExisEmail = await usersService.checkEmailExist(value) // Kiểm tra email đã tồn tại trong cơ sở dữ liệu chưa
          if (isExisEmail) {
            throw new Error('Email already exists') // Nếu email tồn tại, ném lỗi
          }
          return true // Nếu không, trả về true
        }
      }
    },
    password: {
      notEmpty: true, // Kiểm tra không được rỗng
      isLength: {
        options: { min: 6, max: 50 } // Độ dài từ 6 đến 50 ký tự
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1 // Mật khẩu phải chứa ít nhất 1 ký tự thường, 1 ký tự hoa, 1 chữ số và 1 ký tự đặc biệt
        },
        errorMessage:
          'Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol' // Thông báo lỗi nếu mật khẩu không mạnh
      }
    },
    confirm_password: {
      notEmpty: true, // Kiểm tra không được rỗng
      isLength: {
        options: { min: 6, max: 50 } // Độ dài từ 6 đến 50 ký tự
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1 // Mật khẩu phải chứa ít nhất 1 ký tự thường, 1 ký tự hoa, 1 chữ số và 1 ký tự đặc biệt
        },
        errorMessage:
          'Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol' // Thông báo lỗi nếu mật khẩu không mạnh
      },
      custom: {
        options: (value: any, { req }: any) => {
          if (value !== req.body.password) {
            // Kiểm tra xem confirm_password có khớp với password không
            throw new Error('Password confirmation does not match password') // Nếu không khớp, ném lỗi
          }
          return true // Nếu khớp, trả về true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true // Kiểm tra định dạng ngày tháng theo chuẩn ISO 8601
        }
      }
    }
  })
)
