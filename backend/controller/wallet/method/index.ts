import { successRes, errRes } from "../../main";
import Wallet from "../../../model/wallet";

// Get or create wallet
async function getWallet(shopId: string) {
    try {
        let wallet = await Wallet.findOne({ shopId });
        if (!wallet) {
            wallet = await Wallet.create({ shopId, balance: 0, transactions: [] });
        }
        return successRes(wallet);
    } catch (error: any) {
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

// Request withdrawal
async function requestWithdrawal(shopId: string, amount: number) {
    try {
        const wallet = await Wallet.findOne({ shopId });
        if (!wallet) return errRes.DATA_NOT_FOUND({ message: "Wallet not found" });

        if (amount <= 0) {
            return errRes.BAD_REQUEST({ message: "จำนวนเงินต้องมากกว่า 0" });
        }

        if (amount > wallet.balance) {
            return errRes.BAD_REQUEST({ message: "ยอดเงินไม่เพียงพอ" });
        }

        wallet.balance -= amount;
        wallet.transactions.push({
            type: 'withdraw',
            amount: amount,
            description: `ถอนเงินเข้าบัญชีธนาคาร`,
            status: 'completed',
            createdAt: new Date()
        } as any);
        await wallet.save();

        return successRes(wallet);
    } catch (error: any) {
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

export default { getWallet, requestWithdrawal };
