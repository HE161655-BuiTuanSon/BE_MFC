export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable("users", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: { model: "roles", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    facebook_id: DataTypes.STRING,
    avatar_url: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("users");
}
