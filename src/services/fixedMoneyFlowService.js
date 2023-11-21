const fixedMoneyFlowDao = require('../models/fixedMoneyFlowDao');
const error = require('../utils/error');

const getUsedFixedMoneyFlowsByYearMonthAndGetAmount = async (userId, year, month) => { // 월 별 고정 지출 사용량을 합산합니다.
  let typeId = 2;
  const flows = await fixedMoneyFlowDao.getUsedOrGotFixedMoneyFlowsByYearMonth(userId, typeId, year, month);
  const mapped = await Promise.all(flows.map( async (flow) => ({
      amount: flow.amount,
    }
  )));
  return mapped.reduce((acc, allowance) => acc + allowance.amount, 0);
}

module.exports = {
  getUsedFixedMoneyFlowsByYearMonthAndGetAmount
}