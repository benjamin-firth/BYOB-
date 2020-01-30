exports.up = function(knex) {
  return knex.schema
    .createTable('manufacturers', table => {
      table.increments('id').primary();
      table.string('mfr');
      table.string('name');
      table.timestamps(true, true);
    })
    .createTable('cereals', table => {
      table.increments('id').primary();
      table.string('mfr');
      table.string('name');
      table.string('type');
      table.integer('calories');
      table.integer('protein');
      table.integer('fat');
      table.integer('sodium');
      table.integer('fiber');
      table.integer('carbo');
      table.integer('sugars');
      table.integer('potass');
      table.integer('vitamins');
      table.integer('shelf');
      table.integer('weight');
      table.integer('cups');
      table.integer('rating');
      table.integer('mfr_id').unsigned();
      table.foreign('mfr_id').references('manufacturers.id');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('cereals')
    .dropTable('manufacturers')
};

