import User from './User.js';
import Plan from './Plan.js';
import Transaction from './Transaction.js';
import Admin from './Admin.js';

// Associations
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Plan.hasMany(Transaction, { foreignKey: 'planId' });
Transaction.belongsTo(Plan, { foreignKey: 'planId' });

User.belongsTo(Plan, { foreignKey: 'planId' });
Plan.hasMany(User, { foreignKey: 'planId' });

export { User, Plan, Transaction, Admin };
