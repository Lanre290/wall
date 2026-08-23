import { Sequelize, DataTypes, Model } from 'sequelize';
import 'pg';
import 'pg-hstore';

// Use DATABASE_URL from .env
const connectionString = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/wall';

const createSequelize = () => {
  return new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 3, // Keep pool small for serverless/Next.js
      min: 0,
      idle: 10000,
      acquire: 20000
    },
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  });
};

const globalForSequelize = globalThis as unknown as {
  sequelize: Sequelize | undefined;
};

const sequelize = globalForSequelize.sequelize ?? createSequelize();

if (process.env.NODE_ENV !== 'production') {
  globalForSequelize.sequelize = sequelize;
}

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
  },
  plan: {
    type: DataTypes.ENUM('FREE', 'PRO'),
    defaultValue: 'FREE',
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
  font: {
    type: DataTypes.STRING,
    defaultValue: 'font-sans',
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
  },
  metadata: {
    type: DataTypes.JSONB,
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
