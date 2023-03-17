import { jest } from "@jest/globals";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";

describe("voucher services unit test suit", () => {
  it(`should respond with "Voucher already exist"`, async () => {
    const code = "RANDOM_CODE";
    const discount = 0.1;

    const voucher = {
      id: 1,
      code: code,
      discount: discount,
      used: false,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockResolvedValueOnce(voucher);

    const result = voucherService.createVoucher(code, discount);

    expect(result).rejects.toEqual({
      type: "conflict",
      message: "Voucher already exist.",
    });
  });

  it(`should create a new voucher`, async () => {
    const code = "RANDOM_CODE";
    const discount = 1;

    const voucher = {
      id: 1,
      code: code,
      discount: discount,
      used: false,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(voucherRepository, "createVoucher")
      .mockImplementationOnce((): any => {
        return { code: voucher.code, discount: voucher.discount };
      });

    const result = await voucherService.createVoucher(code, discount);
    console.log(result);
    expect(result).toBeUndefined();
  });

  it(`should respond with "Voucher not exist."`, async () => {
    const code = "RANDOM_CODE";
    const discount = 1;
    const amount = 101;

    const voucher = {
      id: 1,
      code: code,
      discount: discount,
      used: false,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {});

    const result = voucherService.applyVoucher(code, amount);

    expect(result).rejects.toEqual({
      type: "conflict",
      message: "Voucher does not exist.",
    });
  });

  it(`should respond with amout not allowed`, async () => {
    const code = "RANDOM_CODE";
    const discount = 10;

    const amount = 99;

    const voucher = {
      id: 1,
      code: code,
      discount: discount,
      used: false,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return voucher;
      });

    const result = await voucherService.applyVoucher(code, amount);

    expect(result).toEqual({
      amount: amount,
      discount: discount,
      finalAmount: amount,
      applied: false,
    });
  });

  it(`should respond with voucher already used`, async () => {
    const code = "RANDOM_CODE";
    const discount = 10;

    const amount = 101;

    const voucher = {
      id: 1,
      code: code,
      discount: discount,
      used: true,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return voucher;
      });

    const result = await voucherService.applyVoucher(code, amount);

    expect(result).toEqual({
      amount: amount,
      discount: discount,
      finalAmount: amount,
      applied: false,
    });
  });

  it(`should apply voucher`, async () => {
    const code = "RANDOM_CODE";
    const discount = 10;

    const amount = 101;

    const voucher = {
      id: 1,
      code: code,
      discount: discount,
      used: false,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return voucher;
      });

    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {});

    const result = await voucherService.applyVoucher(code, amount);

    expect(result).toEqual({
      amount: amount,
      discount: discount,
      finalAmount: amount - amount * (discount / 100),
      applied: true,
    });
  });
});
