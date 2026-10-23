import { Sequelize, DataTypes, Model } from 'sequelize';
import 'pg';
import 'pg-hstore';

// Use DATABASE_URL, with fallbacks for Vercel Postgres / Neon / Supabase integrations
const connectionString = 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.PG_URL || 
  '';

const isProduction = process.env.NODE_ENV === 'production';

if (!connectionString && isProduction) {
  console.error(
    'CRITICAL: No database connection URL found in process.env.DATABASE_URL. ' +
    'Please set DATABASE_URL in your Vercel Environment Variables and redeploy.'
  );
}

const isRemoteDb = 
  connectionString.includes('supabase') || 
  connectionString.includes('aiven') || 
  connectionString.includes('neon') ||
  connectionString.includes('sslmode') ||
  isProduction;

const globalForSequelize = globalThis as unknown as {
  sequelize: Sequelize | undefined;
};

const sequelize = globalForSequelize.sequelize ?? new Sequelize(
  connectionString || (isProduction ? 'postgres://unconfigured-database-url:5432/wall' : 'postgres://localhost:5432/wall'),
  {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 2, // Keep pool very small for serverless
      min: 0,
      idle: 5000,
      acquire: 20000
    },
    dialectOptions: {
      ...(isRemoteDb ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}),
      // Necessary for Supabase transaction pooler (port 6543) / PgBouncer
      prepare: false
    }
  }
);

globalForSequelize.sequelize = sequelize;

// -- Define Models --

class User extends Model {}
class Wall extends Model {}
class Note extends Model {}
class Appreciation extends Model {}
class Inquiry extends Model {}

// Only initialize models if they haven't been initialized yet
if (!sequelize.models.User) {
  User.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    socialLinks: { type: DataTypes.JSONB, defaultValue: {} },
    plan: { type: DataTypes.ENUM('FREE', 'PRO'), defaultValue: 'FREE' }
  }, { sequelize, modelName: 'User' });

  Wall.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    slug: { type: DataTypes.STRING, unique: true, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    privacy: { type: DataTypes.ENUM('PUBLIC', 'PRIVATE'), defaultValue: 'PUBLIC' },
    allowAnonymous: { type: DataTypes.BOOLEAN, defaultValue: true },
    requireApproval: { type: DataTypes.BOOLEAN, defaultValue: false },
    creatorId: { type: DataTypes.INTEGER, allowNull: false }
  }, { sequelize, modelName: 'Wall' });

  Note.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    color: { type: DataTypes.STRING, defaultValue: '0' },
    font: { type: DataTypes.STRING, defaultValue: 'font-sans' },
    isAnonymous: { type: DataTypes.BOOLEAN, defaultValue: true },
    wallId: { type: DataTypes.INTEGER, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: true }
  }, { sequelize, modelName: 'Note' });

  Appreciation.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    noteId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: true }
  }, { sequelize, modelName: 'Appreciation' });

  Inquiry.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    orgName: { type: DataTypes.STRING, allowNull: true },
    eventType: { type: DataTypes.STRING, allowNull: true },
    attendees: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: 'PENDING' }
  }, { sequelize, modelName: 'Inquiry' });

  // Setup Associations
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
}

// Export everything
const ExportUser = sequelize.models.User as typeof User;
const ExportWall = sequelize.models.Wall as typeof Wall;
const ExportNote = sequelize.models.Note as typeof Note;
const ExportAppreciation = sequelize.models.Appreciation as typeof Appreciation;
const ExportInquiry = sequelize.models.Inquiry as typeof Inquiry;

let isSchemaEnsured = false;

export async function ensureSchema() {
  if (isSchemaEnsured) return;
  try {
    // Automatically creates Users, Walls, Notes, Appreciation, Inquiries tables if they don't exist yet
    await sequelize.sync();
    await sequelize.query('ALTER TABLE "Walls" ADD COLUMN IF NOT EXISTS "requireApproval" BOOLEAN DEFAULT FALSE;');
    await sequelize.query('ALTER TABLE "Notes" ADD COLUMN IF NOT EXISTS "font" VARCHAR(50) DEFAULT \'font-sans\';');
    await sequelize.query('ALTER TABLE "Notes" ADD COLUMN IF NOT EXISTS "metadata" JSONB DEFAULT \'{}\'::jsonb;');
    await sequelize.query('ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "plan" VARCHAR(20) DEFAULT \'FREE\';');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "Inquiries" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "orgName" VARCHAR(255),
        "eventType" VARCHAR(255),
        "attendees" VARCHAR(255),
        "notes" TEXT,
        "status" VARCHAR(50) DEFAULT 'PENDING',
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    isSchemaEnsured = true;
  } catch (e) {
    console.warn('ensureSchema warning:', e);
  }
}

export { sequelize, ExportUser as User, ExportWall as Wall, ExportNote as Note, ExportAppreciation as Appreciation, ExportInquiry as Inquiry };
