const job = async () => {

  const preSend = await Account.findById(schedule.data.accountId)

  if (preSend.balance > schedule.data.amount) {
    try {
      const result = await send(schedule.data)

      await Account.findByIdAndUpdate(accountId, {
        "balance": preSend.balance - amount
      });

      const transaction = await Transaction.create({
        customerId,
        accountId: accountId,
        amount: result.amount,
        accountNumber: result.accountNumber,
        bankCode: result.account_bank,
        description: result.narration,
        fees: result.fee,
        bankName: result.bank_name,
        fullName: result.full_name,
      });
  
      res.status( StatusCodes.OK ).json({
        transaction
      });
    } catch (error) {
      console.log(error)
    }
  } else {
    return res.status( StatusCodes.BAD_REQUEST ).json({
      error: -1,
      msg: "Insufficient funds"
    })
  }
}

module.exports = job;