export enum UserVerifyStatus {
  Unverified, // Chưa xác thực email, mặc định là 0
  Verified, // Đã xác thực email
  Banned // Bị khóa
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}
