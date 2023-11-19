const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const postFixedMoneyFlow = async (userId, typeId, categoryId, memo, amount, year, month, date, transaction) => {
  const query = `INSERT INTO fixed_money_flows(user_id, flow_type_id, category_id, memo, amount, year, month, date)
      VALUES(?,?,?,?,?,?,?,?)`;
  const result = await transaction.query(query, [userId, typeId, categoryId, memo, amount, year, month, date]);
  if (result.insertId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  return result.insertId;
}

const postFixedMoneyFlowsGroup = async (transaction) => {
  const query = `INSERT INTO fixed_money_flows_group() 
    VALUES ()`;
  const result = await transaction.query(query);
  const mysqlId = result.insertId;
  if (mysqlId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  return mysqlId;
}

const postMiddleFixedMoneyFlow = async (fixedMoneyFlowId, fixedMoneyFlowsGroupId, transaction) => {
  const query = `INSERT INTO middle_fixed_money_flows(fixed_money_flow_id, fixed_money_flow_group_id) 
    VALUES(?,?)`;
  const result = await transaction.query(query, [fixedMoneyFlowId, fixedMoneyFlowsGroupId]);
  if (result.insertId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  return result;
}

const getFixedMoneyFlows = async(userId) => { // flow_type_id가 1이면 수입, 2이면 지출입니다.
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date 
    FROM fixed_money_flows 
    WHERE user_id = ?
    ORDER BY year DESC, month DESC, date DESC, amount DESC, flow_type_id, category_id
    `,
    [ userId ]
  )
}

const getFixedMoneyFlowsByYearMonth = async (userId, year, month) => { // 월별
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date 
    FROM fixed_money_flows 
    WHERE user_id = ?
    AND year = ? 
    AND month = ?
    ORDER BY date DESC, amount DESC, flow_type_id, category_id
    `,
    [userId, year, month]
  )
}

const getFixedMoneyFlowsByYearDate = async (userId, year, date) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date 
    FROM fixed_money_flows 
    WHERE user_id = ?
    AND year = ? 
    AND date = ?
    ORDER BY month DESC, amount DESC, flow_type_id, category_id
    `,
    [userId, year, date]
  )
}

const getFixedMoneyFlowsByYearMonthDate = async (userId, year, month, date) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date 
    FROM fixed_money_flows 
    WHERE user_id = ?
    AND year = ? 
    AND month = ?
    AND date = ?
    ORDER BY month DESC, amount DESC, flow_type_id, category_id
    `,
    [userId, year, month, date]
  )
}

const getGroupIdsByFlowId = async (fixedFlowId) => {
  return await appDataSource.query(
    `
    SELECT fixed_money_flow_group_id as groupId 
    FROM middle_fixed_money_flows 
    WHERE fixed_money_flow_id = ?
    `,
    [fixedFlowId]
  )
}

const getFlowIdsByGroupId = async (groupId) => { // 그룹 전체 삭제, 부분 삭제에 쓸 수 있습니다.
  return await appDataSource.query(
    `
    SELECT fixed_money_flow_id as flowId
    FROM middle_fixed_money_flows
    WHERE fixed_money_flow_group_id = ?
    `,
    [groupId]
  )
}

const updateFixedMoneyFlows = async (flowId, amount, typeId, categoryId, memo, transaction) => {
  const query = `UPDATE fixed_money_flows 
    SET amount = ?, flow_type_id = ?, category_id = ?, memo = ?
    WHERE id = ?`;
  return await transaction.query(query, [amount, typeId, categoryId, memo, flowId]);
}

const selectDeletedFixedMoneyFlowsByDate = async (flowId, year, month, date, transaction) => {
  const query = `SELECT id FROM fixed_money_flows
    WHERE (id = ? AND year = ? AND month > ?)
    OR (id = ? AND year = ? AND month = ? AND date >= ?)
    OR (id = ? AND year > ?)`;

  // Execute the query and retrieve the result
  const result = await transaction.query(query, [flowId, year, month, flowId, year, month, date, flowId, year]);

  // Check if there are any rows in the result
  if (result.length > 0) {
    // Return the first id from the result (assuming the query returns only one row)
    return result[0];
  } else {
    // If no rows match the criteria, you may want to handle this case accordingly
    return await result; // or throw an error, or return a default value, etc.
  }
};
const deleteFixedMoneyFlowsByDate = async (flowId, year, month, date, transaction) => { // array 안에 obj.id = 1, 2, 4, ..
  const query = `DELETE FROM fixed_money_flows
    WHERE (id = ? AND year = ? AND month > ?)
    OR (id = ? AND year = ? AND month = ? AND date >= ?)
    OR (id = ? AND year > ?);`;
  const result = await transaction.query(query, [flowId, year, month, flowId, year, month, date, flowId, year]);
  return result;
}

const deleteMiddleFixedFlowsByIds = async (deletedId, groupId, transaction) => {
  const query = `DELETE FROM middle_fixed_money_flows 
    WHERE id = ?
    AND fixed_money_flow_group_id = ?`;
  const result = transaction.query(query, [deletedId, groupId])
  if (result.affectedRows === 0) {
    error.throwErr(409, 'NOT_EXISTING_OR_ALREADY_DELETED');
  }
  return result;
}

module.exports = {
  postFixedMoneyFlow,
  postFixedMoneyFlowsGroup,
  postMiddleFixedMoneyFlow,
  getFixedMoneyFlows,
  getFixedMoneyFlowsByYearMonth,
  getFixedMoneyFlowsByYearDate,
  getFixedMoneyFlowsByYearMonthDate,
  getGroupIdsByFlowId,
  getFlowIdsByGroupId,
  updateFixedMoneyFlows,
  selectDeletedFixedMoneyFlowsByDate,
  deleteFixedMoneyFlowsByDate,
  deleteMiddleFixedFlowsByIds
}
