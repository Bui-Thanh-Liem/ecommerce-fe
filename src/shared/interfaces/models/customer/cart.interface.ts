import { CartStatus } from '@/shared/enums/cart-status.enum';
import { ICartItem } from './cart-item.interface';
import { IBase } from '../../common/base.interface';
import { ICustomer } from './customer.interface';
import { IVoucher } from './voucher.interface';

export interface ICart extends IBase {
  customer: ICustomer;
  session: string; // Guest
  totalItems: number;
  totalPrice: number;
  vouchers?: IVoucher[]; // Có thể null nếu không áp dụng voucher nào
  status: CartStatus; // Trạng thái của giỏ hàng, ví dụ: ACTIVE, ORDERED, ABANDONED

  //
  cartItems?: ICartItem[]; // Danh sách các CartItem trong giỏ hàng
}
