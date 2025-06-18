'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { auth } from 'lib/firebase'; // Firebase Auth のインスタンス
import { addPurchases } from 'lib/firestore/purchases'; // Firestore 登録関数
import { useCartStore } from 'store/cartStore';

type FormData = {
  fullName: string;
  email: string;
  postalCode: string;
  address: string;
  paymentMethod: string;
};

export default function CheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart); // 送信後にカートを空にするため

  // フォーム送信時の処理
  // 省略...

  const onSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('ログインが必要です');
      return;
    }

    // 商品ID配列を作る
    const productIds = items.map((item) => item.id);

    // 購入履歴に一括登録
    await addPurchases(user.uid, productIds);

    // カートをクリア
    clearCart();

    alert('購入手続きが完了しました！');
    router.push('/');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-pink-50 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-pink-700">
        購入手続きフォーム
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* 氏名 */}
        <label className="block mb-2 font-semibold" htmlFor="fullName">
          氏名
        </label>
        <input
          id="fullName"
          {...register('fullName', { required: '氏名は必須です' })}
          className={`w-full p-2 mb-1 border rounded ${
            errors.fullName ? 'border-red-500' : 'border-pink-300'
          }`}
          placeholder="山田 太郎"
          type="text"
        />
        {errors.fullName && (
          <p className="text-red-600 mb-3">{errors.fullName.message}</p>
        )}

        {/* メールアドレス */}
        <label className="block mb-2 font-semibold" htmlFor="email">
          メールアドレス
        </label>
        <input
          id="email"
          {...register('email', {
            required: 'メールアドレスは必須です',
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: 'メールアドレスの形式が正しくありません',
            },
          })}
          className={`w-full p-2 mb-1 border rounded ${
            errors.email ? 'border-red-500' : 'border-pink-300'
          }`}
          placeholder="example@example.com"
          type="email"
        />
        {errors.email && (
          <p className="text-red-600 mb-3">{errors.email.message}</p>
        )}

        {/* 郵便番号 */}
        <label className="block mb-2 font-semibold" htmlFor="postalCode">
          郵便番号
        </label>
        <input
          id="postalCode"
          {...register('postalCode', {
            required: '郵便番号は必須です',
            pattern: {
              value: /^[0-9]{3}-?[0-9]{4}$/,
              message: '郵便番号の形式が正しくありません（例：123-4567）',
            },
          })}
          className={`w-full p-2 mb-1 border rounded ${
            errors.postalCode ? 'border-red-500' : 'border-pink-300'
          }`}
          placeholder="123-4567"
          type="text"
        />
        {errors.postalCode && (
          <p className="text-red-600 mb-3">{errors.postalCode.message}</p>
        )}

        {/* 住所 */}
        <label className="block mb-2 font-semibold" htmlFor="address">
          住所
        </label>
        <input
          id="address"
          {...register('address', { required: '住所は必須です' })}
          className={`w-full p-2 mb-1 border rounded ${
            errors.address ? 'border-red-500' : 'border-pink-300'
          }`}
          placeholder="東京都新宿区〇〇1-2-3"
          type="text"
        />
        {errors.address && (
          <p className="text-red-600 mb-3">{errors.address.message}</p>
        )}

        {/* 支払い方法 */}
        <label className="block mb-2 font-semibold" htmlFor="paymentMethod">
          支払い方法
        </label>
        <select
          id="paymentMethod"
          {...register('paymentMethod', {
            required: '支払い方法を選択してください',
          })}
          className={`w-full p-2 mb-4 border rounded ${
            errors.paymentMethod ? 'border-red-500' : 'border-pink-300'
          }`}
          defaultValue=""
        >
          <option value="" disabled>
            選択してください
          </option>
          <option value="creditCard">クレジットカード</option>
          <option value="bankTransfer">銀行振込</option>
          <option value="cashOnDelivery">代金引換</option>
        </select>
        {errors.paymentMethod && (
          <p className="text-red-600 mb-3">{errors.paymentMethod.message}</p>
        )}

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded transition disabled:opacity-50"
        >
          {isSubmitting ? '送信中...' : '購入手続きを完了する'}
        </button>
      </form>
    </div>
  );
}
