import { Sequelize, DataTypes, Model } from 'sequelize';

// Use DATABASE_URL from .env
const connectionString = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/wall';

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
});

// -- Define Models --

// User Model
class User extends Model {}
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  socialLinks: {
    type: DataTypes.JSONB,
    defaultValue: {},
  }
}, { sequelize, modelName: 'User' });

// Wall Model
class Wall extends Model {}
Wall.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  privacy: {
    type: DataTypes.ENUM('PUBLIC', 'PRIVATE'),
    defaultValue: 'PUBLIC',
  },
  allowAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, { sequelize, modelName: 'Wall' });

// Note Model
class Note extends Model {}
Note.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '0', // Storing index or hex
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  wallId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, { sequelize, modelName: 'Note' });

// Appreciation Model (Hearts)
class Appreciation extends Model {}
Appreciation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  noteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, { sequelize, modelName: 'Appreciation' });

// -- Setup Associations --
User.hasMany(Wall, { foreignKey: 'creatorId' });
Wall.belongsTo(User, { foreignKey: 'creatorId' });

Wall.hasMany(Note, { foreignKey: 'wallId' });
Note.belongsTo(Wall, { foreignKey: 'wallId' });

User.hasMany(Note, { foreignKey: 'authorId' });
Note.belongsTo(User, { foreignKey: 'authorId' });

Note.hasMany(Appreciation, { foreignKey: 'noteId' });
Appreciation.belongsTo(Note, { foreignKey: 'noteId' });

User.hasMany(Appreciation, { foreignKey: 'userId' });
Appreciation.belongsTo(User, { foreignKey: 'userId' });

// Export everything
export { sequelize, User, Wall, Note, Appreciation };
