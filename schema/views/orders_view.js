view(`orders_view`, {
  cubes: [
    {
      join_path: Orders,
      prefix: true,
      includes: `*`,
      excludes: [
        `id`
      ]
    },
    {
      join_path: Orders.Products,
      prefix: true,
      includes: '*'
    }
  ],
});