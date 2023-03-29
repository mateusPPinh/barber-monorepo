export class CreateUserDto {
  email: string;
  name?: string;
  password: string;
  isAdmin: boolean;
}
