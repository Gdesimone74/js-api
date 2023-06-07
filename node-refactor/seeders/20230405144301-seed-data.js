'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    // Country
    await queryInterface.bulkInsert('countries', [{
      name: 'Argentina',
      code: 'AR',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Mexico',
      code: 'MX',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'United States of America',
      code: 'US',
      createdAt: new Date(),
      updatedAt: new Date()
    }])

    // Company
    await queryInterface.bulkInsert('companies', [{
      name: 'Company A',
      logo: 'https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Company B',
      logo: 'https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Company C',
      logo: 'https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }])

    // Subsidiary
    await queryInterface.bulkInsert('subsidiaries', [{
      name: 'Subsidiary A',
      logo: 'https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg',
      country_id: 1,
      company_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Subsidiary B',
      logo: 'https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg',
      country_id: 2,
      company_id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }])

    // Listing
    await queryInterface.bulkInsert('listings', [{
      company_name: 'Company A',
      company_logo: 'https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg',
      name: 'Listing A',
      description: 'Some Listing',
      criteria: 'some criteria',
      info: 'some info',
      state: 'ACTIVE',
      gs: '',
      subsidiary_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      company_name: 'Company A',
      company_logo: 'https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg',
      name: 'Listing B',
      description: 'Some Listing',
      criteria: 'some criteria',
      info: 'some info',
      state: 'INACTIVE',
      gs: '',
      subsidiary_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      company_name: 'Company B',
      company_logo: 'https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg',
      name: 'Listing A',
      description: 'Some Listing',
      criteria: 'some criteria',
      info: 'some info',
      state: 'INACTIVE',
      gs: '',
      subsidiary_id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }])

    // platform_listings
    await queryInterface.bulkInsert('platform_listings', [{
      listing_id: 1,
      state: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      listing_id: 2,
      state: 'INACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      listing_id: 3,
      state: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('platform_listings', null, {});
    await queryInterface.bulkDelete('listings', null, {});
    await queryInterface.bulkDelete('subsidiaries', null, {});
    await queryInterface.bulkDelete('companies', null, {});
    await queryInterface.bulkDelete('countries', null, {});
  }
};
