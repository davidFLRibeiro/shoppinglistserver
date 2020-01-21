const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function searchByItem(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log('SEARCH TERM', { searchTerm });
      console.log(result);
      console.log('working');
    });
}
searchByItem('urger');

function searchByPagine(page) {
  const productsPerPAge = 6;
  const offset = productsPerPAge * (page - 1);
  knexInstance
    .select('id', 'name', 'price', 'date_added', 'checked')
    .from('shopping_list')
    .limit(productsPerPAge)
    .offset(offset)
    .then(result => {
      console.log('PAGE ITEMS', { page });
      console.log(result);
    });
}
searchByPagine(6);

function productsAddedDaysAgo(daysAgo) {
  knexInstance
    .select('id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance
        .raw(`now() - '?? days':: INTERVAL`, daysAgo)
        .then(results => {
          console.log('PRODUCTS ADDED DAYS AGO');
          console.log(results);
        })
    );
  productsAddedDaysAgo(5);
}

function costPerCategory() {
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log('COST PER CATEGORY');
      console.log(result);
    });
}
costPerCategory();
