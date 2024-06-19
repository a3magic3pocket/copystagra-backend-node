export interface IUserCreateDto {
  email: string;
  openId: string;
  name: string;
  provider: string;
  role: string;
  isActive: boolean;
  locale?: string;
  description?: string;
  userImagePath?: string;
}
