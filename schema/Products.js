cube(`Products`, {
  sql: `
    SELECT *
    FROM public.products
    WHERE 1=1
      AND (${FILTER_PARAMS.Products.description.filter('description')})
      AND (${FILTER_PARAMS.Products.name.filter('name')})
    `,
  
  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started  
  },
  
  joins: {
    Suppliers: {
      sql: `${CUBE}.supplier_id = ${Suppliers}.id`,
      relationship: `belongsTo`
    },
    
    ProductCategories: {
      sql: `${CUBE}.product_category_id = ${ProductCategories}.id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [id, name, createdAt]
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    name: {
      sql: `name`,
      type: `string`
    },
    
    description: {
      sql: `description`,
      type: `string`
    },
    
    createdAt: {
      sql: `created_at`,
      type: `time`
    }
  }
});
