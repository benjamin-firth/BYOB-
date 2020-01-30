
exports.up = function(knex) {
  return knex.schema.alterTable('cereals', table => {
    table.decimal('cups', null).alter();
    table.decimal('rating', null).alter();
  })
};

exports.down = function(knex) {
  return knex.schema.table('cereals', table => {
    table.dropColumn('cups');
    table.dropColumn('rating');
  })
};
