let { DataTypes, sequelize } = require('../lib/index');

let { student } = require('./student.model');
let { course } = require('./course.model');

let studentCourse = sequelize.define('studentCourse', {
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: student,
      key: 'id',
    },
  },

  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: course,
      key: 'id',
    },
  },
});

student.belongsToMany(course, { through: studentCourse });
course.belongsToMany(student, { through: studentCourse });

module.exports = { studentCourse };
