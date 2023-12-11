
cube(`Orders`, {
  sql: `
    SELECT *
    FROM public.orders
  `,
  preAggregations: {// Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started 
    main_test_julio_2: {
      measures: [Orders.count, rolling_count_month],
      dimensions: [
        Orders.status,
        Users.firstName
      ],
      timeDimension: createdAt,
      granularity: `day`,
      partitionGranularity: `month`,
      refreshKey: {
        every: `0 15 * * *`,
        timezone: `America/Mexico_City`
      }

    }
  },
  joins: {
    Users: {
      sql: `${CUBE}.user_id = ${Users}.id`,
      relationship: `belongsTo`
    },
    Products: {
      sql: `${CUBE}.product_id = ${Products}.id`,
      relationship: `belongsTo`
    }
  },
  measures: {
    rolling_count_month: {
      sql: `id`,
      type: `count`,
      rollingWindow: {
        trailing: `1 month`,
      },
    },
    count: {
      type: `count`,
      drillMembers: [id, createdAt],
      format: `currency`,
      meta: {
        test: 1
      }
    },
    countUsers: {
      type: `countDistinct`,
      sql: `user_id`,
      drillMembers: [id, createdAt]
    },
    countShipped: {
      type: `count`,
      filters: [{
        sql: `${CUBE}.status = 'shipped'`
      }],
      drillMembers: [id, createdAt]
    },
    number: {
      sql: `number`,
      type: `sum`
    },
    testFilters: {
      sql: `${CUBE}.number`,
      type: `sum`,
      filters: [{
        sql: `${CUBE}.status = 'shipped'`
      }],
      drillMembers: [status, number, ratio]
    },
    ratio: {
      type: `number`,
      sql: `${CUBE.number} / ${CUBE.countUsers}`,
      // filters: [{
      //   sql: `${CUBE}.status = 'shipped'`
      // }],
      drillMembers: [status, number, countUsers, ratio]
    },
    maxDate: {
      type: `max`,
      sql: `${CUBE.completedAt}`,
    }
  },
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
    createdAt: {
      sql: `created_at`,
      type: `time`
    },
    completedAt: {
      sql: `completed_at`,
      type: `time`
    },
    test_boolean: {
      sql: `CASE WHEN status = 'completed' THEN TRUE ELSE FALSE END`,
      type: `boolean`
    },
    localTime: {
      type: 'time',
      sql: SQL_UTILS.convertTz(`completed_at`)
    },
    localYear: {
      type: 'number',
      sql: `EXTRACT(year from ${SQL_UTILS.convertTz('completed_at')})`
    },
  },
  segments: {
    status_completed: {
      sql: `${CUBE}.status = 'completed'`
    }
  }
});