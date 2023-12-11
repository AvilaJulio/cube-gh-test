const convertStringPropToFunction = (propNames, dimensionDefinition) => {
  let newResult = { ...dimensionDefinition };
  propNames.forEach((propName) => {
    const propValue = newResult[propName];

    if (!propValue) {
      return;
    }

    newResult[propName] = () => propValue;
  });
  return newResult;
};

const transformDimensions = (dimensions) => {
  return Object.keys(dimensions).reduce((result, dimensionName) => {
    const dimensionDefinition = dimensions[dimensionName];
    return {
      ...result,
      [dimensionName]: convertStringPropToFunction(
        ['sql'],
        dimensionDefinition
      ),
    };
  }, {});
};

const cubes = {
  ordersCube: {
    title: `OrdersDynamic`,
    sql: `SELECT * FROM public.orders`,
    sqlAlias: `orders`,
    dimensions: {
      id: {
        sql: `id`,
        type: `number`,
        primaryKey: true,
        shown: true
      },
      status: {
        sql: `status`,
        type: `string`
      },
    },
    measures: {
      count: {
        type: `count`
      },
      number: {
        sql: (CUBE) => `number`,
        type: `sum`
      },
      test: {
        sql: (CUBE) => `${CUBE.number} / ${CUBE.count}`,
        type: `number`
      }
    },

    joins: {
      foreignCube: `ProductsDynamic`,
      foreignCubeAlias: `random_name`,
      relationship: `belongsTo`
    }
  },
  productsCube: {
    title: `ProductsDynamic`,
    sql: `SELECT * FROM public.products`,
    sqlAlias: `random_name`,
    dimensions: {
      id: {
        sql: `id`,
        type: `number`,
        primaryKey: true,
        shown: true
      },

      name: {
        sql: `name`,
        type: `string`
      },
    }
  }
};


asyncModule(async () => {

  Object.entries(cubes).forEach(([key, cubeDefinition]) => {

    const dimensions = transformDimensions(cubeDefinition.dimensions);

    if (cubeDefinition.title == 'OrdersDynamic') {

      cube(cubeDefinition.title, {
        sql: cubeDefinition.sql,
        sqlAlias: cubeDefinition.sqlAlias,
        dimensions: dimensions,
        measures: cubeDefinition.measures,
        joins: {
          [`${[cubeDefinition.joins.foreignCube]}`]: {
            sql: `${CUBE}.product_id = ${cubeDefinition.joins.foreignCubeAlias}.id`,
            relationship: `${cubeDefinition.joins.relationship}`
          }
        }
      });
    } else {
      cube(cubeDefinition.title, {
        sql: cubeDefinition.sql,
        sqlAlias: cubeDefinition.sqlAlias,
        dimensions: dimensions,
      });
    }
  });

  view('test', {
    includes: [
      `${cubes.ordersCube.title}.status`,
      OrdersDynamic.ProductsDynamic.name,
      `${cubes.ordersCube.title}.count`,

    ]
  });
}); 
