const categoryDao = require('../models/categoryDao');
const error = require('../utils/error');

const getCategory = async (type) => {
  const categoryTypes = {
    '지출' : [1, 2, 3],
    '수입' : [4]
  }

  const categories = await categoryDao.getCategoriesByIds(categoryTypes[type]);
  categories.map((category) => { category.type = type })

  return categories;
}

module.exports = {
  getCategory
}
