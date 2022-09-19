export interface ICreateAccountForm {
  first_name: { name: string; value: string; error: string; type: string };
  last_name: { name: string; value: string; error: string; type: string };
  email: { name: string; value: string; error: string; type: string };
  password: { name: string; value: string; error: string; type: string };
  confirm_password: { name: string; value: string; error: string; type: string };
}
