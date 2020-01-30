const cerealData = require('../../../cerealData');

const createMfr = async (knex, mfr) => {
  const mfrId = await knex('manufacturers').insert({
    mfr: mfr.mfr,
    name: mfr.name
  }, 'id');

  const cerealsPromises = cerealData.cereals
    .filter(cereal => cereal.mfr === mfr.mfr)
    .map(cereal => {
      return createCereal(knex, {
        name: cereal.name,
        mfr: cereal.mfr,
        type: cereal.type,
        calories: parseInt(cereal.calories),
        protein: parseInt(cereal.protein),
        fat: parseInt(cereal.fat),
        sodium: parseInt(cereal.sodium),
        fiber: parseInt(cereal.fiber),
        carbo: parseInt(cereal.carbo),
        sugars: parseInt(cereal.sugars),
        potass: parseInt(cereal.potass),
        vitamins: parseInt(cereal.vitamins),
        shelf: parseInt(cereal.shelf),
        weight: parseInt(cereal.weight),
        cups: parseInt(cereal.cups),
        rating: parseInt(cereal.rating),
        mfr_id: mfrId[0]
      });
  });
  
  return Promise.all(cerealsPromises);
};

const createCereal = (knex, cereal) => {
  return knex('cereals').insert(cereal);
};

exports.seed = async (knex) => {
  try {
    await knex('cereals').del(); 
    await knex('manufacturers').del(); 
    
    let mfrPromises = cerealData.manufacturers.map(mfr => {
      return createMfr(knex, mfr);
    });
    
    return Promise.all(mfrPromises);
  } catch (error) {
    console.log(`Error seeding data: ${error}`);
  }
};
