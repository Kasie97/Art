"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryInstance = exports.Category = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../db/index"));
var Category;
(function (Category) {
    Category["LANDSCAPE"] = "Landscape";
    Category["PORTRAIT"] = "Portrait";
    Category["ANCIENCT"] = "Ancient";
    Category["MODERN"] = "Modern";
    Category["OIL_ON_CANVAS"] = "Oil on Canvas";
    Category["PEN_AND_INK"] = "Pen and Ink";
    Category["NATURE"] = "Nature";
    Category["DIGITAL_PAINT"] = "Digital Paint";
})(Category || (exports.Category = Category = {}));
class CategoryInstance extends sequelize_1.Model {
}
exports.CategoryInstance = CategoryInstance;
CategoryInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.ENUM,
    },
    sub_categories: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    },
    artworkID: {
        type: sequelize_1.DataTypes.STRING,
    },
}, { sequelize: index_1.default, tableName: "category" });
//Define Association
// CategoryInstance.hasMany( ArtworkInstance, {foreignKey: 'categoryID'});
// ArtworkInstance.belongsTo( CategoryInstance, { foreignKey: 'categoryID'});
