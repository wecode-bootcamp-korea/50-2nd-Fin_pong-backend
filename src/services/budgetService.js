const budgetDao = require('../models/budgetDao');
const error = require('../utils/error');

const postBudget = async (familyId, budget, year, month) => {
  try {
    return await budgetDao.postBudget(familyId, budget, year, month);
  } catch (err) {
    throw err;
  }
}

const getBudget = async (familyId) => {
  return await budgetDao.getBudget(familyId);
}

const getBudgetByYear = async (familyId, year) => {
  return await budgetDao.getBudgetByYear(familyId, year);
}

const getBudgetByYearMonth = async (familyId, year, month) => {
  return await budgetDao.getBudgetByYearMonth(familyId, year, month);
}

const updateBudget = async (familyId, budget, year, month) => {
  return await budgetDao.updateBudget(familyId, budget, year, month);
}

module.exports = {
  postBudget,
  getBudget,
  getBudgetByYear,
  getBudgetByYearMonth,
  updateBudget
}