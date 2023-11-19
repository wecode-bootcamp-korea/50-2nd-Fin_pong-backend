const budgetService = require('../services/budgetService');
const error = require('../utils/error');

const postBudget = async (req, res) => { // 관리자만 가능
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId || !roleId) { // roleId가 0이면 일반, 1이면 관리자이므로 일반 가입자면 에러를 냅니다.
      error.throwErr('400', 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    const { budget, year, month } = req.body;
    if (!budget || !year || !month) {
      error.throwErr(400, 'KEY_ERROR');
    }
    await budgetService.postBudget(familyId, budget, year, month);
    return res.status(200).json({message: 'POST_SUCCESS'});
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

const getBudgetByCondition = async (req, res) => {
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY');
    }
    else if (roleId !== 0 && roleId !== 1) {
      error.throwErr(400, 'BAD_USER');
    }
    const { year, month } = req.query;
    if (!year && month) { // 달만 있고 연도가 없는 경우  => 연도를 입력해 주세요
      error.throwErr(400, 'KEY_ERROR_CHOOSE_YEAR');
    }
    else if (!year && !month) { // 연도, 월의 조건이 없는 경우 => 해당 가족의 예산을 모두 보여 줍니다.
      const budget = await budgetService.getBudget(familyId);
      return res.status(200).json({message: 'GET_SUCCESS', 'budget': budget});
    }
    else if (year && !month) { // 연도 조건만 있고, 월 조건은 없는 경우 => 해당 연도의 모든 예산을 보여 줍니다.
      const budget = await budgetService.getBudgetByYear(familyId, year);
      return res.status(200).json({message: 'GET_SUCCESS', 'budget': budget});
    }
    const budget = await budgetService.getBudgetByYearMonth(familyId, year, month); // 연도, 월 조건 모두 있는 경우 => 해당 연, 월의 예산을 보여 줍니다.
    return res.status(200).json({message: 'GET_SUCCESS', 'budget': budget});
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

const updateBudget = async (req, res) => { // 관리자만 가능합니다.
  try {
    const { userId, familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr('400', 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    else if (!userId) {
      error.throwErr('400', 'TOKEN_KEY_ERROR');
    }
    const { budget, year, month } = req.body;
    if (!budget || !year || !month) {
      error.throwErr('400', 'KEY_ERROR');
    }
    await budgetService.updateBudget(familyId, budget, year, month);
    return res.status(200).json({message: 'PUT_SUCCESS'});
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

module.exports = {
  postBudget,
  getBudgetByCondition,
  updateBudget
}